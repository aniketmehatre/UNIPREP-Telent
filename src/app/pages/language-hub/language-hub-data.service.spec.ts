import { TestBed } from '@angular/core/testing';

import { LanguageHubDataService } from './language-hub-data.service';

describe('LanguageHubDataService', () => {
  let service: LanguageHubDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageHubDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
