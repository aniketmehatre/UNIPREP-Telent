import { TestBed } from '@angular/core/testing';

import { LifeAtService } from './life-at.service';

describe('LifeAtService', () => {
  let service: LifeAtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LifeAtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
