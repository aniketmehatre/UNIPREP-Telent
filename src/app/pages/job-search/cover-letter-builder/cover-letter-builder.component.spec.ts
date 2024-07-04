import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverLetterBuilderComponent } from './cover-letter-builder.component';

describe('CoverLetterBuilderComponent', () => {
  let component: CoverLetterBuilderComponent;
  let fixture: ComponentFixture<CoverLetterBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoverLetterBuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoverLetterBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
