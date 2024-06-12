import { TestBed } from '@angular/core/testing';

import { ValidcertificatesService } from './validcertificates.service';

describe('ValidcertificatesService', () => {
  let service: ValidcertificatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidcertificatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
