import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MycertificateComponent } from './mycertificate.component';

describe('MycertificateComponent', () => {
  let component: MycertificateComponent;
  let fixture: ComponentFixture<MycertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MycertificateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MycertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
