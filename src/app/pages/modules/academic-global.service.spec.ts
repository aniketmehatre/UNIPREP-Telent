import { TestBed } from '@angular/core/testing';

import { AcademicGlobalService } from './academic-global.service';

describe('AcademicGlobalService', () => {
  let service: AcademicGlobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcademicGlobalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
