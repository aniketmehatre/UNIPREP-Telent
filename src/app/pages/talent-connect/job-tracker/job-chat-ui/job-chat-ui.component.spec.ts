import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobChatUiComponent } from './job-chat-ui.component';

describe('JobChatUiComponent', () => {
  let component: JobChatUiComponent;
  let fixture: ComponentFixture<JobChatUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobChatUiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobChatUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
