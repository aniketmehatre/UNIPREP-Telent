import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EduLoanCompareComponent } from './edu-loan-compare.component';

describe('EduLoanCompareComponent', () => {
  let component: EduLoanCompareComponent;
  let fixture: ComponentFixture<EduLoanCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EduLoanCompareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EduLoanCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
