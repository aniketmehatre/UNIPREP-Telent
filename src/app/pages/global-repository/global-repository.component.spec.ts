import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalRepositoryComponent } from './global-repository.component';

describe('GlobalRepositoryComponent', () => {
  let component: GlobalRepositoryComponent;
  let fixture: ComponentFixture<GlobalRepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalRepositoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
