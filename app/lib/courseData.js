// lib/courseData.js
const QuestionType = {
  MCQ: 'MCQ',
  TEXT: 'TEXT',
  TRUE_FALSE: 'TRUE_FALSE'
};

const COURSES = [
  {
    id: 'financial-literacy',
    title: 'Financial Literacy',
    videoUrl: 'https://www.youtube.com/embed/dqbFN9a6RNA',
    questions: [
      {
        id: 'fl_q1',
        type: QuestionType.MCQ,
        question: 'What does financial literacy mean?',
        options: [
          'A. Knowing how to read financial news articles',
          'B. Understanding how money works and knowing how to earn, spend, save, and manage it wisely',
          'C. Having a large amount of money saved in a bank account',
          'D. Being able to do complex mathematical calculations'
        ],
        correctAnswer: 'B. Understanding how money works and knowing how to earn, spend, save, and manage it wisely',
        explanation: 'Financial literacy is about understanding money and developing the habits to manage it well — regardless of how much you earn.'
      },
      {
        id: 'fl_q2',
        type: QuestionType.MCQ,
        question: 'Which of the following is an example of a FIXED expense?',
        options: [
          'A. Buying a new pair of shoes',
          'B. Spending money on entertainment',
          'C. Monthly rent or housing payment',
          'D. Buying food at a market'
        ],
        correctAnswer: 'C. Monthly rent or housing payment',
        explanation: 'Fixed expenses stay the same every month — like rent, school fees, or loan repayments.'
      },
      {
        id: 'fl_q3',
        type: QuestionType.MCQ,
        question: 'What is the difference between a NEED and a WANT?',
        options: [
          'A. Needs are expensive; wants are cheap',
          'B. Needs are things you must have to survive; wants are things that are nice to have but not essential',
          'C. Needs are for adults; wants are for children',
          'D. There is no real difference — they are the same thing'
        ],
        correctAnswer: 'B. Needs are things you must have to survive; wants are things that are nice to have but not essential',
        explanation: 'Needs include food, shelter, healthcare, and basic transport. Wants are things like a new phone or eating out.'
      },
      {
        id: 'fl_q4',
        type: QuestionType.MCQ,
        question: 'If your income is LESS than your expenses every month, what situation are you in?',
        options: [
          'A. Surplus — you have extra money left over',
          'B. Break even — your money balances out',
          'C. Deficit — you are spending more than you earn',
          'D. Investment — your money is growing'
        ],
        correctAnswer: 'C. Deficit — you are spending more than you earn',
        explanation: 'A deficit means you spend more than you earn. This leads to debt and financial stress.'
      },
      {
        id: 'fl_q5',
        type: QuestionType.MCQ,
        question: 'Which of these is a good financial habit?',
        options: [
          'A. Spending all your money as soon as you receive it',
          'B. Borrowing money to buy things you want but do not need',
          'C. Saving a portion of your income before you start spending',
          'D. Ignoring small daily expenses because they are not important'
        ],
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
        id: 'bk_q1',
        type: QuestionType.MCQ,
        question: 'What does bookkeeping mean?',
        options: [
          'A. Writing a list of things you want to buy in the future',
          'B. Recording every amount of money that comes in or goes out, clearly and regularly',
          'C. Counting the total amount of money you have in your wallet',
          'D. Making a plan for how much money you want to earn'
        ],
        correctAnswer: 'B. Recording every amount of money that comes in or goes out, clearly and regularly',
        explanation: 'Bookkeeping is the practice of recording ALL financial transactions.'
      },
      {
        id: 'bk_q2',
        type: QuestionType.MCQ,
        question: 'What is the difference between INCOME and an EXPENSE in bookkeeping?',
        options: [
          'A. Income is money you save; an expense is money you earn',
          'B. Income and expenses are the same thing',
          'C. Income is money coming IN; an expense is money going OUT',
          'D. Income is only from a job; an expense is only for rent'
        ],
        correctAnswer: 'C. Income is money coming IN; an expense is money going OUT',
        explanation: 'Income = money received. Expenses = money spent.'
      },
      {
        id: 'bk_q3',
        type: QuestionType.MCQ,
        question: 'Look at this ledger entry. What is the closing balance? Opening balance: GHS 80 | Income this week: GHS 120 | Expenses this week: GHS 75',
        options: [
          'A. GHS 125',
          'B. GHS 200',
          'C. GHS 45',
          'D. GHS 275'
        ],
        correctAnswer: 'A. GHS 125',
        explanation: '80 + 120 - 75 = 125.'
      },
      {
        id: 'bk_q4',
        type: QuestionType.MCQ,
        question: 'Why is it important to keep personal and business finances SEPARATE?',
        options: [
          'A. It is not important — mixing them together is fine',
          'B. Because mixing them makes records confusing and it becomes impossible to know if the business is profitable',
          'C. Because businesses are only allowed to use bank accounts, not cash',
          'D. Because personal expenses are not allowed to be written in a ledger'
        ],
        correctAnswer: 'B. Because mixing them makes records confusing and it becomes impossible to know if the business is profitable',
        explanation: 'Keeping them separate makes records accurate, clear, and trustworthy.'
      },
      {
        id: 'bk_q5',
        type: QuestionType.MCQ,
        question: 'Amara runs a small food stall. She records the following in one week: Sales: GHS 200 | Stock purchased: GHS 80 | Transport: GHS 20 | Phone top-up: GHS 10. What is her profit (balance) for the week?',
        options: [
          'A. GHS 200',
          'B. GHS 110',
          'C. GHS 90',
          'D. GHS 310'
        ],
        correctAnswer: 'C. GHS 90',
        explanation: '200 - (80 + 20 + 10) = 90.'
      }
    ]
  }
];

module.exports = { COURSES, QuestionType };