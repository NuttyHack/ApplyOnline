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
  const hasMedicalAid = watch('hasMedicalAid');
  const hasFamilyDoctor = watch('hasFamilyDoctor');
  const hasDisability = watch('hasDisability');

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
            <Label htmlFor="hasMedicalAid">Do You Have Medical Aid?</Label>
            <Select
              value={hasMedicalAid || ''}
              onValueChange={(value) => setValue('hasMedicalAid', value)}
            >
              <SelectTrigger id="hasMedicalAid" data-testid="select-hasMedicalAid">
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
                <Label htmlFor="medAidProvider">Medical Aid Provider</Label>
                <Input id="medAidProvider" {...register('medAidProvider')} placeholder="e.g., Discovery, Bonitas" data-testid="input-medAidProvider" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medAidNumber">Medical Aid Number</Label>
                <Input id="medAidNumber" {...register('medAidNumber')} data-testid="input-medAidNumber" />
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
            <Label htmlFor="hasFamilyDoctor">Do You Have a Family Doctor?</Label>
            <Select
              value={hasFamilyDoctor || ''}
              onValueChange={(value) => setValue('hasFamilyDoctor', value)}
            >
              <SelectTrigger id="hasFamilyDoctor" data-testid="select-hasFamilyDoctor">
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
                <Label htmlFor="doctorName">Doctor Name</Label>
                <Input id="doctorName" {...register('doctorName')} data-testid="input-doctorName" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctorPhone">Doctor Phone Number</Label>
                <Input id="doctorPhone" {...register('doctorPhone')} data-testid="input-doctorPhone" />
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
            <Label htmlFor="emergencyName">Emergency Contact Name *</Label>
            <Input id="emergencyName" {...register('emergencyName', { required: true })} data-testid="input-emergencyName" />
            {errors.emergencyName && <p className="text-sm text-destructive">Emergency contact name is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
            <Input id="emergencyPhone" {...register('emergencyPhone', { required: true })} data-testid="input-emergencyPhone" />
            {errors.emergencyPhone && <p className="text-sm text-destructive">Emergency contact phone is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyRelationship">Relationship to Learner</Label>
            <Select
              value={watch('emergencyRelationship') || ''}
              onValueChange={(value) => setValue('emergencyRelationship', value)}
            >
              <SelectTrigger id="emergencyRelationship" data-testid="select-emergencyRelationship">
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
            <Label htmlFor="medicalAllergies">Known Allergies</Label>
            <Textarea id="medicalAllergies" {...register('medicalAllergies')} rows={2} placeholder="List any allergies (food, medication, environmental)" data-testid="textarea-medicalAllergies" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalConditions">Chronic Medical Conditions</Label>
            <Textarea id="medicalConditions" {...register('medicalConditions')} rows={2} placeholder="List any chronic conditions" data-testid="textarea-medicalConditions" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentMedication">Current Medication</Label>
            <Textarea id="currentMedication" {...register('currentMedication')} rows={2} placeholder="List any medication currently being taken" data-testid="textarea-currentMedication" />
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
            <Label htmlFor="medAsthma">Asthma</Label>
            <Select
              value={watch('medAsthma') || ''}
              onValueChange={(value) => setValue('medAsthma', value)}
            >
              <SelectTrigger id="medAsthma" data-testid="select-medAsthma">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medEpilepsy">Epilepsy</Label>
            <Select
              value={watch('medEpilepsy') || ''}
              onValueChange={(value) => setValue('medEpilepsy', value)}
            >
              <SelectTrigger id="medEpilepsy" data-testid="select-medEpilepsy">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medDiabetes">Diabetes</Label>
            <Select
              value={watch('medDiabetes') || ''}
              onValueChange={(value) => setValue('medDiabetes', value)}
            >
              <SelectTrigger id="medDiabetes" data-testid="select-medDiabetes">
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
            <Label htmlFor="hasDisability">Does the Learner Have a Disability?</Label>
            <Select
              value={hasDisability || ''}
              onValueChange={(value) => setValue('hasDisability', value)}
            >
              <SelectTrigger id="hasDisability" data-testid="select-hasDisability">
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
              <Label htmlFor="disabilityDetails">Please Provide Details</Label>
              <Textarea id="disabilityDetails" {...register('disabilityDetails')} rows={3} placeholder="Describe the disability and any special accommodations needed" data-testid="textarea-disabilityDetails" />
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
            <Label htmlFor="needsCounselling">Needs Counselling Support?</Label>
            <Select
              value={watch('needsCounselling') || ''}
              onValueChange={(value) => setValue('needsCounselling', value)}
            >
              <SelectTrigger id="needsCounselling" data-testid="select-needsCounselling">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sportsAllowed">Allowed to Participate in Sports?</Label>
            <Select
              value={watch('sportsAllowed') || ''}
              onValueChange={(value) => setValue('sportsAllowed', value)}
            >
              <SelectTrigger id="sportsAllowed" data-testid="select-sportsAllowed">
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
            <Label htmlFor="allowEmergencyTreatment">Allow Emergency Medical Treatment?</Label>
            <Select
              value={watch('allowEmergencyTreatment') || ''}
              onValueChange={(value) => setValue('allowEmergencyTreatment', value)}
            >
              <SelectTrigger id="allowEmergencyTreatment" data-testid="select-allowEmergencyTreatment">
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
