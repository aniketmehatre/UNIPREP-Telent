import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IlearnChallengeComponent } from './ilearn-challenge.component';

describe('IlearnChallengeComponent', () => {
  let component: IlearnChallengeComponent;
  let fixture: ComponentFixture<IlearnChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IlearnChallengeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IlearnChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
