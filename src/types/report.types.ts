export type ProjectCostDataResponse = {
    year: number;
    estimatedCost: Record<string, number>; // keys = months
    actualCost: Record<string, number>;    // keys = months
    budget: number; // total budget for the year
  }
  