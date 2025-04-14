import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ChartsService } from '@modules/charts/services';

import { Incentive } from '../../models/incentive';
import { IncentiveService } from '../../services/incentive.service';

/**
 * SW dealer incentive report component
 * Author: Thisura Munasinghe
 * Created Date: 2021 September 8
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'SW-incentive-report',
    templateUrl: './incentive-report.component.html',
    styleUrls: ['./incentive-report.component.scss'],
})
export class IncentiveReportComponent implements OnInit {
    @ViewChild('myAreaChart') myAreaChart!: ElementRef<HTMLCanvasElement>;
    @Input() duration: 'monthly' | 'quarterly' | 'yearly' = 'yearly';
    @Input() height!: string;
    @Input() width!: string;
    @Input() selectedOutlet!: string;
    @Input() selectedOutletName!: string;
    chart!: Chart;
    incentives!: Incentive[];
    yearlyIncentiveList!: number[];
    monthlyIncentiveList: number[] = [];
    yearlyMonthList: string[] = [];
    monthlyMonthList: string[] = [];
    incentiveList!: number[];
    monthList!: string[];
    monthStatus = false;
    yearStatus = false;

    constructor(
        private chartsService: ChartsService,
        private incentiveService: IncentiveService
    ) {}

    ngOnInit() {
        this.monthStatus = true;
        this.yearStatus = false;
        this.getIncentiveReport();
    }

    _renderChart() {
        this.chart = new this.chartsService.Chart(this.myAreaChart.nativeElement, {
            type: 'line',
            data: {
                labels: this.monthStatus ? this.monthlyMonthList : this.monthList,
                datasets: [
                    {
                        label: 'Incentive',
                        lineTension: 0.3,
                        backgroundColor: 'rgba(0, 97, 242, 0.05)',
                        borderColor: 'rgba(0, 97, 242, 1)',
                        pointRadius: 3,
                        pointBackgroundColor: 'rgba(0, 97, 242, 1)',
                        pointBorderColor: 'rgba(0, 97, 242, 1)',
                        pointHoverRadius: 3,
                        pointHoverBackgroundColor: 'rgba(0, 97, 242, 1)',
                        pointHoverBorderColor: 'rgba(0, 97, 242, 1)',
                        pointHitRadius: 10,
                        pointBorderWidth: 2,
                        data: this.monthStatus ? this.monthlyIncentiveList : this.incentiveList,
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0,
                    },
                },
                scales: {
                    xAxes: [
                        {
                            time: {
                                unit: 'day',
                            },
                            gridLines: {
                                display: false,
                                drawBorder: false,
                            },
                            ticks: {
                                maxTicksLimit: 12,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            ticks: {
                                maxTicksLimit: 10,
                                padding: 10,
                            },
                            gridLines: {
                                color: 'rgb(234, 236, 244)',
                                zeroLineColor: 'rgb(234, 236, 244)',
                                drawBorder: false,
                                borderDash: [2],
                                zeroLineBorderDash: [2],
                            },
                        },
                    ],
                },
                legend: {
                    display: false,
                },
                tooltips: {
                    backgroundColor: 'rgb(255,255,255)',
                    bodyFontColor: '#858796',
                    titleMarginBottom: 10,
                    titleFontColor: '#6e707e',
                    titleFontSize: 14,
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    intersect: false,
                    mode: 'index',
                    caretPadding: 10,
                },
            },
        });
    }

    /**
     * Gets incentive report
     */
    getIncentiveReport() {
        const incentiveList: number[] = [];
        const monthkeyList: string[] = [];
        this.incentiveService
            .getIncentiveReport(this.selectedOutlet)
            .subscribe((incentives: any) => {
                if (incentives) {
                    if (this.chart) {
                        this.chart.destroy();
                    }
                    this.incentives = incentives;
                    if (this.incentives != null) {
                        this.incentives.forEach((element) => {
                            const month: string = element.month_key.substring(4, 6);
                            const formatMonth = new Date(month);
                            const monthName = formatMonth.toLocaleString('en-us', { month: 'short' });
                            incentiveList.push(element.incentive);
                            monthkeyList.push(monthName);
                        });
                    }

                    this.incentiveList = incentiveList;
                    this.monthList = monthkeyList;
                    const monthlyIncentiveList: number[] = this.incentiveList.slice(
                        Math.max(this.incentiveList.length - 6, 0)
                    );
                    const monthlyMonthList: string[] = this.monthList.slice(
                        Math.max(this.monthList.length - 6, 0)
                    );
                    this.monthlyIncentiveList = monthlyIncentiveList;
                    this.monthlyMonthList = monthlyMonthList;
                    this._renderChart();
                }
            });
    }

    /**
     * Determines whether yearly click on
     */
    onYearlyClick() {
        this.yearStatus = !this.yearStatus;
        this.monthStatus = !this.monthStatus;
        this.chart.destroy();
        this._renderChart();
    }

    /**
     * Determines whether monthly click on
     */
    onMonthlyClick() {
        this.yearStatus = !this.yearStatus;
        this.monthStatus = !this.monthStatus;
        this.chart.destroy();
        this._renderChart();
    }
}
