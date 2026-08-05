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
  const gradeApplying = watch('gradeApplying');
  const hasDisciplineHistory = watch('hasDisciplineHistory');
  const hasTeacherRelative = watch('hasTeacherRelative');

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
            <Label htmlFor="preferredStartYear">Preferred Start Year</Label>
            <Input id="preferredStartYear" type="number" placeholder="2027" {...register('preferredStartYear', { valueAsNumber: true })} data-testid="input-preferredStartYear" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gradeApplying">Grade Applying For *</Label>
            <Select
              value={gradeApplying}
              onValueChange={(value) => setValue('gradeApplying', value)}
            >
              <SelectTrigger id="gradeApplying" data-testid="select-gradeApplying">
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
            {errors.gradeApplying && <p className="text-sm text-destructive">Grade is required</p>}
          </div>

          {gradeApplying && parseInt(gradeApplying) >= 10 && (
            <div className="space-y-2">
              <Label htmlFor="chosenStream">Chosen Stream (Grade 10-12)</Label>
              <Select
                value={watch('chosenStream') || ''}
                onValueChange={(value) => setValue('chosenStream', value)}
              >
                <SelectTrigger id="chosenStream" data-testid="select-chosenStream">
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
            <Label htmlFor="gradePassed">Highest Grade Passed</Label>
            <Input id="gradePassed" {...register('gradePassed')} data-testid="input-gradePassed" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearPassedHighest">Year Passed Highest Grade</Label>
            <Input id="yearPassedHighest" type="number" {...register('yearPassedHighest', { valueAsNumber: true })} data-testid="input-yearPassedHighest" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentGrade">Current Grade</Label>
            <Input id="currentGrade" {...register('currentGrade')} data-testid="input-currentGrade" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentAcademicYear">Current Academic Year</Label>
            <Input id="currentAcademicYear" type="number" {...register('currentAcademicYear', { valueAsNumber: true })} data-testid="input-currentAcademicYear" />
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
            <Label htmlFor="prevSchoolName">Previous School Name *</Label>
            <Input id="prevSchoolName" {...register('prevSchoolName', { required: true })} data-testid="input-prevSchoolName" />
            {errors.prevSchoolName && <p className="text-sm text-destructive">Previous school name is required</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prevSchoolAddress">Previous School Address</Label>
              <Input id="prevSchoolAddress" {...register('prevSchoolAddress')} data-testid="input-prevSchoolAddress" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prevSchoolPhone">Previous School Phone</Label>
              <Input id="prevSchoolPhone" {...register('prevSchoolPhone')} data-testid="input-prevSchoolPhone" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reasonLeaving">Reason for Leaving</Label>
            <Textarea id="reasonLeaving" {...register('reasonLeaving')} rows={2} data-testid="textarea-reasonLeaving" />
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
            <Label htmlFor="averagePercentage">Average Percentage</Label>
            <Input id="averagePercentage" {...register('averagePercentage')} data-testid="input-averagePercentage" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numSubjectsPassed">Number of Subjects Passed</Label>
            <Input id="numSubjectsPassed" type="number" {...register('numSubjectsPassed', { valueAsNumber: true })} data-testid="input-numSubjectsPassed" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bestSubject">Best Subject</Label>
            <Input id="bestSubject" {...register('bestSubject')} data-testid="input-bestSubject" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weakestSubject">Weakest Subject</Label>
            <Input id="weakestSubject" {...register('weakestSubject')} data-testid="input-weakestSubject" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="optionalSubject">Optional Subject Interest</Label>
            <Input id="optionalSubject" {...register('optionalSubject')} data-testid="input-optionalSubject" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="needsSupport">Needs Academic Support?</Label>
            <Select
              value={watch('needsSupport') || ''}
              onValueChange={(value) => setValue('needsSupport', value)}
            >
              <SelectTrigger id="needsSupport" data-testid="select-needsSupport">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="needsExtraLessons">Subjects Needing Extra Lessons</Label>
            <Input id="needsExtraLessons" {...register('needsExtraLessons')} placeholder="e.g., Mathematics, Science" data-testid="input-needsExtraLessons" />
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
            <Label htmlFor="sportsParticipation">Sports Participation</Label>
            <Textarea id="sportsParticipation" {...register('sportsParticipation')} rows={2} placeholder="List sports and teams" data-testid="textarea-sportsParticipation" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="leadershipRoles">Leadership Roles</Label>
            <Textarea id="leadershipRoles" {...register('leadershipRoles')} rows={2} placeholder="Prefect, class representative, club leader, etc." data-testid="textarea-leadershipRoles" />
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
            <Label htmlFor="hasDisciplineHistory">Any Disciplinary Issues?</Label>
            <Select
              value={hasDisciplineHistory || ''}
              onValueChange={(value) => setValue('hasDisciplineHistory', value)}
            >
              <SelectTrigger id="hasDisciplineHistory" data-testid="select-hasDisciplineHistory">
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
              <Label htmlFor="disciplineDetails">Please Provide Details</Label>
              <Textarea id="disciplineDetails" {...register('disciplineDetails')} rows={3} data-testid="textarea-disciplineDetails" />
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
            <Label htmlFor="motivationToJoin">Motivation for Applying *</Label>
            <Textarea id="motivationToJoin" {...register('motivationToJoin', { required: true })} rows={4} placeholder="Tell us why you want to join Hoye Secondary School" data-testid="textarea-motivationToJoin" />
            {errors.motivationToJoin && <p className="text-sm text-destructive">This field is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="referralSource">How Did You Hear About Us? *</Label>
            <Select
              value={watch('referralSource')}
              onValueChange={(value) => setValue('referralSource', value)}
            >
              <SelectTrigger id="referralSource" data-testid="select-referralSource">
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
            {errors.referralSource && <p className="text-sm text-destructive">This field is required</p>}
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
            <Label htmlFor="hasTeacherRelative">Do You Have a Relative Teaching at Hoye?</Label>
            <Select
              value={hasTeacherRelative || ''}
              onValueChange={(value) => setValue('hasTeacherRelative', value)}
            >
              <SelectTrigger id="hasTeacherRelative" data-testid="select-hasTeacherRelative">
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
                <Label htmlFor="teacherName">Teacher First Name</Label>
                <Input id="teacherName" {...register('teacherName')} data-testid="input-teacherName" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacherSurname">Teacher Surname</Label>
                <Input id="teacherSurname" {...register('teacherSurname')} data-testid="input-teacherSurname" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacherPhone">Teacher Phone</Label>
                <Input id="teacherPhone" {...register('teacherPhone')} data-testid="input-teacherPhone" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacherRelationship">Relationship to Teacher</Label>
                <Input id="teacherRelationship" {...register('teacherRelationship')} placeholder="e.g., aunt, uncle, cousin" data-testid="input-teacherRelationship" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
