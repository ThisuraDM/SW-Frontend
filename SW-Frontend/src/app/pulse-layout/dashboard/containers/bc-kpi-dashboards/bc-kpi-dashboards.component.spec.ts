import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcKpiDashboardsComponent } from './bc-kpi-dashboards.component';
/**
 * SW Bluecube Dashboard Container
 * Author: Thilina Kelum
 * Created Date: 2021 July 15
 */
describe('BcKpiDashboardsComponent', () => {
    let component: BcKpiDashboardsComponent;
    let fixture: ComponentFixture<BcKpiDashboardsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BcKpiDashboardsComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BcKpiDashboardsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
