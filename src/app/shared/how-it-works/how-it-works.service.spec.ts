import { TestBed } from '@angular/core/testing';

import { HowItWorksService } from './how-it-works.service';

describe('HowItWorksService', () => {
  let service: HowItWorksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HowItWorksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
