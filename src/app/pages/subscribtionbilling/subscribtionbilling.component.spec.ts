import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SubscribtionbillingComponent} from './subscribtionbilling.component';

describe('SubscribtionbillingComponent', () => {
    let component: SubscribtionbillingComponent;
    let fixture: ComponentFixture<SubscribtionbillingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SubscribtionbillingComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SubscribtionbillingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
