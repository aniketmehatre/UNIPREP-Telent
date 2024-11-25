/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EmployerGlobalService } from './employer-global.service';

describe('Service: EmployerGlobal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployerGlobalService]
    });
  });

  it('should ...', inject([EmployerGlobalService], (service: EmployerGlobalService) => {
    expect(service).toBeTruthy();
  }));
});
