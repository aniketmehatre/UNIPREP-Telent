import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportQueryComponent } from './support-query.component';

describe('SupportQueryComponent', () => {
  let component: SupportQueryComponent;
  let fixture: ComponentFixture<SupportQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportQueryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
