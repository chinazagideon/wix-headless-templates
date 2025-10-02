import { useForms } from '../useForms';
import { useCallback, useState } from 'react';
import { PricingCalculator } from '@app/services/PricingCalculator';

// import {  } from '@app/services/PricingCalculator';

/**
 * FormData interface
 * @param first_name - The first name
 * @param last_name - The last name
 * @param service_type - The service type
 * @param moveCategory - The move category
 */
export interface FormData {
  // Step 1: Move Type
  first_name: string;
  last_name: string;
  service_type: string;
  service_id: string;
  moveCategory: string;

  // Step 2: Move Size
  pickup_room_size: string;
  destination_room_size: string;
  rooms: string;
  special_items: Record<string, number>;

  // Step 3: Location & Details
  pickup_address: string;
  destination_address: string;
  destination_building_type: string;
  destination_has_elevator: string;
  move_date: string;
  additional_info?: string;
  pickup_building_type: string;
  move_time: string;
  email_e1ca: string;
  phone_9f17: string;
  moving_address_date_and_time: string;
  has_elevator?: string;
  stairs_count?: number;
  addons: string[];

  // Pricing & Booking Details
  mover_count: number; // 2 or 3 movers
  selected_hours: number; // minimum 2, user can increase
  selected_time_slot?: any; // Time slot from availability
  appointment_date?: string; // Selected appointment date

  // Distance calculation (for travel fees)
  distance_miles?: number;

  // Stairs calculation
  pickup_stairs_count?: number;
  destination_stairs_count?: number;

  // Billing Address
  billing_country: string;
  billing_address: string;
  billing_city: string;
  billing_zip: string;
}

/**
 * useBookingForm hook
 * @returns {Object} - The useBookingForm hook
 */
