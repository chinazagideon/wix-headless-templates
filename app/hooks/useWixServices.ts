import { useState, useEffect } from 'react';
import { ServiceInfoViewModel } from '@app/model/service/service.mapper';
import { wixService } from '@app/services/wixService';

export const useWixServices = () => {
  const [services, setServices] = useState<ServiceInfoViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setIsFetching(true);
        const fetchedServices = await wixService.getServices();
        setServices(fetchedServices);
      } catch (err) {
        console.error('Error in useWixServices:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch services'
        );
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    };

    fetchServices();
  }, []);

  return { services, isLoading, error, isFetching };
};

export const useWixServiceBySlug = (slug: string) => {
  const [service, setService] = useState<ServiceInfoViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const fetchedService = await wixService.getServiceBySlug(slug);
        setService(fetchedService);
      } catch (err) {
        console.error('Error in useWixServiceBySlug:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch service'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchService();
    }
  }, [slug]);

  return { service, isLoading, error };
};
