// app/api/courses/progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "Course ID required" }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId,
        },
      },
      include: {
        moduleProgress: {
          include: {
            module: {
              include: {
                lessons: {
                  include: {
                    questions: true,
                  },
                },
              },
            },
            lessonProgress: {
              include: {
                answers: true,
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ enrolled: false });
    }

    // Calculate overall progress
    let totalLessons = 0;
    let completedLessons = 0;
    let totalScore = 0;
    let totalModules = enrollment.moduleProgress.length;
    let completedModules = 0;

    for (const mp of enrollment.moduleProgress) {
      const moduleLessons = mp.module.lessons.length;
      totalLessons += moduleLessons;
      
      const completedInModule = mp.lessonProgress.filter(lp => lp.completed).length;
      completedLessons += completedInModule;
      
      if (mp.completed) completedModules++;
      
      if (mp.score) totalScore += mp.score;
    }

    const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    const averageScore = totalModules > 0 ? totalScore / totalModules : 0;

    return NextResponse.json({
      enrolled: true,
      progress: {
        overall: Math.round(overallProgress),
        completedLessons,
        totalLessons,
        completedModules,
        totalModules,
        averageScore: Math.round(averageScore),
        courseCompleted: enrollment.completed,
      },
      moduleProgress: enrollment.moduleProgress.map(mp => ({
        moduleId: mp.moduleId,
        moduleTitle: mp.module.title,
        completed: mp.completed,
        score: mp.score,
        lessons: mp.lessonProgress.map(lp => ({
          lessonId: lp.lessonId,
          completed: lp.completed,
          score: lp.score,
          quizPassed: lp.quizPassed,
          videoWatched: lp.videoWatched,
        })),
      })),
    });
  } catch (error) {
    console.error("Get progress error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}