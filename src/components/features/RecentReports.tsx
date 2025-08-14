import React from 'react';

interface RecentReport {
  id?: string;
  type: string;
  time: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
}

interface RecentReportsProps {
  reports?: RecentReport[];
  onReportClick?: (report: RecentReport) => void;
  showViewAll?: boolean;
  className?: string;
}

export const RecentReports: React.FC<RecentReportsProps> = ({
  reports = [
    { id: '1', type: 'Phone Scam', time: '2 hours ago', severity: 'high' },
    { id: '2', type: 'Email Fraud', time: '5 hours ago', severity: 'medium' },
    { id: '3', type: 'Identity Theft', time: '1 day ago', severity: 'critical' },
    { id: '4', type: 'Investment Scam', time: '2 days ago', severity: 'high' },
    { id: '5', type: 'Tech Support Scam', time: '3 days ago', severity: 'medium' },
    { id: '6', type: 'Romance Scam', time: '1 week ago', severity: 'high' },
  ],
  onReportClick,
  showViewAll = true,
  className = '',
}) => {
  return (
    <div className={`${className}`}>
      {/* Minimal header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-light text-slate-900 tracking-wide">
          Recent Reports
        </h3>
        
        {showViewAll && (
          <button className="text-sm text-slate-600 hover:text-slate-900 font-light tracking-wide">
            VIEW ALL
          </button>
        )}
      </div>
      
      {/* Clean list */}
      <div className="space-y-3">
        {reports.map((report, index) => (
          <RecentReportItem
            key={report.id || index}
            report={report}
            onClick={onReportClick}
          />
        ))}
      </div>
    </div>
  );
};

// Minimal Recent Report Item
interface RecentReportItemProps {
  report: RecentReport;
  onClick?: (report: RecentReport) => void;
}

const RecentReportItem: React.FC<RecentReportItemProps> = ({
  report,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(report);
    }
  };

  const content = (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <span className="text-slate-700 text-sm font-light">{report.type}</span>
      </div>
      <div className="text-xs text-slate-500 font-light tracking-wide">
        {report.time}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={handleClick}
        className="w-full hover:bg-slate-50 transition-colors"
      >
        {content}
      </button>
    );
  }

  return <div>{content}</div>;
};