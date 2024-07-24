import { TestBed } from '@angular/core/testing';

import { SalaryConverterService } from './salary-converter.service';

describe('SalaryConverterService', () => {
  let service: SalaryConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaryConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
