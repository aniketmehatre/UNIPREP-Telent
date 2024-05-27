import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizmenuComponent } from './quizmenu.component';

describe('QuizmenuComponent', () => {
  let component: QuizmenuComponent;
  let fixture: ComponentFixture<QuizmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizmenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
