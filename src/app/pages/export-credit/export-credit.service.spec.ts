import { TestBed } from '@angular/core/testing';

import { ExportCreditService } from './export-credit.service';

describe('ExportCreditService', () => {
  let service: ExportCreditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportCreditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
