// components/ProgressBar.tsx

interface ProgressBarProps {
  current: number;
  total: number;
  score?: number;
}

export default function ProgressBar({ current, total, score }: ProgressBarProps) {
  const progress = (current / total) * 100;
  const scorePercentage = score !== undefined ? Math.round((score / current) * 100) : null;

  return (
    <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      {/* Progress Stats */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm text-gray-600">Question</span>
            <p className="text-2xl font-bold text-gray-900">
              {current} <span className="text-lg text-gray-400">/ {total}</span>
            </p>
          </div>
          {score !== undefined && (
            <>
              <div className="w-px h-12 bg-gray-200"></div>
              <div>
                <span className="text-sm text-gray-600">Score</span>
                <p className="text-2xl font-bold text-green-600">
                  {score} <span className="text-lg text-gray-400">/ {current}</span>
                </p>
              </div>
            </>
          )}
        </div>
        {scorePercentage !== null && (
          <div className="text-right">
            <span className="text-sm text-gray-600">Accuracy</span>
            <p className={`text-2xl font-bold ${
              scorePercentage >= 80 ? 'text-green-600' : 
              scorePercentage >= 60 ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {scorePercentage}%
            </p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
        </div>
      </div>

      {/* Progress Text */}
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>{Math.round(progress)}% complete</span>
        <span>{total - current} remaining</span>
      </div>
    </div>
  );
}