import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Users, Briefcase, TrendingUp, FileText } from 'lucide-react';
import { mockStudents, mockEmployers, mockJobs, mockApplications } from '../data/mockData';
import AcceptApplicationButton from '@/components/AcceptApplicationButton';
import { saveApplications } from '@/lib/appStorage';

const OfficerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [students] = useState(mockStudents);
  const [employers] = useState(mockEmployers);
  const [jobs] = useState(mockJobs);
  const [applications, setApplications] = useState(mockApplications);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Update applications list when an application is accepted/rejected
  const handleApplicationAccepted = (updatedApp) => {
    setApplications((prev) => {
      const next = prev.map((a) => {
        const aid = a.id ?? a._id;
        const uid = updatedApp.id ?? updatedApp._id;
        if (aid === uid) return { ...a, ...updatedApp };
        return a;
      });
      // persist and notify other views (student) via appStorage
      try { saveApplications(next); } catch (e) { console.error('saveApplications failed', e); }
      return next;
    });
  };

  const placementRate = ((applications.filter(a => a.status === 'accepted').length / students.length) * 100).toFixed(1);

  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Employers', value: employers.length, icon: Briefcase, color: 'from-purple-500 to-pink-500' },
    { label: 'Job Opportunities', value: jobs.length, icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { label: 'Placement Rate', value: `${placementRate}%`, icon: FileText, color: 'from-orange-500 to-red-500' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Placement Officer Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Hero image: place your provided image at public/hero.jpg */}
      <div className="w-full overflow-hidden rounded-b-lg">
        <img
          src="/hero.jpg"
          alt="Placement hero"
          className="w-full h-40 object-cover md:h-56 lg:h-72"
        />
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="employers">Employers</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app) => {
                    const job = jobs.find(j => j.id === app.jobId);
                    const student = students.find(s => s.id === app.studentId);
                    return (
                      <div key={app.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="text-sm font-medium">{student?.name}</p>
                          <p className="text-xs text-muted-foreground">{job?.title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded capitalize ${app.status === 'accepted' ? 'bg-green-100 text-green-800' : app.status === 'reviewed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {app.status}
                          </span>
                          <AcceptApplicationButton applicationId={app.id} application={app} onUpdated={handleApplicationAccepted} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Active Job Postings</h3>
                <div className="space-y-3">
                  {jobs.filter(j => j.status === 'active').slice(0, 5).map((job) => (
                    <div key={job.id} className="p-3 border rounded">
                      <p className="text-sm font-medium">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.company}</p>
                      <p className="text-xs text-muted-foreground mt-1">{job.location}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Student Records</h3>
              <div className="space-y-4">
                {students.map((student) => {
                  const studentApps = applications.filter(a => a.studentId === student.id);
                  return (
                    <div key={student.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.degree} - Class of {student.year}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                          <p className="text-sm mt-2">Applications: {studentApps.length}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">GPA: {student.gpa}</p>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">{student.status}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="employers" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Employer Directory</h3>
              <div className="space-y-4">
                {employers.map((employer) => {
                  const employerJobs = jobs.filter(j => j.company === employer.name);
                  return (
                    <div key={employer.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{employer.name}</p>
                          <p className="text-sm text-muted-foreground">{employer.industry}</p>
                          <p className="text-sm text-muted-foreground">{employer.email}</p>
                          <p className="text-sm mt-2">Active Jobs: {employerJobs.length}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">{employer.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Placement Reports</h3>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-2">Application Status Summary</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Pending:</span>
                      <span className="font-medium">{applications.filter(a => a.status === 'pending').length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Reviewed:</span>
                      <span className="font-medium">{applications.filter(a => a.status === 'reviewed').length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Accepted:</span>
                      <span className="font-medium">{applications.filter(a => a.status === 'accepted').length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Rejected:</span>
                      <span className="font-medium">{applications.filter(a => a.status === 'rejected').length}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-2">Student Engagement</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Students:</span>
                      <span className="font-medium">{students.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Active Applicants:</span>
                      <span className="font-medium">{new Set(applications.map(a => a.studentId)).size}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Placement Rate:</span>
                      <span className="font-medium">{placementRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-2">Employer Engagement</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Employers:</span>
                      <span className="font-medium">{employers.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Active Job Postings:</span>
                      <span className="font-medium">{jobs.filter(j => j.status === 'active').length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Applications:</span>
                      <span className="font-medium">{applications.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default OfficerDashboard;
