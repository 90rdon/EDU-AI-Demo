

import { Student, AnalyticData } from './types';

// Centralized Assets for the Project
export const ASSETS = {
  mathImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600",
  readingImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
  docImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600",
  avatarStudent: "https://api.dicebear.com/7.x/avataaars/svg?seed=Student",
  avatarAdmin: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
};

export const MOCK_STUDENT: Student = {
  id: 'S12345',
  name: 'Leo Anderson',
  grade: 10,
  gpa: 3.4,
  attendance: 92,
  riskScore: 35, // Moderate risk
  iepStatus: true,
  goals: [
    {
      id: 'g1',
      title: 'Improve Math RIT Score',
      description: 'Increase NWEA MAP Math score from 230 to 245 by end of semester.',
      progress: 65,
      type: 'Academic',
      dueDate: '2025-12-15',
      status: 'In Progress'
    },
    {
      id: 'g2',
      title: 'Reading Fluency',
      description: 'Accommodated reading goal per 504 plan: Read 150 wpm.',
      progress: 80,
      type: 'IEP/504',
      dueDate: '2025-11-30',
      status: 'In Progress'
    }
  ],
  historicGoals: [
    {
      id: 'h1',
      title: 'Biology Lab Safety',
      description: 'Complete all safety modules with 100% accuracy.',
      progress: 100,
      type: 'Academic',
      dueDate: '2024-05-20',
      status: 'Completed'
    },
    {
      id: 'h2',
      title: 'Join Robotics Club',
      description: 'Participate in at least 3 regional meets.',
      progress: 100,
      type: 'Personal',
      dueDate: '2024-04-15',
      status: 'Completed'
    }
  ],
  artifacts: [
    {
      id: 'a1',
      title: 'Math Assessment - Unit 4',
      type: 'document',
      url: '#',
      date: '2025-10-12',
      tags: ['Math', 'Assessment'],
      linkedGoalId: 'g1'
    },
    {
      id: 'a2',
      title: 'Reading Fluency Check',
      type: 'video',
      url: '#',
      date: '2025-09-20',
      tags: ['Reading', 'Video'],
      linkedGoalId: 'g2'
    },
    {
        id: 'a3',
        title: 'History Essay - Texas Revolution',
        type: 'document',
        url: '#',
        date: '2025-09-20',
        tags: ['History', 'Writing'],
        linkedGoalId: undefined
    }
  ],
  riskHistory: {
    monthly: [
        { period: 'Aug', score: 45 },
        { period: 'Sep', score: 42 },
        { period: 'Oct', score: 38 },
        { period: 'Nov', score: 35 }, // Improving (Lower is better)
    ],
    yearly: [
        { period: '2022-23', score: 55 },
        { period: '2023-24', score: 42 },
        { period: '2024-25', score: 35 },
    ]
  }
};

export const CLASS_ROSTER: Student[] = [
  MOCK_STUDENT,
  { ...MOCK_STUDENT, id: 'S12346', name: 'Sarah Miller', riskScore: 12, gpa: 3.9, attendance: 98, iepStatus: false },
  { ...MOCK_STUDENT, id: 'S12347', name: 'James Carter', riskScore: 78, gpa: 2.1, attendance: 82, iepStatus: false },
  { ...MOCK_STUDENT, id: 'S12348', name: 'Maria Rodriguez', riskScore: 45, gpa: 2.8, attendance: 89, iepStatus: true },
];

// Combined data for Analytics Use Case (Munis + Eduphoria/NWEA)
export const DISTRICT_ANALYTICS: AnalyticData[] = [
  { name: 'Capital City HS', finance: 12500, performance: 88, attendance: 95 },
  { name: 'Travis Heights HS', finance: 11800, performance: 92, attendance: 96 },
  { name: 'Lady Bird HS', finance: 13200, performance: 85, attendance: 91 },
  { name: 'Barton Creek HS', finance: 12100, performance: 89, attendance: 94 },
  { name: 'Zilker HS', finance: 12900, performance: 82, attendance: 89 },
];

