import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsWalletComponent } from './docs-wallet.component';

describe('DocsWalletComponent', () => {
  let component: DocsWalletComponent;
  let fixture: ComponentFixture<DocsWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DocsWalletComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocsWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
