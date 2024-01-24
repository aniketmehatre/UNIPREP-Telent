import { TestBed } from '@angular/core/testing';

import { InvestorListService } from './investor-list.service';

describe('InvestorListService', () => {
  let service: InvestorListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvestorListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
