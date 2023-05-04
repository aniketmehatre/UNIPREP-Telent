import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SopsampleCategoryComponent} from './sopsample-category.component';

describe('SopsampleCategoryComponent', () => {
    let component: SopsampleCategoryComponent;
    let fixture: ComponentFixture<SopsampleCategoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SopsampleCategoryComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SopsampleCategoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
