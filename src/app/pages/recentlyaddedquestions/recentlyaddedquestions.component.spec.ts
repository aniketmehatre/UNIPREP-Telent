import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyaddedquestionsComponent } from './recentlyaddedquestions.component';

describe('RecentlyaddedquestionsComponent', () => {
  let component: RecentlyaddedquestionsComponent;
  let fixture: ComponentFixture<RecentlyaddedquestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentlyaddedquestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentlyaddedquestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
