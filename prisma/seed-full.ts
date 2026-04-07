// prisma/seed-full.ts
import { PrismaClient, QuestionType as PrismaQuestionType, Prisma } from '@prisma/client';
import { COURSES, QuestionType as LocalQuestionType } from '@/lib/courseData';

const prisma = new PrismaClient();

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
  console.log("Starting full database seeding...");

  // Create a default teacher
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

  // Loop through each course
  for (const courseData of COURSES) {
    console.log(`\nProcessing course: ${courseData.title}`);
    
    // Create or update course with consistent ID
    let course = await prisma.course.upsert({
      where: { id: courseData.id },
      update: {
        title: courseData.title,
        description: `Learn about ${courseData.title}`,
        category: "Professional Development",
        level: "Beginner",
        isPublished: true,
      },
      create: {
        id: courseData.id,
        title: courseData.title,
        description: `Learn about ${courseData.title}`,
        category: "Professional Development",
        level: "Beginner",
        teacherId: teacher.id,
        isPublished: true,
      },
    });
    console.log(`  Course ready: ${course.id}`);

    // Create or update module with consistent ID
    const moduleId = `${courseData.id}-module`;
    let module = await prisma.module.upsert({
      where: { id: moduleId },
      update: {
        title: `${courseData.title} Module`,
        order: 1,
        courseId: course.id,
      },
      create: {
        id: moduleId,
        title: `${courseData.title} Module`,
        order: 1,
        courseId: course.id,
      },
    });
    console.log(`  Module ready: ${module.id}`);

    // Create or update lesson with consistent ID
    const lessonId = `${courseData.id}-lesson`;
    let lesson = await prisma.lesson.upsert({
      where: { id: lessonId },
      update: {
        title: courseData.title,
        description: `Watch this video to learn about ${courseData.title}`,
        videoUrl: courseData.videoUrl,
      },
      create: {
        id: lessonId,
        title: courseData.title,
        description: `Watch this video to learn about ${courseData.title}`,
        videoUrl: courseData.videoUrl,
        order: 1,
        moduleId: module.id,
      },
    });
    console.log(`  Lesson ready: ${lesson.id}`);

    // Delete existing questions for this lesson to avoid duplicates
    await prisma.question.deleteMany({
      where: { lessonId: lesson.id },
    });
    console.log(`  Cleared existing questions`);

    // Create questions with consistent IDs
    for (let i = 0; i < courseData.questions.length; i++) {
      const q = courseData.questions[i];
      
      await prisma.question.create({
        data: {
          id: q.id, // Use the ID from courseData
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
    console.log(`  Created ${courseData.questions.length} questions`);
  }

  console.log("\n✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });