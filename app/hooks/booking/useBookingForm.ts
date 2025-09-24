import { useForms } from '../useForms';
import { useCallback, useState } from 'react';

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
  moveCategory: string;

  // Step 2: Move Size
  move_size: string;
  rooms: string;
  special_items: Record<string, number>;

  // Step 3: Location & Details
  pickup_address: string;
  destination_address: string;
  destination_building_type: string;
  destination_has_elevator: string;
  destination_stairs_count: string;
  move_date: string;
  additional_info?: string;
  pickup_building_type: string;
  move_time: string;
  email_e1ca: string;
  phone_9f17: string;
  moving_address_date_and_time: string;
  has_elevator?: string;
  stairs_count?: string;
  addons: string[];
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
    moveCategory: '',
    move_size: '',
    rooms: '',
    special_items: {},
    pickup_address: '',
    destination_address: '',
    destination_building_type: '',
    destination_has_elevator: '',
    destination_stairs_count: '',
    move_date: '',
    additional_info: '',
    pickup_building_type: '',
    move_time: '',
    email_e1ca: '',
    phone_9f17: '',
    moving_address_date_and_time: '',
    has_elevator: '',
    stairs_count: '',
    addons: [],
  });

  /**
   * nextStep function
   * @returns {void}
   */
  const nextStep = useCallback(() => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  }, [currentStep]);

  /**
   * prevStep function
   * @returns {void}
   */
  const prevStep = useCallback(() => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  }, [currentStep]);

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
    if (!data.move_size || !data.move_size.trim()) {
      newErrors.move_size = 'Please select move size';
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
    if (
      !data.destination_stairs_count ||
      !data.destination_stairs_count.trim()
    ) {
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
        if (validationErrors.move_size)
          stepErrors.move_size = validationErrors.move_size;
        if (validationErrors.pickup_building_type)
          stepErrors.pickup_building_type =
            validationErrors.pickup_building_type;
        setErrors(stepErrors);
        if (
          !validationErrors.move_size &&
          !validationErrors.pickup_building_type
        )
          setCurrentStep(step + 1);
        return;
      }
    },
    [formData, validateForm]
  );

  /**
   * isStepValid function
   * @param {number} step - The step to validate
   * @returns {boolean} - Whether the step is valid
   */
  const isStepValid = useCallback(
    (step: number) => {
      switch (step) {
        case 1:
          return (
            Boolean(formData.service_type) &&
            formData.moving_address_date_and_time
          );
        case 2:
          return (
            formData.pickup_address &&
            formData.pickup_building_type &&
            validateBuildingType(
              formData.pickup_building_type,
              formData.has_elevator || '',
              formData.stairs_count || ''
            )
          );

        case 3:
          return (
            formData.destination_address &&
            formData.destination_building_type &&
            validateBuildingType(
              formData.destination_building_type,
              formData.destination_has_elevator || '',
              formData.destination_stairs_count || ''
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
            formData.moving_address_date_and_time
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
    stairsCount: string
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

    // Actions
    updateFormData,
    nextStep,
    prevStep,
    isStepValid,
    onClickHasElevator,
    handleStepValidation,
  };
};
