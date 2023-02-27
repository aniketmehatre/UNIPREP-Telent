/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SopComponent } from './sop.component';

describe('SopComponent', () => {
  let component: SopComponent;
  let fixture: ComponentFixture<SopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
