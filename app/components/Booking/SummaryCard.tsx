/**
 * SummaryCardProps interface
 * @param icon - The icon
 * @param label - The label
 * @param value - The value
 * @param className - The class name
 */
export interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

/**
 * SummaryCard component
 * @param icon - The icon
 * @param label - The label
 * @param value - The value
 * @param className - The class name
 */
export const SummaryCard = ({
  icon,
  label,
  value,
  className = '',
}: SummaryCardProps) => (
  <div
    className={`flex items-center space-x-1 p-2 bg-white rounded-lg border border-gray-200 ${className}`}
  >
    <div className="text-theme-orange">{icon}</div>
    <div className="flex-1 min-w-0">
      <small className="text-xs text-gray-500">{label}</small>
      <p className="text-xs font-outfit font-semibold text-gray-900 truncate">
        {value}
      </p>
    </div>
  </div>
);
