import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LogOut, Plus, Briefcase, Users } from 'lucide-react';
import { mockJobs, mockApplications, mockStudents } from '../data/mockData';
import { toast } from 'sonner';

const EmployerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(mockJobs);
  const [applications] = useState(mockApplications);
  const [showJobForm, setShowJobForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    location: '',
    salary: '',
    type: 'Full-time',
    description: '',
    requirements: ''
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePostJob = (e) => {
    e.preventDefault();
    
    const job = {
      id: `job${jobs.length + 1}`,
      ...newJob,
      company: user.company,
      postedBy: user.id,
      postedDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setJobs([...jobs, job]);
    toast.success('Job posted successfully!');
    setShowJobForm(false);
    setNewJob({
      title: '',
      location: '',
      salary: '',
      type: 'Full-time',
      description: '',
      requirements: ''
    });
  };

  const myJobs = jobs.filter(job => job.postedBy === user.id);
  const myApplications = applications.filter(app => 
    myJobs.some(job => job.id === app.jobId)
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Employer Portal</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.company}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{myJobs.length}</p>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{myApplications.length}</p>
                <p className="text-sm text-muted-foreground">Applications</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <Button onClick={() => setShowJobForm(!showJobForm)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </Card>
        </div>

        {showJobForm && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Post New Job</h3>
            <form onSubmit={handlePostJob} className="space-y-4">
              <div>
                <Label>Job Title</Label>
                <Input
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Location</Label>
                  <Input
                    value={newJob.location}
                    onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>Salary Range</Label>
                  <Input
                    value={newJob.salary}
                    onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                    placeholder="e.g., $80,000 - $100,000"
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Job Type</Label>
                <select
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background"
                  value={newJob.type}
                  onChange={(e) => setNewJob({...newJob, type: e.target.value})}
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label>Requirements</Label>
                <Textarea
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Post Job</Button>
                <Button type="button" variant="outline" onClick={() => setShowJobForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        <Tabs defaultValue="jobs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="jobs">My Job Listings</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            {myJobs.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No jobs posted yet</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {myJobs.map((job) => (
                  <Card key={job.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <p className="text-muted-foreground">{job.company}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                        {job.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">{job.location} • {job.type}</p>
                      <p className="text-sm font-medium text-primary">{job.salary}</p>
                      <p className="text-sm text-muted-foreground">{job.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            {myApplications.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No applications received yet</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {myApplications.map((app) => {
                  const job = jobs.find(j => j.id === app.jobId);
                  const student = mockStudents.find(s => s.id === app.studentId);
                  
                  return (
                    <Card key={app.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-lg">{student?.name}</p>
                          <p className="text-sm text-muted-foreground">{student?.degree}</p>
                          <p className="text-sm text-muted-foreground">{student?.email}</p>
                          <p className="text-sm mt-2">Applied for: <span className="font-medium">{job?.title}</span></p>
                          <p className="text-xs text-muted-foreground mt-1">Applied: {app.appliedDate}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded capitalize">
                            {app.status}
                          </span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EmployerDashboard;
