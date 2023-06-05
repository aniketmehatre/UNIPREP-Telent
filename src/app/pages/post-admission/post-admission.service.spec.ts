import {TestBed} from '@angular/core/testing';

import {PostAdmissionService} from './post-admission.service';

describe('PostAdmissionService', () => {
    let service: PostAdmissionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PostAdmissionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
