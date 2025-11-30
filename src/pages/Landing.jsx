import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GraduationCap, Building2, UserCog, ShieldCheck } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const roles = [
    { 
      title: 'Student', 
      icon: GraduationCap, 
      description: 'Explore job opportunities, apply for positions, and track application status',
      path: '/login/student',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      title: 'Employer', 
      icon: Building2, 
      description: 'Post job listings, review applications, and interact with candidates',
      path: '/login/employer',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      title: 'Placement Officer', 
      icon: UserCog, 
      description: 'Track placement records, generate reports, and facilitate employer-student interactions',
      path: '/login/officer',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      title: 'Admin', 
      icon: ShieldCheck, 
      description: 'Manage system settings, user roles, and placement data',
      path: '/login/admin',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Placement Interaction System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Manage and track student placements. Connect companies with talented students and streamline the hiring process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card 
                key={role.title}
                className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
                onClick={() => navigate(role.path)}
              >
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                <Button className="w-full" variant="outline">
                  Login as {role.title}
                </Button>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Demo Credentials - Username: admin/student/employer/officer | Password: [role]123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
