import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, ArrowRight, CheckCircle2, Loader2, School } from 'lucide-react';
import { StepIndicator } from '@/components/StepIndicator';
import { SuccessModal } from '@/components/SuccessModal';
import type { ApplicationInput } from '@workspace/api-client-react';
import { Step1LearnerInfo } from '@/components/steps/Step1LearnerInfo';
import { Step2Academic } from '@/components/steps/Step2Academic';
import { Step3Medical } from '@/components/steps/Step3Medical';
import { Step4Guardian } from '@/components/steps/Step4Guardian';
import { Step5Submit } from '@/components/steps/Step5Submit';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExtractedData } from '@/lib/document-parser';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type ApplyProps = {
  extractedData?: ExtractedData | null;
  initialStep?: number | null;
  onExtractConsumed?: () => void;
};

const steps = [
  { number: 1, title: 'Learner Information' },
  { number: 2, title: 'Academic Details' },
  { number: 3, title: 'Medical & Support' },
  { number: 4, title: 'Parent/Guardian' },
  { number: 5, title: 'Submit & Declaration' },
];

export default function Apply({ extractedData, initialStep, onExtractConsumed }: ApplyProps = {}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSkavsNotice, setShowSkavsNotice] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ refNumber: string; message: string } | null>(null);

  const form = useForm<ApplicationInput>({
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      preferredName: '',
      idNumber: '',
      birthCertNumber: '',
      dob: '',
      age: undefined,
      gender: 'Male',
      nationality: '',
      citizenship: '',
      countryOfBirth: '',
      homeLanguage: '',
      secondLanguage: '',
      learningLanguage: '',
      religion: '',
      mobileNumber: '',
      email: '',
      residentialAddress: '',
      city: '',
      province: '',
      postalCode: '',
      country: '',
      livesWith: '',
      totalSiblings: undefined,
      familyPosition: '',
      siblingsAtSchool: '',
      preferredStartYear: 2027,
      gradePassed: '',
      yearPassedHighest: undefined,
      currentGrade: '',
      currentAcademicYear: undefined,
      prevSchoolName: '',
      prevSchoolAddress: '',
      prevSchoolPhone: '',
      reasonLeaving: '',
      averagePercentage: '',
      bestSubject: '',
      weakestSubject: '',
      numSubjectsPassed: undefined,
      gradeApplying: '',
      chosenStream: '',
      optionalSubject: '',
      needsSupport: '',
      needsExtraLessons: '',
      achievements: '',
      sportsParticipation: '',
      leadershipRoles: '',
      extracurricular: '',
      hasDisciplineHistory: '',
      disciplineDetails: '',
      motivationToJoin: '',
      referralSource: '',
      hasTeacherRelative: '',
      teacherName: '',
      teacherSurname: '',
      teacherPhone: '',
      teacherRelationship: '',
      hasMedicalAid: '',
      medAidProvider: '',
      medAidNumber: '',
      hasFamilyDoctor: '',
      doctorName: '',
      doctorPhone: '',
      emergencyName: '',
      emergencyPhone: '',
      emergencyRelationship: '',
      medicalAllergies: '',
      medicalConditions: '',
      currentMedication: '',
      medAsthma: '',
      medEpilepsy: '',
      medDiabetes: '',
      hasDisability: '',
      disabilityDetails: '',
      needsCounselling: '',
      sportsAllowed: '',
      allowEmergencyTreatment: '',
      guardianFirstName: '',
      guardianLastName: '',
      guardianId: '',
      guardianRelationship: '',
      guardianMaritalStatus: '',
      guardianPhone: '',
      guardianAltPhone: '',
      guardianWhatsapp: '',
      guardianEmail: '',
      guardianEmploymentStatus: '',
      guardianOccupation: '',
      guardianEmployer: '',
      guardianIncomeRange: '',
      guardianHomeAddress: '',
      preferredCommunication: '',
      hasSecondGuardian: '',
      guardian2Name: '',
      guardian2Phone: '',
      permissionPhotos: '',
      confirmTruth: '',
      agreePolicies: '',
      digitalSignature: '',
      submissionDate: new Date().toISOString().split('T')[0],
      additionalNotes: '',
    },
  });

  useEffect(() => {
    if (!extractedData) return;
    const fieldMap: Partial<Record<keyof ApplicationInput, string | undefined>> = {
      firstName: extractedData.firstName,
      lastName: extractedData.lastName,
      middleName: extractedData.middleName,
      idNumber: extractedData.idNumber,
      dob: extractedData.dob,
      gender: extractedData.gender as string | undefined,
      nationality: extractedData.nationality,
      citizenship: extractedData.citizenship,
      mobileNumber: extractedData.mobileNumber,
      email: extractedData.email,
      province: extractedData.province,
      postalCode: extractedData.postalCode,
      prevSchoolName: extractedData.prevSchoolName,
      gradePassed: extractedData.gradePassed,
      averagePercentage: extractedData.averagePercentage,
    };
    (Object.entries(fieldMap) as [keyof ApplicationInput, string | undefined][]).forEach(([k, v]) => {
      if (v !== undefined) form.setValue(k, v as never, { shouldDirty: true });
    });
    if (initialStep) setCurrentStep(initialStep);
    setShowSkavsNotice(true);
    onExtractConsumed?.();
  }, [extractedData]);

  const handleNext = async () => {
    let fieldsToValidate: (keyof ApplicationInput)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['firstName', 'lastName', 'idNumber', 'dob', 'gender', 'nationality', 'homeLanguage', 'residentialAddress', 'city', 'province', 'country'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['prevSchoolName', 'gradeApplying', 'motivationToJoin', 'referralSource'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['emergencyName', 'emergencyPhone'];
    } else if (currentStep === 4) {
      fieldsToValidate = ['guardianFirstName', 'guardianLastName', 'guardianId', 'guardianRelationship', 'guardianPhone'];
    } else if (currentStep === 5) {
      fieldsToValidate = ['confirmTruth', 'agreePolicies', 'digitalSignature', 'submissionDate'];
    }

    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      const firstError = Object.keys(form.formState.errors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Guard 1: Intercept Enter keypresses on steps 1-4 to trigger next step rather than submission
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && currentStep < 5 && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault();
      handleNext();
    }
  };

  // Guard 2: Enforce that form submission ONLY executes on Step 5
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentStep < 5) {
      handleNext();
      return;
    }
    form.handleSubmit(onSubmit)(e);
  };

  const onSubmit = async (data: ApplicationInput) => {
    try {
      const formData = new FormData();
      const allFields = { ...form.getValues(), ...data };

      // Append values to FormData payload
      Object.entries(allFields).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (value instanceof FileList && value.length > 0) {
            formData.append(key, value[0]);
          } else if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Label & Value formatting helpers
      const formatLabel = (key: string) =>
        key
          .replace(/_/g, ' ')
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/^./, (str) => str.toUpperCase())
          .trim();

      const cleanValue = (val: any): string => {
        if (val === null || val === undefined) return '';
        if (typeof val === 'number' && Number.isNaN(val)) return '';
        if (String(val) === 'NaN' || String(val).toLowerCase() === 'undefined') return '';
        if (val instanceof File) return `[Attached File: ${val.name}]`;
        if (val instanceof FileList && val.length > 0) return `[Attached File: ${val[0].name}]`;
        if (typeof val === 'boolean') return val ? 'Yes' : 'No';
        return String(val);
      };

      // --- MODERN EXECUTIVE GENERATED PDF FOR ADMIN ---
      const doc = new jsPDF();
      const primaryColor: [number, number, number] = [30, 58, 138];    // Executive Deep Navy
      const secondaryColor: [number, number, number] = [71, 85, 105];  // Slate Blue
      const lightBg: [number, number, number] = [248, 250, 252];       // Off-White

      // 1. Header Banner
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 28, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(255, 255, 255);
      doc.text('HOYE SECONDARY SCHOOL', 14, 15);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(226, 232, 240);
      doc.text('OFFICIAL ADMISSION APPLICATION RECORD', 14, 22);

      // Metadata Timestamp
      const today = new Date().toLocaleDateString('en-ZA');
      doc.setFontSize(8);
      doc.text(`Submitted: ${today}`, 196, 15, { align: 'right' });
      doc.text('Status: Pending Review', 196, 22, { align: 'right' });

      // 2. Applicant Overview Summary Card
      doc.setFillColor(...lightBg);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, 33, 182, 22, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...primaryColor);
      const fullName = `${allFields.firstName || ''} ${allFields.lastName || ''}`.trim() || 'N/A';
      doc.text(`Applicant Name: ${fullName}`, 18, 41);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...secondaryColor);
      doc.text(`ID / Passport: ${allFields.idNumber || 'N/A'}`, 18, 49);
      doc.text(`Grade Applying: ${allFields.gradeApplying || 'N/A'}`, 110, 41);
      doc.text(`Start Year: ${allFields.preferredStartYear || '2027'}`, 110, 49);

      // 3. Categorized Sections
      const sections = [
        {
          title: '1. Learner Personal Details',
          keys: [
            'firstName', 'middleName', 'lastName', 'preferredName', 'idNumber',
            'birthCertNumber', 'dob', 'age', 'gender', 'nationality', 'citizenship',
            'countryOfBirth', 'homeLanguage', 'secondLanguage', 'learningLanguage',
            'religion', 'mobileNumber', 'email', 'residentialAddress', 'city',
            'province', 'postalCode', 'country', 'livesWith', 'totalSiblings',
            'familyPosition', 'siblingsAtSchool'
          ]
        },
        {
          title: '2. Academic History & Preferences',
          keys: [
            'preferredStartYear', 'gradePassed', 'yearPassedHighest', 'currentGrade',
            'currentAcademicYear', 'prevSchoolName', 'prevSchoolAddress', 'prevSchoolPhone',
            'reasonLeaving', 'averagePercentage', 'bestSubject', 'weakestSubject',
            'numSubjectsPassed', 'gradeApplying', 'chosenStream', 'optionalSubject',
            'needsSupport', 'needsExtraLessons', 'achievements', 'sportsParticipation',
            'leadershipRoles', 'extracurricular', 'hasDisciplineHistory', 'disciplineDetails',
            'motivationToJoin', 'referralSource', 'hasTeacherRelative', 'teacherName',
            'teacherSurname', 'teacherPhone', 'teacherRelationship'
          ]
        },
        {
          title: '3. Medical & Support Information',
          keys: [
            'hasMedicalAid', 'medAidProvider', 'medAidNumber', 'hasFamilyDoctor',
            'doctorName', 'doctorPhone', 'emergencyName', 'emergencyPhone',
            'emergencyRelationship', 'medicalAllergies', 'medicalConditions',
            'currentMedication', 'medAsthma', 'medEpilepsy', 'medDiabetes',
            'hasDisability', 'disabilityDetails', 'needsCounselling', 'sportsAllowed',
            'allowEmergencyTreatment'
          ]
        },
        {
          title: '4. Parent / Guardian Details',
          keys: [
            'guardianFirstName', 'guardianLastName', 'guardianId', 'guardianRelationship',
            'guardianMaritalStatus', 'guardianPhone', 'guardianAltPhone', 'guardianWhatsapp',
            'guardianEmail', 'guardianEmploymentStatus', 'guardianOccupation',
            'guardianEmployer', 'guardianIncomeRange', 'guardianHomeAddress',
            'preferredCommunication', 'hasSecondGuardian', 'guardian2Name',
            'guardian2Phone', 'permissionPhotos'
          ]
        },
        {
          title: '5. Declaration & Signature',
          keys: [
            'confirmTruth', 'agreePolicies', 'digitalSignature', 'submissionDate',
            'additionalNotes'
          ]
        }
      ];

      let currentY = 60;

      sections.forEach((sec) => {
        const rows = sec.keys
          .map((k) => {
            const val = cleanValue(allFields[k as keyof typeof allFields]);
            return val ? [formatLabel(k), val] : null;
          })
          .filter((row): row is [string, string] => row !== null);

        if (rows.length === 0) return;

        autoTable(doc, {
          startY: currentY,
          head: [[sec.title, 'Details']],
          body: rows,
          theme: 'grid',
          headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9,
          },
          styles: { fontSize: 8, cellPadding: 2.5, overflow: 'linebreak' },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 60, textColor: secondaryColor },
            1: { cellWidth: 'auto', textColor: [15, 23, 42] },
          },
          margin: { left: 14, right: 14 },
          didDrawPage: () => {
            const pageStr = `Page ${doc.getNumberOfPages()}`;
            doc.setFontSize(7.5);
            doc.setTextColor(148, 163, 184);
            doc.text(pageStr, 196, 287, { align: 'right' });
            doc.text('Hoye Secondary School — Official Confidential Admission Record', 14, 287);
          }
        });

        currentY = (doc as any).lastAutoTable.finalY + 8;
      });

      const pdfBlob = doc.output('blob');
      formData.append('pdf_form_path', pdfBlob, 'Application.pdf');

      const response = await fetch('https://hoyesecondarysch.com/app/submit_application.php', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'success' || result.tracking_number || result.refNumber) {
        const generatedRef =
          result.tracking_number || result.refNumber || `HY-${new Date().getFullYear()}-0000`;
        setSubmissionResult({
          refNumber: generatedRef,
          message: result.message || 'Your application has been received successfully.',
        });
        setShowSuccess(true);
      } else {
        alert('Submission failed: ' + (result.message || 'Please check your details.'));
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      alert('Unable to reach the server: ' + (error.message || 'Please try again.'));
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-background via-muted/20 to-muted/40">
      {/* Glassmorphic Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground">Hoye Secondary School</h1>
              <p className="text-xs text-muted-foreground font-medium">Online Admissions Application</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-xl hover:bg-muted font-medium text-xs gap-2" data-testid="button-back-home">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* SKAVS autofill notice */}
      <AnimatePresence>
        {showSkavsNotice && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3"
          >
            <div className="container max-w-6xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span><strong className="font-semibold">SKAVS AI Autofill:</strong> We pre-filled fields from your document. Please review for accuracy.</span>
              </div>
              <button 
                type="button"
                onClick={() => setShowSkavsNotice(false)} 
                className="text-amber-700 dark:text-amber-300 hover:text-amber-900 text-xs font-semibold shrink-0 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Container */}
      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Step Indicator Card */}
        <div className="bg-card/70 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-sm">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Floating Modern Form Container */}
        <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-10 shadow-xl shadow-black/5">
          <form onSubmit={handleFormSubmit} onKeyDown={handleKeyDown}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {currentStep === 1 && <Step1LearnerInfo form={form} />}
                {currentStep === 2 && <Step2Academic form={form} />}
                {currentStep === 3 && <Step3Medical form={form} />}
                {currentStep === 4 && <Step4Guardian form={form} />}
                {currentStep === 5 && <Step5Submit form={form} />}
              </motion.div>
            </AnimatePresence>

            {/* Modern Action Bar */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/50 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="h-11 px-6 rounded-xl font-medium border-border/80 hover:bg-muted transition-all"
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider hidden sm:block">
                Step {currentStep} of {steps.length}
              </div>

              {currentStep < 5 ? (
                <Button 
                  type="button" 
                  onClick={handleNext} 
                  className="h-11 px-7 rounded-xl font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all gap-2"
                  data-testid="button-next"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="h-11 px-8 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/25 hover:shadow-lg transition-all gap-2"
                  data-testid="button-submit-application"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* Success Modal */}
      {submissionResult && (
        <SuccessModal
          open={showSuccess}
          onClose={() => setShowSuccess(false)}
          refNumber={submissionResult.refNumber}
          message={submissionResult.message}
        />
      )}
    </div>
  );
}