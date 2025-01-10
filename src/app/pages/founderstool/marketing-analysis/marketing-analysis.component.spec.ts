import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingAnalysisComponent } from './marketing-analysis.component';

describe('MarketingAnalysisComponent', () => {
  let component: MarketingAnalysisComponent;
  let fixture: ComponentFixture<MarketingAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketingAnalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
