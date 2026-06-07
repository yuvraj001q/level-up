import type { TaskDifficulty, Goal } from '@/types';

interface AIQuestInput {
  goals: Goal[];
  level: number;
  interests: string[];
  streak: number;
  completedTitles: string[];
}

interface GeneratedTask {
  title: string;
  description: string;
  difficulty: TaskDifficulty;
  category: string;
}

const TASK_TEMPLATES: Record<string, { easy: string[]; medium: string[]; hard: string[]; epic: string[] }> = {
  FITNESS: {
    easy: [
      'Walk for 15 minutes',
      'Do 10 stretching exercises',
      'Drink 2 liters of water',
      'Take the stairs instead of elevator',
      'Do 20 jumping jacks',
    ],
    medium: [
      'Complete a 20-minute workout',
      'Go for a 30-minute run',
      'Do 50 push-ups throughout the day',
      'Follow a yoga session',
      'Swim for 30 minutes',
    ],
    hard: [
      'Complete a 5 km run',
      'Follow a structured 45-minute workout',
      'Track all calorie intake for the day',
      'Complete a HIIT session',
      'Do 100 squats',
    ],
    epic: [
      'Run 10 km',
      'Complete a 2-hour gym session',
      'Finish a half-marathon training session',
      'Complete a full-body intensive workout',
      'Set a new personal record in any exercise',
    ],
  },
  LEARNING: {
    easy: [
      'Read for 15 minutes',
      'Watch an educational video',
      'Learn 5 new words',
      'Listen to a podcast',
      'Review notes for 10 minutes',
    ],
    medium: [
      'Read for 30 minutes',
      'Complete an online lesson',
      'Practice a new skill for 20 minutes',
      'Write a summary of what you learned',
      'Take an online quiz',
    ],
    hard: [
      'Read a chapter of a book',
      'Complete a full online course module',
      'Write a detailed essay on a topic',
      'Solve 10 complex problems',
      'Create a mind map of a subject',
    ],
    epic: [
      'Finish reading a book',
      'Complete a certification module',
      'Write a research paper',
      'Build a project using new skills',
      'Teach someone what you learned',
    ],
  },
  CODING: {
    easy: [
      'Solve 1 coding challenge',
      'Write 20 lines of code',
      'Review your code from yesterday',
      'Read documentation for 15 minutes',
      'Fix a small bug',
    ],
    medium: [
      'Solve 3 coding challenges',
      'Write 100 lines of code',
      'Refactor a function',
      'Complete a small feature',
      'Code for 30 minutes',
    ],
    hard: [
      'Solve 5 coding challenges',
      'Build a small feature end-to-end',
      'Optimize a piece of code',
      'Complete a code review',
      'Write unit tests',
    ],
    epic: [
      'Complete a full project milestone',
      'Solve 10 hard coding challenges',
      'Build and deploy a feature',
      'Contribute to open source',
      'Complete a hackathon project',
    ],
  },
  READING: {
    easy: ['Read 5 pages', 'Read for 10 minutes', 'Read one article', 'Read a poem', 'Browse book recommendations'],
    medium: ['Read 20 pages', 'Read for 30 minutes', 'Read two articles', 'Take notes while reading', 'Read a short story'],
    hard: ['Read 50 pages', 'Read for 1 hour', 'Complete a chapter', 'Write a book review', 'Analyze a text deeply'],
    epic: ['Finish a book', 'Read 100+ pages', 'Write a detailed analysis', 'Create a reading list for the month', 'Start a book club discussion'],
  },
  BUSINESS: {
    easy: ['Review your goals for the day', 'Send one important email', 'Update your planner', 'Research one business idea', 'Organize your workspace'],
    medium: ['Work on business plan for 30 minutes', 'Network with one person', 'Review finances', 'Create a marketing post', 'Analyze competitor'],
    hard: ['Complete a business proposal', 'Review quarterly strategy', 'Meet with a potential partner', 'Launch a marketing campaign', 'Analyze analytics deeply'],
    epic: ['Secure a new client', 'Complete a major business deal', 'Launch a new product/service', 'Present at an event', 'Publish a case study'],
  },
  SELF_IMPROVEMENT: {
    easy: [
      'Meditate for 5 minutes',
      'Write down 3 things you are grateful for',
      'Practice deep breathing for 2 minutes',
      'Set 3 daily intentions',
      'Compliment yourself',
    ],
    medium: [
      'Meditate for 15 minutes',
      'Journal for 10 minutes',
      'Practice positive affirmations',
      'Do a digital detox for 1 hour',
      'Read about a self-improvement topic',
    ],
    hard: [
      'Meditate for 30 minutes',
      'Complete a full journal entry',
      'Practice a new habit for the day',
      'Do a full digital detox for 4 hours',
      'Create a personal development plan',
    ],
    epic: [
      'Complete a 7-day challenge',
      'Attend a workshop or seminar',
      'Complete a personal development course',
      'Break a bad habit for the day',
      'Achieve a personal breakthrough',
    ],
  },
  NDA_PREPARATION: {
    easy: ['Study for 20 minutes', 'Review 10 practice questions', 'Read one chapter of a subject', 'Create a study schedule', 'Review weak areas'],
    medium: ['Study for 1 hour', 'Complete 50 practice questions', 'Take a mock test section', 'Revise two subjects', 'Create summary notes'],
    hard: ['Study for 3 hours', 'Complete 100 practice questions', 'Take a full mock test', 'Analyze test performance', 'Focus on weak subjects'],
    epic: ['Study for 6+ hours', 'Complete 200 practice questions', 'Achieve target score in mock test', 'Master a difficult subject', 'Complete full syllabus revision'],
  },
  CAREER_GROWTH: {
    easy: ['Update your LinkedIn profile', 'Review job listings', 'Reach out to one connection', 'Update your resume', 'Learn one new professional skill'],
    medium: ['Apply to 3 jobs', 'Complete a professional course module', 'Network with 3 people', 'Work on a side project', 'Prepare for an interview'],
    hard: ['Complete a certification', 'Build a portfolio piece', 'Do a mock interview', 'Write a professional article', 'Speak at a meetup'],
    epic: ['Get a promotion or new job offer', 'Launch a professional website', 'Publish industry research', 'Mentor someone', 'Speak at a conference'],
  },
  COMMUNICATION_SKILLS: {
    easy: ['Practice active listening for 10 minutes', 'Speak clearly for 2 minutes', 'Write a short message', 'Read aloud for 5 minutes', 'Learn one new word'],
    medium: ['Have a meaningful conversation', 'Write a 500-word article', 'Practice a presentation', 'Record yourself speaking', 'Give constructive feedback'],
    hard: ['Give a presentation', 'Write a persuasive essay', 'Lead a group discussion', 'Debate a topic', 'Write a professional proposal'],
    epic: ['Speak at an event', 'Publish an article', 'Negotiate successfully', 'Teach a workshop', 'Lead a team meeting effectively'],
  },
  CREATIVITY: {
    easy: ['Doodle for 5 minutes', 'Brainstorm 10 ideas', 'Listen to inspiring music', 'Take a creative photo', 'Write a short poem'],
    medium: ['Create a piece of art', 'Write a short story', 'Design something new', 'Learn a creative technique', 'Build a mood board'],
    hard: ['Complete a creative project', 'Write a detailed story/script', 'Create a complete design', 'Produce a video', 'Choreograph something'],
    epic: ['Launch a creative portfolio', 'Publish creative work', 'Win a creative competition', 'Complete a masterpiece', 'Exhibit your work'],
  },
  MINDFULNESS: {
    easy: ['Meditate for 5 minutes', 'Practice deep breathing', 'Eat mindfully for one meal', 'Take a mindful walk', 'Do a body scan'],
    medium: ['Meditate for 15 minutes', 'Practice gratitude journaling', 'Do a digital detox for 2 hours', 'Practice mindful eating all day', 'Do a yoga session'],
    hard: ['Meditate for 30 minutes', 'Complete a silent retreat day', 'Practice mindfulness all day', 'Do advanced breathing exercises', 'Complete a meditation course module'],
    epic: ['Complete a week of daily meditation', 'Attend a meditation retreat', 'Master a meditation technique', 'Teach mindfulness to someone', 'Achieve a deep meditative state'],
  },
  PRODUCTIVITY: {
    easy: ['Use Pomodoro for 1 session', 'Make a to-do list', 'Clean your workspace', 'Turn off notifications for 1 hour', 'Identify top 3 priorities'],
    medium: ['Use Pomodoro for 4 sessions', 'Complete top 3 priorities', 'Time block your day', 'Batch similar tasks', 'Process your inbox'],
    hard: ['Complete 8 Pomodoro sessions', 'Finish all planned tasks', 'Deep work for 4 hours', 'Complete a weekly review', 'Optimize workflow'],
    epic: ['Achieve inbox zero', 'Complete a 12-hour productivity day', 'Finish a major project ahead of schedule', 'Systemize your workflow', 'Build a productivity system'],
  },
  FINANCE: {
    easy: ['Review daily expenses', 'Log today transactions', 'Check bank balance', 'Set daily budget', 'Find one way to save money'],
    medium: ['Create a monthly budget', 'Review weekly spending', 'Research one investment', 'Pay off a small debt', 'Set up an automatic savings transfer'],
    hard: ['Analyze quarterly finances', 'Create a financial plan', 'Research stocks or mutual funds', 'Negotiate a better rate on a bill', 'Complete tax preparation'],
    epic: ['Build a diversified portfolio', 'Create a 5-year financial roadmap', 'Achieve a savings milestone', 'Launch a side income stream', 'Complete a full financial audit'],
  },
  HEALTH_WELLNESS: {
    easy: ['Drink 8 glasses of water', 'Take a 10-min walk', 'Stretch for 5 minutes', 'Eat one serving of vegetables', 'Get 7-8 hours of sleep'],
    medium: ['Cook a healthy meal', 'Do a 20-min workout', 'Track your meals for the day', 'Practice good posture all day', 'Take a power nap'],
    hard: ['Complete a full health checkup', 'Follow a diet plan for the day', 'Do 45-min intense workout', 'Meditate for 20 minutes', 'Detox from sugar for the day'],
    epic: ['Complete a 30-day health challenge', 'Achieve a fitness goal weight', 'Run a half marathon', 'Complete a wellness retreat day', 'Transform your daily routine'],
  },
  TRAVEL: {
    easy: ['Research one travel destination', 'Plan a weekend itinerary', 'Check passport validity', 'Browse flight deals', 'Create a packing list'],
    medium: ['Book accommodation for a trip', 'Plan a detailed day itinerary', 'Learn 10 phrases in a foreign language', 'Set a travel savings goal', 'Organize travel documents'],
    hard: ['Plan a full 7-day trip itinerary', 'Book a complete trip', 'Create a travel budget', 'Find hidden local attractions', 'Arrange transportation'],
    epic: ['Plan a multi-country trip', 'Travel to a new country', 'Complete a solo travel experience', 'Write a travel guide', 'Capture and share a travel photobook'],
  },
  SOCIAL_SKILLS: {
    easy: ['Start a conversation with a stranger', 'Compliment someone genuinely', 'Smile at 5 people today', 'Practice active listening for 10 min', 'Ask open-ended questions'],
    medium: ['Attend a social event', 'Network with 3 new people', 'Practice public speaking for 5 min', 'Have a deep conversation', 'Give a toast or speech'],
    hard: ['Lead a group discussion', 'Speak at a small event', 'Negotiate a win-win outcome', 'Handle a difficult conversation well', 'Mentor someone for an hour'],
    epic: ['Speak at a conference', 'Build a community group', 'Teach a workshop on communication', 'Mediate a conflict successfully', 'Deliver a TED-style talk'],
  },
  WRITING: {
    easy: ['Write 100 words', 'Journal for 5 minutes', 'Write a short poem', 'Draft an email', 'Write a one-paragraph story'],
    medium: ['Write 500 words', 'Write a blog post draft', 'Journal for 15 minutes', 'Write a short essay', 'Edit a piece of writing'],
    hard: ['Write 2000 words', 'Complete a short story', 'Write a detailed article', 'Start a writing portfolio', 'Submit writing for publication'],
    epic: ['Write 5000+ words in a day', 'Complete a book chapter', 'Publish an article or story', 'Win a writing competition', 'Complete a NanoWriMo challenge'],
  },
  LANGUAGE: {
    easy: ['Learn 5 new vocabulary words', 'Practice for 10 minutes', 'Watch a short video in target language', 'Label 10 household items', 'Listen to a song in target language'],
    medium: ['Have a 5-min conversation', 'Complete a language lesson', 'Write 10 sentences', 'Read a short article', 'Practice for 30 minutes'],
    hard: ['Have a 15-min conversation', 'Watch a movie without subtitles', 'Write a one-page essay', 'Read a news article', 'Complete an entire lesson module'],
    epic: ['Have a 30-min fluent conversation', 'Read a full book in target language', 'Pass a language certification test', 'Write a story in target language', 'Teach someone the basics'],
  },
  MUSIC: {
    easy: ['Listen to a new genre for 15 min', 'Practice an instrument for 10 min', 'Learn the notes of a scale', 'Clap along to a beat', 'Sing along to a song'],
    medium: ['Practice an instrument for 30 min', 'Learn a new song', 'Study music theory for 20 min', 'Compose a short melody', 'Record a practice session'],
    hard: ['Practice for 1 hour', 'Learn a complex piece', 'Perform in front of someone', 'Write a full song', 'Master a difficult technique'],
    epic: ['Perform at an open mic', 'Record a full track', 'Complete a music certification', 'Compose an original piece', 'Build a music portfolio'],
  },
};

