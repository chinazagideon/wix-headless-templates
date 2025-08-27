'use client';

import { useMutation } from '@tanstack/react-query';
import { useClientAuthSession } from '@app/hooks/useClientAuthSession';

type SubmissionValues = Record<string, any>;

export type UseFormOptions = {
  captchaToken?: string | null;
};

export type UseFormReturn = {
  submit: (
    values: SubmissionValues,
    options?: UseFormOptions
  ) => Promise<any>;
  isSubmitting: boolean;
  error: unknown;
  data: any;
  reset: () => void;
};

const GUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const HEX32_REGEX = /^[0-9a-fA-F]{32}$/;

const normalizeToGuid = (value: string): string => {
  if (GUID_REGEX.test(value)) return value;
  const compact = value.replace(/[^a-fA-F0-9]/g, '');
  if (HEX32_REGEX.test(compact)) {
    return (
      compact.slice(0, 8) +
      '-' +
      compact.slice(8, 12) +
      '-' +
      compact.slice(12, 16) +
      '-' +
      compact.slice(16, 20) +
      '-' +
      compact.slice(20)
    );
  }
  return value;
};

/**
 * useForms
 * Minimal hook around wixClient.submissions.createSubmission
 */
export const useForms = (formId: string): UseFormReturn => {
  const session = useClientAuthSession();
  const normalizedFormId = normalizeToGuid(formId);

  const mutation = useMutation({
    mutationFn: async ({ values, options }: { values: SubmissionValues; options?: UseFormOptions }) => {
      if (!GUID_REGEX.test(normalizedFormId)) {
        throw new Error('Invalid Wix Forms formId. Expected GUID format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
      }
      const payload: any = { formId: normalizedFormId, submissions: values };

      // Prefer server submission for elevated permissions if available
      try {
        const res = await fetch('/api/forms/submit', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...payload, captchaToken: options?.captchaToken }),
        });
        if (res.ok) return res.json();
      } catch {}

      // Fallback to client submission (visitor tokens)
      if (!session?.wixClient) throw new Error('Wix client is not initialized');
      const result = await session.wixClient.submissions.createSubmission(
        payload,
        options?.captchaToken ? { captchaToken: options.captchaToken } : undefined
      );
      return result;
    },
  });

  return {
    submit: async (values: SubmissionValues, options?: UseFormOptions) =>
      mutation.mutateAsync({ values, options }),
    isSubmitting: mutation.isLoading,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
};

export default useForms;


