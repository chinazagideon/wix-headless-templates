import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { fireQuoteLeadConversion } from '@app/lib/track-google-ads-conversion';
import { trackPixelEvent } from '@app/lib/meta-pixel';
import { useWixServices } from './useWixServices';
import { useForms } from './useForms';
import { useUtmParams } from './useUtmParams';
import { normalizePhoneE164 } from '@app/utils/format-phone';
import { zonedTimeToUtc } from 'date-fns-tz';

export interface FormData {
  // Step 1: Move Type
  first_name: string;
  last_name: string;
  service_type: string;
  moveCategory: string;

  // Step 2: Move Size
  move_size_str: string;
  rooms: string;
  special_items_str: any[];

  // Step 3: Location & Details
  moving_address: string;
  unloading_address: string;
  move_date: string;
  additional_info?: string;
  building_type_str: string;
  move_time: string;
  email_e1ca: string;
  phone_9f17: string;
  moving_address_date_and_time: string;
  has_elevator?: string;
  stairs_count?: string;
  moving_date_and_time?: string;
  destination_building_type?: string;
  form_type?: string;
  casl_consent: boolean;
}

export const useQuotationForm = () => {
  const router = useRouter();
  const utmParams = useUtmParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    service_type: '',
    moveCategory: '',
    move_size_str: '',
    rooms: '',
    special_items_str: [],
    moving_address: '',
    unloading_address: '',
    move_date: '',
    additional_info: '',
    building_type_str: '',
    move_time: '',
    email_e1ca: '',
    phone_9f17: '',
    moving_address_date_and_time: '',
    has_elevator: '',
    stairs_count: '',
    moving_date_and_time: '',
    destination_building_type: '',
    form_type: '',
    casl_consent: false,
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [formHasError, setFormHasError] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const { services, isLoading, error, isFetching } = useWixServices();
  const visibleServices = (services ?? []).filter((s) => !s.hidden);
  const [formId, setFormId] = useState<string | null>(
    process.env.NEXT_PUBLIC_WIX_FORM_ID || ''
  );
  const { submit, isSubmitting, error: formError } = useForms(formId || '');

  // Only send known Wix field IDs to avoid "additional properties" errors
  const allowedWixFieldIds: Array<keyof FormData> = [
    'first_name',
    'last_name',
    'email_e1ca',
    'phone_9f17',
    'service_type',
    'move_size_str',
    'moving_address',
    'unloading_address',
    'building_type_str',
    'special_items_str',
    'moving_address_date_and_time',
    'moving_date_and_time',
    'destination_building_type',
    'form_type',
  ];

  const updateFormData = useCallback(
    (field: keyof FormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if ((errors as any)[field]) {
        const { [field]: _removed, ...rest } = errors as Record<string, string>;
        setErrors(rest as Partial<Record<keyof FormData, string>>);
      }
    },
    [errors]
  );

  const updateMoveDateTime = useCallback(
    (field: 'move_date' | 'move_time', value: string) => {
      setFormData((prev) => {
        const next = { ...prev, [field]: value };
        const hasDate = Boolean(next.move_date);
        const hasTime = Boolean(next.move_time);
        if (hasDate) {
          next.moving_address_date_and_time = hasTime
            ? `${next.move_date}T${next.move_time}`
            : next.move_date;
        } else {
          next.moving_address_date_and_time = '';
        }
        return next;
      });
      if (
        errors.move_date ||
        errors.move_time ||
        errors.moving_address_date_and_time
      ) {
        const { move_date, move_time, moving_address_date_and_time, ...rest } =
          errors;
        setErrors(rest);
      }
    },
    [errors]
  );

  const nextStep = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      // Smooth scroll to top of page after DOM update
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Smooth scroll to top of page after DOM update
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [currentStep]);

  const isEmailOrPhone = useCallback((value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\d{10}$/.test(value);
  }, []);

  const validatePhoneField = useCallback((value: string) => {
    if (!value || !value.trim()) {
      setErrors((prev) => ({
        ...prev,
        phone_9f17: 'Phone number is required',
      }));
      return;
    }
    const digits = value.replace(/\D/g, '');
    const isValid =
      digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
    setErrors((prev) =>
      isValid
        ? (({ phone_9f17: _, ...rest }) => rest)(prev)
        : {
            ...prev,
            phone_9f17: 'Enter a valid phone number (e.g. +1 204 555 1234)',
          }
    );
  }, []);

  const compareValue = useCallback((value: string, compare: string) => {
    return value.includes(compare);
  }, []);

  const validateForm = useCallback((data: FormData) => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!data.service_type || !data.service_type.trim()) {
      newErrors.service_type = 'Please select a service';
    }
    if (!data.move_size_str || !data.move_size_str.trim()) {
      newErrors.move_size_str = 'Please select move size';
    }
    // if (!data.building_type_str || !data.building_type_str.trim()) {
    //   newErrors.building_type_str = 'Please select current building type';
    // }
    // if (
    //   !data.destination_building_type ||
    //   !data.destination_building_type.trim()
    // ) {
    //   newErrors.destination_building_type = 'Please select new building type';
    // }

    if (!data.first_name || !data.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    // if (!data.last_name || !data.last_name.trim()) {
    //   newErrors.last_name = 'Last name is required';
    // }
    if (!data.email_e1ca || !data.email_e1ca.trim()) {
      newErrors.email_e1ca = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(data.email_e1ca)) {
      newErrors.email_e1ca = 'Enter a valid email address';
    }
    const digits = (data.phone_9f17 || '').replace(/\D/g, '');
    if (!digits) {
      newErrors.phone_9f17 = 'Phone number is required';
    } else if (
      !(
        digits.length === 10 ||
        (digits.length === 11 && digits.startsWith('1'))
      )
    ) {
      newErrors.phone_9f17 =
        'Enter a valid phone number (e.g. +1 204 555 1234)';
    }

    if (!data.moving_address || !data.moving_address.trim()) {
      newErrors.moving_address = 'Pickup location is required';
    }
    // if (!data.unloading_address || !data.unloading_address.trim()) {
    //   newErrors.unloading_address = 'Final destination is required';
    // }

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

    return newErrors;
  }, []);

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (!formId) throw new Error('Form ID not resolved yet');
      const sanitized: Record<string, unknown> = { casl_consent: true };
      for (const key of allowedWixFieldIds) {
        const value = data[key];
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'phone_9f17') {
            sanitized[key] = normalizePhoneE164(String(value));
          } else if (key === 'moving_address_date_and_time') {
            sanitized['form_type'] = 'Quote Form';
            const val = String(value);
            if (val.includes('T')) {
              const utcDate = zonedTimeToUtc(val, 'America/Winnipeg');
              sanitized['moving_date_and_time'] = new Date(val).toLocaleString(
                'en-US',
                { timeZone: 'America/Winnipeg' }
              );
            } else {
              sanitized['moving_date_and_time'] = val;
            }
          } else if (key === 'special_items_str') {
            sanitized[key] = Array.isArray(value)
              ? value.join(', ')
              : String(value);
          } else {
            sanitized[key] = value;
          }
        }
      }
      if (utmParams.utm_source) sanitized.utm_source = utmParams.utm_source;
      if (utmParams.campaign_id) sanitized.campaign_id = utmParams.campaign_id;

      return submit(sanitized);
    },
    [formId, submit, utmParams]
  );

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    try {
      await onSubmit(formData);
      fireQuoteLeadConversion();
      trackPixelEvent('Lead');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('quote_first_name', formData.first_name);
      }
      router.push('/quote/thank-you');
    } catch (e) {
      console.error(e);
    }
  }, [formData, validateForm, onSubmit, router]);

  // Validates only the fields present in the single-step v2 QuoteForm
  const handleSimpleSubmit = useCallback(async () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.first_name?.trim())
      newErrors.first_name = 'First name is required';
    if (!formData.email_e1ca?.trim()) {
      newErrors.email_e1ca = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email_e1ca)) {
      newErrors.email_e1ca = 'Enter a valid email address';
    }
    const digits = (formData.phone_9f17 || '').replace(/\D/g, '');
    if (digits) {
      const isValid =
        digits.length === 10 ||
        (digits.length === 11 && digits.startsWith('1'));
      if (!isValid)
        newErrors.phone_9f17 =
          'Enter a valid phone number (e.g. +1 204 555 1234)';
    }
    if (!formData.moving_address?.trim())
      newErrors.moving_address = 'Pickup location is required';
    if (!formData.unloading_address?.trim()) {
      newErrors.unloading_address = 'Final destination is required';
    }
    if (!formData.move_date?.trim()) {
      newErrors.moving_address_date_and_time = 'Move date is required';
    } else if (isNaN(new Date(formData.move_date).getTime())) {
      newErrors.moving_address_date_and_time = 'Enter a valid date';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      formData.form_type = 'Quick Form';
      formData.casl_consent = true;
      await onSubmit(formData);
      fireQuoteLeadConversion();
      trackPixelEvent('Lead');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('quote_first_name', formData.first_name);
      }
      router.push('/quote/thank-you');
    } catch (e) {
      console.error(e);
    }
  }, [formData, onSubmit, router]);
  const isMovingHelp = compareValue(formData.service_type, 'Moving Help');

  const isStepValid = useCallback(
    (step: number) => {
      switch (step) {
        case 1:
          return Boolean(formData.service_type);
        case 2:
          return Boolean(
            formData.move_size_str
            // && formData.building_type_str &&
            // formData.destination_building_type
          );
        case 3:
          return Boolean(
            formData.moving_address &&
              formData.first_name &&
              formData.email_e1ca &&
              formData.phone_9f17 &&
              formData.moving_address_date_and_time
          );
        default:
          return false;
      }
    },
    [formData]
  );

  const handleStepValidation = useCallback(
    (step: number) => {
      const validationErrors = validateForm(formData);
      if (step === 1) {
        const stepErrors: Partial<Record<keyof FormData, string>> = {};
        if (validationErrors.service_type)
          stepErrors.service_type = validationErrors.service_type;
        setErrors(stepErrors);
        if (!validationErrors.service_type) setCurrentStep(step + 1);
        return;
      }
      if (step === 2) {
        const stepErrors: Partial<Record<keyof FormData, string>> = {};
        if (validationErrors.move_size_str)
          stepErrors.move_size_str = validationErrors.move_size_str;
        // if (validationErrors.building_type_str)
        //   stepErrors.building_type_str = validationErrors.building_type_str;
        // if (validationErrors.destination_building_type)
        //   stepErrors.destination_building_type =
        //     validationErrors.destination_building_type;
        // setErrors(stepErrors);
        if (
          !validationErrors.move_size_str
          //  && !validationErrors.building_type_str &&
          //   !validationErrors.destination_building_type
        )
          setCurrentStep(step + 1);
        return;
      }
    },
    [formData, validateForm]
  );

  return {
    // State
    currentStep,
    formData,
    isCompleted,
    formHasError,
    errors,
    isSubmitting,
    formError,
    isLoading,
    serviceError: error,
    isFetching,
    visibleServices,

    updateFormData,
    updateMoveDateTime,
    nextStep,
    prevStep,
    handleSubmit,
    handleSimpleSubmit,
    handleStepValidation,

    isStepValid,
    isEmailOrPhone,
    compareValue,
    validatePhoneField,
  };
};
