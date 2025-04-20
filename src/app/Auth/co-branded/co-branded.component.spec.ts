import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoBrandedComponent } from './co-branded.component';

describe('CoBrandedComponent', () => {
  let component: CoBrandedComponent;
  let fixture: ComponentFixture<CoBrandedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoBrandedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoBrandedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
