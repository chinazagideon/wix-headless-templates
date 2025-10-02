import { useCallback, useEffect, useState } from 'react';
import { wixClient } from '@app/server/wix';

export interface TimeSlotCheckResult {
  ok: boolean | null;
  loading: boolean;
  error: string | null;
  details: any | null;
  refresh: () => Promise<void>;
  list: () => Promise<any>;
}

/**
 * useAvailabilityTimeSlot
 * Validates an exact time slot using availabilityTimeSlots.getAvailabilityTimeSlot
 * Inputs are LOCAL start/end in ISO (YYYY-MM-DDThh:mm:ss) per Wix API.
 */
export const useAvailabilityTimeSlot = (
  serviceId: string,
  localStartDate: string | undefined,
  hours: number = 2,
  locationType:
    | 'CUSTOM'
    | 'OWNER_CUSTOM'
    | 'OWNER_BUSINESS'
    | 'UNDEFINED' = 'CUSTOM'
): TimeSlotCheckResult => {
  const [ok, setOk] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<any | null>(null);

  const refresh = useCallback(async () => {
    if (!serviceId || !localStartDate) {
      setOk(null);
      setDetails(null);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setOk(null);
      setDetails(null);

      // Compute local start/end in BUSINESS TIMEZONE with Wix-expected format (no offset)
      const businessTz =
        process.env.NEXT_PUBLIC_BUSINESS_TIMEZONE ||
        Intl.DateTimeFormat().resolvedOptions().timeZone;

      const toLocalIsoNoOffset = (date: Date, tz: string) => {
        const parts = new Intl.DateTimeFormat('en-CA', {
          timeZone: tz,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).formatToParts(date);
        const get = (type: string) =>
          parts.find((p) => p.type === type)?.value || '00';
        const y = get('year');
        const m = get('month');
        const d = get('day');
        const hh = get('hour');
        const mm = get('minute');
        const ss = get('second');
        return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;
      };

      const startUtc = new Date(localStartDate);
      const endUtc = new Date(startUtc);
      endUtc.setHours(endUtc.getHours() + Math.max(2, hours || 2));

      const localStartIso = toLocalIsoNoOffset(startUtc, businessTz);
      const localEndIso = toLocalIsoNoOffset(endUtc, businessTz);

      const location = { locationType } as any;

      // Call server API to avoid client-side 403s
      const apiResp = await fetch('/api/check-availability/time-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          startLocal: localStartIso,
          endLocal: localEndIso,
          timeZone: businessTz,
          locationType: location.locationType,
        }),
      });
      if (!apiResp.ok) {
        const errPayload = await apiResp.json().catch(() => ({}));
        throw new Error(
          errPayload?.error || `Availability API error ${apiResp.status}`
        );
      }
      const apiJson = await apiResp.json();
      console.log('getAvailabilityTimeSlot resp', apiJson);
      // Parse timeSlot per Wix API (not availability)
      const ts = (apiJson?.data as any)?.timeSlot;
      const isAvailable = Boolean(ts?.bookable);

      // Extract resourceId and timezone for downstream booking/checkout
      const resourceId =
        ts?.availableResources?.[0]?.resource?.id ||
        ts?.nestedTimeSlots?.[0]?.availableResources?.[0]?.resource?.id;
      const tz = ts?.timeZone || businessTz;

      // Keep a backward-compatible shape for mapper: expose slot.resource.id & slot.timezone
      const wrapped = {
        slot: {
          resource: resourceId ? { id: resourceId } : undefined,
          timezone: tz,
        },
        timeSlot: ts,
      };

      setOk(isAvailable);
      setDetails(wrapped);
    } catch (err: any) {
      setOk(false);
      setError(err?.message || 'Failed to validate time slot');
      setDetails(null);
    } finally {
      setLoading(false);
    }
  }, [serviceId, localStartDate, hours, locationType]);

  const list = useCallback(async () => {
    if (!serviceId || !localStartDate) return null;
    try {
      const businessTz =
        process.env.NEXT_PUBLIC_BUSINESS_TIMEZONE ||
        Intl.DateTimeFormat().resolvedOptions().timeZone;
      const startUtc = new Date(localStartDate);
      const endUtc = new Date(startUtc);
      endUtc.setHours(endUtc.getHours() + Math.max(2, hours || 2));

      const toLocalIsoNoOffset = (date: Date, tz: string) => {
        const parts = new Intl.DateTimeFormat('en-CA', {
          timeZone: tz,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).formatToParts(date);
        const get = (type: string) =>
          parts.find((p) => p.type === type)?.value || '00';
        return `${get('year')}-${get('month')}-${get('day')}T${get(
          'hour'
        )}:${get('minute')}:${get('second')}`;
      };

      const localStartIso = toLocalIsoNoOffset(startUtc, businessTz);
      const localEndIso = toLocalIsoNoOffset(endUtc, businessTz);

      const res = await fetch('/api/check-availability/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          startLocal: localStartIso,
          endLocal: localEndIso,
          timeZone: businessTz,
          locationType,
        }),
      });
      const json = await res.json();
      console.log('listAvailabilityTimeSlots resp', json);
      return json;
    } catch (e) {
      console.error('listAvailabilityTimeSlots error', e);
      return null;
    }
  }, [serviceId, localStartDate, hours, locationType]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ok, loading, error, details, refresh, list };
};
