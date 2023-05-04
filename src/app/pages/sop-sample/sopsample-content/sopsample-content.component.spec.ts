import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SopsampleContentComponent} from './sopsample-content.component';

describe('SopsampleContentComponent', () => {
    let component: SopsampleContentComponent;
    let fixture: ComponentFixture<SopsampleContentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SopsampleContentComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SopsampleContentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
