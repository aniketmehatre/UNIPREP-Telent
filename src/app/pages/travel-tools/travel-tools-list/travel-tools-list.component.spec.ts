import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelToolsListComponent } from './travel-tools-list.component';

describe('TravelToolsListComponent', () => {
  let component: TravelToolsListComponent;
  let fixture: ComponentFixture<TravelToolsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelToolsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelToolsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
