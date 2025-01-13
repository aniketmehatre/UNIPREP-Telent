import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningVideosComponent } from './learning-videos.component';

describe('LearningVideosComponent', () => {
  let component: LearningVideosComponent;
  let fixture: ComponentFixture<LearningVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearningVideosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
