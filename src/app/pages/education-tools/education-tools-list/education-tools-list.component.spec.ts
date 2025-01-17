import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationToolsListComponent } from './education-tools-list.component';

describe('EducationToolsListComponent', () => {
  let component: EducationToolsListComponent;
  let fixture: ComponentFixture<EducationToolsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationToolsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationToolsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
