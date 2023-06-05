import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FooterStatusBoxComponent} from './footer-status-box.component';

describe('FooterStatusBoxComponent', () => {
    let component: FooterStatusBoxComponent;
    let fixture: ComponentFixture<FooterStatusBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FooterStatusBoxComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FooterStatusBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
