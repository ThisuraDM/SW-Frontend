import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalPerformanceComponent } from './historical-performance.component';

/**
 * SW historical performance component
 * Author: Thilina Kelum
 * Created Date: 2021 August 10
 */
describe('HistoricalPerformanceComponent', () => {
    let component: HistoricalPerformanceComponent;
    let fixture: ComponentFixture<HistoricalPerformanceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HistoricalPerformanceComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HistoricalPerformanceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
