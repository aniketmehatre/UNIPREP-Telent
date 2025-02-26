import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentConnectComponent } from './talent-connect.component';

describe('TalentConnectComponent', () => {
  let component: TalentConnectComponent;
  let fixture: ComponentFixture<TalentConnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalentConnectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalentConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
