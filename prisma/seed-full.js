// prisma/seed-full.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

  // Define all 8 courses with their questions
  const courses = [
    {
      id: 'financial-literacy',
      title: 'Financial Literacy',
      videoUrl: 'https://www.youtube.com/embed/dqbFN9a6RNA',
      questions: [
        {
          id: 'fl_q1',
          type: 'MCQ',
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
          type: 'MCQ',
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
          type: 'MCQ',
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
          type: 'MCQ',
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
          type: 'MCQ',
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
          type: 'MCQ',
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
          type: 'MCQ',
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
          type: 'MCQ',
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
          type: 'MCQ',
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
          type: 'MCQ',
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
    },
    {
      id: 'budgeting',
      title: 'Budgeting',
      videoUrl: 'https://www.youtube.com/embed/QyOHpckT4wc',
      questions: [
        {
          id: 'bud_q1',
          type: 'MCQ',
          question: 'What is the main purpose of a budget?',
          options: [
            'A. To restrict your spending so you never enjoy your money',
            'B. To show off how much money you have to others',
            'C. To plan how you will use your money so it goes where it should',
            'D. To calculate how much tax you owe the government'
          ],
          correctAnswer: 'C. To plan how you will use your money so it goes where it should',
          explanation: 'A budget is a plan — not a punishment. It helps you decide in advance where your money will go.'
        },
        {
          id: 'bud_q2',
          type: 'MCQ',
          question: 'Using the 50/30/20 rule, if you earn GHS 800 per month, how much should you aim to save?',
          options: [
            'A. GHS 50',
            'B. GHS 400',
            'C. GHS 240',
            'D. GHS 160'
          ],
          correctAnswer: 'D. GHS 160',
          explanation: 'The 50/30/20 rule says to put 20% toward savings. 20% of GHS 800 = GHS 160.'
        },
        {
          id: 'bud_q3',
          type: 'MCQ',
          question: "What is the 'Pay Yourself First' saving strategy?",
          options: [
            'A. Spending money on things you enjoy before paying your bills',
            'B. Setting aside your savings immediately when you receive money, before spending on anything else',
            'C. Paying yourself a salary from your own business account',
            'D. Waiting until the end of the month to see what is left to save'
          ],
          correctAnswer: 'B. Setting aside your savings immediately when you receive money, before spending on anything else',
          explanation: 'Pay Yourself First means treating savings like a non-negotiable expense.'
        },
        {
          id: 'bud_q4',
          type: 'MCQ',
          question: 'Which of these is an example of a SHORT-TERM savings goal?',
          options: [
            'A. Saving to start your own business in 3 years',
            'B. Building a university fund over 5 years',
            'C. Saving for a skills training course over the next 2 months',
            'D. Saving for retirement over 20 years'
          ],
          correctAnswer: 'C. Saving for a skills training course over the next 2 months',
          explanation: 'Short-term goals are achievable in 1–3 months.'
        },
        {
          id: 'bud_q5',
          type: 'MCQ',
          question: 'Someone earns GHS 500 per month. Their fixed expenses are GHS 350 and variable expenses are GHS 100. How much is available for savings?',
          options: [
            'A. GHS 100',
            'B. GHS 50',
            'C. GHS 150',
            'D. GHS 0'
          ],
          correctAnswer: 'B. GHS 50',
          explanation: 'GHS 500 income − GHS 350 fixed − GHS 100 variable = GHS 50 remaining.'
        }
      ]
    },
    {
      id: 'cv-basics',
      title: 'CV Basics',
      videoUrl: 'https://www.youtube.com/embed/LZVsMrSYOCQ',
      questions: [
        {
          id: 'cv_q1',
          type: 'MCQ',
          question: 'What is the primary purpose of a CV?',
          options: [
            'A. To tell your whole life story',
            'B. To get you an interview by showing your relevant skills and experience',
            'C. To list every single job you have ever had since childhood',
            'D. To show off your creative writing skills'
          ],
          correctAnswer: 'B. To get you an interview by showing your relevant skills and experience',
          explanation: 'A CV is a professional marketing document designed to secure an interview.'
        },
        {
          id: 'cv_q2',
          type: 'MCQ',
          question: 'Which section should always be at the very top of your CV?',
          options: [
            'A. Hobbies and Interests',
            'B. Contact Information (Name, Phone, Email)',
            'C. Primary School Education',
            'D. References'
          ],
          correctAnswer: 'B. Contact Information (Name, Phone, Email)',
          explanation: 'Employers need to know who you are and how to reach you immediately.'
        },
        {
          id: 'cv_q3',
          type: 'MCQ',
          question: 'How long should a standard CV be for someone starting their career?',
          options: [
            'A. 5 pages',
            'B. 1-2 pages',
            'C. Half a page',
            'D. As long as possible'
          ],
          correctAnswer: 'B. 1-2 pages',
          explanation: 'Keep it concise and relevant. 1-2 pages is the standard.'
        },
        {
          id: 'cv_q4',
          type: 'MCQ',
          question: 'What should you do if you have no formal work experience?',
          options: [
            'A. Leave the section blank',
            'B. List volunteer work, school projects, or informal jobs (like helping a family business)',
            'C. Make up a job at a famous company',
            'D. Don’t apply for the job'
          ],
          correctAnswer: 'B. List volunteer work, school projects, or informal jobs (like helping a family business)',
          explanation: 'Transferable skills from any activity are valuable to employers.'
        },
        {
          id: 'cv_q5',
          type: 'MCQ',
          question: 'Why should you save your CV as a PDF?',
          options: [
            'A. It makes the file size larger',
            'B. It ensures the formatting stays the same on any device',
            'C. It is the only format employers can open',
            'D. It automatically corrects your spelling'
          ],
          correctAnswer: 'B. It ensures the formatting stays the same on any device',
          explanation: 'PDFs preserve your layout and are professional.'
        }
      ]
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter',
      videoUrl: 'https://www.youtube.com/embed/Nc5xGLz_jYI',
      questions: [
        {
          id: 'cl_q1',
          type: 'MCQ',
          question: 'What is the main difference between a CV and a cover letter?',
          options: [
            'A. A cover letter is longer and more detailed than a CV',
            'B. A CV lists your facts and skills; a cover letter explains why you want the job and what you can offer',
            'C. A cover letter lists your education and experience',
            'D. There is no difference — they are the same document'
          ],
          correctAnswer: 'B. A CV lists your facts and skills; a cover letter explains why you want the job and what you can offer',
          explanation: 'A CV is a list of facts; a cover letter is personal and explains your motivation.'
        },
        {
          id: 'cl_q2',
          type: 'MCQ',
          question: 'Which of these is the BEST opening line for a cover letter?',
          options: [
            'A. "To whoever, I want this job and think I would be good at it."',
            'B. "I am writing to apply for the Cashier position advertised at your supermarket."',
            'C. "I have always wanted to work and I am ready for any job available."',
            'D. "My name is Sila and I need a job as soon as possible."'
          ],
          correctAnswer: 'B. "I am writing to apply for the Cashier position advertised at your supermarket."',
          explanation: 'A good opening line names the specific job and where you saw it.'
        },
        {
          id: 'cl_q3',
          type: 'MCQ',
          question: 'How long should a cover letter be?',
          options: [
            'A. At least 3 pages — the more detail the better',
            'B. Exactly the same length as your CV',
            'C. One page — 3 to 4 short paragraphs',
            'D. Just one or two sentences'
          ],
          correctAnswer: 'C. One page — 3 to 4 short paragraphs',
          explanation: 'A cover letter should be one page with 3–4 short paragraphs.'
        },
        {
          id: 'cl_q4',
          type: 'MCQ',
          question: 'Why is it important to customise your cover letter for each job?',
          options: [
            'A. It is not important — the same letter works for every job',
            'B. Because it makes the letter longer and more impressive',
            'C. Because it shows the employer you are genuinely interested in their specific job',
            'D. Because employers check if you used the right font'
          ],
          correctAnswer: 'C. Because it shows the employer you are genuinely interested in their specific job',
          explanation: 'Customising your letter tells the employer you care about their specific opportunity.'
        },
        {
          id: 'cl_q5',
          type: 'MCQ',
          question: 'Which of these is a common mistake to AVOID in a cover letter?',
          options: [
            'A. Keeping your paragraphs short and clear',
            'B. Mentioning a specific skill that matches the job',
            'C. Writing "I only have a little experience but I hope that is okay"',
            'D. Thanking the employer at the end of the letter'
          ],
          correctAnswer: 'C. Writing "I only have a little experience but I hope that is okay"',
          explanation: 'Apologetic or negative language makes you sound unsure of yourself.'
        }
      ]
    },
    {
      id: 'professional-email',
      title: 'Professional Email',
      videoUrl: 'https://www.youtube.com/embed/ED1G0fNkK3U',
      questions: [
        {
          id: 'pe_q1',
          type: 'MCQ',
          question: "You want to email the Head of Marketing at a company in Accra. The company's website is www.ghanabrands.com. What is your BEST first step to find their email?",
          options: [
            'A. Send a message to info@ghanabrands.com',
            'B. Go to hunter.io or apollo.io, type in \'ghanabrands.com\', and look for the Head of Marketing\'s email address',
            'C. Post on social media asking if anyone has the contact',
            'D. Call the company\'s main line and ask for the email address'
          ],
          correctAnswer: 'B. Go to hunter.io or apollo.io, type in \'ghanabrands.com\', and look for the Head of Marketing\'s email address',
          explanation: 'Tools like hunter.io are designed to find professional emails.'
        },
        {
          id: 'pe_q2',
          type: 'MCQ',
          question: 'You find one confirmed email at a company: kofi.asante@akwaaba-tech.com. You now want to email the CEO, whose name is Abena Darko. Which email should you try first?',
          options: [
            'A. ceo@akwaaba-tech.com',
            'B. abena@akwaaba-tech.com',
            'C. abena.darko@akwaaba-tech.com',
            'D. adarko@akwaaba-tech.com'
          ],
          correctAnswer: 'C. abena.darko@akwaaba-tech.com',
          explanation: 'Use the confirmed pattern: firstname.lastname@company.com.'
        },
        {
          id: 'pe_q3',
          type: 'MCQ',
          question: 'Read these two email opening lines. Which one is more likely to get a reply — and why?',
          options: [
            'A. \'I am writing to express my interest in any available positions at your organisation.\'',
            'B. \'I recently read about your team\'s work expanding access to solar energy in rural communities — this kind of mission-driven work is exactly what I want to be part of.\'',
            'C. Both are equally good',
            'D. Option A is better because it is shorter and more professional'
          ],
          correctAnswer: 'B. \'I recently read about your team\'s work expanding access to solar energy in rural communities — this kind of mission-driven work is exactly what I want to be part of.\'',
          explanation: 'Specific, personal openings about THEM are much more effective.'
        },
        {
          id: 'pe_q4',
          type: 'MCQ',
          question: 'You are writing a cold email to a company that has no job posting. What is the BEST \'ask\' to make at the end of your first email?',
          options: [
            'A. \'Please hire me for a full-time position immediately.\'',
            'B. \'Can you forward my CV to all department heads?\'',
            'C. \'Would you be open to a 10-minute conversation this week or next? I have attached my CV for your reference.\'',
            'D. \'Please read my 3-page cover letter attached to this email.\''
          ],
          correctAnswer: 'C. \'Would you be open to a 10-minute conversation this week or next? I have attached my CV for your reference.\'',
          explanation: 'A low-pressure request for a short conversation is more likely to be accepted.'
        },
        {
          id: 'pe_q5',
          type: 'MCQ',
          question: 'Which of these subject lines is MOST likely to get your cold email opened?',
          options: [
            'A. \'Job Application\'',
            'B. \'Hi\'',
            'C. \'Operations Professional — Excited to Contribute to Accra Logistics\' Expansion\'',
            'D. \'Please kindly find my CV attached for your consideration\''
          ],
          correctAnswer: 'C. \'Operations Professional — Excited to Contribute to Accra Logistics\' Expansion\'',
          explanation: 'A clear, value-driven subject line stands out.'
        },
        {
          id: 'pe_q6',
          type: 'MCQ',
          question: 'You sent a cold email 8 days ago. No reply. What should you do?',
          options: [
            'A. Send a second email every day until they reply',
            'B. Send one polite follow-up referencing your original email and restating your interest',
            'C. Give up — if they wanted to reply they would have',
            'D. Email their personal LinkedIn to demand a response'
          ],
          correctAnswer: 'B. Send one polite follow-up referencing your original email and restating your interest',
          explanation: 'One or two polite follow-ups are professional and often necessary.'
        },
        {
          id: 'pe_q7',
          type: 'TRUE_FALSE',
          question: "If a company replies saying 'we have no openings right now', the conversation is over and there is nothing more you can do.",
          options: ['A. True', 'B. False — this is actually a warm contact. Reply gracefully, thank them, and keep the door open.'],
          correctAnswer: 'B. False — this is actually a warm contact. Reply gracefully, thank them, and keep the door open.',
          explanation: 'Keeping the door open can lead to future opportunities.'
        }
      ]
    },
    {
      id: 'digital-literacy-1',
      title: 'Digital Literacy Part 1',
      videoUrl: 'https://www.youtube.com/embed/RWk6yD5ohk0',
      questions: [
        {
          id: 'dl1_q1',
          type: 'MCQ',
          question: 'You want to create a professional email address to use for job applications. Which of these is the best choice?',
          options: [
            'A. coolghanaboy@yahoo.com',
            'B. 0244555123@gmail.com',
            'C. kwame.asante@gmail.com',
            'D. xoxo_bestgirl2007@gmail.com'
          ],
          correctAnswer: 'C. kwame.asante@gmail.com',
          explanation: 'A professional email should ideally be your name.'
        },
        {
          id: 'dl1_q2',
          type: 'MCQ',
          question: 'You want to save your CV so you can access it from any phone or computer and share it easily with employers. Which free tool do you use?',
          options: [
            'A. Print it and carry it everywhere',
            'B. Save it on Google Drive and share the link with employers',
            'C. Keep it only on your phone\'s memory',
            'D. Email it to yourself every time you need it'
          ],
          correctAnswer: 'B. Save it on Google Drive and share the link with employers',
          explanation: 'Cloud storage like Google Drive is accessible from anywhere.'
        },
        {
          id: 'dl1_q3',
          type: 'MCQ',
          question: 'You receive a WhatsApp message saying: \'Congratulations! You have been selected for a job. Please send GH₵50 to receive your offer letter.\' What should you do?',
          options: [
            'A. Send the money quickly before the offer expires',
            'B. Ask them to reduce the fee to GH₵20',
            'C. Do not send any money — this is a scam. Block and report the number.',
            'D. Ask a friend to send the money on your behalf'
          ],
          correctAnswer: 'C. Do not send any money — this is a scam. Block and report the number.',
          explanation: 'Legitimate employers will never ask you for money to give you a job.'
        },
        {
          id: 'dl1_q4',
          type: 'MCQ',
          question: 'You want to learn how to use Microsoft Excel but cannot afford classes. What is the best free option?',
          options: [
            'A. Wait until you can afford a course',
            'B. Ask your employer to teach you on the job',
            'C. Search YouTube: \'How to use Excel for beginners\' — watch and practise for free',
            'D. Excel cannot be learned without a formal class'
          ],
          correctAnswer: 'C. Search YouTube: \'How to use Excel for beginners\' — watch and practise for free',
          explanation: 'YouTube is a massive library of free educational content.'
        },
        {
          id: 'dl1_q5',
          type: 'MCQ',
          question: 'You are on a shared computer at a cyber café and you check your Gmail. You finish and are leaving. What must you do?',
          options: [
            'A. Nothing — Gmail logs out automatically',
            'B. Delete your browsing history only',
            'C. Log out of your Gmail account completely before leaving',
            'D. Change your password from the shared computer'
          ],
          correctAnswer: 'C. Log out of your Gmail account completely before leaving',
          explanation: 'Always log out of personal accounts on shared devices.'
        },
        {
          id: 'dl1_q6',
          type: 'TRUE_FALSE',
          question: 'Google Docs and Google Sheets are free tools that can replace Microsoft Word and Excel for writing CVs and tracking applications.',
          options: ['A. True — they are completely free and save your work automatically in the cloud', 'B. False — you must pay for Google Docs'],
          correctAnswer: 'A. True — they are completely free and save your work automatically in the cloud',
          explanation: 'Google Docs and Sheets are excellent free alternatives.'
        },
        {
          id: 'dl1_q7',
          type: 'MCQ',
          question: 'What is the main professional benefit of LinkedIn that other social media platforms do not offer?',
          options: [
            'A. You can post funny videos and go viral',
            'B. You can connect with your school friends',
            'C. Recruiters and hiring managers actively search LinkedIn every day looking for candidates',
            'D. It is the cheapest way to advertise products'
          ],
          correctAnswer: 'C. Recruiters and hiring managers actively search LinkedIn every day looking for candidates',
          explanation: 'LinkedIn is specifically built for professional networking and recruitment.'
        }
      ]
    },
    {
      id: 'digital-literacy-2',
      title: 'Digital Literacy Part 2',
      videoUrl: 'https://www.youtube.com/embed/xZ9VctC-JZs',
      questions: [
        {
          id: 'dl2_q1',
          type: 'MCQ',
          question: 'An employer searches two candidates on Google. Candidate A has a professional LinkedIn. Candidate B has offensive Instagram posts. What happens?',
          options: [
            'A. The employer chooses based only on the CV',
            'B. Both candidates get a fair chance',
            'C. Candidate A gets a clear advantage. Candidate B may not even be called for interview.',
            'D. The employer cannot legally search social media'
          ],
          correctAnswer: 'C. Candidate A gets a clear advantage. Candidate B may not even be called for interview.',
          explanation: 'Your online presence is part of your professional reputation.'
        },
        {
          id: 'dl2_q2',
          type: 'MCQ',
          question: 'You want recruiters to see that you are actively looking for work on LinkedIn. What do you turn on?',
          options: [
            'A. Your notification settings',
            'B. The \'Open to Work\' feature',
            'C. Your location sharing',
            'D. Your profile view privacy'
          ],
          correctAnswer: 'B. The \'Open to Work\' feature',
          explanation: 'The Open to Work feature signals your availability to recruiters.'
        },
        {
          id: 'dl2_q3',
          type: 'MCQ',
          question: 'Which LinkedIn headline is most likely to attract a recruiter?',
          options: [
            'A. \'Job Seeker\'',
            'B. \'Unemployed — Looking for Work\'',
            'C. \'Customer Relations Professional | Skilled in Communication & Problem Solving | Open to Opportunities in Accra\'',
            'D. \'Hello I am looking for any job please\''
          ],
          correctAnswer: 'C. \'Customer Relations Professional | Skilled in Communication & Problem Solving | Open to Opportunities in Accra\'',
          explanation: 'A headline should highlight your skills and location.'
        },
        {
          id: 'dl2_q4',
          type: 'MCQ',
          question: 'You post a TikTok video about a skill you are learning. It gets 50 views but no engagement. What should you do?',
          options: [
            'A. Delete the video and never post again',
            'B. Post the same video again',
            'C. Reply to every comment, use a trending sound, and post consistently',
            'D. Pay for TikTok advertising immediately'
          ],
          correctAnswer: 'C. Reply to every comment, use a trending sound, and post consistently',
          explanation: 'Algorithms reward engagement and frequency.'
        },
        {
          id: 'dl2_q5',
          type: 'MCQ',
          question: 'What is the most effective way to use Instagram if you are a tailor trying to attract customers?',
          options: [
            'A. Post only inspirational quotes',
            'B. Post about other people\'s designs',
            'C. Post photos and short videos of your actual work and use local hashtags',
            'D. Post every hour to stay visible'
          ],
          correctAnswer: 'C. Post photos and short videos of your actual work and use local hashtags',
          explanation: 'Visual proof of your work is the best marketing on Instagram.'
        },
        {
          id: 'dl2_q6',
          type: 'TRUE_FALSE',
          question: 'On TikTok, a brand new account with zero followers can reach thousands of people with a single video if the content is good.',
          options: ['A. True — TikTok\'s algorithm pushes content based on quality, not follower count', 'B. False — you need at least 1,000 followers first'],
          correctAnswer: 'A. True — TikTok\'s algorithm pushes content based on quality, not follower count',
          explanation: 'TikTok is unique in how it surfaces content from new accounts.'
        },
        {
          id: 'dl2_q7',
          type: 'MCQ',
          question: 'What does the YouTube Partner Programme allow you to do once you reach 1,000 subscribers and 4,000 watch hours?',
          options: [
            'A. Post longer videos',
            'B. Message other creators',
            'C. Earn money from ads that play on your videos',
            'D. Download other people\'s videos'
          ],
          correctAnswer: 'C. Earn money from ads that play on your videos',
          explanation: 'Monetization is a key milestone for YouTube creators.'
        }
      ]
    }
  ];

  // Process each course
  for (const courseData of courses) {
    console.log(`\nProcessing course: ${courseData.title}`);
    
    // Delete existing data for this course to avoid conflicts
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseData.id },
      include: { modules: { include: { lessons: true } } }
    });
    
    if (existingCourse) {
      // Delete existing questions, lessons, modules
      for (const module of existingCourse.modules) {
        for (const lesson of module.lessons) {
          await prisma.question.deleteMany({ where: { lessonId: lesson.id } });
        }
        await prisma.lesson.deleteMany({ where: { moduleId: module.id } });
      }
      await prisma.module.deleteMany({ where: { courseId: courseData.id } });
      await prisma.course.delete({ where: { id: courseData.id } });
      console.log(`  Deleted existing course data`);
    }
    
    // Create course
    const course = await prisma.course.create({
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
    console.log(`  Course created: ${course.id}`);

    // Create module
    const module = await prisma.module.create({
      data: {
        id: `${courseData.id}-module`,
        title: `${courseData.title} Module`,
        order: 1,
        courseId: course.id,
      },
    });
    console.log(`  Module created: ${module.id}`);

    // Create lesson
    const lesson = await prisma.lesson.create({
      data: {
        id: `${courseData.id}-lesson`,
        title: courseData.title,
        description: `Watch this video to learn about ${courseData.title}`,
        videoUrl: courseData.videoUrl,
        order: 1,
        moduleId: module.id,
      },
    });
    console.log(`  Lesson created: ${lesson.id}`);

    // Create questions
    for (let i = 0; i < courseData.questions.length; i++) {
      const q = courseData.questions[i];
      
      let questionType = "MULTIPLE_CHOICE";
      if (q.type === "TEXT") questionType = "TEXT";
      if (q.type === "TRUE_FALSE") questionType = "TRUE_FALSE";
      
      await prisma.question.create({
        data: {
          id: q.id,
          text: q.question,
          type: questionType,
          options: q.options ? JSON.stringify(q.options) : null,
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