export function generateAITasks(input: AIQuestInput): GeneratedTask[] {
  const { goals, level, interests, completedTitles } = input;
  const tasks: GeneratedTask[] = [];

  for (const goal of goals) {
    const templates = TASK_TEMPLATES[goal];
    if (!templates) continue;

    const usedTitles = new Set(completedTitles);
    const availableEasy = templates.easy.filter((t) => !usedTitles.has(t));
    const availableMedium = templates.medium.filter((t) => !usedTitles.has(t));
    const availableHard = templates.hard.filter((t) => !usedTitles.has(t));
    const availableEpic = templates.epic.filter((t) => !usedTitles.has(t));

    if (level <= 3) {
      const pick = availableEasy[Math.floor(Math.random() * availableEasy.length)] || templates.easy[0];
      tasks.push({
        title: pick,
        description: `A beginner-friendly ${goal.toLowerCase()} task to start your journey.`,
        difficulty: 'EASY',
        category: goal,
      });
    } else if (level <= 7) {
      const picks = [];
      const easy = availableEasy[Math.floor(Math.random() * availableEasy.length)];
      if (easy) picks.push({ title: easy, difficulty: 'EASY' as TaskDifficulty });
      const medium = availableMedium[Math.floor(Math.random() * availableMedium.length)];
      if (medium) picks.push({ title: medium, difficulty: 'MEDIUM' as TaskDifficulty });
      for (const p of picks) {
        tasks.push({
          title: p.title,
          description: `A ${goal.toLowerCase()} task suitable for your current level.`,
          difficulty: p.difficulty,
          category: goal,
        });
      }
    } else if (level <= 15) {
      const medium = availableMedium[Math.floor(Math.random() * availableMedium.length)];
      if (medium) {
        tasks.push({
          title: medium,
          description: `A challenging ${goal.toLowerCase()} task to push your limits.`,
          difficulty: 'MEDIUM',
          category: goal,
        });
      }
      const hard = availableHard[Math.floor(Math.random() * availableHard.length)];
      if (hard) {
        tasks.push({
          title: hard,
          description: `A difficult ${goal.toLowerCase()} task for advancing your skills.`,
          difficulty: 'HARD',
          category: goal,
        });
      }
    } else {
      const hard = availableHard[Math.floor(Math.random() * availableHard.length)];
      if (hard) {
        tasks.push({
          title: hard,
          description: `An advanced ${goal.toLowerCase()} task for an experienced user.`,
          difficulty: 'HARD',
          category: goal,
        });
      }
      const epic = availableEpic[Math.floor(Math.random() * availableEpic.length)];
      if (epic) {
        tasks.push({
          title: epic,
          description: `An epic ${goal.toLowerCase()} challenge for a true master.`,
          difficulty: 'EPIC',
          category: goal,
        });
      }
    }
  }

  if (interests.length > 0 && tasks.length < 3) {
    for (const interest of interests.slice(0, 2)) {
      const category = interest.toUpperCase();
      if (TASK_TEMPLATES[category]) {
        const templates = TASK_TEMPLATES[category];
        const medium = templates.medium[Math.floor(Math.random() * templates.medium.length)];
        if (medium) {
          tasks.push({
            title: medium,
            description: `A personalized task based on your interest in ${interest}.`,
            difficulty: 'MEDIUM',
            category,
          });
        }
      }
    }
  }

  return tasks.slice(0, 5);
}

