import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiInfoPieChartComponent } from './kpi-info-pie-chart.component';

/**
 * SW KPI info pie chart component
 * Author: Milan Perera
 * Created Date: 2021 August 2
 */
describe('KpiInfoPieChartComponent', () => {
    let component: KpiInfoPieChartComponent;
    let fixture: ComponentFixture<KpiInfoPieChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [KpiInfoPieChartComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(KpiInfoPieChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
