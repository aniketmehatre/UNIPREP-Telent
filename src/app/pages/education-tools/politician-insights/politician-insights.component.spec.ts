import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticianInsightsComponent } from './politician-insights.component';

describe('PoliticianInsightsComponent', () => {
  let component: PoliticianInsightsComponent;
  let fixture: ComponentFixture<PoliticianInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoliticianInsightsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliticianInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
