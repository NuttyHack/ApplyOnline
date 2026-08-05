import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Upload, AlertCircle } from 'lucide-react';
import type { ApplicationInput } from '@workspace/api-client-react';

interface Step5Props {
  form: UseFormReturn<ApplicationInput>;
}

export function Step5Submit({ form }: Step5Props) {
  const { register, watch, setValue, formState: { errors } } = form;
  const confirmTruth = watch('confirmTruth');
  const agreePolicies = watch('agreePolicies');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-step-title">Step 5: Submit & Declaration</h2>
        <p className="text-muted-foreground">Upload required documents and confirm your declaration</p>
      </div>

      {/* Document Upload */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Required Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-muted/30">
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Please ensure all documents are clear, legible, and in PDF, JPG, or PNG format (max 5MB each)
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Document Upload Cards */}
            <div className="p-4 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
              <Label htmlFor="doc-birth-cert" className="flex flex-col items-center justify-center gap-2 cursor-pointer h-full min-h-[120px]">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">Learner Birth Certificate / ID *</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to upload</p>
                </div>
                <Input
                  id="doc-birth-cert"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="sr-only"
                  data-testid="upload-birth-cert"
                />
              </Label>
            </div>

            <div className="p-4 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
              <Label htmlFor="doc-report" className="flex flex-col items-center justify-center gap-2 cursor-pointer h-full min-h-[120px]">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">Latest School Report *</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to upload</p>
                </div>
                <Input
                  id="doc-report"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="sr-only"
                  data-testid="upload-report"
                />
              </Label>
            </div>

            <div className="p-4 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
              <Label htmlFor="doc-guardian-id" className="flex flex-col items-center justify-center gap-2 cursor-pointer h-full min-h-[120px]">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">Parent/Guardian ID Copy *</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to upload</p>
                </div>
                <Input
                  id="doc-guardian-id"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="sr-only"
                  data-testid="upload-guardian-id"
                />
              </Label>
            </div>

            <div className="p-4 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
              <Label htmlFor="doc-proof-residence" className="flex flex-col items-center justify-center gap-2 cursor-pointer h-full min-h-[120px]">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">Proof of Residence *</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to upload</p>
                </div>
                <Input
                  id="doc-proof-residence"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="sr-only"
                  data-testid="upload-proof-residence"
                />
              </Label>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            * Required documents. Acceptable formats: utility bill, lease agreement, affidavit, bank statement
          </p>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Information (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Any Additional Comments or Information</Label>
            <Textarea
              id="additionalNotes"
              {...register('additionalNotes')}
              rows={4}
              placeholder="Use this space to provide any additional information you think is relevant to your application"
              data-testid="textarea-additionalNotes"
            />
          </div>
        </CardContent>
      </Card>

      {/* Declaration */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Declaration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-foreground">
              By submitting this application, I declare that:
            </p>
            <ul className="text-sm text-foreground space-y-1 list-disc pl-5">
              <li>All information provided in this application is true, accurate, and complete to the best of my knowledge</li>
              <li>I understand that providing false or misleading information may result in the rejection of this application or dismissal from the school</li>
              <li>I have read and understood the school's admission policies and requirements</li>
              <li>I consent to the school verifying the information provided with relevant authorities and institutions</li>
              <li>I understand that submitting an application does not guarantee admission to Hoye Secondary School</li>
            </ul>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-start gap-3">
              <Checkbox
                id="confirmTruth"
                checked={confirmTruth === 'Yes'}
                onCheckedChange={(checked) => setValue('confirmTruth', checked ? 'Yes' : '')}
                data-testid="checkbox-confirmTruth"
              />
              <Label htmlFor="confirmTruth" className="text-sm font-normal cursor-pointer">
                I confirm that all information provided is truthful and accurate *
              </Label>
            </div>
            {errors.confirmTruth && <p className="text-sm text-destructive ml-7">You must confirm this declaration</p>}

            <div className="flex items-start gap-3">
              <Checkbox
                id="agreePolicies"
                checked={agreePolicies === 'Yes'}
                onCheckedChange={(checked) => setValue('agreePolicies', checked ? 'Yes' : '')}
                data-testid="checkbox-agreePolicies"
              />
              <Label htmlFor="agreePolicies" className="text-sm font-normal cursor-pointer">
                I agree to abide by the school's policies, code of conduct, and admission requirements *
              </Label>
            </div>
            {errors.agreePolicies && <p className="text-sm text-destructive ml-7">You must agree to the policies</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="digitalSignature">Digital Signature (Full Name) *</Label>
              <Input
                id="digitalSignature"
                {...register('digitalSignature', { required: true })}
                placeholder="Type your full name"
                data-testid="input-digitalSignature"
              />
              {errors.digitalSignature && <p className="text-sm text-destructive">Digital signature is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="submissionDate">Date *</Label>
              <Input
                id="submissionDate"
                type="date"
                {...register('submissionDate', { required: true })}
                data-testid="input-submissionDate"
              />
              {errors.submissionDate && <p className="text-sm text-destructive">Date is required</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please review all information carefully before submitting. Once submitted, you will receive a tracking reference number to monitor your application status.
        </AlertDescription>
      </Alert>
    </div>
  );
}
