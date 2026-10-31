// Dummy data used while the backend is not ready.
// Lives in memory, so changes (accept, approve, send...) persist until page reload.
import arjun from '@/assets/img/arjun.jpg'
import priya from '@/assets/img/priya.jpg'
import priyaBig from '@/assets/img/priya-big.jpg'
import rahul from '@/assets/img/rahul.jpg'
import sneha from '@/assets/img/sneha.jpg'
import rohit from '@/assets/img/rohit.jpg'
import ananya from '@/assets/img/ananya.jpg'
import karan from '@/assets/img/karan.jpg'
import aisha from '@/assets/img/aisha.jpg'
import resCareer from '@/assets/img/res-career.jpg'
import resResume from '@/assets/img/res-resume.jpg'
import resHigher from '@/assets/img/res-higher.jpg'
import resStartup from '@/assets/img/res-startup.jpg'

export const CAREER_GOALS = ['Internships', 'Jobs', 'Higher studies', 'Freelancing', 'Entrepreneurship']
export const SKILLS = ['Python', 'Data Analysis', 'Machine Learning', 'Communication', 'Leadership', 'Design', 'Product Management', 'Java', 'SQL', 'Public Speaking']
export const INTERESTS = ['AI/ML', 'Web Development', 'Product Management', 'Research', 'Consulting', 'Startups', 'Design', 'Data Science']
export const DOMAINS = ['Engineering', 'Product', 'Data Science', 'Entrepreneurship', 'Research']

