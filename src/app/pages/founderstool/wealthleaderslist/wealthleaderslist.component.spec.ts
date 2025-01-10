import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WealthleaderslistComponent } from './wealthleaderslist.component';

describe('WealthleaderslistComponent', () => {
  let component: WealthleaderslistComponent;
  let fixture: ComponentFixture<WealthleaderslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WealthleaderslistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WealthleaderslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
