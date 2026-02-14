'use client';
import Lines from '@app/components/Design/Lines';
import { useEffect, useRef, useState } from 'react';
import { CheckCircleIcon, Loader, PhoneIcon } from 'lucide-react';
import { zonedTimeToUtc } from 'date-fns-tz';
import { useForms } from '@app/hooks/useForms';
import { normalizePhoneE164 } from '@app/utils/format-phone';
import ThemeButton from '../Button/ThemeButton';
import AddressAutocomplete from '@app/components/AddressAutocomplete';
import DateTimePicker from '@app/components/DateTimePicker/DateTimePicker';
import { constants } from '@app/components/constants';

const QuoteComponent = ({ services }: { services: any[] }) => {
  const {
    submit,
    isSubmitting,
    error: formError,
    formId,
    onSubmit,
  } = useForms(process.env.NEXT_PUBLIC_WIX_FORM_ID || '');
  const [isCompleted, setIsCompleted] = useState(false);
  const successRef = useRef<HTMLDivElement | null>(null);
  const dateTimeRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email_e1ca: '',
    phone_9f17: '',
    moving_address: '',
    unloading_address: '',
    service_type: '',
    moving_address_date_and_time: '',
    hp_field: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});
  const visibleServices = (services ?? [])?.filter((s: any) => !s.hidden);

  useEffect(() => {
    if (isCompleted && successRef.current) {
      successRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isCompleted]);

  const handleChange = (e: any) => {
    const fieldName = e.target.name as keyof typeof formData;
    const fieldValue = e.target.value as string;
    setFormData({ ...formData, [fieldName]: fieldValue });
    // Clear error for this field on change
    if (errors[fieldName]) {
      const { [fieldName]: _removed, ...rest } = errors;
      setErrors(rest);
    }
  };

  const validateForm = (data: typeof formData) => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

    // First name
    if (!data.first_name || !data.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    // Last name
    if (!data.last_name || !data.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    // Email
    if (!data.email_e1ca || !data.email_e1ca.trim()) {
      newErrors.email_e1ca = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(data.email_e1ca)) {
      newErrors.email_e1ca = 'Enter a valid email address';
    }

    // Phone (basic digit length check)
    const digits = (data.phone_9f17 || '').replace(/\D/g, '');
    if (!digits) {
      newErrors.phone_9f17 = 'Phone number is required';
    } else if (digits.length < 10) {
      newErrors.phone_9f17 = 'Enter a valid phone number';
    }

    // Pickup / Moving address
    if (!data.moving_address || !data.moving_address.trim()) {
      newErrors.moving_address = 'Pickup location is required';
    }

    // Final destination / Unloading address
    if (!data.unloading_address || !data.unloading_address.trim()) {
      newErrors.unloading_address = 'Final destination is required';
    }

    // Moving date and time (must be valid date-time)
    if (
      !data.moving_address_date_and_time ||
      !data.moving_address_date_and_time.trim()
    ) {
      newErrors.moving_address_date_and_time =
        'Moving date and time is required';
    } else {
      const parsed = new Date(data.moving_address_date_and_time);
      if (isNaN(parsed.getTime())) {
        newErrors.moving_address_date_and_time = 'Enter a valid date and time';
      }
    }

    // Service type
    if (!data.service_type || !data.service_type.trim()) {
      newErrors.service_type = 'Please select a service';
    }

    return newErrors;
  };

  // outside-click handled in reusable component
  //submit form data to wix forms
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    try {
      // Build sanitized payload with only allowed Wix field IDs (exclude honeypot)
      const base = {
        ...formData,
        phone_9f17: normalizePhoneE164(String(formData.phone_9f17 || '')),
        // moving_address_date_and_time: zonedTimeToUtc(
        //   formData.moving_address_date_and_time,
        //   'America/Winnipeg'
        // ).toISOString(),
        moving_address_date_and_time: new Date(
          formData.moving_address_date_and_time
        ).toUTCString(),
      } as typeof formData;
      const sanitized = Object.fromEntries(
        Object.entries(base).filter(
          ([key, value]) =>
            (allowedWixFieldIds as string[]).includes(key) &&
            value !== '' &&
            value !== undefined &&
            value !== null
        )
      );
      const success = await onSubmit(sanitized);
      if (success.status === 'PENDING') {
        // Reset controlled inputs and errors
        setFormData({
          first_name: '',
          last_name: '',
          email_e1ca: '',
          phone_9f17: '',
          moving_address: '',
          unloading_address: '',
          service_type: '',
          moving_address_date_and_time: '',
          hp_field: '',
        });
        setErrors({});
        // Optional scroll and native form reset
        document.querySelector<HTMLFormElement>('#quote-form')?.reset();
        setIsCompleted(true);
      }

      // setIsCompleted(true);
    } catch (e) {
      console.error(e);
    }
  };

  // Only send known Wix field IDs to avoid "additional properties" errors
  const allowedWixFieldIds: Array<keyof typeof formData> = [
    'first_name',
    'last_name',
    'email_e1ca',
    'phone_9f17',
    'service_type',
    'moving_address',
    'unloading_address',
    'moving_address_date_and_time',
  ];

  const isFormValid = Object.keys(validateForm(formData)).length === 0;
  return (
    <>
      <div
        className="w-full h-full bg-[#011a34]/90 py-10 relative justify-center items-center"
        id="quote"
      >
        <div className="z-10 w-full lg:w-[70%] mx-auto  flex lg:flex-row flex-col gap-4 lg:px-0 px-4 justify-center items-center gap-3">
          {/* <div className='flex lg:flex-row sm:flex-col gap-4 w-full justify-between'> */}
          <div className="flex flex-col gap-2 w-full w-full">
            <div className="flex flex-col gap-2 w-full justify-center items-center border-b border-theme-orange/20 pb-4">
              <div className="text-white dark:text-white flex flex-col lg:flex-row justify-center items-center gap-2 font-outfit font-thin normal-case text-center">
                <p className="text-md font-light text-theme-orange">
                  Need help moving?&nbsp;Call us today&nbsp;
                </p>
                <span className="flex flex-row items-center justify-center gap-0 text-white dark:text-white text-xl font-outfit font-bold normal-case text-center">
                  {/* <span className="text-white dark:text-white text-xl font-outfit font-bold normal-case text-center"> */}
                  <PhoneIcon className="w-4 h-4 pt-1 text-white" />
                  <p
                    className="text-2xl font-bold cursor-pointer hover:text-theme-orange/60 transition-all duration-300"
                    onClick={() =>
                      window.open(`tel:${constants.companyPhone}`, '_blank')
                    }
                  >
                    {' '}
                    {constants.companyPhone}&nbsp;
                  </p>
                  {/* <span className="font-thin">Or</span> */}
                </span>
                {/* </span> */}
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full justify-center items-center">
              <p className="text-theme-orange dark:text-white text-sm font-outfit font-light normal-case text-center">
                OR
              </p>
              <p className="text-white dark:text-white text-md font-outfit font-bold normal-case text-center mb-4">
                fill out the form below to get a free quote
              </p>
            </div>

            {isCompleted && (
              <div
                ref={successRef}
                className="flex flex-col items-center justify-center gap-1 bg-green-500/10 p-4 rounded-lg"
              >
                <CheckCircleIcon className="w-8 h-8 text-green-500 mb-4" />
                <h1 className="font-outfit font-thin lg:text-xl text-lg text-white normal-case mb-4 text-center">
                  Thank you for your interest in our services! We will get back
                  to you shortly.
                </h1>
              </div>
            )}
            <form onSubmit={handleSubmit} id="quote-form">
              <div className="flex md:flex-row flex-col gap-2 w-full mt-2">
                {/* Honeypot field (visually hidden) */}
                <input
                  type="text"
                  name="hp_field"
                  value={formData.hp_field}
                  onChange={handleChange}
                  autoComplete="off"
                  tabIndex={-1}
                  className="hidden"
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-2 w-full lg:mt-0 md:mt-2">
                  <label
                    htmlFor="name"
                    className="text-gray-400 dark:text-white text-sm font-outfit font-light"
                  >
                    First Name<span className="">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="please enter your first name "
                    className="w-full py-3 rounded-lg bg-[#011a34] border-1 border-[#011a34] focus:border-theme-orange active:border-theme-orange"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-xs">{errors.first_name}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 w-full lg:mt-0 mt-2">
                  <label
                    htmlFor="name"
                    className="text-gray-400 dark:text-white text-sm font-outfit font-light"
                  >
                    Last Name<span className="">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="please enter your last name"
                    className="w-full  py-3 rounded-lg bg-[#011a34] border-1 border-[#011a34] focus:border-theme-orange active:border-theme-orange"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-xs">{errors.last_name}</p>
                  )}
                </div>
              </div>
              <div className="flex md:flex-row flex-col gap-2 w-full mt-2">
                <div className="flex flex-col gap-2 w-full mt-2">
                  <label
                    htmlFor="email"
                    className="text-gray-400 dark:text-white text-sm font-outfit font-light"
                  >
                    Email Address<span className="">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="please enter your email address"
                    className="w-full  py-3 rounded-lg bg-[#011a34] border-1 border-[#011a34] focus:border-theme-orange active:border-theme-orange"
                    name="email_e1ca"
                    value={formData.email_e1ca}
                    onChange={handleChange}
                    required
                  />
                  {errors.email_e1ca && (
                    <p className="text-red-500 text-xs">{errors.email_e1ca}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2 w-full mt-2">
                  <label
                    htmlFor="phone"
                    className="text-gray-400 dark:text-white text-sm font-outfit font-light"
                  >
                    Phone Number<span className="">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="please enter your phone number"
                    className="w-full  py-3 rounded-lg bg-[#011a34] border-1 border-[#011a34] active:border-theme-orange"
                    name="phone_9f17"
                    value={formData.phone_9f17}
                    onChange={handleChange}
                    required
                  />
                  {errors.phone_9f17 && (
                    <p className="text-red-500 text-xs">{errors.phone_9f17}</p>
                  )}
                </div>
              </div>
              <div className="flex lg:flex-row flex-col gap-2 w-full mt-2">
                <div className="flex flex-col gap-2 w-full mt-4">
                  <label
                    htmlFor="service"
                    className="text-gray-400 dark:text-white text-sm font-outfit font-light"
                  >
                    Please select desired service
                    <span className="">*</span>
                  </label>

                  <select
                    name="service_type"
                    id="service_type"
                    className="w-full rounded-lg pr-10 py-3 bg-[#011a34] border-1 border-[#011a34] focus:border-theme-orange active:border-theme-orange text-sm text-gray-400"
                    value={formData.service_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Service</option>
                    {visibleServices.map((service: any, index: number) => (
                      <option
                        key={
                          service?.slug ||
                          service?.id ||
                          `${service?.info?.name || 'service'}-${index}`
                        }
                        value={service?.info?.name || service?.name}
                      >
                        {service?.info?.name || service?.name}
                      </option>
                    ))}
                  </select>
                  {errors.service_type && (
                    <p className="text-red-500 text-xs">
                      {errors.service_type}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 w-full mt-4">
                  <label
                    htmlFor="moving_datetime"
                    className="text-gray-400 dark:text-white text-sm font-outfit font-light"
                  >
                    Moving Date & Time<span className="">*</span>
                  </label>
                  <DateTimePicker
                    value={formData.moving_address_date_and_time}
                    onChange={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        moving_address_date_and_time: val,
                      }))
                    }
                    placeholder="select moving date and time"
                    inputClassName="w-full pr-10 py-3 rounded-lg bg-[#011a34] border-1 border-[#011a34] text-gray-300 dark:text-white focus:border-theme-orange active:border-theme-orange cursor-pointer"
                  />
                  {errors.moving_address_date_and_time && (
                    <p className="text-red-500 text-xs">
                      {errors.moving_address_date_and_time}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full mt-2">
                <AddressAutocomplete
                  value={formData.moving_address}
                  onChange={(address) =>
                    handleChange({
                      target: { name: 'moving_address', value: address },
                    })
                  }
                  placeholder="please enter the loading address"
                  label={`Your Loading Address<span className="">*</span>`}
                  className="mt-2 block w-full  rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                  fieldClassName="rounded-lg  bg-[#011a34] border-1 border-[#011a34] active:border-theme-orange"
                  labelClassName="text-gray-400 dark:text-white text-sm font-outfit font-light"
                />
                {/* <label
                  htmlFor="pickup_l"
                  className="text-gray-400 dark:text-white text-sm font-outfit font-light"
                >
                  Pickup Location <span className="">*</span>
                </label>
                <input
                  type="tel"
                  id="pickup"
                  className="w-full rounded-lg  bg-[#011a34] border-1 border-[#011a34] active:border-theme-orange"
                  name="moving_address"
                  value={formData.moving_address}
                  onChange={handleChange}
                  required
                />*/}
                {errors.moving_address && (
                  <p className="text-red-500 text-xs">
                    {errors.moving_address}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full mt-2">
                <AddressAutocomplete
                  value={formData.unloading_address}
                  onChange={(address) =>
                    handleChange({
                      target: { name: 'unloading_address', value: address },
                    })
                  }
                  placeholder="please enter the unloading address"
                  label={`Your Unloading Address<span className="">*</span>`}
                  className="mt-2 block w-full rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                  fieldClassName="rounded-lg  bg-[#011a34] border-1 border-[#011a34] active:border-theme-orange"
                  labelClassName="text-gray-400 dark:text-white text-sm font-outfit font-light"
                />
                {/* <label
                  htmlFor="final_d"
                  className="text-gray-400 dark:text-white text-sm font-outfit font-light"
                >
                  Final Destination <span className="text-theme-orange">*</span>
                </label>
                <input
                  type="tel"
                  id="final"
                  className="w-full rounded-lg  bg-[#011a34] border-1 border-[#011a34] active:border-theme-orange"
                  name="unloading_address"
                  value={formData.unloading_address}
                  onChange={handleChange}
                  required
                />*/}
                {errors.unloading_address && (
                  <p className="text-red-500 text-xs">
                    {errors.unloading_address}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 w-full mt-2">
                {/* <p className="text-gray-400 dark:text-white text-sm font-outfit font-light">
                 <span className="">*</span> Indicates a required field
                </p> */}
              </div>
              <div className="flex justify-center items-center gap-2 animate-slide-in-left mt-4 w-full">
                <ThemeButton
                  isSubmitting={isSubmitting}
                  handleSubmit={() => handleSubmit(new Event('submit'))}
                >
                  Request Quote
                </ThemeButton>
              </div>
            </form>
            {/* </div> */}
          </div>

          <Lines
            linesColor="white"
            strokeWidth={1}
            className="mr-80 lg:block hidden"
            layer="background"
            height="100vh"
          />
        </div>
      </div>
      {/* hover styles are provided in reusable DateTimePicker */}
    </>
  );
};

export default QuoteComponent;