const db = {
  users: [
    {
      id: 's1', role: 'student', name: 'Ananya Sharma', email: 'student@demo.com', avatar: ananya,
      institute: 'Riverside Institute of Technology', degree: 'B.Tech – Computer Science and Engineering', year: '3rd Year',
      skills: ['Python', 'Data Analysis', 'Machine Learning'],
      interests: ['AI/ML', 'Web Development', 'Product Management'],
      goals: ['Internships'], otherGoal: '', profileCompletion: 80
    },
    {
      id: 'm1', role: 'mentor', name: 'Rohit Mehta', email: 'mentor@demo.com', avatar: rohit,
      title: 'Product Manager', company: 'FinTech Solutions', experience: '6+ years',
      about: "I'm a product manager with 6+ years of experience building consumer fintech products. I enjoy mentoring students on career planning, product roles and breaking into the tech industry.",
      skills: ['Product Management', 'Career Transition', 'Tech Industry', 'Interview Preparation', 'Leadership'],
      topics: ['Jobs'], otherTopic: '',
      careerPath: [
        { title: 'B.Tech', org: 'IIT (B.Tech CSE)', period: '2014 – 2018' },
        { title: 'Software Engineer', org: 'TechCorp', period: '2018 – 2021' },
        { title: 'Product Manager', org: 'FinTech Solutions', period: '2021 – Present' }
      ]
    },
    { id: 'a1', role: 'admin', name: 'Admin', email: 'admin@demo.com', title: 'Programme Administrator', avatar: null }
  ],

  mentors: [
    {
      id: 'mn1', name: 'Priya Sharma', title: 'Product Manager', company: 'TechCorp', location: 'Bengaluru, India',
      avatar: priya, photo: priyaBig, domain: 'Product', experience: 6, match: 91, available: true, rating: 4.9, sessions: 48,
      tags: ['Product Management', 'Career Growth', 'Strategy', 'Leadership'], goals: ['Internships', 'Jobs'],
      quote: 'Shares relevant industry experience in your field.',
      about: "I'm a Product Manager at TechCorp with 6+ years of experience building consumer products. I enjoy mentoring students and helping them navigate career decisions.",
      careerPath: [
        { title: 'Product Manager', org: 'TechCorp', period: '2022 – Present' },
        { title: 'Associate Product Manager', org: 'GrowthX', period: '2020 – 2022' },
        { title: 'Software Engineer', org: 'InnoTech', period: '2018 – 2020' },
        { title: 'B.Tech – Computer Science', org: 'National Institute of Technology', period: '2014 – 2018' }
      ],
      slots: ['Wed, 4 Nov 2026 · 4:00 – 4:30 PM', 'Thu, 5 Nov 2026 · 6:00 – 6:30 PM', 'Sat, 7 Nov 2026 · 11:00 – 11:30 AM', 'Tue, 10 Nov 2026 · 5:00 – 5:30 PM']
    },
    {
      id: 'mn2', name: 'Arjun Mehta', title: 'Software Engineer', company: 'Tech Solutions Ltd.', location: 'Pune, India',
      avatar: arjun, domain: 'Engineering', experience: 4, match: 87, available: true, rating: 4.8, sessions: 31,
      tags: ['Machine Learning', 'Career Planning', 'Higher Studies'], goals: ['Jobs', 'Higher studies'],
      quote: 'Experienced in guiding students to top tech roles.',
      about: 'Backend and ML engineer. I help students plan their first engineering role and prepare for technical interviews.',
      careerPath: [
        { title: 'Software Engineer', org: 'Tech Solutions Ltd.', period: '2022 – Present' },
        { title: 'SDE Intern', org: 'CloudNine', period: '2021' },
        { title: 'B.E. – Information Technology', org: 'Pune Institute of Engineering', period: '2018 – 2022' }
      ],
      slots: ['Thu, 5 Nov 2026 · 7:00 – 7:30 PM', 'Sun, 8 Nov 2026 · 10:00 – 10:30 AM']
    },
    {
      id: 'mn3', name: 'Sneha Iyer', title: 'Data Scientist', company: 'AI Research Labs', location: 'Chennai, India',
      avatar: sneha, domain: 'Data Science', experience: 5, match: 84, available: true, rating: 4.9, sessions: 40,
      tags: ['Data Science', 'Higher Studies', 'Research'], goals: ['Higher studies', 'Jobs'],
      quote: 'Helps students explore higher studies and research.',
      about: 'Data scientist working on applied NLP. Happy to talk about MS/PhD applications and data roles.',
      careerPath: [
        { title: 'Data Scientist', org: 'AI Research Labs', period: '2023 – Present' },
        { title: 'M.S. – Data Science', org: 'University of Edinburgh', period: '2021 – 2022' },
        { title: 'B.Tech – ECE', org: 'Anna University', period: '2016 – 2020' }
      ],
      slots: ['Fri, 6 Nov 2026 · 5:00 – 5:30 PM', 'Sat, 7 Nov 2026 · 3:00 – 3:30 PM']
    },
    {
      id: 'mn4', name: 'Rahul Verma', title: 'Founder', company: 'StartupX', location: 'Delhi, India',
      avatar: rahul, domain: 'Entrepreneurship', experience: 8, match: 78, available: false, rating: 4.7, sessions: 22,
      tags: ['Entrepreneurship', 'Business Strategy', 'Product Development'], goals: ['Entrepreneurship', 'Freelancing'],
      quote: 'Built and scaled two startups from zero.',
      about: 'Two-time founder. I mentor students on validating ideas, early fundraising and building a team.',
      careerPath: [
        { title: 'Founder & CEO', org: 'StartupX', period: '2020 – Present' },
        { title: 'Co-founder', org: 'Kirana Cloud', period: '2017 – 2020' }
      ],
      slots: []
    },
    {
      id: 'm1', name: 'Rohit Mehta', title: 'Product Manager', company: 'FinTech Solutions', location: 'Mumbai, India',
      avatar: rohit, domain: 'Product', experience: 6, match: 82, available: true, rating: 4.8, sessions: 36,
      tags: ['Product Management', 'Career Transition', 'Interview Preparation'], goals: ['Jobs', 'Internships'],
      quote: 'Helps engineers move into product roles.',
      about: "I'm a product manager with 6+ years of experience building consumer fintech products.",
      careerPath: [
        { title: 'Product Manager', org: 'FinTech Solutions', period: '2021 – Present' },
        { title: 'Software Engineer', org: 'TechCorp', period: '2018 – 2021' }
      ],
      slots: ['Mon, 2 Nov 2026 · 9:00 – 9:30 AM', 'Tue, 3 Nov 2026 · 7:00 – 7:30 PM']
    },
    {
      id: 'mn6', name: 'Neha Sharma', title: 'Analytics Lead', company: 'RetailIQ', location: 'Hyderabad, India',
      avatar: null, domain: 'Data Science', experience: 7, match: 76, available: true, rating: 4.6, sessions: 18,
      tags: ['Data Roles', 'SQL', 'Career Transition'], goals: ['Jobs', 'Internships'],
      quote: 'Practical guidance for analytics careers.',
      about: 'I lead a 10-member analytics team and help students prepare for data analyst roles.',
      careerPath: [{ title: 'Analytics Lead', org: 'RetailIQ', period: '2022 – Present' }],
      slots: ['Wed, 4 Nov 2026 · 8:00 – 8:30 PM']
    }
  ],

  studentRequests: [
    { id: 'r1', studentId: 's1', mentorId: 'mn1', goal: 'Internships', message: 'I would like guidance on product internships.', status: 'pending', sentOn: '28 Oct 2026' },
    { id: 'r2', studentId: 's1', mentorId: 'm1', goal: 'Jobs', message: 'Help me move into product roles.', status: 'accepted', sentOn: '24 Sep 2026' },
    { id: 'r3', studentId: 's1', mentorId: 'mn2', goal: 'Higher studies', message: '', status: 'declined', sentOn: '12 Sep 2026' },
    { id: 'r4', studentId: 's1', mentorId: 'mn4', goal: 'Entrepreneurship', message: '', status: 'cancelled', sentOn: '28 Aug 2026' }
  ],

  // Student <-> mentor active mentorship (Ananya with Rohit)
  mentorship: {
    mentorId: 'm1',
    session: { date: 'Wed, 4 Nov 2026', time: '4:00 – 4:30 PM (IST)', link: 'https://meet.google.com/xyz-abcd-efg' },
    messages: [
      { from: 'mentor', text: 'Hi Ananya! Looking forward to our session. Feel free to share any specific questions you have.', time: '10:14 AM' },
      { from: 'student', text: "Thanks! I'm particularly interested in learning about product internships and key skills to focus on.", time: '10:16 AM' }
    ],
    notes: 'Focus on one product case study before the next session.',
    actionItems: [
      { id: 1, text: 'Review recommended resources', done: true },
      { id: 2, text: 'Update your resume with discussed points', done: true },
      { id: 3, text: 'Explore internship opportunities', done: false },
      { id: 4, text: 'Schedule a follow-up (if needed)', done: false }
    ],
    completed: false
  },

  // Mentor side (Rohit)
  incomingRequests: [
    { id: 'ir1', name: 'Karan Patel', avatar: karan, course: 'B.Com, Final Year', institute: 'National College of Commerce', goal: 'Explore opportunities in entrepreneurship and understand how to validate and start a business.', topic: 'Entrepreneurship', message: "I'm very interested in starting my own business after graduation. I'd love to get your guidance on idea validation and early steps.", receivedAgo: '2 days ago', status: 'pending', mode: 'Video call' },
    { id: 'ir2', name: 'Ishita Roy', avatar: null, course: 'B.Tech CSE, 2nd Year', institute: 'Riverside Institute of Technology', goal: 'Pursue a career in product management and learn how to transition from a technical role.', topic: 'Jobs', message: "I've been following your work and would love to learn how to break into product and what skills I should start building in college.", receivedAgo: '4 days ago', status: 'pending', mode: 'Chat' },
    { id: 'ir3', name: 'Dev Malhotra', avatar: null, course: 'MBA, 1st Year', institute: 'Westbridge Business School', goal: 'Prepare for product internship interviews.', topic: 'Internships', message: 'Could you help me with case interview preparation?', receivedAgo: '1 week ago', status: 'accepted', mode: 'Video call' },
    { id: 'ir4', name: 'Sara Khan', avatar: null, course: 'B.Sc, Final Year', institute: 'City College', goal: 'Higher studies abroad.', topic: 'Higher studies', message: 'Need help choosing universities.', receivedAgo: '2 weeks ago', status: 'declined', mode: 'Chat', reason: 'Outside my area, please consider Sneha Iyer.' }
  ],

  mentees: [
    { id: 'me1', name: 'Ananya Sharma', avatar: ananya, course: 'B.Tech Computer Science, 3rd Year', institute: 'Riverside Institute of Technology', goal: 'Transition to a product management role', nextSession: 'Wed, 4 Nov 2026 · 4:00 PM', lastNote: 'Discussed resume edits and product portfolio. Shared useful resources.', progress: 60 },
    { id: 'me2', name: 'Aman Gupta', avatar: null, course: 'B.Tech IT, Final Year', institute: 'Pune Institute of Engineering', goal: 'Crack product analyst interviews', nextSession: 'Fri, 6 Nov 2026 · 7:00 PM', lastNote: 'Covered metrics questions and guesstimates.', progress: 35 }
  ],

  availability: {
    available: true,
    maxMentees: 3,
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    times: ['9:00 – 11:00 AM', '11:00 AM – 1:00 PM', '2:00 – 4:00 PM', '4:00 – 6:00 PM', '7:00 – 9:00 PM'],
    slots: ['0-0', '0-2', '1-1', '1-3', '2-4', '3-0', '3-5', '4-1', '4-6']
  },

  mentorSessions: [
    { id: 'ss1', mentee: 'Ananya Sharma', date: '16 Oct 2026', time: '5:00 – 6:00 PM', title: 'Career path and resume review', summary: 'Discussed product management career path and skills to build in college.', status: 'Completed' },
    { id: 'ss2', mentee: 'Aman Gupta', date: '9 Oct 2026', time: '7:00 – 7:45 PM', title: 'Metrics and guesstimates', summary: 'Practised two metric questions.', status: 'Completed' },
    { id: 'ss3', mentee: 'Ananya Sharma', date: '2 Oct 2026', time: '6:00 – 7:00 PM', title: 'Introduction & goal setting', summary: "Understood Ananya's background and created a mentorship plan.", status: 'Completed' }
  ],

  resources: [
    { id: 'rs1', title: 'How to Choose the Right Career Path', category: 'Career Planning', type: 'Article', mins: 6, thumb: resCareer },
    { id: 'rs2', title: 'Resume Building Guide', category: 'Placements', type: 'Guide', mins: 10, thumb: resResume },
    { id: 'rs3', title: "A Beginner's Guide to Higher Studies", category: 'Higher Studies', type: 'Guide', mins: 12, thumb: resHigher },
    { id: 'rs4', title: 'Entrepreneurship Basics', category: 'Entrepreneurship', type: 'Video', mins: 8, thumb: resStartup },
    { id: 'rs5', title: 'A Guide to Product Internships', category: 'Placements', type: 'Article', mins: 5, thumb: resCareer },
    { id: 'rs6', title: 'Product Management Roadmap', category: 'Career Planning', type: 'Video', mins: 8, thumb: resStartup },
    { id: 'rs7', title: 'Writing a Strong SOP', category: 'Higher Studies', type: 'Article', mins: 7, thumb: resResume },
    { id: 'rs8', title: 'Interview Preparation Checklist', category: 'Placements', type: 'Guide', mins: 4, thumb: resHigher }
  ],

  notifications: {
    student: [
      { id: 1, text: 'Rohit Mehta added a note to your session', time: '2h ago', unread: true },
      { id: 2, text: 'Your request to Priya Sharma is pending', time: '3d ago', unread: true },
      { id: 3, text: 'New resource: Product Management Roadmap', time: '5d ago', unread: false }
    ],
    mentor: [
      { id: 1, text: 'New request from Karan Patel', time: '2d ago', unread: true },
      { id: 2, text: 'Session with Ananya on Wed, 4 Nov', time: '1d ago', unread: true }
    ],
    admin: [
      { id: 1, text: '3 mentor applications awaiting review', time: '1h ago', unread: true },
      { id: 2, text: 'New concern reported by a student', time: '5h ago', unread: true }
    ]
  },

  // ===== Admin =====
  adminStats: { totalStudents: 1248, approvedMentors: 312, pendingRequests: 87, activeMentorships: 426, completedSessions: 1892 },
  requestStatus: [
    { label: 'Accepted', value: 184, color: '#16a34a' },
    { label: 'Pending', value: 87, color: '#f59e0b' },
    { label: 'Declined', value: 52, color: '#ef4444' },
    { label: 'Inactive', value: 78, color: '#a1a1b5' }
  ],

  mentorApplications: [
    {
      id: 'ap1', name: 'Aisha Rao', avatar: aisha, role: 'Product Manager', company: 'TechNova', location: 'Bengaluru, India',
      careerPath: 'Product Management', expertise: ['Product Strategy', 'User Research'], submitted: '28 Oct 2026', status: 'pending', experience: '6+ years',
      summary: 'Product Manager with 6+ years of experience building consumer products. Passionate about product management and career transitions.',
      topics: ['Product Strategy', 'User Research', 'Career Transitions'],
      bio: 'I enjoy mentoring students who are curious about product management and the tech industry.',
      checklist: { 'Identity proof': true, 'Professional background': true, 'LinkedIn profile': true, 'Mentor statement': true, 'References (2)': false, 'Application form': true }
    },
    {
      id: 'ap2', name: 'Karthik Iyer', avatar: null, role: 'Data Scientist', company: 'DataMint', location: 'Chennai, India',
      careerPath: 'Data Science', expertise: ['Machine Learning', 'Career Transition'], submitted: '26 Oct 2026', status: 'pending', experience: '5 years',
      summary: 'Data scientist focused on ML in fintech. Wants to help students move into data roles.',
      topics: ['Machine Learning', 'Data roles'], bio: 'Previously a teaching assistant for ML courses.',
      checklist: { 'Identity proof': true, 'Professional background': true, 'LinkedIn profile': true, 'Mentor statement': false, 'References (2)': false, 'Application form': true }
    },
    {
      id: 'ap3', name: 'Meera Nair', avatar: null, role: 'Founder', company: 'GreenLoop', location: 'Kochi, India',
      careerPath: 'Entrepreneurship', expertise: ['Startup Building', 'Sustainability'], submitted: '24 Oct 2026', status: 'pending', experience: '8 years',
      summary: 'Founder of a sustainability startup.', topics: ['Startups', 'Fundraising'], bio: 'Love helping first-time founders.',
      checklist: { 'Identity proof': true, 'Professional background': true, 'LinkedIn profile': false, 'Mentor statement': true, 'References (2)': true, 'Application form': true }
    },
    { id: 'ap4', name: 'Priya Sharma', avatar: priya, role: 'Product Manager', company: 'TechCorp', location: 'Bengaluru, India', careerPath: 'Product Management', expertise: ['Product Management'], submitted: '2 Jul 2026', status: 'approved', experience: '6+ years', summary: '', topics: [], bio: '', checklist: {} },
    { id: 'ap5', name: 'Sneha Iyer', avatar: sneha, role: 'Data Scientist', company: 'AI Research Labs', location: 'Chennai, India', careerPath: 'Data Science', expertise: ['Data Science'], submitted: '18 Jun 2026', status: 'approved', experience: '5 years', summary: '', topics: [], bio: '', checklist: {} },
    { id: 'ap6', name: 'Vikas Jain', avatar: null, role: 'Sales Executive', company: 'QuickMart', location: 'Jaipur, India', careerPath: 'Sales', expertise: ['Sales'], submitted: '3 Jun 2026', status: 'rejected', experience: '1 year', summary: '', topics: [], bio: '', checklist: {} }
  ],

  careerGoalRequests: [
    { id: 'cg1', goal: 'Climate Policy', requester: 'Student', requesterName: 'Riya Das', rationale: 'Interested in careers at the intersection of climate and public policy.', date: '29 Oct 2026', status: 'pending' },
    { id: 'cg2', goal: 'UX Writing', requester: 'Student', requesterName: 'Kabir Shah', rationale: 'Want to explore UX writing opportunities in product teams.', date: '27 Oct 2026', status: 'pending' },
    { id: 'cg3', goal: 'Higher education admissions support', requester: 'Mentor', requesterName: 'Karthik Iyer', rationale: 'Can guide students on university applications, SOPs and interview preparation.', date: '25 Oct 2026', status: 'pending' },
    { id: 'cg4', goal: 'Game Development', requester: 'Student', requesterName: 'Arnav Bose', rationale: 'Passionate about game design and development careers.', date: '22 Oct 2026', status: 'pending' },
    { id: 'cg5', goal: 'Data roles', requester: 'Mentor', requesterName: 'Neha Sharma', rationale: 'High student demand for analytics careers.', date: '10 Sep 2026', status: 'approved' },
    { id: 'cg6', goal: 'Astrology', requester: 'Student', requesterName: 'Anonymous', rationale: 'Not related to career guidance.', date: '2 Sep 2026', status: 'declined' }
  ],
  approvedGoals: ['Internships', 'Jobs & placements', 'Higher studies', 'Freelancing', 'Entrepreneurship', 'Data roles'],

  participation: {
    months: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    requests: [62, 78, 95, 110, 132, 151],
    completed: [48, 60, 71, 88, 104, 126],
    capacityUsed: 68,
    mentorsAvailable: 23,
    lowAvailability: [
      { name: 'Rohit Mehta', avatar: rohit, current: 2, capacity: 3 },
      { name: 'Priya Sharma', avatar: priya, current: 5, capacity: 5 },
      { name: 'Sneha Iyer', avatar: sneha, current: 4, capacity: 5 },
      { name: 'Arjun Mehta', avatar: arjun, current: 4, capacity: 6 }
    ],
    topics: [
      { topic: 'Higher studies', requests: 110, mentors: 4, slots: 20 },
      { topic: 'Data roles', requests: 86, mentors: 12, slots: 60 },
      { topic: 'Entrepreneurship', requests: 78, mentors: 10, slots: 50 },
      { topic: 'Freelancing', requests: 64, mentors: 8, slots: 40 }
    ]
  },

  concerns: [
    {
      id: 'c1', type: 'Inappropriate behaviour', reporterType: 'Student', reportedOn: '29 Oct 2026', status: 'Open',
      mentee: 'Priya Nair', mentor: 'Rahul Verma',
      details: 'The mentor made uncomfortable personal comments during a session and repeatedly contacted me outside the platform.',
      notes: '', timeline: [{ at: '29 Oct 2026, 4:30 PM', text: 'Report submitted by student' }]
    },
    {
      id: 'c2', type: 'Missed sessions', reporterType: 'Mentor', reportedOn: '27 Oct 2026', status: 'Under review',
      mentee: 'Aman Gupta', mentor: 'Rohit Mehta',
      details: 'Mentee missed two scheduled sessions without informing.',
      notes: 'Reached out to the mentee for their response.', timeline: [{ at: '27 Oct 2026, 11:00 AM', text: 'Report submitted by mentor' }, { at: '28 Oct 2026, 2:15 PM', text: 'Marked under review' }]
    },
    {
      id: 'c3', type: 'Unresponsive mentee', reporterType: 'Mentor', reportedOn: '20 Oct 2026', status: 'Resolved',
      mentee: 'Kabir Shah', mentor: 'Sneha Iyer', details: 'No response for 3 weeks.', notes: 'Mentorship closed with consent.', timeline: [{ at: '20 Oct 2026, 9:00 AM', text: 'Report submitted by mentor' }, { at: '22 Oct 2026, 5:00 PM', text: 'Resolved' }]
    },
    {
      id: 'c4', type: 'Scheduling issues', reporterType: 'Student', reportedOn: '14 Oct 2026', status: 'Closed',
      mentee: 'Ishita Roy', mentor: 'Arjun Mehta', details: 'Session time kept changing.', notes: 'Mentor updated availability.', timeline: [{ at: '14 Oct 2026, 1:00 PM', text: 'Report submitted by student' }, { at: '15 Oct 2026, 10:00 AM', text: 'Closed' }]
    }
  ]
}

export default db
