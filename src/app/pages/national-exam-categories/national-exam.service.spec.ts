import { TestBed } from '@angular/core/testing';

import { NationalExamService } from './national-exam.service';

describe('NationalExamService', () => {
  let service: NationalExamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NationalExamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
