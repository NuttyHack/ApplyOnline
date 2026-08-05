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
  const guardianEmploymentStatus = watch('guardianEmploymentStatus');
  const hasSecondGuardian = watch('hasSecondGuardian');

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
              <Label htmlFor="guardianFirstName">First Name *</Label>
              <Input id="guardianFirstName" {...register('guardianFirstName', { required: true })} data-testid="input-guardianFirstName" />
              {errors.guardianFirstName && <p className="text-sm text-destructive">Guardian first name is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardianLastName">Last Name *</Label>
              <Input id="guardianLastName" {...register('guardianLastName', { required: true })} data-testid="input-guardianLastName" />
              {errors.guardianLastName && <p className="text-sm text-destructive">Guardian last name is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardianId">ID or Passport Number *</Label>
              <Input id="guardianId" {...register('guardianId', { required: true })} data-testid="input-guardianId" />
              {errors.guardianId && <p className="text-sm text-destructive">Guardian ID is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardianRelationship">Relationship to Learner *</Label>
              <Select
                value={watch('guardianRelationship')}
                onValueChange={(value) => setValue('guardianRelationship', value)}
              >
                <SelectTrigger id="guardianRelationship" data-testid="select-guardianRelationship">
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
              {errors.guardianRelationship && <p className="text-sm text-destructive">Relationship is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardianMaritalStatus">Marital Status</Label>
              <Select
                value={watch('guardianMaritalStatus') || ''}
                onValueChange={(value) => setValue('guardianMaritalStatus', value)}
              >
                <SelectTrigger id="guardianMaritalStatus" data-testid="select-guardianMaritalStatus">
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
            <Label htmlFor="guardianPhone">Primary Phone Number *</Label>
            <Input id="guardianPhone" {...register('guardianPhone', { required: true })} data-testid="input-guardianPhone" />
            {errors.guardianPhone && <p className="text-sm text-destructive">Guardian phone is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardianAltPhone">Alternative Phone Number</Label>
            <Input id="guardianAltPhone" {...register('guardianAltPhone')} data-testid="input-guardianAltPhone" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardianWhatsapp">WhatsApp Number</Label>
            <Input id="guardianWhatsapp" {...register('guardianWhatsapp')} data-testid="input-guardianWhatsapp" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardianEmail">Email Address</Label>
            <Input id="guardianEmail" type="email" {...register('guardianEmail')} data-testid="input-guardianEmail" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="preferredCommunication">Preferred Communication Method</Label>
            <Select
              value={watch('preferredCommunication') || ''}
              onValueChange={(value) => setValue('preferredCommunication', value)}
            >
              <SelectTrigger id="preferredCommunication" data-testid="select-preferredCommunication">
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
            <Label htmlFor="guardianEmploymentStatus">Employment Status</Label>
            <Select
              value={guardianEmploymentStatus || ''}
              onValueChange={(value) => setValue('guardianEmploymentStatus', value)}
            >
              <SelectTrigger id="guardianEmploymentStatus" data-testid="select-guardianEmploymentStatus">
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
                <Label htmlFor="guardianOccupation">Occupation</Label>
                <Input id="guardianOccupation" {...register('guardianOccupation')} data-testid="input-guardianOccupation" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardianEmployer">Employer Name</Label>
                <Input id="guardianEmployer" {...register('guardianEmployer')} data-testid="input-guardianEmployer" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="guardianIncomeRange">Monthly Income Range</Label>
                <Select
                  value={watch('guardianIncomeRange') || ''}
                  onValueChange={(value) => setValue('guardianIncomeRange', value)}
                >
                  <SelectTrigger id="guardianIncomeRange" data-testid="select-guardianIncomeRange">
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
            <Label htmlFor="guardianHomeAddress">Full Address</Label>
            <Textarea id="guardianHomeAddress" {...register('guardianHomeAddress')} rows={3} placeholder="Street address, suburb, city, postal code" data-testid="textarea-guardianHomeAddress" />
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
            <Label htmlFor="hasSecondGuardian">Is There a Second Guardian?</Label>
            <Select
              value={hasSecondGuardian || ''}
              onValueChange={(value) => setValue('hasSecondGuardian', value)}
            >
              <SelectTrigger id="hasSecondGuardian" data-testid="select-hasSecondGuardian">
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
                <Label htmlFor="guardian2Name">Second Guardian Full Name</Label>
                <Input id="guardian2Name" {...register('guardian2Name')} data-testid="input-guardian2Name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardian2Phone">Second Guardian Phone Number</Label>
                <Input id="guardian2Phone" {...register('guardian2Phone')} data-testid="input-guardian2Phone" />
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
            <Label htmlFor="permissionPhotos">Allow Photos/Videos for School Use?</Label>
            <Select
              value={watch('permissionPhotos') || ''}
              onValueChange={(value) => setValue('permissionPhotos', value)}
            >
              <SelectTrigger id="permissionPhotos" data-testid="select-permissionPhotos">
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
