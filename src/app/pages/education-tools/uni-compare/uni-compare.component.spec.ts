import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniCompareComponent } from './uni-compare.component';

describe('UniCompareComponent', () => {
  let component: UniCompareComponent;
  let fixture: ComponentFixture<UniCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniCompareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
