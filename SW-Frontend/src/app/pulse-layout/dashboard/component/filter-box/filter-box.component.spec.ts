import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBoxComponent } from './filter-box.component';

/**
 * SW filter box component
 * Author: Thilina Kelum
 * Created Date: 2021 July 13
 */
describe('FilterBoxComponent', () => {
    let component: FilterBoxComponent;
    let fixture: ComponentFixture<FilterBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FilterBoxComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FilterBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
