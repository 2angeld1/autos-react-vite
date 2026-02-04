export interface Review {
  id: string;
  _id: string;
  carId: string;
  userName: string;
  rating: number;
  comment: string;
  reply?: string;
  repliedAt?: string;
  isApproved: boolean;
  ip?: string;
  createdAt: string;
  updatedAt: string;
  car?: {
    make: string;
    model: string;
    year: number;
  };
}
