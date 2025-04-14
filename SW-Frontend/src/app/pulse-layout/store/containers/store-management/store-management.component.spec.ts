import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreManagementComponent } from './store-management.component';

/**
 * SW store management container
 * Author: Thilina Kelum
 * Created Date: 2021 August 3
 */
describe('StoreManagementComponent', () => {
    let component: StoreManagementComponent;
    let fixture: ComponentFixture<StoreManagementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StoreManagementComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StoreManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
