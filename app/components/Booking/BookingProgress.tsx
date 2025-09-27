export interface BookingProgressProps {
  currentStep: number;
  isRelocationService: () => boolean;
}

const steps = [
  {
    label: 'Start',
    level: 1,
  },
  {
    label: 'Location',
    level: 2,
  },
  {
    label: 'Destination',
    level: 3,
  },
  {
    label: 'Add-Ons',
    level: 4,
  },
  {
    label: 'Complete',
    level: 5,
  },
];

const BookingProgress = ({
  currentStep,
  isRelocationService,
}: BookingProgressProps) => {
  const max_step = steps.length;

  return (
    <div className="mb-4 lg:mb-12 w-full relative z-1000 ">
      <div className="flex items-center justify-between mb-4  w-full z-1000">
        <div
          className={`absolute top-5 left-0 w-full h-0.5 bg-gray-200 z-1000  border-b border-gray-200 ${
            currentStep === steps.length ? 'bg-theme-orange' : 'bg-gray-200'
          }`}
        ></div>

        {steps.map((step) => (
          <div key={step.level} className="flex items-center">
            <div
              className={`z-20 w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                step.level <= currentStep
                  ? 'bg-theme-orange text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step.level}
            </div>
            {step.level < steps.length && (
              <div
                className={`w-[calc(100%-100px)] z-30 h-0.5 mx-4 transition-all duration-300 ${
                  step.level < currentStep ? 'bg-theme-orange' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm text-gray-500 text-center">
        {steps.map((step) => (
          <span
            key={step.level}
            className={
              currentStep >= step.level ? 'text-theme-orange font-medium' : ''
            }
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BookingProgress;
