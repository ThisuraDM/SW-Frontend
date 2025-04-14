import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MONTH_DATA } from '@app/SW-layout/dashboard/data/data';
import { ProductPerformance } from '@app/SW-layout/dashboard/models/historical-performance';
import { BlueCubeProducts } from '@app/SW-layout/dashboard/models/products';
import { HistoricalPerformanceService } from '@app/SW-layout/dashboard/services/historical-performance.service';
import { ProductsService } from '@app/SW-layout/dashboard/services/products.service';
import { ChartsService } from '@modules/charts/services';

/**
 * SW historical performance component
 * Author: Thilina Kelum
 * Created Date: 2021 August 10
 */
@Component({
    selector: 'SW-historical-performance',
    templateUrl: './historical-performance.component.html',
    styleUrls: ['./historical-performance.component.scss'],
})
export class HistoricalPerformanceComponent implements OnInit {
    @ViewChild('myBarChart') myBarChart!: ElementRef<HTMLCanvasElement>;
    @Input() duration: 'monthly' | 'quarterly' | 'halfYearly' | 'yearly' = 'halfYearly';
    @Input() height!: string;
    @Input() width!: string;
    @Input() selectedOutlet!: string;
    @Input() selectedOutletName!: string;

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
    selectedProduct = '';

    constructor(
        private chartsService: ChartsService,
        private productsService: ProductsService,
        private historicalPerformanceService: HistoricalPerformanceService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.getBlueCubeProducts();
        this.gerHistoricalPerformanceByOutletPlanAndProduct();
        if (this.monthList != null) {
            this.monthList.forEach((value) => {
                this.monthMap.set(value.id, value.name);
            });
        }
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
        if (changes.selectedOutlet?.previousValue) {
            this.gerHistoricalPerformanceByOutletPlanAndProduct();
        }
    }

    /**
     * Sets default product
     */
    setDefaultProduct() {
        if (this.productList != null) {
            // this.productList.forEach((value) => {
            //     if (value.product_id == this.productId) {
            //         this.selectedProduct = value.product_name;
            //         this.changeDetectorRef.detectChanges();
            //     }
            // });
        }
    }

    /**
     * Changes product
     * @param product
     */
    changeProduct(product: any) {
        this.productId = product.product_id;
        this.productPlan = product.plans.length > 0 ? product.plans : '';
        this.selectedProduct = product.plans.length > 0 ? product.plans : product.product_name;
        this.changeDetectorRef.detectChanges();
        this.gerHistoricalPerformanceByOutletPlanAndProduct();
    }

    /**
     * Gets blue cube products
     */
    getBlueCubeProducts() {
        this.productsService.getBlueCubeProducts().subscribe((result) => {
            this.productList = result;
            this.setDefaultProduct();
        });
    }

    /**
     * Gers historical performance by outlet plan and product
     */
    gerHistoricalPerformanceByOutletPlanAndProduct() {
        this.historicalPerformanceService
            .gerHistoricalPerformanceByOutletPlanAndProduct(
                this.selectedOutlet,
                this.productPlan,
                this.productId
            )
            .subscribe((result) => {
                this.productPerformance = result;
                this.filterDeviceActivationDataByPeriod(this.selectedHistoricalPerformancePeriod);
            });
    }

    /**
     * Filters device activation data by period
     * @param filter
     */
    filterDeviceActivationDataByPeriod(filter: string) {
        this.selectedHistoricalPerformancePeriod = filter;
        this.chartData = [];
        this.labelData = [];

        if (this.monthMap != null) {
            if (this.selectedHistoricalPerformancePeriod === '1_month') {
                this.productPerformance.daily_data?.forEach((value) => {
                    this.chartData.push(value.sales);
                    const splitted = value.key.split('');
                    this.labelData.push(
                        this.monthMap.get(splitted[4] + splitted[5]) + '-' + splitted[6] + splitted[7]
                    );
                });
            } else if (this.selectedHistoricalPerformancePeriod === '1_week') {
                if (this.productPerformance.daily_data) {
                    for (
                        let i = this.productPerformance.daily_data.length - 7;
                        i < this.productPerformance.daily_data.length;
                        i++
                    ) {
                        if (this.productPerformance.daily_data) {
                            this.chartData.push(this.productPerformance.daily_data[i].sales);
                            const splitted = this.productPerformance.daily_data[i].key.split('');
                            this.labelData.push(
                                this.monthMap.get(splitted[4] + splitted[5]) +
                                    '-' +
                                    splitted[6] +
                                    splitted[7]
                            );
                        }
                    }
                }
            } else if (this.selectedHistoricalPerformancePeriod === '6_months') {
                if (this.productPerformance.monthly_data) {
                    for (
                        let i = this.productPerformance.monthly_data.length - 6;
                        i < this.productPerformance.monthly_data.length;
                        i++
                    ) {
                        // if (this.productPerformance.monthly_data) {
                        //     this.chartData.push(this.productPerformance.monthly_data[i].sales);
                        //     const splitted = this.productPerformance.monthly_data[i].key.split('');
                        //     this.labelData.push(this.monthMap.get(splitted[4] + splitted[5]));
                        // }
                    }
                }
            } else {
                this.productPerformance.monthly_data?.forEach((value) => {
                    this.chartData.push(value.sales);
                    const splitted = value.key.split('');
                    this.labelData.push(this.monthMap.get(splitted[4] + splitted[5]));
                });
            }
        }

        // this.chart.destroy();
        // this._renderChart();
        // this.changeDetectorRef.detectChanges();
    }

    /**
     * Renders chart
     */
    _renderChart() {
        this.chart = new this.chartsService.Chart(this.myBarChart.nativeElement, {
            type: 'bar',
            data: {
                datasets: [
                    {
                        label: 'Easyphone',
                        backgroundColor: 'rgb(0,155,223)',
                        hoverBackgroundColor: 'rgba(0, 97, 242, 0.9)',
                        borderColor: '#4e73df',
                        data: this.chartData,
                        maxBarThickness: 60,
                    },
                ],
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
                    enabled: false,
                    // titleMarginBottom: 10,
                    // titleFontColor: '#6e707e',
                    // titleFontSize: 14,
                    // backgroundColor: 'rgb(255,255,255)',
                    // bodyFontColor: '#858796',
                    // borderColor: '#dddfeb',
                    // borderWidth: 1,
                    // xPadding: 15,
                    // yPadding: 15,
                    // displayColors: false,
                    // caretPadding: 10,
                    // callbacks: {},
                },
            },
        });
    }
}
