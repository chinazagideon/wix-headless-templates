import { FormData } from '@app/hooks/booking/useBookingForm';

export const moveTypes = [
  {
    name: 'residential',
    label: 'Residential Move',
  },
  {
    name: 'commercial',
    label: 'Commercial Move',
  },
  {
    name: 'labour',
    label: 'Labour Only',
  },
  {
    name: 'furniture',
    label: 'Furniture Assembly/Disassembly',
  },
  {
    name: 'packing-unpack',
    label: 'Packing/Unpacking',
  },
];
// Types for Wix collection data
export interface ServiceRate {
  id: string;
  title: string;
  moverCount: number;
  moveType: (typeof moveTypes)[number];
  basePrice: number;
  currency: string;
  isActive: boolean;
}

export interface TravelFee {
  id: string;
  title: string;
  baseFee: number;
  perMileFee: number;
  maxDistance: number;
  isActive: boolean;
}

export interface TruckFee {
  id: string;
  title: string;
  moverCount: number;
  baseFee: number;
  isActive: boolean;
}

export interface StairFee {
  id: string;
  title: string;
  pricePerFlight: number;
  currency: string;
  isActive: boolean;
}

export interface SpecialItem {
  id: string;
  title: string;
  basePrice: number;
  pricePerHour: number;
  requiresExtraMovers: boolean;
  isActive: boolean;
}

export interface Addon {
  id: string;
  title: string;
  basePrice: number;
  pricePerRoom?: number;
  isActive: boolean;
}

export interface PricingData {
  serviceRates: ServiceRate[];
  travelFees: TravelFee[];
  truckFees: TruckFee[];
  stairFees: StairFee[];
  specialItems: SpecialItem[];
  addons: Addon[];
}

export interface CalculatedPricing {
  baseServicePrice: number;
  travelFee: number;
  truckFee: number;
  stairsFee: number;
  specialItemsFee: number;
  addonsFee: number;
  totalBeforeHours: number;
  totalAfterHours: number;
  finalTotal: number;
  isTruckService: boolean;
  breakdown: {
    moverCount: number;
    moveType: string;
    selectedHours: number;
    basePricePerHour: number;
    totalBasePrice: number;
    travelFee: number;
    truckFee: number;
    stairsFee: number;
    specialItemsFee: number;
    addonsFee: number;
  };
}

export class PricingCalculator {
  private pricingData: PricingData;

  constructor(pricingData: PricingData) {
    this.pricingData = pricingData;
  }

  /**
   * Calculate comprehensive pricing for a booking
   */
  calculatePricing(formData: FormData): CalculatedPricing {
    const {
      mover_count,
      selected_hours,
      special_items,
      addons,
      distance_miles,
      pickup_stairs_count,
      destination_stairs_count,
      service_type,
    } = formData;

    // Extract move type from service_type
    const move_type = this.extractMoveTypeFromService(service_type);

    // 1. Base Service Price (per hour)
    const baseServicePrice = this.getBaseServicePrice(mover_count, move_type);

    // 2. Travel Fee
    const travelFee = this.calculateTravelFee(distance_miles || 0);

    // 3. Truck Fee
    const truckFee = this.getTruckFee(mover_count, move_type);

    // 4. Stairs Fee
    const stairsFee = this.calculateStairsFee(
      (pickup_stairs_count || 0) + (destination_stairs_count || 0)
    );

    // 5. Special Items Fee
    const specialItemsFee = Number(
      this.calculateSpecialItemsFee(special_items, selected_hours)
    );

    // 6. Addons Fee
    const addonsFee = Number(this.calculateAddonsFee(addons, formData.rooms));

    // Calculate totals
    // Base service price is multiplied by hours, other fees are one-time

    const totalBasePrice = Number(baseServicePrice) * Number(selected_hours);
    const oneTimeFees =
      Number(travelFee) +
      Number(truckFee) +
      Number(stairsFee) +
      Number(specialItemsFee) +
      Number(addonsFee);
    const tax = Number(oneTimeFees) * 0.05;
    const finalTotal = totalBasePrice + oneTimeFees + tax;

    // Debug logging
    // console.log('Pricing Calculation Debug:', {
    //     baseServicePrice: Number(baseServicePrice),
    //     selected_hours: Number(selected_hours),
    //     totalBasePrice,
    //     travelFee: Number(travelFee),
    //     truckFee: Number(truckFee),
    //     stairsFee: Number(stairsFee),
    //     specialItemsFee: Number(specialItemsFee),
    //     addonsFee: Number(addonsFee),
    //     oneTimeFees,
    //     finalTotal
    // });

    return {
      baseServicePrice,
      travelFee,
      truckFee,
      stairsFee,
      specialItemsFee,
      addonsFee,
      totalBeforeHours: totalBasePrice,
      totalAfterHours: finalTotal,
      finalTotal,
      isTruckService: this.isTruckService(move_type),
      breakdown: {
        moverCount: mover_count,
        moveType: move_type,
        selectedHours: selected_hours,
        basePricePerHour: baseServicePrice,
        totalBasePrice: totalBasePrice,
        travelFee,
        truckFee,
        stairsFee,
        specialItemsFee,
        addonsFee,
      },
    };
  }

