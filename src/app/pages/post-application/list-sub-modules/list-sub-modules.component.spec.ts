/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListSubModulesComponent} from './list-sub-modules.component';

describe('ListSubModulesComponent', () => {
    let component: ListSubModulesComponent;
    let fixture: ComponentFixture<ListSubModulesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ListSubModulesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListSubModulesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
