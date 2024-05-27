import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagetypequizComponent } from './languagetypequiz.component';

describe('LanguagetypequizComponent', () => {
  let component: LanguagetypequizComponent;
  let fixture: ComponentFixture<LanguagetypequizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguagetypequizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguagetypequizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
