import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalEdufitComponent } from './global-edufit.component';

describe('GlobalEdufitComponent', () => {
  let component: GlobalEdufitComponent;
  let fixture: ComponentFixture<GlobalEdufitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalEdufitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalEdufitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
