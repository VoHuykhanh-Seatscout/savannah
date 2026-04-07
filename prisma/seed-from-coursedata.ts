import { PrismaClient, QuestionType as PrismaQuestionType, Prisma } from '@prisma/client';
import { COURSES, QuestionType as LocalQuestionType } from '@/lib/courseData';

const prisma = new PrismaClient();

// Helper function to map local QuestionType to Prisma QuestionType
function mapQuestionType(type: LocalQuestionType): PrismaQuestionType {
  switch (type) {
    case LocalQuestionType.MCQ:
      return PrismaQuestionType.MULTIPLE_CHOICE;
    case LocalQuestionType.TEXT:
      return PrismaQuestionType.TEXT;
    case LocalQuestionType.TRUE_FALSE:
      return PrismaQuestionType.TRUE_FALSE;
    default:
      return PrismaQuestionType.MULTIPLE_CHOICE;
  }
}

async function main() {
  console.log("Starting database seeding from courseData...");

  // Create a default teacher if not exists
  let teacher = await prisma.user.findUnique({
    where: { email: "teacher@savannah.com" },
  });

  if (!teacher) {
    teacher = await prisma.user.create({
      data: {
        name: "Savannah Teacher",
        email: "teacher@savannah.com",
        role: "TEACHER",
        isVerified: true,
      },
    });
    console.log("Created teacher:", teacher.email);
  }

  // Loop through each course in courseData
  for (const courseData of COURSES) {
    // Check if course already exists
    let course = await prisma.course.findFirst({
      where: { id: courseData.id },
    });

    if (!course) {
      // Create course
      course = await prisma.course.create({
        data: {
          id: courseData.id,
          title: courseData.title,
          description: `Learn about ${courseData.title}`,
          category: "Professional Development",
          level: "Beginner",
          teacherId: teacher.id,
          isPublished: true,
        },
      });
      console.log(`Created course: ${course.title}`);

      // Create module
      const module = await prisma.module.create({
        data: {
          title: `${courseData.title} Module`,
          order: 1,
          courseId: course.id,
        },
      });
      console.log(`  Created module: ${module.title}`);

      // Create lesson
      const lesson = await prisma.lesson.create({
        data: {
          title: courseData.title,
          description: `Watch this video to learn about ${courseData.title}`,
          videoUrl: courseData.videoUrl,
          order: 1,
          moduleId: module.id,
        },
      });
      console.log(`    Created lesson: ${lesson.title}`);

      // Create questions
      for (let i = 0; i < courseData.questions.length; i++) {
        const q = courseData.questions[i];
        
        await prisma.question.create({
          data: {
            text: q.question,
            type: mapQuestionType(q.type),
            options: q.options ? JSON.stringify(q.options) : Prisma.JsonNull,
            correctAnswer: q.correctAnswer || "",
            explanation: q.explanation || null,
            order: i + 1,
            lessonId: lesson.id,
          },
        });
      }
      console.log(`    Created ${courseData.questions.length} questions`);
    } else {
      console.log(`Course already exists: ${course.title}`);
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });