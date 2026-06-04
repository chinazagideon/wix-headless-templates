'use client';

import { useState } from 'react';

const FAQS = [
  {
    q: 'How are your rates calculated?',
    a: 'We charge by the hour from the moment our crew arrives. No travel fees, no fuel surcharges, no stair fees — just the flat hourly rate. Minimum 2-hour charge applies.',
  },
  {
    q: 'Do you provide packing materials?',
    a: 'Yes — furniture pads, blankets, shrink wrap, and stretch film are all included at no extra cost.',
  },
  {
    q: 'Are you insured?',
    a: 'Yes. ICANDO Movers carries full liability and cargo insurance on every job in Winnipeg.',
  },
  {
    q: 'How far in advance should I book?',
    a: 'We recommend 1–2 weeks in advance, especially May–September. For last-minute moves, call Nelson at (204) 229-5871.',
  },
  {
    q: 'Do you move outside of Winnipeg?',
    a: 'Yes — we serve Winnipeg and nearby communities. For long-distance or inter-provincial moves, call us for a flat-rate quote.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-[#EAE4D8] py-20 md:py-24" id="faq">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold tracking-[.12em] uppercase text-[#FD6232] mb-2">
            Answers before you book
          </p>
          <h2 className="font-serif font-bold text-[#1A1208] text-[38px]">
            FAQ
          </h2>
        </div>

        <div className="max-w-[640px] mx-auto bg-[#FDFAF5] border border-[#D9D2C4] rounded-[24px] overflow-hidden shadow-[0_2px_16px_rgba(61,26,8,0.06)]">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={i < FAQS.length - 1 ? 'border-b border-[#D9D2C4]' : ''}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left text-[15px] font-medium text-[#1A1208] hover:bg-[#EAE4D8] transition-colors gap-3 font-sans"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span>{faq.q}</span>
                <span
                  className={`w-[22px] h-[22px] rounded-full border-[1.5px] border-[#FD6232] text-[#FD6232] flex items-center justify-center text-[16px] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: openIndex === i ? '200px' : '0' }}
              >
                <p className="px-6 pb-5 text-[15px] text-[#5C4F3D] leading-[1.7]">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
