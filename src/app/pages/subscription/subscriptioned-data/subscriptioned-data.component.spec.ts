import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionedDataComponent } from './subscriptioned-data.component';

describe('SubscriptionedDataComponent', () => {
  let component: SubscriptionedDataComponent;
  let fixture: ComponentFixture<SubscriptionedDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionedDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
