/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CareerHubService } from './career-hub.service';

describe('Service: CareerHub', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CareerHubService]
    });
  });

  it('should ...', inject([CareerHubService], (service: CareerHubService) => {
    expect(service).toBeTruthy();
  }));
});
