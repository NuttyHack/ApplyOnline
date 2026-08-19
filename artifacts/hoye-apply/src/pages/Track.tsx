import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/StatusBadge';
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
  GraduationCap
} from 'lucide-react';
import { 
  useTrackApplication, 
  useRecoverReference, 
  getTrackApplicationQueryKey, 
  getRecoverReferenceQueryKey 
} from '@workspace/api-client-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function Track() {
  const [refNumber, setRefNumber] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [showRecover, setShowRecover] = useState(false);
  const [recoverIdNumber, setRecoverIdNumber] = useState('');
  const [recoverPhone, setRecoverPhone] = useState('');
  const [recoverTriggered, setRecoverTriggered] = useState(false);

  const { data: application, isLoading, isError } = useTrackApplication(refNumber, {
    query: {
      queryKey: getTrackApplicationQueryKey(refNumber),
      enabled: !!refNumber && searchTriggered,
    },
  });

  const { data: recoveredRef, isLoading: isRecovering, isError: isRecoverError } = useRecoverReference(
    { idNumber: recoverIdNumber, phone: recoverPhone },
    {
      query: {
        queryKey: getRecoverReferenceQueryKey({ idNumber: recoverIdNumber, phone: recoverPhone }),
        enabled: !!recoverIdNumber && !!recoverPhone && recoverTriggered,
      },
    }
  );

  // Safely sync state when reference is recovered without rendering state side-effects
  useEffect(() => {
    if (recoveredRef && recoverTriggered) {
      setRefNumber(recoveredRef.refNumber);
      setSearchTriggered(true);
      setRecoverTriggered(false);
      setShowRecover(false);
    }
  }, [recoveredRef, recoverTriggered]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (refNumber.trim()) {
      setSearchTriggered(true);
    }
  };

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    if (recoverIdNumber.trim() && recoverPhone.trim()) {
      setRecoverTriggered(true);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-background via-muted/20 to-muted/40 pb-16">
      {/* Top Header */}
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
            <Button variant="ghost" size="sm" className="rounded-xl hover:bg-muted font-medium text-xs gap-2" data-testid="button-back-home">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="container max-w-2xl mx-auto px-4 pt-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Admission Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground" data-testid="text-track-title">
            Track Your Status
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Check live admission decisions and process updates using your unique reference number.
          </p>
        </div>

        {/* Search Card */}
        <Card className="border-border/60 shadow-xl shadow-black/5 rounded-3xl overflow-hidden bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">Search Application</CardTitle>
            <CardDescription className="text-xs">
              Enter the reference code provided during online submission.
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
                    placeholder="e.g. HY-2027-0001"
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value.toUpperCase())}
                    className="h-12 pl-4 pr-10 rounded-2xl font-mono text-sm uppercase tracking-wide focus-visible:ring-2 focus-visible:ring-primary"
                    data-testid="input-reference-number"
                  />
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Button 
                  type="submit" 
                  disabled={!refNumber.trim() || isLoading} 
                  className="flex-1 h-11 rounded-xl font-semibold bg-primary hover:bg-primary/90 shadow-md gap-2" 
                  data-testid="button-search"
                >
                  <Search className="h-4 w-4" />
                  {isLoading ? 'Checking Status...' : 'Track Application'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRecover(!showRecover)}
                  className="h-11 rounded-xl font-medium gap-2 border-border/70 hover:bg-muted"
                  data-testid="button-recover-reference"
                >
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  Lost Reference?
                </Button>
              </div>
            </form>

            {/* Recover Reference Form */}
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
                      Provide the applicant's ID or Passport number alongside the registered guardian's phone number.
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
                          data-testid="input-recover-id"
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
                          data-testid="input-recover-phone"
                        />
                      </div>
                      <Button
                        type="submit"
                        variant="secondary"
                        disabled={!recoverIdNumber.trim() || !recoverPhone.trim() || isRecovering}
                        className="w-full h-10 rounded-xl text-xs font-semibold"
                        data-testid="button-submit-recover"
                      >
                        {isRecovering ? 'Locating Record...' : 'Retrieve Reference Code'}
                      </Button>
                    </form>

                    {isRecoverError && (
                      <Alert variant="destructive" className="rounded-xl border-rose-500/20 bg-rose-500/10 text-rose-800 dark:text-rose-300">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          No matching record found. Please verify the ID and mobile phone details.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Search Errors */}
        {isError && searchTriggered && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
            <Alert variant="destructive" className="rounded-2xl border-rose-500/20 bg-rose-500/10 text-rose-800 dark:text-rose-300" data-testid="alert-not-found">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs font-medium">
                Application not found. Please double-check your reference code (e.g. HY-2027-XXXX) and try again.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Application Result Details Card */}
        {application && searchTriggered && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-border/80 shadow-xl rounded-3xl overflow-hidden bg-card" data-testid="card-application-result">
              <CardHeader className="bg-muted/20 border-b border-border/40 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl font-black" data-testid="text-applicant-name">
                      {application.firstName} {application.lastName}
                    </CardTitle>
                    <CardDescription className="text-xs font-medium mt-1 flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-primary" /> Applying for Grade {application.gradeApplying}
                      <span className="text-border">•</span>
                      <span className="font-mono text-primary font-bold">{application.refNumber}</span>
                    </CardDescription>
                  </div>
                  <StatusBadge status={application.status} />
                </div>
              </CardHeader>

              <CardContent className="p-6 sm:p-8 space-y-8">
                {/* Timeline */}
                <div className="space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> Application Timeline
                  </h4>

                  <div className="space-y-6 pt-2">
                    {/* Step 1: Application Submitted */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className="w-0.5 bg-emerald-500/30 my-1 h-full min-h-[2.5rem]" />
                      </div>
                      <div className="pb-2">
                        <p className="font-bold text-sm">Application Submitted</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {format(new Date(application.submittedAt), 'PPP p')}
                        </p>
                      </div>
                    </div>

                    {/* Step 2: Under Review */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            application.status === 'under_review' ||
                            application.status === 'accepted' ||
                            application.status === 'rejected' ||
                            application.status === 'waitlisted'
                              ? 'bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {application.status === 'under_review' ? (
                            <Clock className="h-4 w-4 animate-pulse" />
                          ) : application.status === 'pending' ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </div>
                        <div className="w-0.5 bg-border my-1 h-full min-h-[2.5rem]" />
                      </div>
                      <div className="pb-2">
                        <p className="font-bold text-sm">Document Verification & Review</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {application.status === 'pending'
                            ? 'Queued for administrative assessment'
                            : 'Application and attached documents are currently being evaluated.'}
                        </p>
                      </div>
                    </div>

                    {/* Step 3: Decision */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            application.status === 'accepted'
                              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
                              : application.status === 'rejected'
                              ? 'bg-rose-500/10 border border-rose-500/20 text-rose-600'
                              : application.status === 'waitlisted'
                              ? 'bg-purple-500/10 border border-purple-500/20 text-purple-600'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {application.status === 'accepted' ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : application.status === 'rejected' || application.status === 'waitlisted' ? (
                            <FileText className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-sm">Admission Decision</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {application.status === 'accepted' ||
                          application.status === 'rejected' ||
                          application.status === 'waitlisted'
                            ? `Final status updated on ${format(new Date(application.updatedAt), 'PPP')}`
                            : 'Awaiting review outcome.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Hoye Admissions Desk</span>
                  <span>Updated: {format(new Date(application.updatedAt), 'PPP p')}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}