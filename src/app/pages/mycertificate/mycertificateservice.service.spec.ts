import { TestBed } from '@angular/core/testing';

import { MycertificateserviceService } from './mycertificateservice.service';

describe('MycertificateserviceService', () => {
  let service: MycertificateserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MycertificateserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
