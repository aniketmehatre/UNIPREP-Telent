import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSearchModuleComponent } from './header-search-module.component';

describe('HeaderSearchModuleComponent', () => {
  let component: HeaderSearchModuleComponent;
  let fixture: ComponentFixture<HeaderSearchModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderSearchModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderSearchModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
