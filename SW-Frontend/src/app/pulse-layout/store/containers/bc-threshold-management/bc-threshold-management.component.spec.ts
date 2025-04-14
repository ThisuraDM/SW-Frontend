import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcThresholdManagementComponent } from './bc-threshold-management.component';

describe('BcThresholdManagementComponent', () => {
    let component: BcThresholdManagementComponent;
    let fixture: ComponentFixture<BcThresholdManagementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BcThresholdManagementComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BcThresholdManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
