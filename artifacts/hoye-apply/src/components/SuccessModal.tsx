import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, Check } from 'lucide-react';

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  refNumber: string;
  message: string;
}

export function SuccessModal({ open, onClose, refNumber, message }: SuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(refNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-success">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-10 w-10 text-green-600" data-testid="icon-success" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl" data-testid="text-success-title">Application Submitted Successfully</DialogTitle>
          <DialogDescription className="text-center pt-2" data-testid="text-success-message">
            {message}
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted rounded-lg p-4 my-4">
          <p className="text-sm text-muted-foreground text-center mb-2">Your tracking reference number</p>
          <div className="flex items-center justify-center gap-2">
            <code className="text-lg font-mono font-semibold text-primary" data-testid="text-reference-number">
              {refNumber}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
              data-testid="button-copy-reference"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-center text-muted-foreground">
            Please save this reference number. You will need it to track your application status.
          </p>
          <Button onClick={onClose} className="w-full" data-testid="button-close-modal">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
