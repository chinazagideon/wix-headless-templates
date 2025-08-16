import { CalendarIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { PencilIcon } from 'lucide-react';
import Image from 'next/image';

const blogPosts = [
  {
    title: 'Relocation Horrors',
    date: 'Yesterday',
    location: 'Winnipeg, MB',
    description:
      'Relocation Hub is a platform that allows you to find the best relocation services in Winnipeg. We have a team of experienced relocation experts who are dedicated to helping you with your move.',
    image: '/custom/truck.png',
  },
  {
    title: "Winnipeg's Best Relocation Services",
    date: 'Yesterday',
    location: 'Winnipeg, MB',
    description:
      'Moving to Winnipeg? Relocation Hub is a platform that allows you to find the best relocation services in Winnipeg. We have a team of experienced relocation experts who are dedicated to helping you with your move.',
    image: '/custom/winnipeg.webp',
  },
  {
    title: 'Weather stories',
    date: 'Yesterday',
    location: 'Winnipeg, MB',
    description:
      'Weather in Winnipeg is unpredictable. We have a team of experienced relocation experts who are dedicated to helping you with your move.',
    image: '/custom/moving-truck.png',
  },
];

const Page = () => {
  return (
    <>
      <div className="w-full bg-[#D9D9D9] lg:h-[338px] pt-32 px-2 lg:px-20 py-10 lg:py-auto">
        <div className="flex flex-col items-start lg:items-center px-4 justify-center p-2 lg:p-10 py-10">
          <h1 className="font-outfit font-thin lg:text-6xl text-4xl text-black normal-case mb-4">
            <span className="text-theme-orange font-bold">Winnipeg</span>{' '}
            Relocation Hub
          </h1>
          <p className="text-gray-500 text-sm">
            Read blog posts about our relocation stories
          </p>
        </div>
      </div>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full rounded-2xl overflow-hidden mx-auto  h-full text-black flex flex-col lg:flex-row items-center justify-center gap-4">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-2 w-full"
            >
              <span className="font-bold text-xl flex flex-row items-center justify-center gap-2 mb-4">
                <Image
                  src={post.image}
                  className="rounded-2xl"
                  alt="Relocation Hub"
                  width={440}
                  height={480}
                />
              </span>
              <div className="font-outfit text-sm text-center p-3 flex flex-col items-center justify-center">
                <div className="hover:text-gray-300 pb-3 transition-colors flex flex-col items-center justify-center">
                  <div className="flex flex-col gap-2 items-start justify-start">
                    <h1 className="text-lg font-bold font-outfit text-black normal-case">
                      {post.title}
                    </h1>
                    <div className="flex flex-row justify-between gap-2 mb-2 border-b border-gray-200 pb-2 w-full">
                      <div className="flex flex-row justify-start gap-2">
                        <CalendarIcon className="h-4 w-4 text-theme-orange" />
                        <p className="text-xs font-light font-outfit text-gray-500">
                          {post.date}
                        </p>
                      </div>
                      <div className="flex flex-row justify-end gap-2">
                        <PencilIcon className="h-4 w-4 text-theme-orange" />
                        <p className="text-xs font-light font-outfit text-gray-500">
                          {post.location}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs font-light text-wrap text-left font-outfit text-gray-500">
                      {post.description}
                    </p>
                    <a
                      href={'/blog'}
                      className="underline text-theme-orange text-xs"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
