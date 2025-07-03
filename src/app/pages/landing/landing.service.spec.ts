/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { landingServices } from './landing.service';

describe('Service: Landing', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [landingServices]
    });
  });

  it('should ...', inject([landingServices], (service: landingServices) => {
    expect(service).toBeTruthy();
  }));
});
