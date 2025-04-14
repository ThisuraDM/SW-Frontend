import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveReportComponent } from './incentive-report.component';

/**
 * SW dealer incentive report component
 * Author: Thisura Munasinghe
 * Created Date: 2021 September 8
 */
describe('IncentiveReportComponent', () => {
    let component: IncentiveReportComponent;
    let fixture: ComponentFixture<IncentiveReportComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IncentiveReportComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IncentiveReportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
