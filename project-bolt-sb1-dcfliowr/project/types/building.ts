export interface Building {
  id: string;
  name: string;
  address: string;
  neighborhood?: string;
  innerDoorCode: string;
  outerDoorCode: string;
  notes?: string;
  createdAt: string;
  lastViewed: string;
}