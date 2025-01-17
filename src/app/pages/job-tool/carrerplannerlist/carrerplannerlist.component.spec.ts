import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrerplannerlistComponent } from './carrerplannerlist.component';

describe('CarrerplannerlistComponent', () => {
  let component: CarrerplannerlistComponent;
  let fixture: ComponentFixture<CarrerplannerlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarrerplannerlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrerplannerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
