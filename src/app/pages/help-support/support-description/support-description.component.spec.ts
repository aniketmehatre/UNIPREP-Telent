import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportDescriptionComponent } from './support-description.component';

describe('SupportDescriptionComponent', () => {
  let component: SupportDescriptionComponent;
  let fixture: ComponentFixture<SupportDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
