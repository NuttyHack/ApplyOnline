import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  School, 
  Sparkles,
  Calendar,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

type StatusType = 'pending' | 'under_review' | 'accepted' | 'approved' | 'rejected' | 'waitlisted';

interface ApplicationData {
  refNumber: string;
  firstName: string;
  lastName: string;
  status: StatusType;
}

export default function Track() {
  const [refNumber, setRefNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [application, setApplication] = useState<ApplicationData | null>(null);

  const fetchApplication = async (searchQuery: string) => {
    setIsLoading(true);
    setError(null);
    setApplication(null);

    const cleanQuery = searchQuery.trim();

    try {
      // Connects directly to track_status.php
      const response = await fetch(`https://hoyesecondarysch.com/app/track_status.php?ref=${encodeURIComponent(cleanQuery)}`);
      
      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'success' && result.data) {
        setApplication({
          refNumber: cleanQuery,
          firstName: result.data.first_name,
          lastName: result.data.last_name,
          status: (result.data.status || 'pending').toLowerCase() as StatusType,
        });
      } else {
        setError(result.message || 'Application not found. Please double-check your reference number.');
      }
    } catch (err) {
      console.error('Track error:', err);
      setError('Unable to reach the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (refNumber.trim()) {
      fetchApplication(refNumber);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-background via-muted/20 to-muted/40 pb-16">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground">Hoye Secondary School</h1>
              <p className="text-xs text-muted-foreground font-medium">Application Tracker</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-xl hover:bg-muted font-medium text-xs gap-2">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 pt-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Admission Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Track Your Status
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Check live admission decisions and process updates using your unique reference number.
          </p>
        </div>

        <Card className="border-border/60 shadow-xl shadow-black/5 rounded-3xl overflow-hidden bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">Search Application</CardTitle>
            <CardDescription className="text-xs">
              Enter your reference number exactly as assigned upon submission.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="refNumber" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Reference Number
                </Label>
                <div className="relative">
                  <Input
                    id="refNumber"
                    placeholder="Enter reference number..."
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    className="h-12 pl-4 pr-10 rounded-2xl font-mono text-sm uppercase tracking-wide focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={!refNumber.trim() || isLoading} 
                className="w-full h-11 rounded-xl font-semibold bg-primary hover:bg-primary/90 shadow-md gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Track Application
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
            <Alert variant="destructive" className="rounded-2xl border-rose-500/20 bg-rose-500/10 text-rose-800 dark:text-rose-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {application && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="border-border/80 shadow-xl rounded-3xl overflow-hidden bg-card">
              <CardHeader className="bg-muted/20 border-b border-border/40 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl font-black">
                      {application.firstName} {application.lastName}
                    </CardTitle>
                    <CardDescription className="text-xs font-medium mt-1 flex items-center gap-2">
                      Reference: <span className="font-mono text-primary font-bold">{application.refNumber}</span>
                    </CardDescription>
                  </div>
                  <div className="px-3 py-1.5 rounded-full text-xs font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                    {application.status.replace('_', ' ')}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 sm:p-8 space-y-8">
                <div className="space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> Application Progress
                  </h4>

                  <div className="space-y-6 pt-2">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className="w-0.5 bg-emerald-500/30 my-1 h-full min-h-[2.5rem]" />
                      </div>
                      <div className="pb-2">
                        <p className="font-bold text-sm">Application Received</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Record found in the admissions database.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <Clock className="h-4 w-4 animate-pulse" />
                        </div>
                        <div className="w-0.5 bg-border my-1 h-full min-h-[2.5rem]" />
                      </div>
                      <div className="pb-2">
                        <p className="font-bold text-sm">Status Evaluation</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Current status: <span className="font-semibold text-foreground uppercase">{application.status.replace('_', ' ')}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-sm">Final Decision</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {['accepted', 'approved'].includes(application.status)
                            ? 'Application Accepted!'
                            : application.status === 'rejected'
                            ? 'Application Unsuccessful.'
                            : 'Decision pending review.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Hoye Secondary School</span>
                  <span>Live Tracking System</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}