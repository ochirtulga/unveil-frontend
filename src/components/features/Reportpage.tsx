// src/components/features/ReportPage.tsx
import React, { useState } from 'react';
import { Layout, Container } from '../layout/Layout';
import { useToast } from '../context/ToastContext';
import { useVerification } from '../context/VerificationContext';
import { VerificationModal } from './VerificationModal';
import { validateEmail, validatePhone, validateName, validateCompany, validateDescription } from '../../utils/validation';
import { apiService, handleApiError } from '../../services/api';
import { SCAM_TYPES, TOAST_TYPES } from '../../utils/constants';

interface ReportFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  actions: string;
  description: string;
  reporterEmail: string;
  reporterName: string;
}

interface ReportPageProps {
  className?: string;
}

export const ReportPage: React.FC<ReportPageProps> = ({ className = '' }) => {
  const { showToast } = useToast();
  const { verificationState, isVerificationRequired } = useVerification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<ReportFormData>>({});
  
  const [formData, setFormData] = useState<ReportFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    actions: '',
    description: '',
    reporterEmail: '',
    reporterName: '',
  });

  const updateField = (field: keyof ReportFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<ReportFormData> = {};

    // At least one contact method is required
    if (!formData.name.trim() && !formData.email.trim() && !formData.phone.trim()) {
      const errorMessage = 'At least one of: name, email, or phone is required';
      errors.name = errorMessage;
      errors.email = errorMessage;
      errors.phone = errorMessage;
    }

    // Validate individual fields if provided
    if (formData.name.trim()) {
      const nameValidation = validateName(formData.name);
      if (!nameValidation.isValid) errors.name = nameValidation.error;
    }

    if (formData.email.trim()) {
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) errors.email = emailValidation.error;
    }

    if (formData.phone.trim()) {
      const phoneValidation = validatePhone(formData.phone);
      if (!phoneValidation.isValid) errors.phone = phoneValidation.error;
    }

    if (formData.company.trim()) {
      const companyValidation = validateCompany(formData.company);
      if (!companyValidation.isValid) errors.company = companyValidation.error;
    }

    // Required fields
    if (!formData.actions.trim()) {
      errors.actions = 'Scam type is required';
    }

    const descriptionValidation = validateDescription(formData.description);
    if (!descriptionValidation.isValid) {
      errors.description = descriptionValidation.error;
    }

    const reporterEmailValidation = validateEmail(formData.reporterEmail);
    if (!reporterEmailValidation.isValid) {
      errors.reporterEmail = reporterEmailValidation.error;
    }

    const reporterNameValidation = validateName(formData.reporterName);
    if (!reporterNameValidation.isValid) {
      errors.reporterName = reporterNameValidation.error;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast(TOAST_TYPES.ERROR, 'Form Validation Failed', 'Please correct the errors below and try again.');
      return;
    }

    if (isVerificationRequired()) {
      setIsVerificationModalOpen(true);
      return;
    }

    await submitReport();
  };

  const submitReport = async () => {
    setIsSubmitting(true);

    try {
      const reportData = {
        ...formData,
        name: formData.name.trim() || null,
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        company: formData.company.trim() || null,
        actions: formData.actions.trim(),
        description: formData.description.trim(),
        reporterEmail: formData.reporterEmail.trim(),
        reporterName: formData.reporterName.trim(),
      };

      const result = await apiService.reportCase(reportData, verificationState.verificationToken || undefined);
      
      showToast(TOAST_TYPES.SUCCESS, 'Report Submitted', `Case #${result.caseId} has been created successfully. Thank you for helping protect the community!`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        actions: '',
        description: '',
        reporterEmail: '',
        reporterName: '',
      });
      setFormErrors({});

    } catch (error) {
      console.error('Report submission error:', error);
      const errorMessage = handleApiError(error);
      showToast(TOAST_TYPES.ERROR, 'Submission Failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationComplete = async () => {
    setIsVerificationModalOpen(false);
    await submitReport();
  };

  return (
    <>
      <Layout className={className}>
        <Container size="md">
          <div className="py-16">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-light text-slate-900 mb-6 tracking-tight">
                Report a Case
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
                Help protect your community by reporting suspicious individuals or organizations. 
                Your report will be reviewed and added to our database for others to verify.
              </p>
            </div>

            {/* Report Form */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Case Information Section */}
                <FormSection title="Case Information" subtitle="Provide any available contact details for the suspect">
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      label="Full Name"
                      value={formData.name}
                      onChange={(value) => updateField('name', value)}
                      placeholder="e.g., John Smith"
                      error={formErrors.name}
                      optional
                    />
                    
                    <FormField
                      label="Company/Organization"
                      value={formData.company}
                      onChange={(value) => updateField('company', value)}
                      placeholder="e.g., Fake Tech Support Inc."
                      error={formErrors.company}
                      optional
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(value) => updateField('email', value)}
                      placeholder="e.g., scammer@example.com"
                      error={formErrors.email}
                      optional
                    />
                    
                    <FormField
                      label="Phone Number"
                      type="tel"
                      value={formData.phone}
                      onChange={(value) => updateField('phone', value)}
                      placeholder="e.g., +1-555-123-4567"
                      error={formErrors.phone}
                      optional
                    />
                  </div>

                  <InfoBox text="At least one contact method (name, email, or phone) is required." />
                </FormSection>

                {/* Case Details Section */}
                <FormSection title="Case Details" subtitle="Describe the fraudulent activity">
                  
                  <FormSelect
                    label="Type of Scam"
                    value={formData.actions}
                    onChange={(value) => updateField('actions', value)}
                    options={SCAM_TYPES}
                    error={formErrors.actions}
                    required
                  />

                  <FormTextarea
                    label="Detailed Description"
                    value={formData.description}
                    onChange={(value) => updateField('description', value)}
                    placeholder="Describe what happened, how you were contacted, what they asked for, any red flags you noticed, etc. Be as detailed as possible to help others recognize similar actions."
                    error={formErrors.description}
                    required
                    maxLength={2000}
                    rows={6}
                  />
                </FormSection>

                {/* Reporter Information Section */}
                <FormSection title="Your Information" subtitle="Required for verification and follow-up">
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      label="Your Name"
                      value={formData.reporterName}
                      onChange={(value) => updateField('reporterName', value)}
                      placeholder="e.g., Jane Doe"
                      error={formErrors.reporterName}
                      required
                    />
                    
                    <FormField
                      label="Your Email"
                      type="email"
                      value={formData.reporterEmail}
                      onChange={(value) => updateField('reporterEmail', value)}
                      placeholder="e.g., your.email@example.com"
                      error={formErrors.reporterEmail}
                      required
                    />
                  </div>

                  <InfoBox 
                    text="Your information is used for verification and will be displayed with this case."
                    type="privacy"
                  />
                </FormSection>

                {/* Submit Section */}
                <SubmitSection 
                  isSubmitting={isSubmitting}
                  isVerified={verificationState.isVerified}
                />
              </form>
            </div>
          </div>
        </Container>
      </Layout>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onVerified={handleVerificationComplete}
      />
    </>
  );
};

