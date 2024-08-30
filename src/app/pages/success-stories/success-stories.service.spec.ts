import { TestBed } from '@angular/core/testing';

import { SuccessStoriesService } from './success-stories.service';

describe('SuccessStoriesService', () => {
  let service: SuccessStoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuccessStoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
