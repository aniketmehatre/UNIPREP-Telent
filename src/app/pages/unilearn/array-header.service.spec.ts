import { TestBed } from '@angular/core/testing';

import { ArrayHeaderService } from './array-header.service';

describe('ArrayHeaderService', () => {
  let service: ArrayHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArrayHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
