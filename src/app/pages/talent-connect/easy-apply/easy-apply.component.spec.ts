import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyApplyComponent } from './easy-apply.component';

describe('EasyApplyComponent', () => {
  let component: EasyApplyComponent;
  let fixture: ComponentFixture<EasyApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EasyApplyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasyApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
