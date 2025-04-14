import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerThresholdManagementComponent } from './dealer-threshold-management.component';

describe('DealerThresholdManagementComponent', () => {
    let component: DealerThresholdManagementComponent;
    let fixture: ComponentFixture<DealerThresholdManagementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DealerThresholdManagementComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DealerThresholdManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
