export enum TripStatus {
  Planned = 0,
  Ongoing = 1,
  Completed = 2,
  Canceled = 3,
}

export interface Trip {
  id: number;
  name: string;
  destination: string;
  status: TripStatus;
  travelers: number;
  startDate: string;
  endDate: string;
}

export interface CurrentTripDetails extends Trip {
  numberOfLocations: number;
  numberOfItems: number;
}
