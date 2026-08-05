import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ApplicationInput } from '@workspace/api-client-react';

interface Step1Props {
  form: UseFormReturn<ApplicationInput>;
}

export function Step1LearnerInfo({ form }: Step1Props) {
  const { register, watch, setValue, formState: { errors } } = form;
  const siblingsAtSchool = watch('siblingsAtSchool');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-step-title">Step 1: Learner Information</h2>
        <p className="text-muted-foreground">Please provide the learner's personal details and contact information</p>
      </div>

      {/* Identity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Identity</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input id="firstName" {...register('firstName', { required: true })} data-testid="input-firstName" />
            {errors.firstName && <p className="text-sm text-destructive">First name is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input id="lastName" {...register('lastName', { required: true })} data-testid="input-lastName" />
            {errors.lastName && <p className="text-sm text-destructive">Last name is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="middleName">Middle Name</Label>
            <Input id="middleName" {...register('middleName')} data-testid="input-middleName" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredName">Preferred Name</Label>
            <Input id="preferredName" {...register('preferredName')} data-testid="input-preferredName" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idNumber">ID Number *</Label>
            <Input id="idNumber" {...register('idNumber', { required: true })} data-testid="input-idNumber" />
            {errors.idNumber && <p className="text-sm text-destructive">ID number is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthCertNumber">Birth Certificate Number</Label>
            <Input id="birthCertNumber" {...register('birthCertNumber')} data-testid="input-birthCertNumber" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input id="dob" type="date" {...register('dob', { required: true })} data-testid="input-dob" />
            {errors.dob && <p className="text-sm text-destructive">Date of birth is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" {...register('age', { valueAsNumber: true })} data-testid="input-age" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select
              value={watch('gender')}
              onValueChange={(value) => setValue('gender', value as 'Male' | 'Female')}
            >
              <SelectTrigger id="gender" data-testid="select-gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-sm text-destructive">Gender is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality *</Label>
            <Input id="nationality" {...register('nationality', { required: true })} data-testid="input-nationality" />
            {errors.nationality && <p className="text-sm text-destructive">Nationality is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="citizenship">Citizenship</Label>
            <Input id="citizenship" {...register('citizenship')} data-testid="input-citizenship" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="countryOfBirth">Country of Birth</Label>
            <Input id="countryOfBirth" {...register('countryOfBirth')} data-testid="input-countryOfBirth" />
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Language & Religion</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="homeLanguage">Home Language *</Label>
            <Input id="homeLanguage" {...register('homeLanguage', { required: true })} data-testid="input-homeLanguage" />
            {errors.homeLanguage && <p className="text-sm text-destructive">Home language is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondLanguage">Second Language</Label>
            <Input id="secondLanguage" {...register('secondLanguage')} data-testid="input-secondLanguage" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="learningLanguage">Language of Learning</Label>
            <Select
              value={watch('learningLanguage') || ''}
              onValueChange={(value) => setValue('learningLanguage', value)}
            >
              <SelectTrigger id="learningLanguage" data-testid="select-learningLanguage">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Xitsonga">Xitsonga</SelectItem>
                <SelectItem value="isiZulu">isiZulu</SelectItem>
                <SelectItem value="Sesotho">Sesotho</SelectItem>
                <SelectItem value="Shona">Shona</SelectItem>
                <SelectItem value="Ndebele">Ndebele</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="religion">Religion</Label>
            <Input id="religion" {...register('religion')} data-testid="input-religion" />
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <Input id="mobileNumber" {...register('mobileNumber')} data-testid="input-mobileNumber" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" {...register('email')} data-testid="input-email" />
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Residential Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="residentialAddress">Address *</Label>
            <Textarea id="residentialAddress" {...register('residentialAddress', { required: true })} rows={3} data-testid="textarea-residentialAddress" />
            {errors.residentialAddress && <p className="text-sm text-destructive">Residential address is required</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" {...register('city', { required: true })} data-testid="input-city" />
              {errors.city && <p className="text-sm text-destructive">City is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Province *</Label>
              <Input id="province" {...register('province', { required: true })} data-testid="input-province" />
              {errors.province && <p className="text-sm text-destructive">Province is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" {...register('postalCode')} data-testid="input-postalCode" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input id="country" {...register('country', { required: true })} data-testid="input-country" />
              {errors.country && <p className="text-sm text-destructive">Country is required</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Family Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="livesWith">Lives With</Label>
            <Select
              value={watch('livesWith') || ''}
              onValueChange={(value) => setValue('livesWith', value)}
            >
              <SelectTrigger id="livesWith" data-testid="select-livesWith">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mother">Mother</SelectItem>
                <SelectItem value="Father">Father</SelectItem>
                <SelectItem value="Both Parents">Both Parents</SelectItem>
                <SelectItem value="Guardian">Guardian</SelectItem>
                <SelectItem value="Relative">Relative</SelectItem>
                <SelectItem value="Boarding">Boarding</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalSiblings">Total Number of Siblings</Label>
            <Input id="totalSiblings" type="number" {...register('totalSiblings', { valueAsNumber: true })} data-testid="input-totalSiblings" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="familyPosition">Position in Family</Label>
            <Select
              value={watch('familyPosition') || ''}
              onValueChange={(value) => setValue('familyPosition', value)}
            >
              <SelectTrigger id="familyPosition" data-testid="select-familyPosition">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="First Born">First Born</SelectItem>
                <SelectItem value="Middle Child">Middle Child</SelectItem>
                <SelectItem value="Youngest">Youngest</SelectItem>
                <SelectItem value="Only Child">Only Child</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="siblingsAtSchool">Any Siblings at Hoye?</Label>
            <Select
              value={siblingsAtSchool || ''}
              onValueChange={(value) => setValue('siblingsAtSchool', value)}
            >
              <SelectTrigger id="siblingsAtSchool" data-testid="select-siblingsAtSchool">
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
    </div>
  );
}
