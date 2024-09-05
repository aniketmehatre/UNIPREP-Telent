import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictionDialogComponent } from './restriction-dialog.component';

describe('RestrictionDialogComponent', () => {
  let component: RestrictionDialogComponent;
  let fixture: ComponentFixture<RestrictionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestrictionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestrictionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
