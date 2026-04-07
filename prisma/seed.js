const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Hardcode the courses data directly in JavaScript to avoid TypeScript issues
const coursesData = [
  {
    id: 'financial-literacy',
    title: 'Financial Literacy',
    videoUrl: 'https://www.youtube.com/embed/dqbFN9a6RNA',
    questions: [
      {
        question: 'What does financial literacy mean?',
        type: 'MULTIPLE_CHOICE',
        options: JSON.stringify([
          'A. Knowing how to read financial news articles',
          'B. Understanding how money works and knowing how to earn, spend, save, and manage it wisely',
          'C. Having a large amount of money saved in a bank account',
          'D. Being able to do complex mathematical calculations'
        ]),
        correctAnswer: 'B. Understanding how money works and knowing how to earn, spend, save, and manage it wisely',
        explanation: 'Financial literacy is about understanding money and developing the habits to manage it well — regardless of how much you earn.'
      },
      {
        question: 'Which of the following is an example of a FIXED expense?',
        type: 'MULTIPLE_CHOICE',
        options: JSON.stringify([
          'A. Buying a new pair of shoes',
          'B. Spending money on entertainment',
          'C. Monthly rent or housing payment',
          'D. Buying food at a market'
        ]),
        correctAnswer: 'C. Monthly rent or housing payment',
        explanation: 'Fixed expenses stay the same every month — like rent, school fees, or loan repayments.'
      },
      {
        question: 'What is the difference between a NEED and a WANT?',
        type: 'MULTIPLE_CHOICE',
        options: JSON.stringify([
          'A. Needs are expensive; wants are cheap',
          'B. Needs are things you must have to survive; wants are things that are nice to have but not essential',
          'C. Needs are for adults; wants are for children',
          'D. There is no real difference — they are the same thing'
        ]),
        correctAnswer: 'B. Needs are things you must have to survive; wants are things that are nice to have but not essential',
        explanation: 'Needs include food, shelter, healthcare, and basic transport. Wants are things like a new phone or eating out.'
      },
      {
        question: 'If your income is LESS than your expenses every month, what situation are you in?',
        type: 'MULTIPLE_CHOICE',
        options: JSON.stringify([
          'A. Surplus — you have extra money left over',
          'B. Break even — your money balances out',
          'C. Deficit — you are spending more than you earn',
          'D. Investment — your money is growing'
        ]),
        correctAnswer: 'C. Deficit — you are spending more than you earn',
        explanation: 'A deficit means you spend more than you earn. This leads to debt and financial stress.'
      },
      {
        question: 'Which of these is a good financial habit?',
        type: 'MULTIPLE_CHOICE',
        options: JSON.stringify([
          'A. Spending all your money as soon as you receive it',
          'B. Borrowing money to buy things you want but do not need',
          'C. Saving a portion of your income before you start spending',
          'D. Ignoring small daily expenses because they are not important'
        ]),
        correctAnswer: 'C. Saving a portion of your income before you start spending',
        explanation: "Saving before you spend — also called 'paying yourself first' — is one of the most powerful financial habits."
      }
    ]
  },
  {
    id: 'bookkeeping',
    title: 'Bookkeeping',
    videoUrl: 'https://www.youtube.com/embed/qigAl8nVlFg',
    questions: [
      {
        question: 'What does bookkeeping mean?',
        type: 'MULTIPLE_CHOICE',
        options: JSON.stringify([
          'A. Writing a list of things you want to buy in the future',
          'B. Recording every amount of money that comes in or goes out, clearly and regularly',
          'C. Counting the total amount of money you have in your wallet',
          'D. Making a plan for how much money you want to earn'
        ]),
        correctAnswer: 'B. Recording every amount of money that comes in or goes out, clearly and regularly',
        explanation: 'Bookkeeping is the practice of recording ALL financial transactions.'
      },
      {
        question: 'What is the difference between INCOME and an EXPENSE in bookkeeping?',
        type: 'MULTIPLE_CHOICE',
        options: JSON.stringify([
          'A. Income is money you save; an expense is money you earn',
          'B. Income and expenses are the same thing',
          'C. Income is money coming IN; an expense is money going OUT',
          'D. Income is only from a job; an expense is only for rent'
        ]),
        correctAnswer: 'C. Income is money coming IN; an expense is money going OUT',
        explanation: 'Income = money received. Expenses = money spent.'
      },
      {
        question: 'Look at this ledger entry. What is the closing balance? Opening balance: GHS 80 | Income this week: GHS 120 | Expenses this week: GHS 75',
        type: 'MULTIPLE_CHOICE',
        options: JSON.stringify([
          'A. GHS 125',
          'B. GHS 200',
          'C. GHS 45',
          'D. GHS 275'
        ]),
        correctAnswer: 'A. GHS 125',
        explanation: '80 + 120 - 75 = 125.'
      },
      {
        question: 'Why is it important to keep personal and business finances SEPARATE?',
        type: 'MULTIPLE_CHOICE',
        options: JSON.stringify([
          'A. It is not important — mixing them together is fine',
          'B. Because mixing them makes records confusing and it becomes impossible to know if the business is profitable',
          'C. Because businesses are only allowed to use bank accounts, not cash',
          'D. Because personal expenses are not allowed to be written in a ledger'
        ]),
        correctAnswer: 'B. Because mixing them makes records confusing and it becomes impossible to know if the business is profitable',
        explanation: 'Keeping them separate makes records accurate, clear, and trustworthy.'
      },
      {
        question: 'Amara runs a small food stall. She records the following in one week: Sales: GHS 200 | Stock purchased: GHS 80 | Transport: GHS 20 | Phone top-up: GHS 10. What is her profit (balance) for the week?',
        type: 'MULTIPLE_CHOICE',
        options: JSON.stringify([
          'A. GHS 200',
          'B. GHS 110',
          'C. GHS 90',
          'D. GHS 310'
        ]),
        correctAnswer: 'C. GHS 90',
        explanation: '200 - (80 + 20 + 10) = 90.'
      }
    ]
  }
];

async function main() {
  console.log("Starting database seeding...");

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
    console.log("✅ Created teacher:", teacher.email);
  } else {
    console.log("✅ Teacher already exists:", teacher.email);
  }

  // Loop through each course
  for (const courseData of coursesData) {
    // Check if course already exists
    let course = await prisma.course.findUnique({
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
      console.log(`✅ Created course: ${course.title} (${course.id})`);

      // Create module
      const module = await prisma.module.create({
        data: {
          title: `${courseData.title} Module`,
          order: 1,
          courseId: course.id,
        },
      });
      console.log(`  ✅ Created module: ${module.title}`);

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
      console.log(`  ✅ Created lesson: ${lesson.title}`);

      // Create questions
      for (let i = 0; i < courseData.questions.length; i++) {
        const q = courseData.questions[i];
        
        await prisma.question.create({
          data: {
            text: q.question,
            type: q.type,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            order: i + 1,
            lessonId: lesson.id,
          },
        });
      }
      console.log(`  ✅ Created ${courseData.questions.length} questions`);
    } else {
      console.log(`⏭️ Course already exists: ${course.title}`);
    }
  }

  // Verify courses were created
  const courseCount = await prisma.course.count();
  console.log(`\n📊 Total courses in database: ${courseCount}`);
  
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