import { useQuery } from '@tanstack/react-query';
import { ServiceInfoViewModel } from '@app/model/service/service.mapper';
import { wixService } from '@app/services/wixService';

export const useWixServices = () => {
  const { data, isLoading, isFetching, error } = useQuery<
    ServiceInfoViewModel[]
  >(['wixServices'], () => wixService.getServices(), {
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    services: data ?? [],
    isLoading,
    isFetching,
    error: error
      ? error instanceof Error
        ? error.message
        : String(error)
      : null,
  };
};

export const useWixServiceBySlug = (slug: string) => {
  const { data, isLoading, error } = useQuery<ServiceInfoViewModel | null>(
    ['wixService', slug],
    () => wixService.getServiceBySlug(slug),
    {
      enabled: Boolean(slug),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  return {
    service: data ?? null,
    isLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : String(error)
      : null,
  };
};
