import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BlueCubeProducts } from '@app/SW-layout/dashboard/models/products';
import { Placement } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'SW-multilevel-dropdown',
    templateUrl: './multilevel-dropdown.component.html',
    styleUrls: ['./multilevel-dropdown.component.scss'],
})
export class MultilevelDropdownComponent implements OnInit, OnChanges {

    @Input() dataList: BlueCubeProducts[] = [];
    placement: Placement = 'bottom-end';
    selectedProduct: any = {};
    selectedProductName: string = '';
    @Output() selectProductAndPlan = new EventEmitter<any>();

    constructor() {

    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['dataList']) {
            this.selectedProductName = this.dataList[0].product_name;
            this.selectedProduct = this.dataList[0];
        }
    }

    selectProduct(data: any) {
        this.selectedProduct = {
            product_id: data.product_id,
            product_name: data.product_name,
            plans: '',
        };
        this.selectedProductName = data.product_name;
        this.selectProductAndPlan.emit(this.selectedProduct);
    }

    selectProductPlan(id: number, name: string, plan: string) {
        this.selectedProduct = {
            product_id: id,
            product_name: name,
            plans: plan,
        };
        this.selectedProductName = plan;
        this.selectProductAndPlan.emit(this.selectedProduct);
    }
}
