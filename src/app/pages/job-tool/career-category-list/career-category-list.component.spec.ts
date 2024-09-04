import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerCategoryListComponent } from './career-category-list.component';

describe('CareerCategoryListComponent', () => {
  let component: CareerCategoryListComponent;
  let fixture: ComponentFixture<CareerCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareerCategoryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
