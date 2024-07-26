import { TestBed } from '@angular/core/testing';

import { TranslateViewService } from './translate-view.service';

describe('TranslateViewService', () => {
  let service: TranslateViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslateViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
