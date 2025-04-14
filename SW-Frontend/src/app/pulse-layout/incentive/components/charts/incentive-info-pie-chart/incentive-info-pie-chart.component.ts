import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChartsService } from '@modules/charts/services';

@Component({
  selector: 'SW-incentive-info-pie-chart',
  templateUrl: './incentive-info-pie-chart.component.html'
})
export class IncentiveInfoPieChartComponent implements OnInit {

    @ViewChild('SWIncentiveInfoPieChart') SWIncentiveInfoPieChart!: ElementRef<HTMLCanvasElement>;
    chart!: Chart;
    @Input() value!: number;

    constructor(private chartsService: ChartsService) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {

        const chart_context = this.SWIncentiveInfoPieChart.nativeElement.getContext('2d');
        const gradient = chart_context?.createLinearGradient(0, 0, 0, 180);
        gradient?.addColorStop(0.0, '#009bdf');
        gradient?.addColorStop(1.0, '#164396');
        const inputValue = this.value;

        this.chart = new this.chartsService.Chart(this.SWIncentiveInfoPieChart.nativeElement, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [inputValue, 100 - inputValue],
                        backgroundColor: gradient ? [gradient, '#FDB934'] : '#f1eeee',
                        hoverBackgroundColor: gradient ? [gradient, '#FDB934'] : '#e5e2e2',
                        hoverBorderColor: gradient ? [gradient, '#e5e2e2'] : '#FDB934',
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
