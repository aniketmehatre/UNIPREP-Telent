import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntreprenuersectorproficiencyComponent } from './entreprenuersectorproficiency.component';

describe('EntreprenuersectorproficiencyComponent', () => {
  let component: EntreprenuersectorproficiencyComponent;
  let fixture: ComponentFixture<EntreprenuersectorproficiencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntreprenuersectorproficiencyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntreprenuersectorproficiencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
