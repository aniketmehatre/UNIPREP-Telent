import { TestBed } from '@angular/core/testing';

import { TravelCostEstimatorService } from './travel-cost-estimator.service';

describe('TravelCostEstimatorService', () => {
  let service: TravelCostEstimatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelCostEstimatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
