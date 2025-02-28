import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyConnectComponent } from './company-connect.component';

describe('CompanyConnectComponent', () => {
  let component: CompanyConnectComponent;
  let fixture: ComponentFixture<CompanyConnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyConnectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
