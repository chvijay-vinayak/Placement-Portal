import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Users, Briefcase, TrendingUp, Settings } from 'lucide-react';
import { mockStudents, mockEmployers, mockJobs, mockApplications } from '../data/mockData';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [students] = useState(mockStudents);
  const [employers] = useState(mockEmployers);
  const [jobs] = useState(mockJobs);
  const [applications] = useState(mockApplications);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Employers', value: employers.length, icon: Briefcase, color: 'from-purple-500 to-pink-500' },
    { label: 'Active Jobs', value: jobs.filter(j => j.status === 'active').length, icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { label: 'Applications', value: applications.length, icon: Settings, color: 'from-orange-500 to-red-500' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
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

        <Tabs defaultValue="students" className="space-y-4">
          <TabsList>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="employers">Employers</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Student Management</h3>
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.degree} - Class of {student.year}</p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">GPA: {student.gpa}</p>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">{student.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="employers" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Employer Management</h3>
              <div className="space-y-4">
                {employers.map((employer) => (
                  <div key={employer.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{employer.name}</p>
                      <p className="text-sm text-muted-foreground">{employer.industry}</p>
                      <p className="text-sm text-muted-foreground">{employer.email}</p>
                    </div>
                    <div>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">{employer.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Job Listings</h3>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">{job.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{job.location} • {job.type}</p>
                    <p className="text-sm font-medium text-primary">{job.salary}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">System Settings</h3>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-2">User Roles</p>
                  <p className="text-sm text-muted-foreground">Manage system user roles and permissions</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-2">Placement Data</p>
                  <p className="text-sm text-muted-foreground">Configure placement tracking and reporting</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-2">System Configuration</p>
                  <p className="text-sm text-muted-foreground">General system settings and preferences</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
