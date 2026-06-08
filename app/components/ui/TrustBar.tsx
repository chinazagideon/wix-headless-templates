import { constants } from '@app/components/constants';

export default function TrustBar() {
  return (
    <div className="bg-[#F5F0E8] border-b border-[#D9D2C4]">
      <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8">
        <span className="flex items-center gap-1.5 text-[13px] text-[#5C4F3D] font-medium">
          <span className="text-[#FBB914]">★</span>
          {constants.googleRating} Google Rating
        </span>
        <span className="hidden sm:block text-[#D9D2C4]">|</span>
        <span className="flex items-center gap-1.5 text-[13px] text-[#5C4F3D] font-medium">
          <span className="text-[#FD6232]">✓</span>
          Fully Insured
        </span>
        <span className="hidden sm:block text-[#D9D2C4]">|</span>
        <span className="flex items-center gap-1.5 text-[13px] text-[#5C4F3D] font-medium">
          <span className="text-[#FD6232]">✓</span>
          No Hidden Fees
        </span>
      </div>
    </div>
  );
}
