import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeAtComponent } from './life-at.component';

describe('LifeAtComponent', () => {
  let component: LifeAtComponent;
  let fixture: ComponentFixture<LifeAtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LifeAtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LifeAtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
