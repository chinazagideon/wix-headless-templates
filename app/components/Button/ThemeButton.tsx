import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Loader, Loader2 } from 'lucide-react';
import Link from 'next/link';

const ThemeButton = (props: {
  isSubmitting: boolean;
  handleSubmit?: () => void;
  children: React.ReactNode;
  href?: string;
  showIcon?: boolean;
}) => {
  const { children, href, isSubmitting, handleSubmit, showIcon = true } = props;
  return (
    <>
      {handleSubmit && (
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className={`capitalize rounded-full bg-theme-orange px-3 w-fit py-1.5 !font-size-10 font-outfit font-bold text-white hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-200 hover:scale-105 flex flex-row items-center gap-2 normal-case 
            ${isSubmitting ? 'cursor-not-allowed hover:bg-gray disabled' : ''}`}
        >
          {isSubmitting ? 'loading' : children}
          {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
          {!isSubmitting && (
            <ArrowRightIcon className="w-8 h-8 rounded-full bg-[#011a34] p-1 text-white hover:scale-105 transition-all duration-200" />
          )}
        </button>
      )}
      {href && (
        <Link
          href={href}
          prefetch
          className="capitalize rounded-full bg-theme-orange px-3 w-fit py-1.5 !font-size-10 font-outfit font-bold text-white hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-200 hover:scale-105 flex flex-row items-center gap-2 normal-case "
        >
          {children}
          {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
          {showIcon && !isSubmitting && (
            <ArrowRightIcon className="w-8 h-8 rounded-full bg-[#011a34] p-1 text-white hover:scale-105 transition-all duration-200" />
          )}
        </Link>
      )}
    </>
  );
};

export default ThemeButton;