export function generateDailyQuests(goals: Goal[], level: number, streak: number): GeneratedTask[] {
  const quests: GeneratedTask[] = [];
  const shuffled = [...goals].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(5, shuffled.length); i++) {
    const goal = shuffled[i];
    const templates = TASK_TEMPLATES[goal];
    if (!templates) continue;

    let difficulty: TaskDifficulty;
    if (level <= 3) difficulty = 'EASY';
    else if (level <= 10) difficulty = 'MEDIUM';
    else if (level <= 20) difficulty = 'HARD';
    else difficulty = 'EPIC';

    const pool = templates[difficulty.toLowerCase() as keyof typeof templates] as string[];
    const title = pool[Math.floor(Math.random() * pool.length)];

    quests.push({
      title,
      description: `Daily ${goal.toLowerCase()} quest: ${title.toLowerCase()}.`,
      difficulty,
      category: goal,
    });
  }

  if (streak > 0 && streak % 7 === 0) {
    const bonusGoal = shuffled[0];
    const templates = TASK_TEMPLATES[bonusGoal];
    if (templates) {
      const epic = templates.epic[Math.floor(Math.random() * templates.epic.length)];
      if (epic) {
        quests.push({
          title: `🔥 STREAK BONUS: ${epic}`,
          description: `Bonus quest for your ${streak}-day streak!`,
          difficulty: 'EPIC',
          category: bonusGoal,
        });
      }
    }
  }

  return quests;
}

