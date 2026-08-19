import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import type { ApplicationInput } from '@workspace/api-client-react';

interface Step3Props {
  form: UseFormReturn<ApplicationInput>;
}

export function Step3Medical({ form }: Step3Props) {
  const { register, watch, setValue, formState: { errors } } = form;
  const hasMedicalAid = watch('has_medical_aid');
  const hasFamilyDoctor = watch('has_family_doctor');
  const hasDisability = watch('has_disability');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-step-title">Step 3: Medical & Support Information</h2>
        <p className="text-muted-foreground">Please provide health and emergency contact details</p>
      </div>

      {/* Medical Aid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Medical Aid Coverage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="has_medical_aid">Do You Have Medical Aid?</Label>
            <Select
              value={hasMedicalAid || ''}
              onValueChange={(value) => setValue('has_medical_aid', value)}
            >
              <SelectTrigger id="has_medical_aid" data-testid="select-has_medical_aid">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasMedicalAid === 'Yes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border">
              <div className="space-y-2">
                <Label htmlFor="med_aid_provider">Medical Aid Provider</Label>
                <Input id="med_aid_provider" {...register('med_aid_provider')} placeholder="e.g., Discovery, Bonitas" data-testid="input-med_aid_provider" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="med_aid_number">Medical Aid Number</Label>
                <Input id="med_aid_number" {...register('med_aid_number')} data-testid="input-med_aid_number" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Family Doctor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Family Doctor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="has_family_doctor">Do You Have a Family Doctor?</Label>
            <Select
              value={hasFamilyDoctor || ''}
              onValueChange={(value) => setValue('has_family_doctor', value)}
            >
              <SelectTrigger id="has_family_doctor" data-testid="select-has_family_doctor">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasFamilyDoctor === 'Yes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border">
              <div className="space-y-2">
                <Label htmlFor="doctor_name">Doctor Name</Label>
                <Input id="doctor_name" {...register('doctor_name')} data-testid="input-doctor_name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor_phone">Doctor Phone Number</Label>
                <Input id="doctor_phone" {...register('doctor_phone')} data-testid="input-doctor_phone" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="border-2 border-accent/20 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-accent" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergency_name">Emergency Contact Name *</Label>
            <Input id="emergency_name" {...register('emergency_name', { required: true })} data-testid="input-emergency_name" />
            {errors.emergency_name && <p className="text-sm text-destructive">Emergency contact name is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency_phone">Emergency Contact Phone *</Label>
            <Input id="emergency_phone" {...register('emergency_phone', { required: true })} data-testid="input-emergency_phone" />
            {errors.emergency_phone && <p className="text-sm text-destructive">Emergency contact phone is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency_relationship">Relationship to Learner</Label>
            <Select
              value={watch('emergency_relationship') || ''}
              onValueChange={(value) => setValue('emergency_relationship', value)}
            >
              <SelectTrigger id="emergency_relationship" data-testid="select-emergency_relationship">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mother">Mother</SelectItem>
                <SelectItem value="Father">Father</SelectItem>
                <SelectItem value="Guardian">Guardian</SelectItem>
                <SelectItem value="Grandmother">Grandmother</SelectItem>
                <SelectItem value="Grandfather">Grandfather</SelectItem>
                <SelectItem value="Aunt">Aunt</SelectItem>
                <SelectItem value="Uncle">Uncle</SelectItem>
                <SelectItem value="Sibling">Sibling</SelectItem>
                <SelectItem value="Other Relative">Other Relative</SelectItem>
                <SelectItem value="Family Friend">Family Friend</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Medical History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Medical History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="medical_allergies">Known Allergies</Label>
            <Textarea id="medical_allergies" {...register('medical_allergies')} rows={2} placeholder="List any allergies (food, medication, environmental)" data-testid="textarea-medical_allergies" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medical_conditions">Chronic Medical Conditions</Label>
            <Textarea id="medical_conditions" {...register('medical_conditions')} rows={2} placeholder="List any chronic conditions" data-testid="textarea-medical_conditions" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_medication">Current Medication</Label>
            <Textarea id="current_medication" {...register('current_medication')} rows={2} placeholder="List any medication currently being taken" data-testid="textarea-current_medication" />
          </div>
        </CardContent>
      </Card>

      {/* Specific Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Specific Medical Conditions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="med_asthma">Asthma</Label>
            <Select
              value={watch('med_asthma') || ''}
              onValueChange={(value) => setValue('med_asthma', value)}
            >
              <SelectTrigger id="med_asthma" data-testid="select-med_asthma">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="med_epilepsy">Epilepsy</Label>
            <Select
              value={watch('med_epilepsy') || ''}
              onValueChange={(value) => setValue('med_epilepsy', value)}
            >
              <SelectTrigger id="med_epilepsy" data-testid="select-med_epilepsy">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="med_diabetes">Diabetes</Label>
            <Select
              value={watch('med_diabetes') || ''}
              onValueChange={(value) => setValue('med_diabetes', value)}
            >
              <SelectTrigger id="med_diabetes" data-testid="select-med_diabetes">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Disability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Disability & Special Needs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="has_disability">Does the Learner Have a Disability?</Label>
            <Select
              value={hasDisability || ''}
              onValueChange={(value) => setValue('has_disability', value)}
            >
              <SelectTrigger id="has_disability" data-testid="select-has_disability">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasDisability === 'Yes' && (
            <div className="space-y-2 p-4 bg-muted/30 rounded-lg border">
              <Label htmlFor="disability_details">Please Provide Details</Label>
              <Textarea id="disability_details" {...register('disability_details')} rows={3} placeholder="Describe the disability and any special accommodations needed" data-testid="textarea-disability_details" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support Needs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Support & Permissions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="needs_counselling">Needs Counselling Support?</Label>
            <Select
              value={watch('needs_counselling') || ''}
              onValueChange={(value) => setValue('needs_counselling', value)}
            >
              <SelectTrigger id="needs_counselling" data-testid="select-needs_counselling">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sports_allowed">Allowed to Participate in Sports?</Label>
            <Select
              value={watch('sports_allowed') || ''}
              onValueChange={(value) => setValue('sports_allowed', value)}
            >
              <SelectTrigger id="sports_allowed" data-testid="select-sports_allowed">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Limited">Limited (medical restrictions)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="allow_emergency_treatment">Allow Emergency Medical Treatment?</Label>
            <Select
              value={watch('allow_emergency_treatment') || ''}
              onValueChange={(value) => setValue('allow_emergency_treatment', value)}
            >
              <SelectTrigger id="allow_emergency_treatment" data-testid="select-allow_emergency_treatment">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes - Allow emergency treatment in case of accident or illness</SelectItem>
                <SelectItem value="No">No - Contact guardian first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}