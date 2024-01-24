import { TestBed } from '@angular/core/testing';

import { ScholarshipListService } from './scholarship-list.service';

describe('ScholarshipListService', () => {
  let service: ScholarshipListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScholarshipListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