export function generateWeeklyQuests(goals: Goal[], level: number): GeneratedTask[] {
  const quests: GeneratedTask[] = [];
  const shuffled = [...goals].sort(() => Math.random() - 0.5);

  for (const goal of shuffled.slice(0, 4)) {
    const templates = TASK_TEMPLATES[goal];
    if (!templates) continue;

    const medium = templates.medium[Math.floor(Math.random() * templates.medium.length)];
    if (medium) {
      quests.push({
        title: medium,
        description: `Weekly ${goal.toLowerCase()} quest. Complete this week for bonus XP.`,
        difficulty: 'MEDIUM',
        category: goal,
      });
    }

    const hard = templates.hard[Math.floor(Math.random() * templates.hard.length)];
    if (hard) {
      quests.push({
        title: hard,
        description: `Weekly ${goal.toLowerCase()} challenge. Go above and beyond!`,
        difficulty: 'HARD',
        category: goal,
      });
    }
  }

  return quests.slice(0, 7);
}

export function generateMonthlyQuests(goals: Goal[], level: number): GeneratedTask[] {
  const quests: GeneratedTask[] = [];
  const shuffled = [...goals].sort(() => Math.random() - 0.5);

  const pool: { title: string; difficulty: TaskDifficulty; goal: Goal }[] = [];

  for (const goal of shuffled) {
    const templates = TASK_TEMPLATES[goal];
    if (!templates) continue;

    for (const title of templates.hard) {
      pool.push({ title, difficulty: 'HARD', goal });
    }
    for (const title of templates.epic) {
      pool.push({ title, difficulty: 'EPIC', goal });
    }
  }

  pool.sort(() => Math.random() - 0.5);

  for (const item of pool.slice(0, 10)) {
    const isEpic = item.difficulty === 'EPIC';
    quests.push({
      title: isEpic ? `🏆 ${item.title}` : item.title,
      description: isEpic
        ? `Ambitious monthly ${item.goal.toLowerCase()} challenge. Push your limits!`
        : `Monthly ${item.goal.toLowerCase()} quest. Complete this month for huge XP.`,
      difficulty: item.difficulty,
      category: item.goal,
    });
  }

  return quests.slice(0, 10);
}
