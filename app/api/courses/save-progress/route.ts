// app/api/courses/save-progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user && session.user.email) {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: session.user.id,
          name: session.user.name || "Student",
          email: session.user.email || `user_${session.user.id}@example.com`,
          role: "STUDENT",
          isVerified: true,
        },
      });
    }

    const { courseId, lessonId, answers, videoWatched } = await req.json();

    console.log("Save progress request:", { courseId, lessonId, videoWatched });

    // Find or create enrollment
    let enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });

    if (!enrollment) {
      enrollment = await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: courseId,
        },
      });
      console.log("Created enrollment:", enrollment.id);
    }
    
    // Find the course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                questions: true,
              },
            },
          },
        },
      },
    });
    
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    
    // Find the specific lesson (renamed variable to 'mod' to avoid conflict)
    let targetLesson = null;
    let targetModule = null;
    
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        if (lesson.id === lessonId) {
          targetLesson = lesson;
          targetModule = mod;
          break;
        }
      }
      if (targetLesson) break;
    }

    if (!targetLesson || !targetModule) {
      return NextResponse.json({ error: "Lesson or Module not found" }, { status: 404 });
    }

    // Find or create module progress
    let moduleProgress = await prisma.moduleProgress.findFirst({
      where: {
        enrollmentId: enrollment.id,
        moduleId: targetModule.id,
      },
    });

    if (!moduleProgress) {
      moduleProgress = await prisma.moduleProgress.create({
        data: {
          enrollmentId: enrollment.id,
          moduleId: targetModule.id,
          userId: user.id,
        },
      });
    }

    // Find or create lesson progress
    let lessonProgress = await prisma.lessonProgress.findFirst({
      where: {
        moduleProgressId: moduleProgress.id,
        lessonId: targetLesson.id,
      },
    });

    if (!lessonProgress) {
      lessonProgress = await prisma.lessonProgress.create({
        data: {
          moduleProgressId: moduleProgress.id,
          lessonId: targetLesson.id,
        },
      });
    }

    // Calculate score from answers
    let correctCount = 0;
    let totalMcqQuestions = 0;

    for (const [questionId, userAnswer] of Object.entries(answers)) {
      const question = targetLesson.questions.find(q => q.id === questionId);
      
      if (question) {
        if (question.type !== "TEXT") {
          totalMcqQuestions++;
          if (userAnswer === question.correctAnswer) {
            correctCount++;
          }
        }
        
        // Save the answer
        await prisma.studentAnswer.upsert({
          where: {
            lessonProgressId_questionId: {
              lessonProgressId: lessonProgress.id,
              questionId: question.id,
            },
          },
          update: {
            answer: userAnswer as string,
            isCorrect: question.type !== "TEXT" && userAnswer === question.correctAnswer,
          },
          create: {
            lessonProgressId: lessonProgress.id,
            questionId: question.id,
            answer: userAnswer as string,
            isCorrect: question.type !== "TEXT" && userAnswer === question.correctAnswer,
            userId: user.id,
          },
        });
      }
    }

    const finalScore = correctCount;
    const quizPassed = totalMcqQuestions > 0 && finalScore >= (totalMcqQuestions * 0.7);
    const lessonCompleted = videoWatched && (totalMcqQuestions === 0 || quizPassed);

    // Update lesson progress
    await prisma.lessonProgress.update({
      where: { id: lessonProgress.id },
      data: {
        videoWatched: videoWatched || lessonProgress.videoWatched,
        quizPassed: quizPassed,
        score: finalScore,
        completed: lessonCompleted,
        completedAt: lessonCompleted ? new Date() : null,
      },
    });

    // Update module progress (calculate from all lessons in module)
    const allLessonsInModule = await prisma.lesson.findMany({
      where: { moduleId: targetModule.id },
    });
    
    const allLessonProgress = await prisma.lessonProgress.findMany({
      where: {
        moduleProgressId: moduleProgress.id,
        lessonId: { in: allLessonsInModule.map(l => l.id) },
      },
    });
    
    // Calculate module completion
    const moduleCompleted = allLessonProgress.length > 0 && 
      allLessonProgress.every(lp => lp.completed);
    
    // Calculate module average score
    const moduleTotalScore = allLessonProgress.reduce((sum, lp) => sum + (lp.score || 0), 0);
    const moduleAvgScore = allLessonProgress.length > 0 
      ? Math.round(moduleTotalScore / allLessonProgress.length) 
      : 0;
    
    await prisma.moduleProgress.update({
      where: { id: moduleProgress.id },
      data: {
        score: moduleAvgScore,
        completed: moduleCompleted,
        completedAt: moduleCompleted ? new Date() : null,
      },
    });

    // Update course progress (check if all modules are completed)
    const allModulesInCourse = await prisma.module.findMany({
      where: { courseId: course.id },
    });
    
    const allModuleProgress = await prisma.moduleProgress.findMany({
      where: {
        enrollmentId: enrollment.id,
        moduleId: { in: allModulesInCourse.map(m => m.id) },
      },
    });
    
    const courseCompleted = allModuleProgress.length > 0 && 
      allModuleProgress.every(mp => mp.completed);
    
    if (courseCompleted && !enrollment.completed) {
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          completed: true,
          completedAt: new Date(),
        },
      });
      console.log("🎉 Course completed!");
    }

    // Calculate overall course progress percentage
    const totalLessons = allModulesInCourse.reduce(
      (sum, m) => sum + (course.modules.find(cm => cm.id === m.id)?.lessons.length || 0), 
      0
    );
    const completedLessons = allModuleProgress.reduce(
      (sum, mp) => sum + (allLessonProgress.filter(lp => lp.moduleProgressId === mp.id && lp.completed).length), 
      0
    );
    const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    return NextResponse.json({ 
      success: true,
      lesson: {
        score: finalScore,
        totalQuestions: totalMcqQuestions,
        percentage: totalMcqQuestions > 0 ? (finalScore / totalMcqQuestions) * 100 : 0,
        quizPassed: quizPassed,
        completed: lessonCompleted,
      },
      module: {
        score: moduleAvgScore,
        completed: moduleCompleted,
      },
      course: {
        completed: courseCompleted,
        overallProgress: Math.round(overallProgress),
      },
    });
  } catch (error) {
    console.error("Save progress error:", error);
    return NextResponse.json({ error: "Internal server error: " + String(error) }, { status: 500 });
  }
}