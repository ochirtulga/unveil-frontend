import React, { useEffect, useState } from 'react';
import { Case } from '../../hooks/useSearch';
import { useVerification } from '../context/VerificationContext';
import { VerificationModal } from './VerificationModal';

interface CaseDetailModalProps {
  case: Case;
  isOpen: boolean;
  onClose: () => void;
  onVote: (caseId: number, vote: 'guilty' | 'not_guilty') => Promise<boolean>;
  isVotingInProgress: boolean;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  case: scamCase,
  isOpen,
  onClose,
  onVote,
  isVotingInProgress,
}) => {
  const { verificationState, isVerificationRequired } = useVerification();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [pendingVote, setPendingVote] = useState<'guilty' | 'not_guilty' | null>(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleVote = async (vote: 'guilty' | 'not_guilty') => {
    if (isVotingInProgress) return;

    // Check if verification is required
    if (isVerificationRequired()) {
      setPendingVote(vote);
      setIsVerificationModalOpen(true);
      return;
    }

    // User is verified, proceed with vote
    await onVote(scamCase.id, vote);
  };

  const handleVerificationComplete = async () => {
    console.log('Verification completed, closing modal and executing pending vote');
    setIsVerificationModalOpen(false);
    
    // Small delay to ensure modal closes before proceeding with vote
    setTimeout(async () => {
      if (pendingVote) {
        await onVote(scamCase.id, pendingVote);
        setPendingVote(null);
      }
    }, 100);
  };

  const handleVerificationModalClose = () => {
    setIsVerificationModalOpen(false);
    setPendingVote(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getVerdictStatus = () => {
    if (scamCase.verdictScore > 0) return 'Guilty';
    if (scamCase.verdictScore < 0) return 'Not Guilty';
    return 'Controversial';
  };

  const getVerdictColor = () => {
    const status = getVerdictStatus();
    switch (status) {
      case 'Guilty':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'Not Guilty':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'Controversial':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getConfidence = () => {
    if (scamCase.totalVotes === 0) return 0;
    const dominantVotes = Math.max(scamCase.guiltyVotes, scamCase.notGuiltyVotes);
    return Math.round((dominantVotes / scamCase.totalVotes) * 100);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-light text-slate-900 tracking-wide">
              Case Details
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Case ID and Status */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 font-light tracking-wide">CASE ID</p>
                <p className="text-lg font-light text-slate-900">#{scamCase.id}</p>
              </div>
              <div className={`px-3 py-2 border rounded-lg ${getVerdictColor()}`}>
                <div className="text-sm font-medium">{getVerdictStatus()}</div>
                {scamCase.totalVotes > 0 && (
                  <div className="text-xs opacity-75">
                    {getConfidence()}% confidence
                  </div>
                )}
              </div>
            </div>

            {/* Primary Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-light text-slate-900 border-b border-slate-200 pb-2">
                Primary Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scamCase.name && (
                  <CaseInfoField label="Name" value={scamCase.name} />
                )}
                
                {scamCase.email && (
                  <CaseInfoField label="Email" value={scamCase.email} mono />
                )}
                
                {scamCase.phone && (
                  <CaseInfoField label="Phone" value={scamCase.phone} mono />
                )}
                
                {scamCase.company && (
                  <CaseInfoField label="Company" value={scamCase.company} />
                )}
                
                <CaseInfoField label="Scam Type" value={scamCase.actions} />
              </div>
            </div>

            {/* Description */}
            {scamCase.description && (
              <div className="space-y-4">
                <h3 className="text-lg font-light text-slate-900 border-b border-slate-200 pb-2">
                  Case Description
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-700 font-light leading-relaxed">
                    {scamCase.description}
                  </p>
                </div>
              </div>
            )}

            {/* Voting Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-light text-slate-900 border-b border-slate-200 pb-2">
                Community Verdict
              </h3>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-light text-slate-900">{scamCase.totalVotes}</div>
                  <div className="text-xs text-slate-500 font-light tracking-wide">TOTAL VOTES</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-light text-red-700">{scamCase.guiltyVotes}</div>
                  <div className="text-xs text-red-600 font-light tracking-wide">GUILTY</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-light text-green-700">{scamCase.notGuiltyVotes}</div>
                  <div className="text-xs text-green-600 font-light tracking-wide">NOT GUILTY</div>
                </div>
              </div>

              {/* Current Score */}
              <div className="text-center p-4 border border-slate-200 rounded-lg">
                <div className="text-3xl font-light text-slate-900 mb-2">
                  {scamCase.verdictScore > 0 ? '+' : ''}{scamCase.verdictScore}
                </div>
                <div className="text-sm text-slate-500 font-light tracking-wide">
                  VERDICT SCORE
                </div>
              </div>

              {/* Voting Section */}
              <div className="flex items-center justify-center space-x-4 pt-4">
                <button
                  onClick={() => handleVote('guilty')}
                  disabled={isVotingInProgress}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300 disabled:cursor-not-allowed transition-colors font-medium tracking-wide rounded-lg"
                >
                  {isVotingInProgress ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span>Vote Guilty</span>
                </button>
                
                <button
                  onClick={() => handleVote('not_guilty')}
                  disabled={isVotingInProgress}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white disabled:bg-green-300 disabled:cursor-not-allowed transition-colors font-medium tracking-wide rounded-lg"
                >
                  {isVotingInProgress ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <span>Vote Not Guilty</span>
                </button>
              </div>

              {/* Voting Info */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-blue-800 font-light">
                    {verificationState.isVerified 
                      ? `Verified as ${verificationState.email}. One vote per email per case.`
                      : 'Email verification required to vote. One vote per email per case.'
                    }
                  </span>
                </div>
              </div>

              {/* Verification Status */}
              {verificationState.isVerified && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-green-800 font-light">
                      ✓ Email verified - You can vote on cases
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-light text-slate-900 border-b border-slate-200 pb-2">
                Timeline
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600 font-light">Case Reported</span>
                  <span className="text-slate-900 font-light">{formatDate(scamCase.createdAt)}</span>
                </div>
                
                {scamCase.lastVotedAt && (
                  <div className="flex justify-between items-center py-2 border-t border-slate-100">
                    <span className="text-slate-600 font-light">Last Vote</span>
                    <span className="text-slate-900 font-light">{formatDate(scamCase.lastVotedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end p-6 border-t border-slate-200 space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 text-slate-600 hover:text-slate-900 font-light tracking-wide transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={handleVerificationModalClose}
        onVerified={handleVerificationComplete}
        caseId={scamCase.id}
      />
    </>
  );
};

// Helper component for case information fields
interface CaseInfoFieldProps {
  label: string;
  value: string;
  mono?: boolean;
}

const CaseInfoField: React.FC<CaseInfoFieldProps> = ({ label, value, mono = false }) => {
  return (
    <div>
      <p className="text-sm text-slate-500 font-light tracking-wide mb-1">{label.toUpperCase()}</p>
      <p className={`text-slate-900 font-light ${mono ? 'font-mono text-sm' : ''} break-all`}>
        {value}
      </p>
    </div>
  );
};