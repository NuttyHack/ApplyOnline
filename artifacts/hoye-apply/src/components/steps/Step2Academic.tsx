import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ApplicationInput } from '@workspace/api-client-react';

interface Step2Props {
  form: UseFormReturn<ApplicationInput>;
}

export function Step2Academic({ form }: Step2Props) {
  const { register, watch, setValue, formState: { errors } } = form;
  const gradeApplying = watch('grade_applying');
  const hasDisciplineHistory = watch('has_discipline_history');
  const hasTeacherRelative = watch('has_teacher_relative');

  const getSubjectsForGrade = (grade: string) => {
    const gradeNum = parseInt(grade);
    if (gradeNum <= 9) {
      return ['English', 'Mathematics', 'Natural Sciences', 'Social Sciences', 'Life Orientation', 'Technology', 'Economic Management Sciences', 'Creative Arts', 'Additional Language'];
    }
    return ['Core subjects based on stream selection'];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-step-title">Step 2: Academic Details</h2>
        <p className="text-muted-foreground">Please provide information about your academic history and achievements</p>
      </div>

      {/* Admission Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Admission Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="preferred_start_year">Preferred Start Year</Label>
            <Input id="preferred_start_year" type="number" placeholder="2027" {...register('preferred_start_year', { valueAsNumber: true })} data-testid="input-preferred_start_year" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade_applying">Grade Applying For *</Label>
            <Select
              value={gradeApplying}
              onValueChange={(value) => setValue('grade_applying', value)}
            >
              <SelectTrigger id="grade_applying" data-testid="select-grade_applying">
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">Grade 8</SelectItem>
                <SelectItem value="9">Grade 9</SelectItem>
                <SelectItem value="10">Grade 10</SelectItem>
                <SelectItem value="11">Grade 11</SelectItem>
                <SelectItem value="12">Grade 12</SelectItem>
              </SelectContent>
            </Select>
            {errors.grade_applying && <p className="text-sm text-destructive">Grade is required</p>}
          </div>

          {gradeApplying && parseInt(gradeApplying) >= 10 && (
            <div className="space-y-2">
              <Label htmlFor="chosen_stream">Chosen Stream (Grade 10-12)</Label>
              <Select
                value={watch('chosen_stream') || ''}
                onValueChange={(value) => setValue('chosen_stream', value)}
              >
                <SelectTrigger id="chosen_stream" data-testid="select-chosen_stream">
                  <SelectValue placeholder="Select stream" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Physics">Physics Stream (Sciences)</SelectItem>
                  <SelectItem value="History">History Stream (Humanities)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="grade_passed">Highest Grade Passed</Label>
            <Input id="grade_passed" {...register('grade_passed')} data-testid="input-grade_passed" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year_passed_highest">Year Passed Highest Grade</Label>
            <Input id="year_passed_highest" type="number" {...register('year_passed_highest', { valueAsNumber: true })} data-testid="input-year_passed_highest" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_grade">Current Grade</Label>
            <Input id="current_grade" {...register('current_grade')} data-testid="input-current_grade" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_academic_year">Current Academic Year</Label>
            <Input id="current_academic_year" type="number" {...register('current_academic_year', { valueAsNumber: true })} data-testid="input-current_academic_year" />
          </div>
        </CardContent>
      </Card>

      {/* Subject Info */}
      {gradeApplying && (
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">Subjects for Grade {gradeApplying}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {getSubjectsForGrade(gradeApplying).map((subject) => (
                <li key={subject}>{subject}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Previous School */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Previous School Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prev_school_name">Previous School Name *</Label>
            <Input id="prev_school_name" {...register('prev_school_name', { required: true })} data-testid="input-prev_school_name" />
            {errors.prev_school_name && <p className="text-sm text-destructive">Previous school name is required</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prev_school_address">Previous School Address</Label>
              <Input id="prev_school_address" {...register('prev_school_address')} data-testid="input-prev_school_address" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prev_school_phone">Previous School Phone</Label>
              <Input id="prev_school_phone" {...register('prev_school_phone')} data-testid="input-prev_school_phone" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason_leaving">Reason for Leaving</Label>
            <Textarea id="reason_leaving" {...register('reason_leaving')} rows={2} data-testid="textarea-reason_leaving" />
          </div>
        </CardContent>
      </Card>

      {/* Academic Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Academic Performance</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="average_percentage">Average Percentage</Label>
            <Input id="average_percentage" {...register('average_percentage')} data-testid="input-average_percentage" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="num_subjects_passed">Number of Subjects Passed</Label>
            <Input id="num_subjects_passed" type="number" {...register('num_subjects_passed', { valueAsNumber: true })} data-testid="input-num_subjects_passed" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="best_subject">Best Subject</Label>
            <Input id="best_subject" {...register('best_subject')} data-testid="input-best_subject" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weakest_subject">Weakest Subject</Label>
            <Input id="weakest_subject" {...register('weakest_subject')} data-testid="input-weakest_subject" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="optional_subject">Optional Subject Interest</Label>
            <Input id="optional_subject" {...register('optional_subject')} data-testid="input-optional_subject" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="needs_support">Needs Academic Support?</Label>
            <Select
              value={watch('needs_support') || ''}
              onValueChange={(value) => setValue('needs_support', value)}
            >
              <SelectTrigger id="needs_support" data-testid="select-needs_support">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="needs_extra_lessons">Subjects Needing Extra Lessons</Label>
            <Input id="needs_extra_lessons" {...register('needs_extra_lessons')} placeholder="e.g., Mathematics, Science" data-testid="input-needs_extra_lessons" />
          </div>
        </CardContent>
      </Card>

      {/* Extracurricular */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activities & Achievements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="achievements">Academic Achievements</Label>
            <Textarea id="achievements" {...register('achievements')} rows={2} placeholder="List any awards, certificates, or notable achievements" data-testid="textarea-achievements" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sports_participation">Sports Participation</Label>
            <Textarea id="sports_participation" {...register('sports_participation')} rows={2} placeholder="List sports and teams" data-testid="textarea-sports_participation" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="leadership_roles">Leadership Roles</Label>
            <Textarea id="leadership_roles" {...register('leadership_roles')} rows={2} placeholder="Prefect, class representative, club leader, etc." data-testid="textarea-leadership_roles" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="extracurricular">Other Extracurricular Activities</Label>
            <Textarea id="extracurricular" {...register('extracurricular')} rows={2} placeholder="Clubs, music, drama, community service, etc." data-testid="textarea-extracurricular" />
          </div>
        </CardContent>
      </Card>

      {/* Discipline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Discipline History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="has_discipline_history">Any Disciplinary Issues?</Label>
            <Select
              value={hasDisciplineHistory || ''}
              onValueChange={(value) => setValue('has_discipline_history', value)}
            >
              <SelectTrigger id="has_discipline_history" data-testid="select-has_discipline_history">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasDisciplineHistory === 'Yes' && (
            <div className="space-y-2">
              <Label htmlFor="discipline_details">Please Provide Details</Label>
              <Textarea id="discipline_details" {...register('discipline_details')} rows={3} data-testid="textarea-discipline_details" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* School Choice */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Why Hoye Secondary School?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="motivation_to_join">Motivation for Applying *</Label>
            <Textarea id="motivation_to_join" {...register('motivation_to_join', { required: true })} rows={4} placeholder="Tell us why you want to join Hoye Secondary School" data-testid="textarea-motivation_to_join" />
            {errors.motivation_to_join && <p className="text-sm text-destructive">This field is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="referral_source">How Did You Hear About Us? *</Label>
            <Select
              value={watch('referral_source')}
              onValueChange={(value) => setValue('referral_source', value)}
            >
              <SelectTrigger id="referral_source" data-testid="select-referral_source">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="Google Search">Google Search</SelectItem>
                <SelectItem value="School Website">School Website</SelectItem>
                <SelectItem value="Teacher Recommendation">Teacher Recommendation</SelectItem>
                <SelectItem value="Parent or Guardian">Parent or Guardian</SelectItem>
                <SelectItem value="Friend">Friend</SelectItem>
                <SelectItem value="Sibling at School">Sibling at School</SelectItem>
                <SelectItem value="Former Student">Former Student</SelectItem>
                <SelectItem value="Community Member">Community Member</SelectItem>
                <SelectItem value="Church">Church</SelectItem>
                <SelectItem value="Radio">Radio</SelectItem>
                <SelectItem value="Flyer Poster">Flyer or Poster</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.referral_source && <p className="text-sm text-destructive">This field is required</p>}
          </div>
        </CardContent>
      </Card>

      {/* Teacher Relative */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Teacher Connection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="has_teacher_relative">Do You Have a Relative Teaching at Hoye?</Label>
            <Select
              value={hasTeacherRelative || ''}
              onValueChange={(value) => setValue('has_teacher_relative', value)}
            >
              <SelectTrigger id="has_teacher_relative" data-testid="select-has_teacher_relative">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasTeacherRelative === 'Yes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teacher_name">Teacher First Name</Label>
                <Input id="teacher_name" {...register('teacher_name')} data-testid="input-teacher_name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher_surname">Teacher Surname</Label>
                <Input id="teacher_surname" {...register('teacher_surname')} data-testid="input-teacher_surname" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher_phone">Teacher Phone</Label>
                <Input id="teacher_phone" {...register('teacher_phone')} data-testid="input-teacher_phone" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher_relationship">Relationship to Teacher</Label>
                <Input id="teacher_relationship" {...register('teacher_relationship')} placeholder="e.g., aunt, uncle, cousin" data-testid="input-teacher_relationship" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}