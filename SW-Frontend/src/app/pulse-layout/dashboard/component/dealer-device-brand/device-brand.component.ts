import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { CHART_COLOR_DATA } from '@app/SW-layout/dashboard/data/chart-colour-data';
import {
    DeviceSellingBrandData,
    DeviceSellingBrandWithColourData,
} from '@app/SW-layout/dashboard/models/device-summary';
import { ChartsService } from '@modules/charts/services';

/**
 * SW device brand component
 * Author: Thilina Kelum
 * Created Date: 2021 September 2
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'SW-device-brand',
    templateUrl: './device-brand.component.html',
})
export class DeviceBrandsComponent implements OnInit, AfterViewInit {
    @ViewChild('myPieChart') myPieChart!: ElementRef<HTMLCanvasElement>;
    @Input() height!: string;
    @Input() width!: string;
    @Input() data: DeviceSellingBrandData[] = [];
    @Input() dataPeriod!: string;
    deviceSellingBrandDataWithColorList: DeviceSellingBrandWithColourData[] = [];
    labelList: any[] = [];
    dataList: any[] = [];
    colourList: any[] = [];
    chart!: Chart;
    chartColor = CHART_COLOR_DATA;

    constructor(
        private chartsService: ChartsService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.createChart();
    }

    ngAfterViewInit() {
        this._renderChart();
        this.changeDetectorRef.detectChanges();
    }

    ngOnChanges(changes: SimpleChanges) {
        // this.chart.destroy();
        // this.createChart();
    }

    /**
     * Creates chart
     */
    createChart() {
        this.labelList = [];
        this.dataList = [];
        this.colourList = [];
        this.deviceSellingBrandDataWithColorList = [];
        let iterateCount = 0;

        this.data.forEach((value) => {
            if (value != null) {
                this.labelList.push(value.brand);
                this.dataList.push(value.count);
                this.colourList.push(this.chartColor[iterateCount]);
            }

            const deviceSellingBrandWithColourData: DeviceSellingBrandWithColourData = {
                brand: value.brand,
                count: value.count,
                colour: this.chartColor[iterateCount],
            };
            iterateCount++;
            this.deviceSellingBrandDataWithColorList.push(deviceSellingBrandWithColourData);
        });
        this._renderChart();
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Renders chart
     */
    _renderChart() {
        // this.chart = new this.chartsService.Chart(this.myPieChart.nativeElement, {
        //     type: 'doughnut',
        //     data: {
        //         labels: this.labelList,
        //         datasets: [
        //             {
        //                 data: this.dataList,
        //                 backgroundColor: this.colourList,
        //                 hoverBackgroundColor: this.colourList,
        //                 hoverBorderColor: 'rgba(234, 236, 244, 1)',
        //             },
        //         ],
        //     },
        //     options: {
        //         maintainAspectRatio: false,
        //         tooltips: {
        //             backgroundColor: 'rgb(255,255,255)',
        //             bodyFontColor: '#858796',
        //             borderColor: '#dddfeb',
        //             borderWidth: 1,
        //             xPadding: 15,
        //             yPadding: 15,
        //             displayColors: false,
        //             caretPadding: 10,
        //         },
        //         legend: {
        //             display: false,
        //         },
        //         title: {
        //             display: false,
        //             text: 'Device by Brand for',
        //         },
        //         cutoutPercentage: 50,
        //     },
        // });
    }
}
