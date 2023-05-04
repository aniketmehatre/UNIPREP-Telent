import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ListSubModulesComponent} from './list-sub-modules.component';

describe('ListSubModulesComponent', () => {
    let component: ListSubModulesComponent;
    let fixture: ComponentFixture<ListSubModulesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ListSubModulesComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ListSubModulesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