  /**
   * Extract move type from service_type string
   */
  private extractMoveTypeFromService(serviceType: string): string {
    if (!serviceType) return 'residential'; // Default to residential
    const foundType = moveTypes.find((type) =>
      serviceType.toLowerCase().includes(type.name.toLowerCase())
    );
    if (foundType) return foundType.label;
    return 'residential';
  }

  /**
   * Get base service price per hour based on mover count and move type
   */
  private getBaseServicePrice(moverCount: number, moveType: any): number {
    // Convert label back to name for comparison
    const moveTypeName =
      moveTypes.find((type) => type.label === moveType)?.name || moveType;

    // Match your actual data structure
    const serviceRate = this.pricingData.serviceRates.find(
      (rate) =>
        rate.moveType === moveTypeName &&
        rate.moverCount === moverCount &&
        rate.isActive
    );
    return serviceRate?.basePrice || 120; // Fallback to default price
  }

  /**
   * Calculate travel fee based on distance
   */
  private calculateTravelFee(distanceMiles: number): number {
    const travelFee = this.pricingData.travelFees.find((fee) => fee.isActive);
    if (!travelFee) return 0;

    // Base fee + per mile fee
    // return travelFee.baseFee + (distanceMiles * travelFee.perMileFee);
    return travelFee.baseFee;
  }

  /**
   * Get truck fee based on mover count
   */
  private getTruckFee(moverCount: number, move_type: string): number {
    const truckFee = this.pricingData.truckFees.find(
      (fee) => fee.moverCount === moverCount && fee.isActive
    );

    if (!this.isTruckService(move_type)) return 0;
    return truckFee?.baseFee || 0;
  }

  /**
   * Calculate stairs fee based on total flights
   */
  private calculateStairsFee(totalFlights: number): number {
    // this.calculateAddonsFee
    const stairFee = this.pricingData.stairFees.find((fee) => fee.isActive);
    if (!stairFee) return 0;

    return totalFlights * stairFee.pricePerFlight;
  }

  /**
   * Calculate special items fee
   */
  private calculateSpecialItemsFee(
    specialItems: Record<string, number>,
    hours: number
  ): number {
    let totalFee = 0;

    Object.entries(specialItems).forEach(([itemName, quantity]) => {
      const specialItem = this.pricingData.specialItems.find(
        (item) =>
          item.title.toLowerCase() === itemName.toLowerCase() && item.isActive
      );

      if (specialItem && quantity > 0) {
        // Base price
        totalFee += specialItem.basePrice * quantity;
      }
    });

    return totalFee;
  }

  /**
   * Calculate addons fee
   */
  private calculateAddonsFee(addons: string[], roomCount: string): number {
    let totalFee = 0;
    const rooms = parseInt(roomCount) || 1;

    addons.forEach((addonName) => {
      const addon = this.pricingData.addons.find(
        (item) =>
          item.title.toLowerCase() === addonName.toLowerCase() && item.isActive
      );

      if (addon) {
        // Base price + per room price if applicable
        if (addon.pricePerRoom && addon.pricePerRoom > 0) {
          totalFee += addon.basePrice + addon.pricePerRoom * rooms;
        } else {
          totalFee += addon.basePrice;
        }
      }
    });

    return totalFee;
  }

  public isTruckService(serviceType: string): boolean {
    return serviceType === 'residential' || serviceType === 'commercial';
  }

  /**
   * Get available mover counts for UI
   */
  getAvailableMoverCounts(): number[] {
    const counts = new Set<number>();
    this.pricingData.serviceRates
      .filter((rate) => rate.isActive)
      .forEach((rate) => counts.add(rate.moverCount));
    return Array.from(counts).sort();
  }

  /**
   * Get available move types for UI
   */
  getAvailableMoveTypes(): (typeof moveTypes)[number][] {
    const typeNames = new Set<string>();
    this.pricingData.serviceRates
      .filter((rate) => rate.isActive)
      .forEach((rate) => typeNames.add(rate.moveType.name));
    return moveTypes.filter((type) => typeNames.has(type.name));
  }

  /**
   * Get minimum bookable hours
   */
  getMinimumHours(): number {
    return 2; //min hour requirement
  }

  /**
   * Get maximum bookable hours (optional limit)
   */
  getMaximumHours(): number {
    return 12; // Reasonable limit, can be configured
  }
}
