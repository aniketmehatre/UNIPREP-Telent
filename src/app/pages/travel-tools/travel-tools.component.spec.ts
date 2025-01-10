import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelToolsComponent } from './travel-tools.component';

describe('TravelToolsComponent', () => {
  let component: TravelToolsComponent;
  let fixture: ComponentFixture<TravelToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelToolsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
