/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InstitutionLoginComponent } from './institution-login.component';

describe('InstitutionLoginComponent', () => {
  let component: InstitutionLoginComponent;
  let fixture: ComponentFixture<InstitutionLoginComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ InstitutionLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
