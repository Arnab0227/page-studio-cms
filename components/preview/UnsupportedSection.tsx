import React from 'react';

interface UnsupportedSectionProps {
  type?: string;
  reason?: string;
  isDraft?: boolean;
}

const UnsupportedSection: React.FC<UnsupportedSectionProps> = ({
  type = 'unknown',
  reason = 'This component is not supported',
  isDraft = false,
}) => {
  return (
    <div
      className={`my-4 p-4 border-2 border-dashed rounded-lg ${
        isDraft ? 'border-orange-300 bg-orange-50' : 'border-gray-300 bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-lg font-semibold text-gray-600">⚠️</div>
        <div>
          <p className="font-medium text-gray-900">
            Unsupported Component: {type}
          </p>
          <p className="text-sm text-gray-600 mt-1">{reason}</p>
          {isDraft && (
            <p className="text-xs text-orange-700 mt-2">
              This is a draft component and may not be valid yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

UnsupportedSection.displayName = 'UnsupportedSection';

export default UnsupportedSection;
