import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntreprenuerskillmoduleComponent } from './entreprenuerskillmodule.component';

describe('EntreprenuerskillmoduleComponent', () => {
  let component: EntreprenuerskillmoduleComponent;
  let fixture: ComponentFixture<EntreprenuerskillmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntreprenuerskillmoduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntreprenuerskillmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
