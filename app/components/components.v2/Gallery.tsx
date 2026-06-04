import Image from 'next/image';

const PHOTOS = [
  {
    src: '/custom/icando-move-truck.jpg',
    alt: 'ICANDO truck at a Winnipeg home',
    caption: 'The truck that shows up on time',
    tall: true,
    wide: false,
  },
  {
    src: '/custom/moving-elevator.jpg',
    alt: 'Mover handling wrapped items in elevator',
    caption: 'Careful handling every step',
    tall: false,
    wide: false,
  },
  {
    src: '/custom/moving-bed-mirror.jpg',
    alt: 'Furniture wrapped and protected',
    caption: 'Fully wrapped & protected',
    tall: false,
    wide: false,
  },
  {
    src: '/custom/truck-move.jpg',
    alt: 'ICANDO crew working the ramp',
    caption: 'The full crew, ramp down & ready',
    tall: false,
    wide: true,
  },
  {
    src: '/custom/moving-package-icando.jpg',
    alt: 'Mover carrying mattress down stairs',
    caption: 'Stairs are no problem',
    tall: false,
    wide: false,
  },
  {
    src: '/custom/truck-move-2.jpg',
    alt: 'Two movers loading sofa into truck',
    caption: 'Teamwork makes the difference',
    tall: false,
    wide: true,
  },
];

export default function Gallery() {
  return (
    <section className="bg-[#F5F0E8] pt-20" id="gallery">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <p className="text-[11px] font-semibold tracking-[.12em] uppercase text-[#FD6232] mb-2">
          On the job in Winnipeg
        </p>
        <h2
          className="font-serif font-bold text-[#1A1208] leading-[1.2] mb-9"
          style={{ fontSize: 'clamp(28px,3vw,38px)' }}
        >
          Your move, in good hands
        </h2>
      </div>

      {/* Full-bleed grid */}
      <div
        className="grid mt-2"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: '240px 240px',
          gap: '4px',
        }}
      >
        {PHOTOS.map((photo, i) => (
          <div
            key={i}
            className="group relative overflow-hidden bg-[#EAE4D8]"
            style={{
              gridRow: photo.tall ? 'span 2' : undefined,
              gridColumn: photo.wide ? 'span 2' : undefined,
            }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width:900px) 50vw, 25vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(10,4,2,0.75)] to-transparent px-4 py-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[12px] font-medium text-[rgba(253,250,245,0.92)]">
                {photo.caption}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
