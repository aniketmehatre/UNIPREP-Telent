import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarshipListGuidlinesComponent } from './scholarship-list-guidlines.component';

describe('ScholarshipListGuidlinesComponent', () => {
  let component: ScholarshipListGuidlinesComponent;
  let fixture: ComponentFixture<ScholarshipListGuidlinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScholarshipListGuidlinesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScholarshipListGuidlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
