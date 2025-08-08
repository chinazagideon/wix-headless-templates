import Lines from '@app/components/Design/Lines';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const QuoteComponent = () => {
  return (
    <>
      <div className="w-full h-full bg-black py-10 mt-10 relative" id="quote">
        <div className="w-full lg:w-[70%] mx-auto  flex lg:flex-row flex-col gap-4 lg:px-0 px-4 justify-center items-center gap-3">
          {/* <div className='flex lg:flex-row sm:flex-col gap-4 w-full justify-between'> */}
          <div className="flex flex-col gap-4 w-full lg:w-[50%] mr-4 lg:justify-start justify-center lg:mr-4 mr-0 lg:mb-0 mb-4">
            <h1 className="text-white dark:text-white text-2xl font-outfit font-light mb-4 normal-case lg:text-left text-center">
              <span className="font-bold">Get</span> a Quote
            </h1>
            <div className="flex flex-col gap-4 text-center lg:text-left">
              <p className="text-white dark:text-white text-center lg:text-left text-base font-outfit font-light">
                With ICANDO MOVERS, you can trust us to provide a moving
                experience that is tailored to your needs, affordable, reliable,
                and backed by outstanding customer support. Fill out this quick
                form for a moving quote and we’ll get back to you in the same
                business day.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full lg:w-[50%] w-full justify-end">
            <form action="">
              <div className="flex flex-col gap-2 w-full mt-2">
                <label
                  htmlFor="name"
                  className="text-gray-400 dark:text-white text-sm font-outfit font-light"
                >
                  Fullname
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-lg bg-[#2B2B2B] border-2 border-[#2B2B2B] focus:border-theme-orange active:border-theme-orange"
                />
              </div>
              <div className="flex flex-col gap-2 w-full mt-2">
                <label
                  htmlFor="email"
                  className="text-gray-400 dark:text-white text-sm font-outfit font-light"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-lg bg-[#2B2B2B] border-2 border-[#2B2B2B] focus:border-theme-orange active:border-theme-orange"
                />
              </div>
              <div className="flex flex-col gap-2 w-full mt-2">
                <label
                  htmlFor="phone"
                  className="text-gray-400 dark:text-white text-sm font-outfit font-light"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full rounded-lg  bg-[#2B2B2B] border-2 border-[#2B2B2B] active:border-theme-orange"
                />
              </div>
              <div className="flex flex-col gap-2 w-full mt-2">
                <label
                  htmlFor="pickup_l"
                  className="text-gray-400 dark:text-white text-sm font-outfit font-light"
                >
                  Pickup Location
                </label>
                <input
                  type="tel"
                  id="pickup"
                  className="w-full rounded-lg  bg-[#2B2B2B] border-2 border-[#2B2B2B] active:border-theme-orange"
                />
              </div>
              <div className="flex flex-col gap-2 w-full mt-2">
                <label
                  htmlFor="final_d"
                  className="text-gray-400 dark:text-white text-sm font-outfit font-light"
                >
                  Final Destination
                </label>
                <input
                  type="tel"
                  id="final"
                  className="w-full rounded-lg  bg-[#2B2B2B] border-2 border-[#2B2B2B] active:border-theme-orange"
                />
              </div>
              <div className="flex flex-col gap-2 w-full mt-2">
                <label
                  htmlFor="service"
                  className="text-gray-400 dark:text-white text-sm font-outfit font-light"
                >
                  Please select desired service
                </label>

                <select
                  name=""
                  id=""
                  className="w-full rounded-lg bg-[#2B2B2B] border-2 border-[#2B2B2B] focus:border-theme-orange active:border-theme-orange text-sm text-gray-400"
                >
                  <option value="">Select Service</option>
                  <option value="1">Commercial Moving</option>
                  <option value="2">Residential Moving</option>
                  <option value="3">Storage</option>
                  <option value="4">Packing</option>
                </select>
              </div>
              {/* <div className='flex flex-col gap-2 w-full mt-2'>
                                <label htmlFor="comment" className='text-gray-400 dark:text-white text-sm font-outfit font-light'>Additional Comment</label>
                                <textarea className='w-full rounded-lg bg-[#2B2B2B] text-sm bg-[#2B2B2B] border-[#2B2B2B] text-gray-600'>Addtional Comment </textarea>
                            </div> */}
              <div className="flex items-center gap-2 animate-slide-in-left mt-4 w-full">
                <button
                  type="submit"
                  disabled={true}
                  className="capitalize rounded-full bg-theme-orange px-3 w-fit py-3 !font-size-10 font-outfit font-light text-white hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-200 hover:scale-105 flex flex-row items-center gap-2 normal-case disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Request Qoutation
                  <ArrowRightIcon className="w-10 h-10 rounded-full bg-[#000] p-1 text-white hover:scale-105 transition-all duration-200" />
                </button>
              </div>
            </form>
            {/* </div> */}
          </div>
          <Lines
            linesColor="white"
            strokeWidth={1}
            className="mr-80 lg:block hidden"
            height="100vh"
          />
        </div>
      </div>
    </>
  );
};

export default QuoteComponent;
