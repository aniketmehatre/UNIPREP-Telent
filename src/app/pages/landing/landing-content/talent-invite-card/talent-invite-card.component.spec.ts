import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentInviteCardComponent } from './talent-invite-card.component';

describe('TalentInviteCardComponent', () => {
  let component: TalentInviteCardComponent;
  let fixture: ComponentFixture<TalentInviteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalentInviteCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalentInviteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
