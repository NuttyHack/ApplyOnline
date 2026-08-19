import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Search, 
  CheckCircle, 
  Clock, 
  User, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-background via-background to-muted">
      
      {/* Modern Header with School Logo */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md shadow-xs transition-all">
        <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3.5 group cursor-pointer">
            <div className="w-11 h-11 rounded-2xl bg-muted/60 border border-border/60 p-1.5 flex items-center justify-center shadow-xs group-hover:border-primary/50 transition-colors">
              <img 
                src="/logo.png" 
                alt="Hoye Secondary School Logo" 
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" 
                onError={(e) => {
                  // Graceful fallback if logo image hasn't been uploaded yet
                  (e.target as HTMLElement).style.display = 'none';
                  (e.target as HTMLElement).parentElement!.innerText = 'H';
                }}
              />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors" data-testid="text-school-name">
                Hoye Secondary School
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[11px] font-medium text-muted-foreground">Online Admissions Portal</p>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link href="/yearbook">
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-xl h-9 px-3.5 text-xs font-semibold gap-2 hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              >
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Yearbook</span>
              </Button>
            </Link>
            
            <Link href="/track">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl h-9 px-4 text-xs font-semibold gap-2 border-border/80 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-xs" 
                data-testid="button-track-header"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Track Application</span>
              </Button>
            </Link>
          </div>

        </div>
      </header>

      {/* Modern Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-background via-muted/30 to-background">
        {/* Ambient background glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
          
          {/* Live Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-medium mb-6 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Official Admissions Portal • 2027 Academic Year Open
          </div>

          {/* Action-Focused Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.15]" data-testid="text-hero-title">
            Online Admission Application for <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Hoye Secondary School
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Submit learner details, upload required documents, and track your application status in real time—all through our secure digital portal.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto">
            <Link href="/apply" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="group relative w-full sm:w-auto h-12 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                data-testid="button-apply-online"
              >
                <span className="flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
                  <span>Start New Application</span>
                  <ArrowRight className="h-4 w-4 ml-1 opacity-80 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>

            <Link href="/track" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto h-12 px-8 rounded-xl border-border/80 hover:border-slate-400 bg-background/80 hover:bg-accent/60 backdrop-blur-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                data-testid="button-track-application"
              >
                <Search className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>Track Existing Application</span>
              </Button>
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="mt-14 pt-8 border-t border-border/50 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Takes less than 10 minutes</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Encrypted & POPIA Compliant</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>Instant Email & SMS Reference</span>
            </div>
          </div>

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
          <p>&copy; 2026 Hoye Secondary School. All rights reserved.</p>
          <p className="mt-2">For assistance, please contact our admissions office.</p>
        </div>
      </footer>
    </div>
  );
}