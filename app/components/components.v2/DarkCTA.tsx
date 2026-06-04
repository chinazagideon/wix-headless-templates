export default function DarkCTA() {
  return (
    <section className="bg-[#F5F0E8] py-20" id="cta">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#3D1A08] via-[#8B3000] to-[#C44B1A] px-10 md:px-14 py-16">
          {/* Glow */}
          <div className="absolute -top-1/3 -right-[5%] w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(253,98,50,0.18)_0%,transparent_70%)] pointer-events-none" />

          <p className="text-[11px] font-semibold tracking-[.12em] uppercase text-[#E8832A] mb-2">
            The final word
          </p>
          <h2
            className="font-serif font-bold text-white leading-[1.12] mb-4"
            style={{ fontSize: 'clamp(32px,4vw,48px)' }}
          >
            Winnipeg&apos;s <em className="italic text-[#E8832A]">smartest</em>{' '}
            move
          </h2>
          <p className="text-[17px] text-[rgba(253,250,245,0.78)] max-w-[520px] leading-[1.65] mb-8">
            ICANDO Movers does fewer moves per day so every customer gets a
            careful, focused crew — not a rushed assembly line. Book today and
            see why Winnipeg keeps coming back.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#quote"
              className="inline-flex items-center gap-2 bg-[#FDFAF5] text-[#FD6232] font-semibold px-6 py-3 rounded-full hover:bg-white hover:-translate-y-px transition-all"
            >
              Get a free quote →
            </a>
            <a
              href="tel:+12042295871"
              className="inline-flex items-center gap-2 text-white border-2 border-[rgba(253,250,245,0.55)] font-semibold px-6 py-3 rounded-full hover:bg-[rgba(253,250,245,0.1)] transition-all"
            >
              (204) 229-5871
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
