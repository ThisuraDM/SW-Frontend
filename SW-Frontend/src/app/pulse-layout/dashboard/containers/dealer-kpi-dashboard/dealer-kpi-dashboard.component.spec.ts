import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerKpiDashboardComponent } from './dealer-kpi-dashboard.component';

/**
 * SW Dealer Dashboard Container
 * Author: Thilina Kelum
 * Created Date: 2021 July 15
 */
describe('DealerKpiDashboardComponent', () => {
    let component: DealerKpiDashboardComponent;
    let fixture: ComponentFixture<DealerKpiDashboardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DealerKpiDashboardComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DealerKpiDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
