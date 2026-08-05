import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/StatusBadge';
import { ArrowLeft, Search, AlertCircle, CheckCircle2, Clock, FileText } from 'lucide-react';
import { useTrackApplication, useRecoverReference, getTrackApplicationQueryKey, getRecoverReferenceQueryKey } from '@workspace/api-client-react';
import { format } from 'date-fns';

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

  if (recoveredRef && recoverTriggered) {
    setRefNumber(recoveredRef.refNumber);
    setSearchTriggered(true);
    setRecoverTriggered(false);
    setShowRecover(false);
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-accent font-bold text-lg">H</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Hoye Secondary School</h1>
              <p className="text-xs text-muted-foreground">Track Your Application</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" data-testid="button-back-home">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container max-w-2xl mx-auto px-4 py-12">
        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle data-testid="text-track-title">Track Your Application</CardTitle>
            <CardDescription>
              Enter your reference number to check your application status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="refNumber">Reference Number</Label>
                <Input
                  id="refNumber"
                  placeholder="e.g. HSS-2027-A1B2C3"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  data-testid="input-reference-number"
                />
                <p className="text-sm text-muted-foreground">
                  This was provided when you submitted your application
                </p>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={!refNumber.trim() || isLoading} className="flex-1" data-testid="button-search">
                  <Search className="h-4 w-4 mr-2" />
                  {isLoading ? 'Searching...' : 'Track Application'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRecover(!showRecover)}
                  data-testid="button-recover-reference"
                >
                  Lost Reference?
                </Button>
              </div>
            </form>

            {/* Recover Form */}
            {showRecover && (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">Recover Your Reference Number</h4>
                    <p className="text-sm text-muted-foreground">
                      Enter the details you used when applying
                    </p>
                  </div>
                  <form onSubmit={handleRecover} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="recoverIdNumber">ID or Passport Number</Label>
                      <Input
                        id="recoverIdNumber"
                        value={recoverIdNumber}
                        onChange={(e) => setRecoverIdNumber(e.target.value)}
                        data-testid="input-recover-id"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recoverPhone">Parent/Guardian Phone Number</Label>
                      <Input
                        id="recoverPhone"
                        value={recoverPhone}
                        onChange={(e) => setRecoverPhone(e.target.value)}
                        data-testid="input-recover-phone"
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={!recoverIdNumber.trim() || !recoverPhone.trim() || isRecovering}
                      className="w-full"
                      data-testid="button-submit-recover"
                    >
                      {isRecovering ? 'Recovering...' : 'Recover Reference'}
                    </Button>
                  </form>
                  {isRecoverError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Could not find an application with those details. Please check and try again.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Error State */}
        {isError && searchTriggered && (
          <Alert variant="destructive" data-testid="alert-not-found">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Application not found. Please check your reference number and try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Application Result */}
        {application && searchTriggered && (
          <Card className="border-2" data-testid="card-application-result">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl" data-testid="text-applicant-name">
                    {application.firstName} {application.lastName}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Applying for Grade {application.gradeApplying} • {application.refNumber}
                  </CardDescription>
                </div>
                <StatusBadge status={application.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Timeline */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Application Timeline
                </h4>
                <div className="space-y-4">
                  {/* Applied */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 w-0.5 bg-border mt-2 h-full min-h-[2rem]" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-semibold">Application Submitted</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(application.submittedAt), 'PPP p')}
                      </p>
                    </div>
                  </div>

                  {/* Under Review */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          application.status === 'under_review' ||
                          application.status === 'accepted' ||
                          application.status === 'rejected' ||
                          application.status === 'waitlisted'
                            ? 'bg-blue-100'
                            : 'bg-muted'
                        }`}
                      >
                        {application.status === 'under_review' ||
                        application.status === 'accepted' ||
                        application.status === 'rejected' ||
                        application.status === 'waitlisted' ? (
                          <FileText className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 w-0.5 bg-border mt-2 h-full min-h-[2rem]" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-semibold">Under Review</p>
                      <p className="text-sm text-muted-foreground">
                        {application.status === 'pending'
                          ? 'Awaiting review'
                          : 'Application is being reviewed'}
                      </p>
                    </div>
                  </div>

                  {/* Decision */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          application.status === 'accepted'
                            ? 'bg-green-100'
                            : application.status === 'rejected'
                              ? 'bg-red-100'
                              : application.status === 'waitlisted'
                                ? 'bg-purple-100'
                                : 'bg-muted'
                        }`}
                      >
                        {application.status === 'accepted' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : application.status === 'rejected' || application.status === 'waitlisted' ? (
                          <FileText
                            className={`h-5 w-5 ${application.status === 'rejected' ? 'text-red-600' : 'text-purple-600'}`}
                          />
                        ) : (
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Decision</p>
                      <p className="text-sm text-muted-foreground">
                        {application.status === 'accepted' ||
                        application.status === 'rejected' ||
                        application.status === 'waitlisted'
                          ? `Decision made on ${format(new Date(application.updatedAt), 'PPP')}`
                          : 'Decision pending'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="text-sm text-muted-foreground">
                <p>
                  Last updated: {format(new Date(application.updatedAt), 'PPP p')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
