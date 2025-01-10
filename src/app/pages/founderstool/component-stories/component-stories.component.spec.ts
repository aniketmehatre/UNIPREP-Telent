import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentStoriesComponent } from './component-stories.component';

describe('ComponentStoriesComponent', () => {
  let component: ComponentStoriesComponent;
  let fixture: ComponentFixture<ComponentStoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentStoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
