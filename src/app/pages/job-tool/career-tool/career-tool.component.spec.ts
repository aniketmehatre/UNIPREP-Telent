import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerToolComponent } from './career-tool.component';

describe('CareerToolComponent', () => {
  let component: CareerToolComponent;
  let fixture: ComponentFixture<CareerToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareerToolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