export const useBookingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [formHasError, setFormHasError] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    service_type: '',
    service_id: '',
    moveCategory: '',
    pickup_room_size: '',
    destination_room_size: '',
    rooms: '',
    special_items: {},
    pickup_address: '',
    destination_address: '',
    destination_building_type: '',
    destination_has_elevator: '',
    destination_stairs_count: 0,
    move_date: '',
    additional_info: '',
    pickup_building_type: '',
    move_time: '',
    email_e1ca: '',
    phone_9f17: '',
    moving_address_date_and_time: '',
    has_elevator: '',
    stairs_count: 0,
    addons: [],
    // New pricing fields
    mover_count: 2, // Default to 2 movers
    selected_hours: 2, // Minimum 2 hours
    selected_time_slot: null,
    appointment_date: '',
    distance_miles: 0,
    pickup_stairs_count: 0,
    // Billing Address defaults
    billing_country: '',
    billing_address: '',
    billing_city: '',
    billing_zip: '',
  });

  /**
   * isRelocationService function
   * @returns {boolean} - Whether the service type is a residential or commercial service
   */
  const isRelocationService = useCallback(() => {
    // Check if service type is NOT residential or commercial (non-truck services)
    // Return true for non-relocation services (labour, furniture, packing) that need destination flow
    return (
      !formData.service_type?.toLowerCase().includes('residential') &&
      !formData.service_type?.toLowerCase().includes('commercial')
    );
  }, [formData.service_type]);

  /**
   * nextStep function
   * @returns {void}
   */
  const nextStep = useCallback(() => {
    if (currentStep < 5) {
      if (currentStep === 2 && isRelocationService()) {
        setCurrentStep(currentStep + 2);
      } else {
        setCurrentStep(currentStep + 1);
      }
      // Smooth scroll to top of page after DOM update
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [currentStep, isRelocationService]);

  /**
   * prevStep function
   * @returns {void}
   */
  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      if (currentStep === 4 && isRelocationService()) {
        setCurrentStep(currentStep - 2);
      } else {
        setCurrentStep(currentStep - 1);
      }

      // Smooth scroll to top of page after DOM update
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [currentStep, isRelocationService]);

  /**
   * updateFormData function
   * @param {keyof FormData} field - The field to update
   * @param {any} value - The value to update the field with
   * @returns {void}
   */
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

  /**
   * validateForm function
   * @param {FormData} data - The form data to validate
   * @returns {Partial<Record<keyof FormData, string>>} - The validation errors
   */
  const validateForm = useCallback((data: FormData) => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!data.service_type || !data.service_type.trim()) {
      newErrors.service_type = 'Please select a service';
    }
    if (!data.pickup_room_size || !data.pickup_room_size.trim()) {
      newErrors.pickup_room_size = 'Please select move size';
    }
    if (!data.pickup_building_type || !data.pickup_building_type.trim()) {
      newErrors.pickup_building_type = 'Please select building type';
    }
    if (
      !data.destination_building_type ||
      !data.destination_building_type.trim()
    ) {
      newErrors.destination_building_type = 'Please select building type';
    }
    if (
      !data.destination_has_elevator ||
      !data.destination_has_elevator.trim()
    ) {
      newErrors.destination_has_elevator =
        'Please select if you have an elevator';
    }
    if (!data.destination_stairs_count || !data.destination_stairs_count) {
      newErrors.destination_stairs_count =
        'Please select how many stairs you have';
    }
    if (!data.first_name || !data.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!data.last_name || !data.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    if (!data.email_e1ca || !data.email_e1ca.trim()) {
      newErrors.email_e1ca = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(data.email_e1ca)) {
      newErrors.email_e1ca = 'Enter a valid email address';
    }
    const digits = (data.phone_9f17 || '').replace(/\D/g, '');
    if (!digits) {
      newErrors.phone_9f17 = 'Phone number is required';
    } else if (digits.length < 10) {
      newErrors.phone_9f17 = 'Enter a valid phone number';
    }

    if (!data.pickup_address || !data.pickup_address.trim()) {
      newErrors.pickup_address = 'Pickup location is required';
    }
    if (!data.destination_address || !data.destination_address.trim()) {
      newErrors.destination_address = 'Final destination is required';
    }

    // Billing Address validation
    if (!data.billing_country || !data.billing_country.trim()) {
      newErrors.billing_country = 'Country is required';
    }
    if (!data.billing_address || !data.billing_address.trim()) {
      newErrors.billing_address = 'Address is required';
    }
    if (!data.billing_city || !data.billing_city.trim()) {
      newErrors.billing_city = 'City is required';
    }
    if (!data.billing_zip || !data.billing_zip.trim()) {
      newErrors.billing_zip = 'ZIP/Postal code is required';
    }

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

  /**
   * handleStepValidation function
   * @param {number} step - The step to validate
   * @returns {void}
   */
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
        if (validationErrors.pickup_room_size)
          stepErrors.pickup_room_size = validationErrors.pickup_room_size;
        if (validationErrors.pickup_building_type)
          stepErrors.pickup_building_type =
            validationErrors.pickup_building_type;
        setErrors(stepErrors);
        if (
          !validationErrors.pickup_room_size &&
          !validationErrors.pickup_building_type
        )
          setCurrentStep(step + 1);
        return;
      }
      if (step === 3) {
        const stepErrors: Partial<Record<keyof FormData, string>> = {};
        if (validationErrors.destination_room_size)
          stepErrors.destination_room_size =
            validationErrors.destination_room_size;
        if (validationErrors.destination_building_type)
          stepErrors.destination_building_type =
            validationErrors.destination_building_type;
        setErrors(stepErrors);
        if (
          !validationErrors.destination_room_size &&
          !validationErrors.destination_building_type
        )
          setCurrentStep(step + 1);
        return;
      }
    },
    [formData, validateForm]
  );

  /**
   * gotoStep function
   * @param {number} step - The step to go to
   * @returns {void}
   */
  const gotoStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  /**
   * isStepValid function
   * @param {number} step - The step to validate
   * @returns {boolean} - Whether the step is valid
   */
  const isStepValid = useCallback(
    (step: number) => {
      switch (step) {
        case 1:
          // Allow proceeding even without availability check
          // Business owner will approve/reject booking manually
          return (
            Boolean(formData.service_type) &&
            Boolean(formData.service_id) &&
            Boolean(formData.moving_address_date_and_time)
          );
        case 2:
          return (
            formData.pickup_address &&
            formData.pickup_building_type &&
            validateBuildingType(
              formData.pickup_building_type,
              formData.has_elevator || '',
              formData.stairs_count || 0
            ) &&
            formData.pickup_room_size
          );

        case 3:
          return (
            formData.destination_address &&
            formData.destination_building_type &&
            validateBuildingType(
              formData.destination_building_type,
              formData.destination_has_elevator || '',
              formData.destination_stairs_count || 0
            )
          );
        case 4:
          return true;
        case 5:
          return (
            formData.first_name &&
            formData.last_name &&
            formData.email_e1ca &&
            formData.phone_9f17 &&
            formData.moving_address_date_and_time &&
            formData.billing_country &&
            formData.billing_address &&
            formData.billing_city &&
            formData.billing_zip
          );
        default:
          return false;
      }
    },
    [formData]
  );

  /**
   * validateBuildingType function
   * @param {string} field - The field to validate
   * @returns {boolean} - Whether the field is valid
   */
  const validateBuildingType = (
    field: string,
    hasElevator: string,
    stairsCount: number
  ) => {
    if (field === 'Apartment') {
      if (hasElevator?.toLowerCase() === 'yes') {
        return true;
      } else if (hasElevator?.toLowerCase() === 'no') {
        return Number(stairsCount) >= 1;
      }
      return false;
    }
    return true;
  };

  /**
   * onClickHasElevator function
   * @param {any} field - The field to update
   * @param {string} value - The value to update the field with
   * @returns {void}
   */
  const onClickHasElevator = (field: any, value: string) => {
    updateFormData(field, value);
  };

  return {
    // State
    currentStep,
    formData,
    isCompleted,
    formHasError,
    errors,
    isRelocationService,
    // Actions
    updateFormData,
    nextStep,
    prevStep,
    isStepValid,
    onClickHasElevator,
    handleStepValidation,
    gotoStep,
  };
};
