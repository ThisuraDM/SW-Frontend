import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartsService } from '@modules/charts/services';

import { ProductTrend } from '../../models/product-trend';
import { ProductsTrendService } from '../../services/product-trend.service';

/**
 * SW trend chart component
 * Author: Thisura Munasinghe
 * Created Date: 2021 August 30
 */
@Component({
    selector: 'SW-trend-chart',
    templateUrl: './trend-chart.component.html',
})
export class TrendChartComponent implements OnInit {
    @ViewChild('SWTrendChart') myAreaChart!: ElementRef<HTMLCanvasElement>;
    @Input() duration: 'monthly' | 'quarterly' | 'yearly' = 'yearly';
    @Input() height!: string;
    @Input() width!: string;
    @Input() selectedProduct!: number;
    @Input() selectedOutlet!: string;
    @Input() selectedMonth = '';

    chart!: Chart;
    productTrends!: ProductTrend[];
    salesList!: number[];
    footFallList!: number[];
    datesList!: string[];

    constructor(
        private chartsService: ChartsService,
        private changeDetectorRef: ChangeDetectorRef,
        private productTrendService: ProductsTrendService
    ) {}

    ngOnInit() {
        this.getProductTrends();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.duration?.firstChange) {
            return;
        }
        if (this.chart) {
            this.chart.destroy();
            this.getProductTrends();
            this._renderChart();
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Renders chart
     */
    _renderChart() {
        this.chart = new this.chartsService.Chart(this.myAreaChart.nativeElement, {
            type: 'line',
            data: {
                labels: this.datesList,
                datasets: [
                    {
                        label: 'Sales',
                        lineTension: 0,
                        backgroundColor: 'rgba(255,255,255,0)',
                        borderColor: 'rgb(0,155,223)',
                        borderWidth: 4,
                        pointRadius: 0,
                        pointBackgroundColor: 'rgb(0,155,223)',
                        pointBorderColor: 'rgb(0,155,223)',
                        pointHoverRadius: 3,
                        pointHoverBackgroundColor: 'rgb(0,155,223)',
                        pointHoverBorderColor: 'rgb(0,155,223)',
                        pointHitRadius: 10,
                        pointBorderWidth: 2,
                        data: this.salesList,
                        yAxisID: 'y',
                    },
                    {
                        label: 'Footfall',
                        lineTension: 0,
                        backgroundColor: 'rgba(255,255,255,0)',
                        borderColor: 'rgb(22,67,150)',
                        borderWidth: 4,
                        pointRadius: 0,
                        pointBackgroundColor: 'rgb(22,67,150)',
                        pointBorderColor: 'rgb(22,67,150)',
                        pointHoverRadius: 3,
                        pointHoverBackgroundColor: 'rgb(22,67,150)',
                        pointHoverBorderColor: 'rgb(22,67,150)',
                        pointHitRadius: 10,
                        pointBorderWidth: 2,
                        data: this.footFallList,
                        // data: [2,6,8],
                        yAxisID: 'y1',
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 50,
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
                                maxTicksLimit: 7,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            id: 'y',
                            type: 'linear',
                            position: 'left',
                            ticks: {
                                maxTicksLimit: 5,
                                padding: 10,
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Sales',
                            },
                            stacked: false,
                            gridLines: {
                                color: 'rgb(234, 236, 244)',
                                zeroLineColor: 'rgb(234, 236, 244)',
                                drawBorder: false,
                                borderDash: [2],
                                zeroLineBorderDash: [2],
                            },
                        },
                        {
                            id: 'y1',
                            type: 'linear',
                            position: 'right',
                            ticks: {
                                maxTicksLimit: 5,
                                padding: 10,
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Footfall',
                            },
                            stacked: false,

                            gridLines: {
                                color: 'rgb(234, 236, 244)',
                                zeroLineColor: 'rgb(234, 236, 244)',
                                drawBorder: false,
                                borderDash: [2],
                                zeroLineBorderDash: [2],
                                drawOnChartArea: false,
                            },
                        },
                    ],
                },
                legend: {
                    display: true,
                    align: 'center',
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
                    callbacks: {
                        label: (tooltipItem, chart) => {
                            let datasetLabel = '';
                            if (chart && chart.datasets) {
                                datasetLabel = chart.datasets[tooltipItem.datasetIndex as number]
                                    .label as string;
                            }
                            return datasetLabel + ': ' + tooltipItem.yLabel;
                        },
                    },
                },
            },
        });
    }

    /**
     * Gets product trends
     */
    getProductTrends() {
        const salesList1: number[] = [];
        const footFallList1: number[] = [];
        const datesList1: string[] = [];
        this.productTrendService
            .getProductTrends(this.selectedProduct, this.selectedMonth, this.selectedOutlet)
            .subscribe((productTrend: any) => {
                if (productTrend) {
                    if (this.chart) {
                        this.chart.destroy();
                    }
                    this.productTrends = productTrend;
                    if (this.productTrends != null) {
                        this.productTrends.forEach((element) => {
                            salesList1.push(element.sale);
                            footFallList1.push(element.footfall);
                            datesList1.push(element.data_date);
                        });
                        this.salesList = salesList1;
                        this.footFallList = footFallList1;
                        this.datesList = datesList1;
                    }

                    this._renderChart();
                }
            });
    }
}
