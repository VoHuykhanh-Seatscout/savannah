// app/api/teacher/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is a teacher
    if (!session?.user?.id || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get ALL courses with their enrollments (not filtered by teacherId)
    const allCourses = await prisma.course.findMany({
      include: {
        enrollments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                organization: true,
              },
            },
            moduleProgress: {
              include: {
                lessonProgress: true,
                module: {
                  include: {
                    lessons: true,
                  },
                },
              },
            },
          },
        },
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

    console.log("All courses found:", allCourses.length);
    console.log("Courses with enrollments:", allCourses.filter(c => c.enrollments.length > 0).map(c => ({ title: c.title, enrollments: c.enrollments.length })));

    // If no courses, return empty
    if (allCourses.length === 0) {
      return NextResponse.json({
        success: true,
        courses: [],
        totalCourses: 0,
        totalStudents: 0,
        overallCompletionRate: 0,
      });
    }

    // Calculate analytics for each course
    const analytics = allCourses.map(course => {
      const totalStudents = course.enrollments.length;
      const completedStudents = course.enrollments.filter(e => e.completed).length;
      const completionRate = totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0;
      
      // Calculate average score across all students
      let totalScores = 0;
      let studentsWithScores = 0;
      
      course.enrollments.forEach(enrollment => {
        const moduleScores = enrollment.moduleProgress
          .filter(mp => mp.score !== null)
          .map(mp => mp.score || 0);
        
        if (moduleScores.length > 0) {
          const avgScore = moduleScores.reduce((a, b) => a + b, 0) / moduleScores.length;
          totalScores += avgScore;
          studentsWithScores++;
        }
      });
      
      const averageScore = studentsWithScores > 0 ? totalScores / studentsWithScores : 0;
      
      // Get student progress details
      const studentProgress = course.enrollments.map(enrollment => {
        // Calculate total lessons from the course modules
        const totalLessons = course.modules.reduce(
          (sum, m) => sum + m.lessons.length, 0
        );
        
        // Calculate completed lessons from moduleProgress
        const completedLessons = enrollment.moduleProgress.reduce(
          (sum, mp) => sum + mp.lessonProgress.filter(lp => lp.completed).length, 0
        );
        const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
        
        const moduleProgressDetails = enrollment.moduleProgress.map(mp => ({
          moduleTitle: mp.module.title,
          completed: mp.completed,
          score: mp.score,
          lessonsCompleted: mp.lessonProgress.filter(l => l.completed).length,
          totalLessons: mp.module.lessons.length,
        }));
        
        return {
          studentId: enrollment.user.id,
          studentName: enrollment.user.name,
          studentEmail: enrollment.user.email,
          organization: enrollment.user.organization,
          enrolledAt: enrollment.enrolledAt,
          completed: enrollment.completed,
          completedAt: enrollment.completedAt,
          progressPercentage: Math.round(progressPercentage),
          moduleProgress: moduleProgressDetails,
        };
      });
      
      return {
        courseId: course.id,
        courseTitle: course.title,
        totalStudents,
        completedStudents,
        completionRate: Math.round(completionRate),
        averageScore: Math.round(averageScore),
        studentProgress,
      };
    });

    // Filter out courses with no students (optional - show only courses with enrollments)
    const coursesWithStudents = analytics.filter(course => course.totalStudents > 0);

    const response = {
      success: true,
      courses: coursesWithStudents,
      totalCourses: coursesWithStudents.length,
      totalStudents: coursesWithStudents.reduce((sum, c) => sum + c.totalStudents, 0),
      overallCompletionRate: coursesWithStudents.length > 0 
        ? Math.round(coursesWithStudents.reduce((sum, c) => sum + c.completionRate, 0) / coursesWithStudents.length)
        : 0,
    };
    
    console.log("Response summary:", {
      totalCourses: response.totalCourses,
      totalStudents: response.totalStudents,
      overallCompletionRate: response.overallCompletionRate,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Teacher analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}