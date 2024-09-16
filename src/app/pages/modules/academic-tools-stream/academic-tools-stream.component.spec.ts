import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicToolsStreamComponent } from './academic-tools-stream.component';

describe('AcademicToolsStreamComponent', () => {
  let component: AcademicToolsStreamComponent;
  let fixture: ComponentFixture<AcademicToolsStreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademicToolsStreamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicToolsStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
