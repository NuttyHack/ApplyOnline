import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/Home';
import Apply from '@/pages/Apply';
import Track from '@/pages/Track';
import Yearbook from '@/pages/Yearbook';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { SkavsChatWidget } from '@/components/skavs/SkavsChatWidget';
import type { ExtractedData } from '@/lib/document-parser';

const queryClient = new QueryClient();

function AppShell() {
  const [, navigate] = useLocation();
  const [pendingExtract, setPendingExtract] = useState<ExtractedData | null>(null);
  const [skavsInitialStep, setSkavsInitialStep] = useState<number | null>(null);

  const handleSkavsNavigate = useCallback((target: string) => {
    if (target === 'yearbook') {
      navigate('/yearbook');
    } else if (target === 'track') {
      navigate('/track');
    } else if (target.startsWith('apply_step_')) {
      const step = parseInt(target.replace('apply_step_', ''));
      setSkavsInitialStep(step);
      navigate('/apply');
    }
  }, [navigate]);

  const handleApplyExtracted = useCallback((data: ExtractedData) => {
    setPendingExtract(data);
    navigate('/apply');
  }, [navigate]);

  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/apply">
          {() => (
            <Apply
              extractedData={pendingExtract}
              initialStep={skavsInitialStep}
              onExtractConsumed={() => {
                setPendingExtract(null);
                setSkavsInitialStep(null);
              }}
            />
          )}
        </Route>
        <Route path="/track" component={Track} />
        <Route path="/yearbook" component={Yearbook} />
        <Route component={NotFound} />
      </Switch>

      {/* SKAVS — shown on all pages */}
      <SkavsChatWidget
        onApplyExtracted={handleApplyExtracted}
        onNavigate={handleSkavsNavigate}
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AppShell />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
