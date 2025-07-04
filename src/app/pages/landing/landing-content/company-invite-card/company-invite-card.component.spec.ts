import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInviteCardComponent } from './company-invite-card.component';

describe('CompanyInviteCardComponent', () => {
  let component: CompanyInviteCardComponent;
  let fixture: ComponentFixture<CompanyInviteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyInviteCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyInviteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
