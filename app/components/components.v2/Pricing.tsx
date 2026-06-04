const PLANS = [
  {
    tier: '2 Movers',
    price: '$120',
    unit: '/per hour',
    subtext: 'plus a travel fee',
    dark: false,
    features: [
      'Truck & equipment included',
      'Furniture pads & blankets',
      'Shrink wrap & stretch film',
      'Dollies & moving straps',
      'Best for studios & 1-beds',
    ],
  },
  {
    tier: '3 Movers',
    price: '$170',
    unit: '/per hour',
    subtext: 'plus a travel fee',
    dark: true,
    features: [
      'Truck & equipment included',
      'Furniture pads & blankets',
      'Shrink wrap & stretch film',
      'Faster loading & less fatigue',
      'Best for 2–3 bed homes',
    ],
  },
];

export default function Pricing() {
  return (
    <section className="bg-[#F5F0E8] py-20 md:py-24" id="pricing">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold tracking-[.12em] uppercase text-[#FD6232] mb-2">
            Honest Pricing
          </p>
          <h2
            className="font-serif font-bold text-[#1A1208] leading-[1.2] mb-3"
            style={{ fontSize: 'clamp(28px,3vw,38px)' }}
          >
            Flat hourly rates.
            <br />
            No hidden fees.
          </h2>
          <p className="text-[16px] text-[#5C4F3D] max-w-[400px] mx-auto">
            Minimum 2-hour charge on all bookings. Truck included in every rate,
            plus a travel fee.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-[660px] mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.tier}
              className={`rounded-[24px] p-8 md:p-9 ${
                plan.dark
                  ? 'bg-gradient-to-br from-[#3D1A08] to-[#7A2800] text-white'
                  : 'bg-[#FDFAF5] border border-[#D9D2C4] shadow-[0_2px_16px_rgba(61,26,8,0.06)]'
              }`}
            >
              <p
                className={`text-[10px] font-semibold uppercase tracking-[.1em] mb-3.5 ${
                  plan.dark ? 'text-[#E8832A]' : 'text-[#9C8E7A]'
                }`}
              >
                {plan.tier}
              </p>

              <div className="flex items-baseline gap-1 mb-5">
                <span
                  className={`font-serif font-bold text-[52px] leading-none ${
                    plan.dark ? 'text-white' : 'text-[#1A1208]'
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-[13px] ${
                    plan.dark
                      ? 'text-[rgba(253,250,245,0.55)]'
                      : 'text-[#9C8E7A]'
                  }`}
                >
                  {plan.unit}
                </span>
                {/* <span className="text-left text-xs"></span> */}
              </div>

              <ul className="flex flex-col gap-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[14px]">
                    <span
                      className={`w-[18px] h-[18px] rounded-full flex-shrink-0 flex items-center justify-center border text-[9px] font-bold ${
                        plan.dark
                          ? 'border-[#E8832A] text-[#E8832A]'
                          : 'border-[#FD6232] text-[#FD6232]'
                      }`}
                    >
                      ✓
                    </span>
                    <span
                      className={
                        plan.dark
                          ? 'text-[rgba(253,250,245,0.85)]'
                          : 'text-[#5C4F3D]'
                      }
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="#quote"
                className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-full transition-all hover:-translate-y-px ${
                  plan.dark
                    ? 'bg-[#FDFAF5] text-[#FD6232] hover:bg-white'
                    : 'bg-[#FD6232] text-white shadow-[0_4px_24px_rgba(253,98,50,0.28)] hover:bg-[#C44B1A]'
                }`}
              >
                Book this crew →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