// Board Member View Data
export const BOARD_ASSESSMENT_TRENDS = [
  { period: 'Fall', year: '2024', district: 212, norm: 210, previous: 208 },
  { period: 'Winter', year: '2024', district: 219, norm: 216, previous: 214 },
  { period: 'Spring', year: '2025', district: 228, norm: 222, previous: 221 },
];

export const BOARD_GAP_ANALYSIS = [
  { group: 'All Students', current: 78, target: 80 },
  { group: 'Eco Dis', current: 65, target: 70 },
  { group: 'SPED', current: 48, target: 55 },
  { group: 'EB/EL', current: 54, target: 60 },
  { group: 'Gifted', current: 98, target: 95 },
];

// New Data for Teacher Turnover Correlation
export const BOARD_TURNOVER_DATA = [
  { campus: 'Zilker HS', turnover: 24, growth: -2.5, cost: 380000, subject: 'Math' },
  { campus: 'Lady Bird HS', turnover: 18, growth: 1.2, cost: 240000, subject: 'Math' },
  { campus: 'Barton Creek HS', turnover: 14, growth: 3.5, cost: 180000, subject: 'Math' },
  { campus: 'Capital City HS', turnover: 10, growth: 4.8, cost: 120000, subject: 'Math' },
  { campus: 'Travis Heights HS', turnover: 6, growth: 6.2, cost: 80000, subject: 'Math' },
];

// New Data for Data Studio Scenarios
export const SUB_IMPACT_DATA = [
  { category: 'Certified Teacher', avgGrowth: 12.5, attendance: 96, count: 850 },
  { category: 'Long-Term Sub (>6 weeks)', avgGrowth: 7.2, attendance: 91, count: 45 },
  { category: 'Short-Term Sub', avgGrowth: 4.8, attendance: 88, count: 20 },
];

export const PROGRAM_ROI_DATA = [
  { program: 'Reading Recovery', cost: 1200, growthPoints: 14, costPerPoint: 85 },
  { program: 'After-school Tutoring', cost: 400, growthPoints: 6, costPerPoint: 66 },
  { program: 'Online Math Intervention', cost: 150, growthPoints: 4, costPerPoint: 37 },
  { program: 'Summer Bridge', cost: 800, growthPoints: 8, costPerPoint: 100 },
];

// TEKS Cohort Longitudinal Data (Multi-Measure Proficiency %)
// Comparison of State (STAAR), District (NWEA), and Local (Classroom) assessments
export const TEKS_COHORT_DATA = {
  grade5: {
    math: [
      { name: '2023 (Gr 3)', STAAR: 68, NWEA: 74, Classroom: 86 },
      { name: '2024 (Gr 4)', STAAR: 72, NWEA: 79, Classroom: 89 },
      { name: '2025 (Gr 5)', STAAR: 79, NWEA: 85, Classroom: 94 },
    ],
    reading: [
      { name: '2023 (Gr 3)', STAAR: 65, NWEA: 70, Classroom: 82 },
      { name: '2024 (Gr 4)', STAAR: 70, NWEA: 76, Classroom: 88 },
      { name: '2025 (Gr 5)', STAAR: 75, NWEA: 82, Classroom: 91 },
    ],
    science: [
      { name: '2023 (Base)', STAAR: 60, NWEA: 65, Classroom: 78 },
      { name: '2024 (Mid)', STAAR: 68, NWEA: 74, Classroom: 85 },
      { name: '2025 (Curr)', STAAR: 74, NWEA: 80, Classroom: 90 },
    ]
  },
  grade7: {
    math: [
      { name: '2023 (Gr 5)', STAAR: 70, NWEA: 75, Classroom: 88 },
      { name: '2024 (Gr 6)', STAAR: 73, NWEA: 79, Classroom: 90 },
      { name: '2025 (Gr 7)', STAAR: 78, NWEA: 84, Classroom: 93 },
    ],
    reading: [
      { name: '2023 (Gr 5)', STAAR: 68, NWEA: 72, Classroom: 84 },
      { name: '2024 (Gr 6)', STAAR: 71, NWEA: 78, Classroom: 87 },
      { name: '2025 (Gr 7)', STAAR: 76, NWEA: 83, Classroom: 92 },
    ]
  }
};