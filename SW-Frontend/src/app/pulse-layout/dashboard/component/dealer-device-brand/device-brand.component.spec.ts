import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceBrandsComponent } from './device-brand.component';

/**
 * SW device brand component
 * Author: Thilina Kelum
 * Created Date: 2021 September 2
 */
describe('DeviceBrandsComponent', () => {
    let component: DeviceBrandsComponent;
    let fixture: ComponentFixture<DeviceBrandsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeviceBrandsComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DeviceBrandsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
