import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { LogOut, Briefcase, CheckCircle, Clock, XCircle } from 'lucide-react';
import { mockJobs } from '../data/mockData';
import { toast } from 'sonner';
import { loadApplications, saveApplications } from '@/lib/appStorage';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs] = useState(mockJobs);
  const [applications, setApplications] = useState(() => loadApplications());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const onUpdated = (e) => setApplications(e.detail);
    window.addEventListener('applications:updated', onUpdated);
    return () => window.removeEventListener('applications:updated', onUpdated);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleApply = (jobId) => {
    const alreadyApplied = applications.some(app => app.jobId === jobId && app.studentId === user.id);
    
    if (alreadyApplied) {
      toast.error('You have already applied for this position');
      return;
    }

    const newApplication = {
      id: `app${applications.length + 1}`,
      jobId,
      studentId: user.id,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
      resume: 'resume.pdf',
      coverLetter: 'Application submitted'
    };

    const next = [...applications, newApplication];

    setApplications(next);
    saveApplications(next);
    toast.success('Application submitted successfully!');
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const myApplications = applications.filter(app => app.studentId === user.id);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'reviewed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'accepted': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Student Portal</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="jobs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="jobs">Job Opportunities</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            <div className="mb-4">
              <Input
                placeholder="Search jobs by title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid gap-4">
              {filteredJobs.map((job) => {
                const applied = applications.some(app => app.jobId === job.id && app.studentId === user.id);
                
                return (
                  <Card key={job.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                        <p className="text-muted-foreground">{job.company}</p>
                      </div>
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm"><span className="font-medium">Location:</span> {job.location}</p>
                      <p className="text-sm"><span className="font-medium">Type:</span> {job.type}</p>
                      <p className="text-sm"><span className="font-medium">Salary:</span> {job.salary}</p>
                      <p className="text-sm text-muted-foreground">{job.description}</p>
                      <p className="text-sm"><span className="font-medium">Requirements:</span> {job.requirements}</p>
                    </div>

                    <Button 
                      onClick={() => handleApply(job.id)} 
                      disabled={applied}
                      className="w-full"
                    >
                      {applied ? 'Already Applied' : 'Apply Now'}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Application Status</h3>
              {myApplications.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No applications yet</p>
              ) : (
                <div className="space-y-4">
                  {myApplications.map((app) => {
                    const job = jobs.find(j => j.id === app.jobId);
                    return (
                      <div key={app.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{job?.title}</p>
                          <p className="text-sm text-muted-foreground">{job?.company}</p>
                          <p className="text-xs text-muted-foreground mt-1">Applied: {app.appliedDate}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(app.status)}
                          <span className="text-sm capitalize">{app.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-muted-foreground">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-muted-foreground">{user.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Degree</p>
                  <p className="text-muted-foreground">{user.degree}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Graduation Year</p>
                  <p className="text-muted-foreground">{user.year}</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;
