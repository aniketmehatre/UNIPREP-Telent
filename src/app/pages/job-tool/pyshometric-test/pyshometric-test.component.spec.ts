import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PyshometricTestComponent } from './pyshometric-test.component';

describe('PyshometricTestComponent', () => {
  let component: PyshometricTestComponent;
  let fixture: ComponentFixture<PyshometricTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PyshometricTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PyshometricTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