// Helper Components
interface FormSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, subtitle, children }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-light text-slate-900 tracking-wide mb-2">{title}</h2>
      {subtitle && <p className="text-sm text-slate-600 font-light">{subtitle}</p>}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'tel';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  maxLength?: number;
}

const FormField: React.FC<FormFieldProps> = ({
  label, type = 'text', value, onChange, placeholder, error, required = false, optional = false, maxLength,
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
      {optional && <span className="text-slate-400 ml-1 font-light">(optional)</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
        error ? 'border-red-300' : 'border-slate-300'
      }`}
    />
    {error && <p className="mt-1 text-sm text-red-600 font-light">{error}</p>}
  </div>
);

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  error?: string;
  required?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label, value, onChange, options, error, required = false,
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
        error ? 'border-red-300' : 'border-slate-300'
      }`}
    >
      <option value="">Select a scam type...</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-600 font-light">{error}</p>}
  </div>
);

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  rows?: number;
}

const FormTextarea: React.FC<FormTextareaProps> = ({
  label, value, onChange, placeholder, error, required = false, maxLength, rows = 4,
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      rows={rows}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical ${
        error ? 'border-red-300' : 'border-slate-300'
      }`}
    />
    <div className="flex justify-between items-center mt-1">
      {error ? (
        <p className="text-sm text-red-600 font-light">{error}</p>
      ) : (
        <div></div>
      )}
      {maxLength && (
        <p className="text-xs text-slate-500 font-light">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  </div>
);

interface InfoBoxProps {
  text: string;
  type?: 'info' | 'privacy';
}

const InfoBox: React.FC<InfoBoxProps> = ({ text, type = 'info' }) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    privacy: 'bg-slate-50 border-slate-200 text-slate-600',
  };

  const icons = {
    info: (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    privacy: (
      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-9a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2zm10-12V6a4 4 0 00-8 0v3" />
      </svg>
    ),
  };

  return (
    <div className={`p-4 border rounded-lg ${styles[type]}`}>
      <div className="flex items-center space-x-2">
        {icons[type]}
        <span className="text-sm font-light">{text}</span>
      </div>
    </div>
  );
};

interface SubmitSectionProps {
  isSubmitting: boolean;
  isVerified: boolean;
}

const SubmitSection: React.FC<SubmitSectionProps> = ({ isSubmitting, isVerified }) => (
  <div className="pt-6 border-t border-slate-200">
    <div className="text-center space-y-4">
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-8 py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium tracking-wide rounded-lg transition-colors flex items-center justify-center space-x-2 mx-auto"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Submitting Report...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Submit Case</span>
          </>
        )}
      </button>

      {isVerified ? (
        <InfoBox 
          text="✓ Email verified - Ready to submit" 
          type="info"
        />
      ) : (
        <InfoBox 
          text="Email verification required to submit reports" 
          type="info"
        />
      )}

      <p className="text-xs text-slate-500 font-light max-w-lg mx-auto">
        By submitting this case, you confirm that the information provided is accurate to the best of your knowledge. 
        False reports may result in account restrictions.
      </p>
    </div>
  </div>
);