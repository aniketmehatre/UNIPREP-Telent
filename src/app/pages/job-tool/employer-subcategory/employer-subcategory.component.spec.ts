import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerSubcategoryComponent } from './employer-subcategory.component';

describe('EmployerSubcategoryComponent', () => {
  let component: EmployerSubcategoryComponent;
  let fixture: ComponentFixture<EmployerSubcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerSubcategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployerSubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
