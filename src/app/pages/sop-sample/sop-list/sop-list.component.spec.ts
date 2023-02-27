import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SopListComponent } from './sop-list.component';

describe('SopListComponent', () => {
  let component: SopListComponent;
  let fixture: ComponentFixture<SopListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SopListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SopListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
