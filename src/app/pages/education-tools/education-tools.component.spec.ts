import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationToolsComponent } from './education-tools.component';

describe('EducationToolsComponent', () => {
  let component: EducationToolsComponent;
  let fixture: ComponentFixture<EducationToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationToolsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
