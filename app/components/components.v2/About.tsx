import Image from 'next/image';
import Link from 'next/link';
import routes from '../Layout/NavBarV2/routes';

const FEATURES = [
  'Clean, fully fuelled truck',
  'Furniture pads & blankets',
  'Shrink wrap & stretch film',
  'Dollies & moving straps',
  'Disassembly & reassembly',
  'Floor & door-frame protection',
  'Stair carry at no extra charge',
  'Friendly, hands-on crew',
];

export default function About() {
  return (
    <section className="bg-[#F5F0E8] py-20 md:py-24" id="about">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p className="text-[11px] font-semibold tracking-[.12em] uppercase text-[#FD6232] mb-2.5">
              Meet ICANDO Movers
            </p>
            <h2
              className="font-serif font-bold text-[#1A1208] leading-[1.2] mb-5"
              style={{ fontSize: 'clamp(28px,3vw,38px)' }}
            >
              A Winnipeg crew that <em className="italic">actually</em> shows up
              — and shows care
            </h2>
            <p className="text-[16px] text-[#5C4F3D] leading-[1.7] mb-3">
              Founded by Nelson, ICANDO Movers is a small, hands-on team built
              on word-of-mouth across Winnipeg. We do fewer moves a day so every
              customer gets a careful, focused crew — not a rushed assembly
              line.
            </p>
            <p className="text-[16px] text-[#5C4F3D] leading-[1.7] mb-7">
              No upsells at the door. No mystery charges. Just two or three
              people who care about your stuff as much as you do.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={routes.pricing_section}
                className="inline-flex items-center gap-2 bg-[#FD6232] text-white font-semibold px-6 py-3 rounded-full shadow-[0_4px_24px_rgba(253,98,50,0.28)] hover:bg-[#C44B1A] hover:-translate-y-px transition-all"
              >
                See our pricing →
              </Link>
              <Link
                href={routes.faq}
                className="text-[#FD6232] font-semibold hover:text-[#C44B1A] transition-colors"
              >
                FAQ
              </Link>
            </div>
          </div>

          {/* Photo stack */}
          <div className="relative h-[420px]">
            <div className="absolute top-0 left-0 right-10 bottom-12 rounded-[24px] overflow-hidden shadow-[0_8px_32px_rgba(61,26,8,0.12)]">
              <Image
                src="/custom/truck-move.jpg"
                alt="ICANDO crew loading truck"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-[55%] h-[58%] rounded-[16px] overflow-hidden shadow-[0_8px_32px_rgba(61,26,8,0.12)] border-4 border-[#F5F0E8]">
              <Image
                src="/custom/moving-elevator.jpg"
                alt="ICANDO mover in elevator"
                fill
                className="object-cover object-top"
              />
            </div>
            {/* Badge */}
            <div className="absolute top-5 right-9 z-10 bg-[#FD6232] rounded-xl px-4 py-3 text-center shadow-[0_4px_24px_rgba(253,98,50,0.28)]">
              <span className="block font-serif font-bold text-white text-[28px] leading-none">
                8+
              </span>
              <span className="block text-[10px] font-semibold text-[rgba(255,255,255,0.85)] uppercase tracking-wide mt-1 leading-snug">
                Years Moving
                <br />
                Winnipeg
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
