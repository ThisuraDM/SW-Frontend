import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendChartComponent } from './trend-chart.component';

/**
 * SW trend chart component
 * Author: Thisura Munasinghe
 * Created Date: 2021 August 30
 */
describe('TrendChartComponent', () => {
    let component: TrendChartComponent;
    let fixture: ComponentFixture<TrendChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TrendChartComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TrendChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
