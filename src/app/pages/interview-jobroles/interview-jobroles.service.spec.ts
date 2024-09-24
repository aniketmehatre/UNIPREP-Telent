import { TestBed } from '@angular/core/testing';

import { InterviewJobrolesService } from './interview-jobroles.service';

describe('InterviewJobrolesService', () => {
  let service: InterviewJobrolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterviewJobrolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
