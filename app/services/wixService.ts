import { createClient, OAuthStrategy } from '@wix/sdk';
import { services } from '@wix/bookings';
import {
  ServiceInfoViewModel,
  mapServiceInfo,
} from '@app/model/service/service.mapper';

class WixService {
  private clientId: string;

  constructor() {
    this.clientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID as string;
    if (!this.clientId) {
      throw new Error('NEXT_PUBLIC_WIX_CLIENT_ID is not configured');
    }
  }

  private createClient() {
    return createClient({
      modules: { services },
      auth: OAuthStrategy({
        clientId: this.clientId,
      }),
    });
  }

  async getServices(): Promise<ServiceInfoViewModel[]> {
    try {
      const wixClient = this.createClient();
      const serviceList = await wixClient.services.queryServices().find();

      // Map the raw services to ServiceInfoViewModel using the existing mapper
      const mappedServices = serviceList.items
        ?.map((service) => mapServiceInfo(service))
        .filter(Boolean) as ServiceInfoViewModel[];

      return mappedServices;
    } catch (error) {
      console.error('Error fetching services from Wix:', error);
      throw new Error(`Failed to fetch services: ${error}`);
    }
  }

  async getServiceBySlug(slug: string): Promise<ServiceInfoViewModel | null> {
    try {
      const wixClient = this.createClient();
      const serviceList = await wixClient.services
        .queryServices()
        .eq('mainSlug.name', slug)
        .find();

      if (serviceList.items && serviceList.items.length > 0) {
        return mapServiceInfo(serviceList.items[0]);
      }

      return null;
    } catch (error) {
      console.error('Error fetching service by slug:', error);
      throw new Error(`Failed to fetch service: ${error}`);
    }
  }

  async getServicesByCategory(
    categoryId: string
  ): Promise<ServiceInfoViewModel[]> {
    try {
      const wixClient = this.createClient();
      const serviceList = await wixClient.services
        .queryServices()
        .eq('category.id', categoryId)
        .find();

      const mappedServices = serviceList.items
        ?.map((service) => mapServiceInfo(service))
        .filter(Boolean) as ServiceInfoViewModel[];

      return mappedServices;
    } catch (error) {
      console.error('Error fetching services by category:', error);
      throw new Error(`Failed to fetch services by category: ${error}`);
    }
  }
}

// Export a singleton instance
export const wixService = new WixService();
