// app/api/courses/enroll/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("Session debug:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
    });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized - No user ID" }, { status: 401 });
    }

    const { courseId } = await req.json();
    console.log("Course ID:", courseId);

    // First, verify the user exists in the database
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    // If user doesn't exist by ID, try by email
    if (!user && session.user.email) {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
    }

    // If user still doesn't exist, create them
    if (!user) {
      console.log("User not found, creating new user...");
      user = await prisma.user.create({
        data: {
          id: session.user.id,
          name: session.user.name || "Student",
          email: session.user.email || `user_${session.user.id}@example.com`,
          role: "STUDENT",
          isVerified: true,
        },
      });
      console.log("Created user:", user.id);
    }

    // Check if course exists
    let course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      // Create a default teacher if needed
      let teacher = await prisma.user.findFirst({
        where: { role: "TEACHER" },
      });
      
      if (!teacher) {
        teacher = await prisma.user.create({
          data: {
            name: "System Teacher",
            email: "teacher@savannah.com",
            role: "TEACHER",
            isVerified: true,
          },
        });
      }
      
      // Create the course with proper title formatting
      const formattedTitle = courseId
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      course = await prisma.course.create({
        data: {
          id: courseId,
          title: formattedTitle,
          description: `Learn about ${formattedTitle}`,
          category: "Professional Development",
          level: "Beginner",
          teacherId: teacher.id,
          isPublished: true,
        },
      });
      console.log("Created course:", course.id);
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({ message: "Already enrolled", enrollment: existingEnrollment });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
      },
    });
    console.log("Created enrollment:", enrollment.id);

    // Get course modules and create module progress entries
    const modules = await prisma.module.findMany({
      where: { courseId: course.id },
      orderBy: { order: "asc" },
      include: {
        lessons: {
          orderBy: { order: "asc" },
        },
      },
    });

    // Create module progress for each module (renamed variable to 'mod' to avoid conflict)
    for (const mod of modules) {
      const moduleProgress = await prisma.moduleProgress.create({
        data: {
          enrollmentId: enrollment.id,
          moduleId: mod.id,
          userId: user.id,
        },
      });

      // Create lesson progress for each lesson
      for (const lesson of mod.lessons) {
        await prisma.lessonProgress.create({
          data: {
            moduleProgressId: moduleProgress.id,
            lessonId: lesson.id,
          },
        });
      }
    }

    return NextResponse.json({ message: "Enrolled successfully", enrollment });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json({ error: "Internal server error: " + String(error) }, { status: 500 });
  }
}