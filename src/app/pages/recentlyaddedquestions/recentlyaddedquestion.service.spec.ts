import { TestBed } from '@angular/core/testing';

import { RecentlyaddedquestionService } from './recentlyaddedquestion.service';

describe('RecentlyaddedquestionService', () => {
  let service: RecentlyaddedquestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecentlyaddedquestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
