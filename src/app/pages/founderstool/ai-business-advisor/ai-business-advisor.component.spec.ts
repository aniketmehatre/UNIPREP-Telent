import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiBusinessAdvisorComponent } from './ai-business-advisor.component';

describe('AiBusinessAdvisorComponent', () => {
  let component: AiBusinessAdvisorComponent;
  let fixture: ComponentFixture<AiBusinessAdvisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiBusinessAdvisorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiBusinessAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
