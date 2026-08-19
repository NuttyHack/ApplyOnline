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
  HelpCircle, 
  KeyRound,
  Sparkles,
  Calendar,
  GraduationCap,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type StatusType = 'pending' | 'under_review' | 'accepted' | 'approved' | 'rejected' | 'waitlisted';

interface ApplicationData {
  refNumber: string;
  firstName: string;
  lastName: string;
  gradeApplying: string;
  status: StatusType;
  submittedAt: string;
  updatedAt: string;
}

export default function Track() {
  const [refNumber, setRefNumber] = useState('');
  const [showRecover, setShowRecover] = useState(false);
  const [recoverIdNumber, setRecoverIdNumber] = useState('');
  const [recoverPhone, setRecoverPhone] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recoverError, setRecoverError] = useState<string | null>(null);
  const [application, setApplication] = useState<ApplicationData | null>(null);

  const fetchApplication = async (searchQuery: string) => {
    setIsLoading(true);
    setError(null);
    setApplication(null);

    const cleanQuery = searchQuery.trim().toUpperCase();

    try {
      const response = await fetch(
        `https://hoyesecondarysch.com/app/track_application.php?ref=${encodeURIComponent(cleanQuery)}&tracking_number=${encodeURIComponent(cleanQuery)}`
      );

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'error' || data.found === false || (!data.refNumber && !data.tracking_number && !data.firstName)) {
        setError('Application not found. Please double-check your reference code or applicant ID number and try again.');
      } else {
        setApplication({
          refNumber: data.tracking_number || data.refNumber || cleanQuery,
          firstName: data.firstName || data.applicant_first_name || data.applicant_name?.split(' ')[0] || 'Applicant',
          lastName: data.lastName || data.applicant_last_name || data.applicant_name?.split(' ').slice(1).join(' ') || '',
          gradeApplying: data.gradeApplying || data.grade_applying || '8',
          status: (data.status || data.application_status || 'pending').toLowerCase() as StatusType,
          submittedAt: data.submittedAt || data.submission_date || data.created_at || new Date().toISOString(),
          updatedAt: data.updatedAt || data.updated_at || new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.error('Track error:', err);
      setError('Unable to reach the admissions server. Please try again shortly.');
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

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverIdNumber.trim() || !recoverPhone.trim()) return;

    setIsRecovering(true);
    setRecoverError(null);

    try {
      const response = await fetch('https://hoyesecondarysch.com/app/recover_reference.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idNumber: recoverIdNumber.trim(),
          phone: recoverPhone.trim(),
        }),
      });

      const data = await response.json();

      if (data.refNumber || data.tracking_number) {
        const foundRef = data.refNumber || data.tracking_number;
        setRefNumber(foundRef);
        setShowRecover(false);
        fetchApplication(foundRef);
      } else {
        setRecoverError(data.message || 'Could not find an application with those details. Please check and try again.');
      }
    } catch (err) {
      setRecoverError('Server communication error. Please try again.');
    } finally {
      setIsRecovering(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
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
            Check live admission decisions and process updates using your unique reference number or ID number.
          </p>
        </div>

        <Card className="border-border/60 shadow-xl shadow-black/5 rounded-3xl overflow-hidden bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">Search Application</CardTitle>
            <CardDescription className="text-xs">
              Enter reference code (e.g., HY-2026-XXXX or HY-2027-XXXX) or ID number.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="refNumber" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Reference / ID Number
                </Label>
                <div className="relative">
                  <Input
                    id="refNumber"
                    placeholder="e.g. HY-2027-0001 or 0801015000088"
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value.toUpperCase())}
                    className="h-12 pl-4 pr-10 rounded-2xl font-mono text-sm uppercase tracking-wide focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Button 
                  type="submit" 
                  disabled={!refNumber.trim() || isLoading} 
                  className="flex-1 h-11 rounded-xl font-semibold bg-primary hover:bg-primary/90 shadow-md gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Checking Status...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Track Application
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRecover(!showRecover)}
                  className="h-11 rounded-xl font-medium gap-2 border-border/70 hover:bg-muted"
                >
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  Lost Reference?
                </Button>
              </div>
            </form>

            <AnimatePresence>
              {showRecover && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <Separator className="my-5" />
                  <div className="space-y-4 bg-muted/30 p-5 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-primary" />
                      <h4 className="font-bold text-sm">Recover Reference Number</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Provide the applicant's ID number and registered parent's phone number.
                    </p>

                    <form onSubmit={handleRecover} className="space-y-3.5">
                      <div className="space-y-1.5">
                        <Label htmlFor="recoverIdNumber" className="text-xs font-medium">ID / Passport Number</Label>
                        <Input
                          id="recoverIdNumber"
                          placeholder="e.g. 0801015000088"
                          value={recoverIdNumber}
                          onChange={(e) => setRecoverIdNumber(e.target.value)}
                          className="h-10 rounded-xl text-xs bg-background"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="recoverPhone" className="text-xs font-medium">Parent/Guardian Mobile</Label>
                        <Input
                          id="recoverPhone"
                          placeholder="e.g. 082 123 4567"
                          value={recoverPhone}
                          onChange={(e) => setRecoverPhone(e.target.value)}
                          className="h-10 rounded-xl text-xs bg-background"
                        />
                      </div>
                      <Button
                        type="submit"
                        variant="secondary"
                        disabled={!recoverIdNumber.trim() || !recoverPhone.trim() || isRecovering}
                        className="w-full h-10 rounded-xl text-xs font-semibold"
                      >
                        {isRecovering ? 'Locating Record...' : 'Retrieve Reference Code'}
                      </Button>
                    </form>

                    {recoverError && (
                      <Alert variant="destructive" className="rounded-xl border-rose-500/20 bg-rose-500/10 text-rose-800 dark:text-rose-300">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">{recoverError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                      <GraduationCap className="w-3.5 h-3.5 text-primary" /> Grade {application.gradeApplying}
                      <span className="text-border">•</span>
                      <span className="font-mono text-primary font-bold">{application.refNumber}</span>
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
                        <p className="font-bold text-sm">Submitted Successfully</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatDate(application.submittedAt)}</p>
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
                        <p className="font-bold text-sm">Under Review</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Documents are undergoing verification by administrative staff.
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
                            : 'Decision pending.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Hoye Admissions Portal</span>
                  <span>Last Checked: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}