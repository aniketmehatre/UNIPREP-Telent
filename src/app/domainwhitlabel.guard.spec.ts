import { TestBed } from '@angular/core/testing';

import { DomainwhitlabelGuard } from './domainwhitlabel.guard';

describe('DomainwhitlabelGuard', () => {
  let guard: DomainwhitlabelGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DomainwhitlabelGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
