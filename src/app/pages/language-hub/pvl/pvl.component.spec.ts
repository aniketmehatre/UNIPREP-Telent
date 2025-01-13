/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PvlComponent } from './pvl.component';

describe('PvlComponent', () => {
  let component: PvlComponent;
  let fixture: ComponentFixture<PvlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PvlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PvlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
