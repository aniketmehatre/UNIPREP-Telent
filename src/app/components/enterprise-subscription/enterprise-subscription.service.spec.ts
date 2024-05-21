import { TestBed } from '@angular/core/testing';

import { EnterpriseSubscriptionService } from './enterprise-subscription.service';

describe('EnterpriseSubscriptionService', () => {
  let service: EnterpriseSubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnterpriseSubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
