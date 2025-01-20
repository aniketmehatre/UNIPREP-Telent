import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchSoonTagComponent } from './launch-soon-tag.component';

describe('LaunchSoonTagComponent', () => {
  let component: LaunchSoonTagComponent;
  let fixture: ComponentFixture<LaunchSoonTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaunchSoonTagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaunchSoonTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
