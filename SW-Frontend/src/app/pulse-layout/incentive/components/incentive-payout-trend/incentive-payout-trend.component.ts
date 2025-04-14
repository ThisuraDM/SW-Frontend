import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { MONTH_DATA } from '@app/SW-layout/dashboard/data/data';
import { ProductPerformance } from '@app/SW-layout/dashboard/models/historical-performance';
import { BlueCubeProducts } from '@app/SW-layout/dashboard/models/products';
import { ChartsService } from '@modules/charts/services';

import { PayoutTrendChartResponse } from '../../models/dealer-incentive-payout-trend';
import { DealerIncentivePayoutTrendService } from '../../services/dealer-incentive-payout-trend.service';

@Component({
  selector: 'SW-incentive-payout-trend',
  templateUrl: './incentive-payout-trend.component.html',
  styleUrls: ['./incentive-payout-trend.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class IncentivePayoutTrendComponent implements OnInit {

    @ViewChild('myBarChart') myBarChart!: ElementRef<HTMLCanvasElement>;
    @Input() duration: 'monthly' | 'quarterly' | 'halfYearly' | 'yearly' = 'halfYearly';
    @Input() width!: string;
    @Input() vendorId!: string;
    @Input() selectedMonthAndYear!: string;

    chart!: Chart;
    navigationService: any;
    productList: BlueCubeProducts[] = [];
    selectedHistoricalPerformancePeriod = '6_months';
    productPerformance!: ProductPerformance;
    monthList = MONTH_DATA;
    monthMap = new Map();
    labelData: any[] = [];
    chartData: any[] = [];
    productId = 1;
    productPlan = '';
    selectedNoOfMonth = 3
    selectedSchemaName = ''
    selectedCategory = '';
    schemaNames: string[] = [];
    categoryNames: string[] = [];
    trendChartData:PayoutTrendChartResponse[] = []

    constructor(
        private chartsService: ChartsService,
        private payoutTrendService:DealerIncentivePayoutTrendService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
    }

    ngAfterViewInit() {
        this._renderChart();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.duration?.firstChange) {
            return;
        }
        if (this.chart) {
            this.chart.destroy();
            this._renderChart();
            this.changeDetectorRef.detectChanges();
        }
        if(changes.selectedMonthAndYear?.currentValue){
            this.getCategoryNames();
        }
    }

    getCategoryNames() {
        this.payoutTrendService.getIncentivePayoutTrendCategoryNames( this.selectedMonthAndYear,6,this.vendorId).subscribe((response) => {
            this.categoryNames = response.result;
            this.selectedCategory = this.categoryNames[0];
            this.getSchemaNames();
        });
    }

    getSchemaNames() {
        this.payoutTrendService.getIncentivePayoutTrendSchemaNames(
            this.selectedCategory,
            this.selectedMonthAndYear,
            6,
            this.vendorId
            ).subscribe((result) => {
            this.schemaNames = result.schema_names;
            this.selectedSchemaName = this.schemaNames[0];
            this.getTrendChart();
        });
    }

    onCategoryChange(){
        this.getSchemaNames();
    }

    onSchemaChange(){
        this.getTrendChart();
    }

    onNoOfMonthChange(){
        if(this.selectedNoOfMonth == 3){
            this.selectedNoOfMonth = 6;
        }else{
            this.selectedNoOfMonth = 3;
        }
        this.getTrendChart();
    }


    getTrendChart() {
        this.labelData = [];
        this.chartData = [];
        this.payoutTrendService.getIncentivePayoutTrendChart(
            this.selectedMonthAndYear,this.selectedNoOfMonth,this.vendorId,this.selectedSchemaName,this.selectedCategory)
            .subscribe((response) => {
            this.trendChartData = response;
            this.trendChartData.forEach(element => {
                this.labelData.push(element.month);
                this.chartData.push(element.commission_amount);
            });
            this.chart.destroy();
            this._renderChart();
        });
    }

    /**
     * Renders chart
     */
    _renderChart() {
        this.chart = new this.chartsService.Chart(this.myBarChart.nativeElement, {
            type: 'bar',
            data: {
                datasets:this.chartData? [
                    {
                        label: 'Commission',
                        backgroundColor: 'rgb(0,155,223)',
                        hoverBackgroundColor: 'rgba(0, 97, 242, 0.9)',
                        borderColor: '#4e73df',
                        data: this.chartData?this.chartData:[],
                        maxBarThickness: 60,
                    },
                ]:[],
                labels: this.labelData,

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
                                unit: 'month',
                            },
                            gridLines: {
                                display: false,
                                drawBorder: true,
                            },
                            ticks: {
                                autoSkip: false,
                            },
                            stacked: true,
                        },
                    ],
                    yAxes: [
                        {
                            id: 'xAxis1',
                            ticks: {
                                min: 0,
                                maxTicksLimit: 10,
                                padding: 10,
                                precision: 0,
                                callback(label:any, index, labels) {
                                    return label/1000+'k';
                                }
                            },
                            scaleLabel: {
                                display: true,
                            },
                            stacked: true,
                            gridLines: {
                                color: 'rgb(234, 236, 244)',
                                zeroLineColor: 'rgb(234, 236, 244)',
                                drawBorder: true,
                                borderDash: [2],
                                zeroLineBorderDash: [2],
                            },

                        },
                    ],
                },
                legend: {
                    display: false,
                    align: 'start',
                },

                tooltips: {
                    titleMarginBottom: 10,
                    titleFontColor: '#6e707e',
                    titleFontSize: 14,
                    backgroundColor: 'rgb(255,255,255)',
                    bodyFontColor: '#858796',
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    caretPadding: 10,
                    callbacks: {
                    },
                },
            },

        });
    }
}
