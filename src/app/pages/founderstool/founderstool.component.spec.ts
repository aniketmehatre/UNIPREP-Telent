import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FounderstoolComponent } from './founderstool.component';

describe('FounderstoolComponent', () => {
  let component: FounderstoolComponent;
  let fixture: ComponentFixture<FounderstoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FounderstoolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FounderstoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
