// app/api/debug/courses/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      courses: courses.map(c => ({
        id: c.id,
        title: c.title,
        lessonIds: c.modules.flatMap(m => m.lessons.map(l => l.id)),
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}