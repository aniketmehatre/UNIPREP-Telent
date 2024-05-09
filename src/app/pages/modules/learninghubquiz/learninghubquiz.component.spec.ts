import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearninghubquizComponent } from './learninghubquiz.component';

describe('LearninghubquizComponent', () => {
  let component: LearninghubquizComponent;
  let fixture: ComponentFixture<LearninghubquizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearninghubquizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearninghubquizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
