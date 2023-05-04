import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SopSampleComponent} from './sop-sample.component';

describe('SopSampleComponent', () => {
    let component: SopSampleComponent;
    let fixture: ComponentFixture<SopSampleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SopSampleComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SopSampleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
