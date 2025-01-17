import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WealthleaderreadansComponent } from './wealthleaderreadans.component';

describe('WealthleaderreadansComponent', () => {
  let component: WealthleaderreadansComponent;
  let fixture: ComponentFixture<WealthleaderreadansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WealthleaderreadansComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WealthleaderreadansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
