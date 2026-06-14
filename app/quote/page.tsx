'use client';

import { useEffect } from 'react';
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  TruckIcon,
  HomeIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { BoxIcon, HandHelping, Loader, SofaIcon } from 'lucide-react';
import PageHeader from '@app/components/Layout/PageHeader';
import DateTimePicker from '@app/components/DateTimePicker/DateTimePicker';
import { useQuotationForm } from '@app/hooks/useQuotationForm';
import TrustBar from '@app/components/ui/TrustBar';
import PlaceAutocompleteInput from '@app/components/ui/PlaceAutocompleteInput';
import ConsentText from './_components/ConsentText';
import QuotePageShell from './_components/QuotePageShell';
import { trackPixelEvent } from '@app/lib/meta-pixel';
import Testimonials from '@app/components/components.v2/Testimonials';
import QuoteForm from '@app/components/components.v2/QuoteForm';

const move_sizes = [
  {
    id: 'small',
    label: 'Small move',
    description: '(studio/bedroom)',
    items: 'Up to 10 items',
  },
  {
    id: 'medium',
    label: 'Medium move',
    description: '(2 - 3 bedrooms)',
    items: '10-25 items',
  },
  {
    id: 'large',
    label: 'Large move',
    description: '(4+ bedrooms)',
    items: '25+ items',
  },
];

const items = [
  'Piano',
  'Pool Table',
  'Large Appliances',
  'Artwork',
  'Antiques',
  // 'Exercise Equipment',
  // 'Floor runners',
  // 'Tall Furniture',
  // 'Heavy Items',
  // 'Fragile Items',
  // 'Electronics',
  'Other',
];

export default function QuotationPage() {
  const {
    currentStep,
    formData,
    errors,
    isSubmitting,
    isFetching,
    visibleServices,
    updateFormData,
    prevStep,
    handleSubmit,
    handleStepValidation,
    isStepValid,
    compareValue,
    formError,
    validatePhoneField,
    serviceError,
  } = useQuotationForm();

  useEffect(() => {
    trackPixelEvent('ViewContent');
  }, []);

  type IconType = typeof HomeIcon;
  const iconByKeyword: Record<string, IconType> = {
    residential: HomeIcon,
    commercial: BuildingOfficeIcon,
    moving: HandHelping,
    furniture: SofaIcon,
    warehousing: HomeIcon,
    packing: BoxIcon,
    unpacking: BoxIcon,
  };

  const getIconForService = (serviceName?: string): IconType => {
    if (!serviceName) return TruckIcon;
    const firstWord = serviceName.trim().split(/\s+/)[0].toLowerCase();
    return iconByKeyword[firstWord] ?? TruckIcon;
  };

  const isMovingHelp = compareValue(formData.service_type, 'Moving Help');

  return (
    <QuotePageShell>
      <PageHeader
        title={`Get a Free Moving Quote`}
        description={`Tell us about your move and get a personalized quote in minutes`}
        className="items-center justify-center"
      />
      <TrustBar />
      <QuoteForm />
      <Testimonials />
    </QuotePageShell>
  );
}
