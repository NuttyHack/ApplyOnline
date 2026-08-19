import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
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
      // Step 1 defaults
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
      // Step 2 defaults
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
      // Step 3 defaults
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
      // Step 4 defaults
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
      // Step 5 defaults
      confirmTruth: '',
      agreePolicies: '',
      digitalSignature: '',
      submissionDate: new Date().toISOString().split('T')[0],
      additionalNotes: '',
    },
  });

  // Apply SKAVS extracted data into the form when provided
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

const onSubmit = async (data: ApplicationInput) => {
  try {
    const formData = new FormData();

    // 1. Append all form values (Steps 1 to 5) to FormData
    Object.entries(data).forEach(([key, value]) => {
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

    // 2. Generate client-side PDF snapshot if html2pdf is available
    if (typeof window !== 'undefined' && (window as any).html2pdf) {
      const element = document.createElement('div');
      element.style.padding = '20px';
      element.style.fontFamily = 'Arial, sans-serif';

      let htmlContent = `
        <div style="text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 10px; margin-bottom: 20px;">
          <h1 style="color: #1e40af; margin: 0;">HOYE SECONDARY SCHOOL</h1>
          <p style="margin: 5px 0; font-weight: bold; color: #2563eb;">OFFICIAL ADMISSION APPLICATION RECORD</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
      `;

      Object.entries(data).forEach(([key, value]) => {
        if (value && typeof value !== 'object') {
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          htmlContent += `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 6px; font-weight: bold; width: 40%; color: #475569;">${label}</td>
              <td style="padding: 6px; color: #0f172a;">${String(value)}</td>
            </tr>
          `;
        }
      });

      htmlContent += `</table>`;
      element.innerHTML = htmlContent;

      const opt = {
        margin: 10,
        filename: 'Application.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const pdfBlob = await (window as any).html2pdf().set(opt).from(element).output('blob');
      formData.append('pdf_form_path', pdfBlob, 'Application.pdf');
    }

    // 3. Dispatch to live PHP backend pipeline
    const response = await fetch("https://hoyesecondarysch.com/app/submit_application.php", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server returned status code ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success" || result.tracking_number || result.refNumber) {
      const generatedRef = result.tracking_number || result.refNumber || `HY-${new Date().getFullYear()}-0000`;
      setSubmissionResult({
        refNumber: generatedRef,
        message: result.message || "Your application has been received successfully."
      });
      setShowSuccess(true);
    } else {
      alert("Submission failed: " + (result.message || "Please check your details."));
    }
  } catch (error: any) {
    console.error("Submission error:", error);
    alert("Unable to reach the server: " + (error.message || "Please try again."));
  }
};

    const response = await fetch("https://hoyesecondarysch.com/app/submit_application.php", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.status === "success" || result.refNumber || response.ok) {
      setSubmissionResult({
        refNumber: result.refNumber || result.tracking_number || `HY-${new Date().getFullYear()}-0000`,
        message: result.message || "Your application has been received successfully."
      });
      setShowSuccess(true);
    } else {
      alert("Submission failed: " + (result.message || "Please check your details."));
    }
  } catch (error) {
    console.error("Submission error:", error);
    alert("Unable to reach the server. Please try again.");
  }
};

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-accent font-bold text-lg">H</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Hoye Secondary School</h1>
              <p className="text-xs text-muted-foreground">Online Admissions Application</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" data-testid="button-back-home">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* SKAVS autofill notice */}
      <AnimatePresence>
        {showSkavsNotice && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-yellow-50 border-b border-yellow-200 px-4 py-2.5"
          >
            <div className="container max-w-6xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-yellow-800">
                <Sparkles className="w-4 h-4 text-yellow-600 shrink-0" />
                <span><strong>SKAVS</strong> has pre-filled some fields from your document. Please review and correct any details before submitting.</span>
              </div>
              <button onClick={() => setShowSkavsNotice(false)} className="text-yellow-600 hover:text-yellow-800 text-xs font-medium shrink-0">Dismiss</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Indicator */}
      <StepIndicator steps={steps} currentStep={currentStep} />

      {/* Form */}
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && <Step1LearnerInfo form={form} />}
              {currentStep === 2 && <Step2Academic form={form} />}
              {currentStep === 3 && <Step3Medical form={form} />}
              {currentStep === 4 && <Step4Guardian form={form} />}
              {currentStep === 5 && <Step5Submit form={form} />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pb-12">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              data-testid="button-back"
            >
              Back
            </Button>
            
            {currentStep < 5 ? (
              <Button type="button" onClick={handleNext} data-testid="button-next">
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                data-testid="button-submit-application"
              >
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </form>
      </div>

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