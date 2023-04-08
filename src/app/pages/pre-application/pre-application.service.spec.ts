import { TestBed } from '@angular/core/testing';

import { PreApplicationService } from './pre-application.service';

describe('PreApplicationService', () => {
  let service: PreApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
