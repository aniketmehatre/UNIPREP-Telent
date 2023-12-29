import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationpolicyComponent } from './cancellationpolicy.component';

describe('CancellationpolicyComponent', () => {
  let component: CancellationpolicyComponent;
  let fixture: ComponentFixture<CancellationpolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancellationpolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancellationpolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
