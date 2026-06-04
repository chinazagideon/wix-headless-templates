export default function Stats() {
  const items = [
    { value: '8+', label: 'Years Moving Winnipeg' },
    { value: '4.8★', label: 'Google Rating' },
    { value: '40%', label: 'Less Than Competitors' },
  ];

  return (
    <section className="bg-[#EAE4D8] border-b border-[#D9D2C4]" id="stats">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col sm:flex-row items-stretch">
          {items.map((item, i) => (
            <div key={item.label} className="flex flex-1 items-stretch">
              {i > 0 && (
                <div className="hidden sm:block w-px bg-[#D9D2C4] self-stretch" />
              )}
              <div className="flex-1 flex flex-col items-center justify-center py-8 px-5 text-center border-b sm:border-b-0 border-[#D9D2C4]">
                <span className="font-serif font-bold text-[42px] text-[#1A1208] leading-none mb-1.5">
                  {item.value}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[.1em] text-[#9C8E7A]">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
