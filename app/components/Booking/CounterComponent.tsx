'use client';
import { MinusIcon, PlusIcon } from 'lucide-react';

const CounterComponent = ({
  count,
  updateFormData,
}: {
  count: any;
  updateFormData: (count: number) => void;
}) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <button
        type="button"
        onClick={() => {
          const current = count || 0;
          if (current > 0) {
            updateFormData(current - 1);
          }
        }}
        disabled={!count || count <= 0}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
          !count || count <= 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-theme-orange text-white hover:bg-orange-600 shadow-lg hover:shadow-xl'
        }`}
      >
        <MinusIcon className="w-5 h-5" />
      </button>

      <div className="w-16 text-center">
        <span className="text-2xl font-semibold text-gray-900">
          {count || 0}
        </span>
      </div>

      <button
        type="button"
        onClick={() => {
          const current = count || 0;
          updateFormData(current + 1);
        }}
        className="w-8 h-8 rounded-full bg-theme-orange text-white hover:bg-orange-600 shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200"
      >
        <PlusIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CounterComponent;
