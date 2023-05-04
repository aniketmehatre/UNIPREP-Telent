import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SopSampleSubcatgoryComponent} from './sop-sample-subcatgory.component';

describe('SopSampleSubcatgoryComponent', () => {
    let component: SopSampleSubcatgoryComponent;
    let fixture: ComponentFixture<SopSampleSubcatgoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SopSampleSubcatgoryComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SopSampleSubcatgoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
