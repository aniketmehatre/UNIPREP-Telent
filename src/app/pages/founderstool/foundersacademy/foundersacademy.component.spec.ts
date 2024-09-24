import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundersacademyComponent } from './foundersacademy.component';

describe('FoundersacademyComponent', () => {
  let component: FoundersacademyComponent;
  let fixture: ComponentFixture<FoundersacademyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoundersacademyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoundersacademyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
