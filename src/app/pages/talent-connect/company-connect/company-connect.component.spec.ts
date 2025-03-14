import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyConnect1Component } from './company-connect.component';

describe('CompanyConnect1Component', () => {
  let component: CompanyConnect1Component;
  let fixture: ComponentFixture<CompanyConnect1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyConnect1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyConnect1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
