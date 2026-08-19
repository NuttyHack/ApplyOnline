import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import type { ApplicationInput } from '@workspace/api-client-react';

interface Step4Props {
  form: UseFormReturn<ApplicationInput>;
}

export function Step4Guardian({ form }: Step4Props) {
  const { register, watch, setValue, formState: { errors } } = form;
  const guardianEmploymentStatus = watch('guardian_employment_status');
  const hasSecondGuardian = watch('has_second_guardian');

  const isEmployed = guardianEmploymentStatus && ['Employed', 'Self Employed', 'Part Time', 'Contract Worker'].includes(guardianEmploymentStatus);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-step-title">Step 4: Parent / Guardian Details</h2>
        <p className="text-muted-foreground">Please provide information about the primary parent or guardian</p>
      </div>

      {/* Primary Guardian */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Primary Guardian Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guardian_first_name">First Name *</Label>
              <Input id="guardian_first_name" {...register('guardian_first_name', { required: true })} data-testid="input-guardian_first_name" />
              {errors.guardian_first_name && <p className="text-sm text-destructive">Guardian first name is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardian_last_name">Last Name *</Label>
              <Input id="guardian_last_name" {...register('guardian_last_name', { required: true })} data-testid="input-guardian_last_name" />
              {errors.guardian_last_name && <p className="text-sm text-destructive">Guardian last name is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardian_id">ID or Passport Number *</Label>
              <Input id="guardian_id" {...register('guardian_id', { required: true })} data-testid="input-guardian_id" />
              {errors.guardian_id && <p className="text-sm text-destructive">Guardian ID is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardian_relationship">Relationship to Learner *</Label>
              <Select
                value={watch('guardian_relationship')}
                onValueChange={(value) => setValue('guardian_relationship', value)}
              >
                <SelectTrigger id="guardian_relationship" data-testid="select-guardian_relationship">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mother">Mother</SelectItem>
                  <SelectItem value="Father">Father</SelectItem>
                  <SelectItem value="Legal Guardian">Legal Guardian</SelectItem>
                  <SelectItem value="Grandmother">Grandmother</SelectItem>
                  <SelectItem value="Grandfather">Grandfather</SelectItem>
                  <SelectItem value="Aunt">Aunt</SelectItem>
                  <SelectItem value="Uncle">Uncle</SelectItem>
                  <SelectItem value="Stepmother">Stepmother</SelectItem>
                  <SelectItem value="Stepfather">Stepfather</SelectItem>
                  <SelectItem value="Foster Parent">Foster Parent</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.guardian_relationship && <p className="text-sm text-destructive">Relationship is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardian_marital_status">Marital Status</Label>
              <Select
                value={watch('guardian_marital_status') || ''}
                onValueChange={(value) => setValue('guardian_marital_status', value)}
              >
                <SelectTrigger id="guardian_marital_status" data-testid="select-guardian_marital_status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Divorced">Divorced</SelectItem>
                  <SelectItem value="Widowed">Widowed</SelectItem>
                  <SelectItem value="Separated">Separated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Guardian Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guardian_phone">Primary Phone Number *</Label>
            <Input id="guardian_phone" {...register('guardian_phone', { required: true })} data-testid="input-guardian_phone" />
            {errors.guardian_phone && <p className="text-sm text-destructive">Guardian phone is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardian_alt_phone">Alternative Phone Number</Label>
            <Input id="guardian_alt_phone" {...register('guardian_alt_phone')} data-testid="input-guardian_alt_phone" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardian_whatsapp">WhatsApp Number</Label>
            <Input id="guardian_whatsapp" {...register('guardian_whatsapp')} data-testid="input-guardian_whatsapp" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardian_email">Email Address</Label>
            <Input id="guardian_email" type="email" {...register('guardian_email')} data-testid="input-guardian_email" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="preferred_communication">Preferred Communication Method</Label>
            <Select
              value={watch('preferred_communication') || ''}
              onValueChange={(value) => setValue('preferred_communication', value)}
            >
              <SelectTrigger id="preferred_communication" data-testid="select-preferred_communication">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Phone Call">Phone Call</SelectItem>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Guardian Employment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guardian_employment_status">Employment Status</Label>
            <Select
              value={guardianEmploymentStatus || ''}
              onValueChange={(value) => setValue('guardian_employment_status', value)}
            >
              <SelectTrigger id="guardian_employment_status" data-testid="select-guardian_employment_status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Employed">Employed (Full Time)</SelectItem>
                <SelectItem value="Self Employed">Self Employed</SelectItem>
                <SelectItem value="Part Time">Part Time</SelectItem>
                <SelectItem value="Contract Worker">Contract Worker</SelectItem>
                <SelectItem value="Unemployed">Unemployed</SelectItem>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Retired">Retired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isEmployed && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border">
              <div className="space-y-2">
                <Label htmlFor="guardian_occupation">Occupation</Label>
                <Input id="guardian_occupation" {...register('guardian_occupation')} data-testid="input-guardian_occupation" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardian_employer">Employer Name</Label>
                <Input id="guardian_employer" {...register('guardian_employer')} data-testid="input-guardian_employer" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="guardian_income_range">Monthly Income Range</Label>
                <Select
                  value={watch('guardian_income_range') || ''}
                  onValueChange={(value) => setValue('guardian_income_range', value)}
                >
                  <SelectTrigger id="guardian_income_range" data-testid="select-guardian_income_range">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Below R3 000">Below R3,000</SelectItem>
                    <SelectItem value="R3 000-R7 000">R3,000 - R7,000</SelectItem>
                    <SelectItem value="R7 001-R15 000">R7,001 - R15,000</SelectItem>
                    <SelectItem value="R15 001-R30 000">R15,001 - R30,000</SelectItem>
                    <SelectItem value="Above R30 000">Above R30,000</SelectItem>
                    <SelectItem value="Prefer Not To Say">Prefer Not To Say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guardian Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Guardian Home Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="guardian_home_address">Full Address</Label>
            <Textarea id="guardian_home_address" {...register('guardian_home_address')} rows={3} placeholder="Street address, suburb, city, postal code" data-testid="textarea-guardian_home_address" />
            <p className="text-sm text-muted-foreground">If same as learner's address, you may leave blank</p>
          </div>
        </CardContent>
      </Card>

      {/* Second Guardian */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Second Guardian (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="has_second_guardian">Is There a Second Guardian?</Label>
            <Select
              value={hasSecondGuardian || ''}
              onValueChange={(value) => setValue('has_second_guardian', value)}
            >
              <SelectTrigger id="has_second_guardian" data-testid="select-has_second_guardian">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasSecondGuardian === 'Yes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border">
              <div className="space-y-2">
                <Label htmlFor="guardian_2_name">Second Guardian Full Name</Label>
                <Input id="guardian_2_name" {...register('guardian_2_name')} data-testid="input-guardian_2_name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardian_2_phone">Second Guardian Phone Number</Label>
                <Input id="guardian_2_phone" {...register('guardian_2_phone')} data-testid="input-guardian_2_phone" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="permission_photos">Allow Photos/Videos for School Use?</Label>
            <Select
              value={watch('permission_photos') || ''}
              onValueChange={(value) => setValue('permission_photos', value)}
            >
              <SelectTrigger id="permission_photos" data-testid="select-permission_photos">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes - Allow school to use photos/videos</SelectItem>
                <SelectItem value="No">No - Do not use photos/videos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="font-medium">
          Please note: Hoye Secondary School does not provide accommodation. Learners must make their own boarding or local housing arrangements.
        </AlertDescription>
      </Alert>
    </div>
  );
}