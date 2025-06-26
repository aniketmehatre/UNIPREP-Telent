import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UuidInviteCardComponent } from './uuid-invite-card.component';

describe('UuidInviteCardComponent', () => {
  let component: UuidInviteCardComponent;
  let fixture: ComponentFixture<UuidInviteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UuidInviteCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UuidInviteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
