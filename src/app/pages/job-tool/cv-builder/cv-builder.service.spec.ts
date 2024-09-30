import { TestBed } from '@angular/core/testing';

import { CvBuilderService } from './cv-builder.service';

describe('CvBuilderService', () => {
  let service: CvBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CvBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
