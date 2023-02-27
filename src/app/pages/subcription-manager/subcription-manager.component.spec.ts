import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcriptionManagerComponent } from './subcription-manager.component';

describe('SubcriptionManagerComponent', () => {
  let component: SubcriptionManagerComponent;
  let fixture: ComponentFixture<SubcriptionManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcriptionManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcriptionManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
