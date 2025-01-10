import { TestBed } from '@angular/core/testing';

import { EducationToolsService } from './education-tools.service';

describe('EducationToolsService', () => {
  let service: EducationToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EducationToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
