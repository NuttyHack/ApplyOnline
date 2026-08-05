import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Search, CheckCircle, Clock, User, Award, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-accent font-bold text-lg">H</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground" data-testid="text-school-name">Hoye Secondary School</h1>
              <p className="text-xs text-muted-foreground">Online Admissions Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/yearbook">
              <Button variant="ghost" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Yearbook
              </Button>
            </Link>
            <Link href="/track">
              <Button variant="outline" size="sm" data-testid="button-track-header">
                <Search className="h-4 w-4 mr-2" />
                Track Application
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
          <Award className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-accent">Now accepting applications for 2027 intake</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-hero-title">
          Welcome to Hoye Secondary School
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Begin your journey with one of South Africa's leading secondary schools. Our online application process is designed to be clear, guided, and secure.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/apply">
            <Button size="lg" className="w-full sm:w-auto" data-testid="button-apply-online">
              <FileText className="h-5 w-5 mr-2" />
              Apply Online
            </Button>
          </Link>
          <Link href="/track">
            <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-track-application">
              <Search className="h-5 w-5 mr-2" />
              Track My Application
            </Button>
          </Link>
        </div>
      </section>

      {/* Application Steps */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-foreground mb-2">How to Apply</h3>
          <p className="text-muted-foreground">Complete your application in 5 simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { number: 1, title: 'Learner Information', description: 'Personal details and contact information' },
            { number: 2, title: 'Academic Details', description: 'School history and performance' },
            { number: 3, title: 'Medical & Support', description: 'Health information and needs' },
            { number: 4, title: 'Parent/Guardian', description: 'Guardian details and employment' },
            { number: 5, title: 'Submit & Declaration', description: 'Upload documents and submit' },
          ].map((step) => (
            <Card key={step.number} className="relative overflow-hidden" data-testid={`card-step-${step.number}`}>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">{step.number}</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Key Information */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <Card className="border-2">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                  <Clock className="h-7 w-7 text-accent" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Intake Year</h4>
                <p className="text-muted-foreground">2027 Academic Year</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                  <User className="h-7 w-7 text-accent" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Grade Range</h4>
                <p className="text-muted-foreground">Grades 8 to 12</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                  <CheckCircle className="h-7 w-7 text-accent" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Application Status</h4>
                <p className="text-muted-foreground">Track online anytime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-card">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Hoye Secondary School. All rights reserved.</p>
          <p className="mt-2">For assistance, please contact our admissions office.</p>
        </div>
      </footer>
    </div>
  );
}
