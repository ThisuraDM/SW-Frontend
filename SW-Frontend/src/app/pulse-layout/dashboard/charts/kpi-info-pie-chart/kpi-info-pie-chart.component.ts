import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ChartsService } from '@modules/charts/services';

/**
 * SW KPI info pie chart component
 * Author: Milan Perera
 * Created Date: 2021 August 2
 */
@Component({
    selector: 'SW-kpi-info-pie-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './kpi-info-pie-chart.component.html',
})
export class KpiInfoPieChartComponent implements OnInit, AfterViewInit {
    @ViewChild('SWKpiInfoPieChart') SWKpiInfoPieChart!: ElementRef<HTMLCanvasElement>;
    chart!: Chart;
    @Input() value!: number;

    constructor(private chartsService: ChartsService) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {

        const chart_context = this.SWKpiInfoPieChart.nativeElement.getContext('2d');
        const gradient = chart_context?.createLinearGradient(0, 0, 0, 180);
        gradient?.addColorStop(0.0, '#009bdf');
        gradient?.addColorStop(1.0, '#164396');
        const inputValue = this.value;

        this.chart = new this.chartsService.Chart(this.SWKpiInfoPieChart.nativeElement, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [inputValue, 100 - inputValue],
                        backgroundColor: gradient ? [gradient, '#c9c6c6'] : '#f1eeee',
                        hoverBackgroundColor: gradient ? [gradient, '#bbb8b8'] : '#e5e2e2',
                        hoverBorderColor: gradient ? [gradient, '#e5e2e2'] : '#bbb8b8',
                    },
                ],
            },
            options: {
                legend: {
                    display: false,
                },
                cutoutPercentage: 70,
                tooltips: {
                    enabled: false,
                },
                aspectRatio: 1,
                responsive: true,
            },
        });
    }

}
