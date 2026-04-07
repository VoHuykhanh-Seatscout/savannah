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

    // Get ALL courses with enrollments
    const allCourses = await prisma.course.findMany({
      where: {
        enrollments: {
          some: {} // Only get courses that have at least one enrollment
        }
      },
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
      
      // Calculate average score
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
        const totalLessons = course.modules.reduce(
          (sum, m) => sum + m.lessons.length, 0
        );
        
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

    return NextResponse.json({
      success: true,
      courses: analytics,
      totalCourses: analytics.length,
      totalStudents: analytics.reduce((sum, c) => sum + c.totalStudents, 0),
      overallCompletionRate: analytics.length > 0 
        ? Math.round(analytics.reduce((sum, c) => sum + c.completionRate, 0) / analytics.length)
        : 0,
    });
  } catch (error) {
    console.error("Teacher analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}