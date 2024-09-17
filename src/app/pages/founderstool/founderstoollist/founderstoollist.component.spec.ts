import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FounderstoollistComponent } from './founderstoollist.component';

describe('FounderstoollistComponent', () => {
  let component: FounderstoollistComponent;
  let fixture: ComponentFixture<FounderstoollistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FounderstoollistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FounderstoollistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
