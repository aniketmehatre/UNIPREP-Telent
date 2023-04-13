import { TestBed } from '@angular/core/testing';

import { PreAppService } from './pre-app.service';

describe('PreAppService', () => {
  let service: PreAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
