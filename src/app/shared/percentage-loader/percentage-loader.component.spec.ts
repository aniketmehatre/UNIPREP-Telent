import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageLoaderComponent } from './percentage-loader.component';

describe('PercentageLoaderComponent', () => {
  let component: PercentageLoaderComponent;
  let fixture: ComponentFixture<PercentageLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PercentageLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PercentageLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
