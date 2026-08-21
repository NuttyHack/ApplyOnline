import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Search, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  GraduationCap,
  Globe
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden bg-slate-50/50 text-slate-950 selection:bg-sky-200 selection:text-sky-900 font-sans">
      
      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-50 border-b border-sky-100/80 bg-white/80 backdrop-blur-xl shadow-xs transition-all">
        <div className="container max-w-6xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3.5 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2 sm:gap-3.5 group cursor-pointer min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 rounded-xl sm:rounded-2xl bg-sky-50 border border-sky-200/60 p-1 sm:p-1.5 flex items-center justify-center shadow-xs group-hover:border-sky-400 group-hover:bg-sky-100/60 transition-all duration-300">
              <img 
                src="school.jpg" 
                alt="Hoye Secondary School Logo" 
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" 
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent) parent.innerText = 'H';
                }}
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-base font-extrabold tracking-tight text-black group-hover:text-sky-600 transition-colors truncate" data-testid="text-school-name">
                Hoye Secondary School
              </h1>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse shrink-0" />
                <p className="text-[9px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">Admissions Portal</p>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Modern Main Website Link (Navigates in Same Tab) */}
            <a href="https://hoyesecondarysch.com">
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-xl h-8 sm:h-9 px-2 sm:px-3.5 text-xs font-bold gap-1.5 sm:gap-2 text-slate-700 hover:text-sky-700 hover:bg-sky-100/60 border border-sky-200/60 bg-white/70 transition-all shadow-xs"
              >
                <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" />
                <span className="hidden xs:inline">Main Website</span>
              </Button>
            </a>

            <Link href="/yearbook">
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-xl h-8 sm:h-9 px-2 sm:px-3.5 text-xs font-bold gap-1.5 sm:gap-2 text-slate-700 hover:text-black hover:bg-sky-100/50 transition-all"
              >
                <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-500" />
                <span className="hidden xs:inline">Yearbook</span>
              </Button>
            </Link>
            
            <Link href="/track">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl h-8 sm:h-9 px-2.5 sm:px-4 text-xs font-bold gap-1.5 sm:gap-2 border-sky-200 bg-white text-black hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all shadow-xs" 
                data-testid="button-track-header"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Track Application</span>
                <span className="sm:hidden">Track</span>
              </Button>
            </Link>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-10 sm:py-20 md:py-28 bg-gradient-to-b from-sky-100/40 via-sky-50/20 to-slate-50/50">
        {/* Ambient Light Blue Glow Effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[600px] h-[200px] sm:h-[350px] bg-sky-300/30 blur-[80px] sm:blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-10 right-10 w-36 sm:w-72 h-36 sm:h-72 bg-sky-200/20 blur-[60px] sm:blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">

          {/* Title */}
          <h1 className="text-2xl xs:text-3xl sm:text-6xl md:text-7xl font-black tracking-tight text-black mb-4 sm:mb-6 leading-[1.15]" data-testid="text-hero-title">
            Online Admission Application for <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 bg-clip-text text-transparent">
              Hoye Secondary School
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-xl text-slate-700 font-medium mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Submit learner details, upload required documents, and track your application status in real time—all through our secure digital portal.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-center items-center w-full max-w-md mx-auto">
            <Link href="/apply" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="group relative w-full sm:w-auto h-12 sm:h-13 px-6 sm:px-8 rounded-2xl bg-black hover:bg-slate-800 text-white font-bold shadow-lg shadow-sky-500/15 hover:shadow-sky-500/25 transition-all duration-300 active:scale-[0.98]"
                data-testid="button-apply-online"
              >
                <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-sky-400 transition-transform duration-200 group-hover:-translate-y-0.5" />
                  <span>Start New Application</span>
                  <ArrowRight className="h-4 w-4 ml-1 opacity-80 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>

            <Link href="/track" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto h-12 sm:h-13 px-6 sm:px-8 rounded-2xl border-sky-200/80 bg-white/80 hover:bg-sky-50 hover:border-sky-300 text-black font-bold backdrop-blur-sm transition-all duration-300 active:scale-[0.98]"
                data-testid="button-track-application"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-sky-600" />
                <span className="text-sm sm:text-base">Track Application</span>
              </Button>
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-sky-200/60 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 text-center text-xs sm:text-sm font-semibold text-slate-700">
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/60 border border-sky-100/60 shadow-xs">
              <Clock className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Takes less than 10 minutes</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/60 border border-sky-100/60 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Encrypted & POPIA Compliant</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/60 border border-sky-100/60 shadow-xs">
              <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Instant Email & SMS Reference</span>
            </div>
          </div>

        </div>
      </section>

      {/* Application Steps */}
      <section className="container max-w-6xl mx-auto px-4 py-10 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-100/80 px-3.5 py-1.5 rounded-full border border-sky-200">
            Simple Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-black mt-3 mb-2 sm:mb-3">How to Apply</h2>
          <p className="text-xs sm:text-base text-slate-600 font-medium max-w-lg mx-auto">Complete your application seamlessly in 5 straightforward steps</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {[
            { number: '01', title: 'Learner Info', description: 'Personal details & contact information' },
            { number: '02', title: 'Academic Details', description: 'School history & academic performance' },
            { number: '03', title: 'Medical & Support', description: 'Health requirements & special needs' },
            { number: '04', title: 'Parent/Guardian', description: 'Guardian details & emergency contact' },
            { number: '05', title: 'Submit & Verify', description: 'Upload documents & final declaration' },
          ].map((step) => (
            <Card 
              key={step.number} 
              className="group relative overflow-hidden border-sky-100 bg-white hover:border-sky-300 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/10" 
              data-testid={`card-step-${step.number}`}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-4 sm:p-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center font-extrabold text-xs sm:text-sm mb-3 sm:mb-4 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-colors duration-300">
                  {step.number}
                </div>
                <h3 className="font-bold text-black text-sm sm:text-base mb-1 group-hover:text-sky-600 transition-colors">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Key Information Highlight Cards */}
      <section className="container max-w-5xl mx-auto px-4 py-4 sm:py-8 mb-8 sm:mb-12">
        <div className="rounded-2xl sm:rounded-3xl border border-sky-200/80 bg-gradient-to-br from-white via-sky-50/30 to-white p-4 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-8">
            
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/80 border border-sky-100 shadow-xs">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-sky-500/10 border border-sky-200 flex items-center justify-center mb-2 sm:mb-3">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-sky-600" />
              </div>
              <h4 className="font-extrabold text-black text-sm sm:text-base mb-1">Intake Year</h4>
              <p className="text-xs sm:text-sm font-semibold text-sky-700 bg-sky-100/60 px-3 py-0.5 rounded-full">2027 Academic Year</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/80 border border-sky-100 shadow-xs">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-sky-500/10 border border-sky-200 flex items-center justify-center mb-2 sm:mb-3">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-sky-600" />
              </div>
              <h4 className="font-extrabold text-black text-sm sm:text-base mb-1">Grade Range</h4>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">Grades 8 to 12</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/80 border border-sky-100 shadow-xs">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-sky-500/10 border border-sky-200 flex items-center justify-center mb-2 sm:mb-3">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-sky-600" />
              </div>
              <h4 className="font-extrabold text-black text-sm sm:text-base mb-1">Application Status</h4>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">Track online 24/7</p>
            </div>

          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="border-t border-sky-100 py-8 sm:py-10 bg-white">
        <div className="container max-w-6xl mx-auto px-4 text-center text-xs sm:text-sm text-slate-600 font-medium">
          <p className="text-black font-semibold">&copy; 2026 Hoye Secondary School. All rights reserved.</p>
          <p className="mt-1.5 text-slate-500">For assistance or technical support, please contact our admissions office.</p>
        </div>
      </footer>

    </div>
  );
}