// Mock data for the placement system
export const mockUsers = {
  admin: { id: 'admin1', username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
  student: { id: 'student1', username: 'vijay', password: 'vijay123', role: 'student', name: 'VIJAY VINAYAK', email: 'vijay@student.com', phone: '123-456-7890', degree: 'Computer Science', year: '2024' },
  employer: { id: 'employer1', username: 'employer', password: 'employer123', role: 'employer', name: 'Tech Corp', email: 'hr@techcorp.com', phone: '987-654-3210', company: 'Tech Corp' },
  officer: { id: 'officer1', username: 'officer', password: 'officer123', role: 'officer', name: 'Placement Officer', email: 'officer@college.com', phone: '555-555-5555' }
};

export const mockJobs = [
  { id: 'job1', title: 'Software Engineer', company: 'Tech Corp', location: 'Remote', salary: '$80,000 - $100,000', type: 'Full-time', description: 'Looking for a talented software engineer...', requirements: 'BS in Computer Science, 2+ years experience', postedBy: 'employer1', postedDate: '2024-11-20', status: 'active' },
  { id: 'job2', title: 'Data Analyst', company: 'Data Inc', location: 'New York', salary: '$70,000 - $90,000', type: 'Full-time', description: 'Seeking a data analyst to join our team...', requirements: 'BS in Statistics or related field', postedBy: 'employer1', postedDate: '2024-11-22', status: 'active' },
  { id: 'job3', title: 'UI/UX Designer', company: 'Design Studio', location: 'San Francisco', salary: '$75,000 - $95,000', type: 'Contract', description: 'Creative designer needed for exciting projects...', requirements: 'Portfolio required, 3+ years experience', postedBy: 'employer1', postedDate: '2024-11-18', status: 'active' },
  { id: 'job4', title: 'APPLE', company: 'APPLE', location: 'INDIA', salary: '$75,000 - $95,000', type: 'Contract', description: 'designer needed for exciting projects...', requirements: 'Portfolio required, 1+ years experience', postedBy: 'employer1', postedDate: '2024-11-18', status: 'active' }
];

export const mockApplications = [
  { id: 'app1', jobId: 'job1', studentId: 'student1', status: 'pending', appliedDate: '2024-11-21', resume: 'resume.pdf', coverLetter: 'I am very interested...' },
  { id: 'app2', jobId: 'job2', studentId: 'student1', status: 'reviewed', appliedDate: '2024-11-23', resume: 'resume.pdf', coverLetter: 'I have strong analytical skills...' },
  { id: 'app3', jobId: 'job3', studentId: 'student2', status: 'pending', appliedDate: '2024-11-24', resume: 'resume2.pdf', coverLetter: 'Design experience and portfolio available.' },
  { id: 'app4', jobId: 'job1', studentId: 'student3', status: 'reviewed', appliedDate: '2024-11-25', resume: 'resume3.pdf', coverLetter: 'Looking forward to contributing.' },
  { id: 'app5', jobId: 'job4', studentId: 'student2', status: 'accepted', appliedDate: '2024-11-26', resume: 'resume2.pdf', coverLetter: 'Eager to join this opportunity.' }
];

export const mockStudents = [
  { id: 'student1', name: 'VIJAY VINAYAK', email: 'vijay@student.com', phone: '123-456-7890', degree: 'Computer Science', year: '2024', gpa: '3.8', status: 'active' },
  { id: 'student2', name: 'MOHITH SAI', email: 'mohith@student.com', phone: '123-456-7891', degree: 'Business Administration', year: '2024', gpa: '3.9', status: 'active' },
  { id: 'student3', name: 'BARGAV', email: 'bargav@student.com', phone: '123-456-7892', degree: 'Engineering', year: '2025', gpa: '3.7', status: 'active' }
];

export const mockEmployers = [
  { id: 'employer1', name: 'Tech Corp', email: 'hr@techcorp.com', phone: '987-654-3210', industry: 'Technology', website: 'www.techcorp.com', status: 'active' },
  { id: 'employer2', name: 'Data Inc', email: 'hr@datainc.com', phone: '987-654-3211', industry: 'Data Analytics', website: 'www.datainc.com', status: 'active' }
];
