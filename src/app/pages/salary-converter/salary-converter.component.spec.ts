import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryConverterComponent } from './salary-converter.component';

describe('SalaryConverterComponent', () => {
  let component: SalaryConverterComponent;
  let fixture: ComponentFixture<SalaryConverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryConverterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
