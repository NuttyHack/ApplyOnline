import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Step1Props {
  form: UseFormReturn<any>;
}

export function Step1LearnerInfo({ form }: Step1Props) {
  const { register, watch, setValue, formState: { errors } } = form;
  const siblingsAtSchool = watch('siblings_at_school');

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
            <Label htmlFor="first_name">First Name *</Label>
            <Input id="first_name" {...register('first_name', { required: true })} data-testid="input-first_name" />
            {errors.first_name && <p className="text-sm text-destructive">First name is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input id="last_name" {...register('last_name', { required: true })} data-testid="input-last_name" />
            {errors.last_name && <p className="text-sm text-destructive">Last name is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="middle_name">Middle Name</Label>
            <Input id="middle_name" {...register('middle_name')} data-testid="input-middle_name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred_name">Preferred Name</Label>
            <Input id="preferred_name" {...register('preferred_name')} data-testid="input-preferred_name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="id_number">ID Number *</Label>
            <Input id="id_number" {...register('id_number', { required: true })} data-testid="input-id_number" />
            {errors.id_number && <p className="text-sm text-destructive">ID number is required</p>}
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
              onValueChange={(value) => setValue('gender', value)}
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
            <Label htmlFor="country_of_birth">Country of Birth</Label>
            <Input id="country_of_birth" {...register('country_of_birth')} data-testid="input-country_of_birth" />
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
            <Label htmlFor="home_language">Home Language *</Label>
            <Input id="home_language" {...register('home_language', { required: true })} data-testid="input-home_language" />
            {errors.home_language && <p className="text-sm text-destructive">Home language is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="second_language">Second Language</Label>
            <Input id="second_language" {...register('second_language')} data-testid="input-second_language" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="learning_language">Language of Learning</Label>
            <Select
              value={watch('learning_language') || ''}
              onValueChange={(value) => setValue('learning_language', value)}
            >
              <SelectTrigger id="learning_language" data-testid="select-learning_language">
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
            <Label htmlFor="mobile_number">Mobile Number</Label>
            <Input id="mobile_number" {...register('mobile_number')} data-testid="input-mobile_number" />
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
            <Label htmlFor="residential_address">Address *</Label>
            <Textarea id="residential_address" {...register('residential_address', { required: true })} rows={3} data-testid="textarea-residential_address" />
            {errors.residential_address && <p className="text-sm text-destructive">Residential address is required</p>}
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
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input id="postal_code" {...register('postal_code')} data-testid="input-postal_code" />
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
            <Label htmlFor="lives_with">Lives With</Label>
            <Select
              value={watch('lives_with') || ''}
              onValueChange={(value) => setValue('lives_with', value)}
            >
              <SelectTrigger id="lives_with" data-testid="select-lives_with">
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
            <Label htmlFor="total_siblings">Total Number of Siblings</Label>
            <Input id="total_siblings" type="number" {...register('total_siblings', { valueAsNumber: true })} data-testid="input-total_siblings" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="family_position">Position in Family</Label>
            <Select
              value={watch('family_position') || ''}
              onValueChange={(value) => setValue('family_position', value)}
            >
              <SelectTrigger id="family_position" data-testid="select-family_position">
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
            <Label htmlFor="siblings_at_school">Any Siblings at Hoye?</Label>
            <Select
              value={siblingsAtSchool || ''}
              onValueChange={(value) => setValue('siblings_at_school', value)}
            >
              <SelectTrigger id="siblings_at_school" data-testid="select-siblings_at_school">
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