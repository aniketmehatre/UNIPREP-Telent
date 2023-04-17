import { TestBed } from '@angular/core/testing';

import { PostApplicationService } from './post-application.service';

describe('PostApplicationService', () => {
  let service: PostApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
