import { TestBed } from '@angular/core/testing';

import { LanguageArrayGlobalService } from './language-array-global.service';

describe('LanguageArrayGlobalService', () => {
  let service: LanguageArrayGlobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageArrayGlobalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
