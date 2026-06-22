const ITEMS = [
  'Clean, fully fuelled truck',
  'Furniture pads & blankets',
  'Shrink wrap & stretch film',
  'Dollies & moving straps',
  'Disassembly & reassembly',
  'Floor & door-frame protection',
  'Friendly, hands-on crew',
];

export default function Included() {
  return (
    <section className="bg-[#EAE4D8] py-20 md:py-24" id="included">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p className="text-[11px] font-semibold tracking-[.12em] uppercase text-[#FD6232] mb-2.5">
              What&apos;s included
            </p>
            <h2
              className="font-serif font-bold text-[#1A1208] leading-[1.2] mb-4"
              style={{ fontSize: 'clamp(28px,3vw,38px)' }}
            >
              Every move, <em className="italic">fully equipped</em>
            </h2>
            <p className="text-[16px] text-[#5C4F3D] leading-[1.7] mb-7">
              Every booking — at every price — comes with the full kit. No
              &ldquo;add the wrap for $50.&rdquo; No renting blankets. It&apos;s
              all in the hourly rate.
            </p>
            <a
              href="#quote"
              className="inline-flex items-center gap-2 bg-[#FD6232] text-white font-semibold px-6 py-3 rounded-full shadow-[0_4px_24px_rgba(253,98,50,0.28)] hover:bg-[#C44B1A] hover:-translate-y-px transition-all"
            >
              Book today →
            </a>
          </div>

          {/* List */}
          <div className="bg-[#FDFAF5] border border-[#D9D2C4] rounded-[24px] px-9 py-8 shadow-[0_2px_16px_rgba(61,26,8,0.06)]">
            <ul className="flex flex-col gap-3.5">
              {ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-[15px] text-[#5C4F3D]"
                >
                  <span className="w-5 h-5 rounded-full flex-shrink-0 border-[1.5px] border-[#FD6232] text-[#FD6232] flex items-center justify-center text-[9px] font-bold">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
