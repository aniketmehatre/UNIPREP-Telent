import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportCreditComponent } from './export-credit.component';

describe('ExportCreditComponent', () => {
  let component: ExportCreditComponent;
  let fixture: ComponentFixture<ExportCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportCreditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
