import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceActivationsComponent } from './device-activations.component';

/**
 * SW device activations component
 * Author: Thilina Kelum
 * Created Date: 2021 August 24
 */
describe('DeviceActivationsComponent', () => {
    let component: DeviceActivationsComponent;
    let fixture: ComponentFixture<DeviceActivationsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeviceActivationsComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DeviceActivationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
