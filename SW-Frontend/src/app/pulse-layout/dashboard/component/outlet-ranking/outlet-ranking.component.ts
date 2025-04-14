import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    ViewChildren,
} from '@angular/core';
import { OutletRanking, OutletDetails } from '@app/SW-layout/dashboard/models/outlet-ranking';
import { Products } from '@app/SW-layout/dashboard/models/products';
import { OutletRankingService } from '@app/SW-layout/dashboard/services/outlet-ranking.service';
import { ProductsService } from '@app/SW-layout/dashboard/services/products.service';
import { SBSortableHeaderDirective } from '@modules/tables/directives';

const tableProperties = {
    limit: 5,
    pageNum: 0,
    page: 0,
    sortBy: 'sales',
    pageSize: 4,
};

/**
 * SW outlet ranking component
 * Author: Thisura Munasinghe
 * Created Date: 2021 August 15
 */
@Component({
    selector: 'SW-outlet-ranking',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './outlet-ranking.component.html',
    styleUrls: ['./outlet-ranking.component.scss'],
})
export class OutletRankingComponent implements OnChanges, OnInit {
    @Input() pageSize!: number;
    @Input() selectedMonth = '';
    @Output() productSelect = new EventEmitter<number>();
    @Output() productNameSelect = new EventEmitter<string>();

    products: Products[] = [];
    outletRanking: OutletRanking ={
        number:0,
        number_of_elements:0,
        size:0,
        total_elements:0,
        total_pages:0,
        content:[],
    };
    selectedProductId!: number;
    selectedProductName!: string;
    itemsPerPage!: number;
    totalItems!: number;
    pageNum!: number;
    sortBy!: string;
    loading = false;
    loaded = false;

    @ViewChildren(SBSortableHeaderDirective) headers!: QueryList<SBSortableHeaderDirective>;

    constructor(
        public changeDetectorRef: ChangeDetectorRef,
        private productService: ProductsService,
        private outletRankingService: OutletRankingService
    ) {
        this.pageNum = tableProperties.pageNum;
        this.sortBy = tableProperties.sortBy;
        this.pageSize = tableProperties.pageSize;
    }

    ngOnInit() {
        this.getProducts();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.productChange();
    }

    /**
     * Gets products
     */
    getProducts() {
        this.loading = true;
        this.productService.getProducts().subscribe((products: Products[]) => {
            if (products) {
                this.products = products;
                if (this.products != null) {
                    this.selectedProductId = this.products[0].id;
                }
                this.productChange();
                this.loading = false;
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    /**
     * Gets outlet ranking
     */
    getOutletRanking() {
        this.loading = true;
        if (this.selectedProductId && this.selectedMonth) {
            this.outletRankingService
                .getOutletRanking(
                    this.selectedProductId,
                    tableProperties.limit,
                    this.selectedMonth,
                    this.pageNum,
                    this.sortBy
                )
                .subscribe((outletRanking: OutletRanking) => {
                    if (outletRanking) {
                        this.outletRanking = outletRanking;
                        this.outletRanking.number = outletRanking.number + 1;
                        this.loading = false;
                        this.changeDetectorRef.detectChanges();
                    }
                });
            setInterval(() => {
                this.loaded = true;
                this.changeDetectorRef.detectChanges();
            }, 1000);
        }
    }

    /**
     * Products change
     */
    productChange() {
        if (this.products != null) {
            this.products.forEach((value) => {
                if (value.id == this.selectedProductId) {
                    this.selectedProductName = value.display_name;
                }
            });
        }

        this.pageNum = 0;
        this.getOutletRanking();
        if (this.selectedProductId) {
            this.productSelect.emit(this.selectedProductId);
            this.productNameSelect.emit(this.selectedProductName);
        }
    }

    /**
     * Sorts by change
     */
    sortByChange() {
        this.pageNum = 0;
        this.getOutletRanking();
    }

    /**
     * Loads page
     * @param page
     */
    loadPage(page: number) {
        this.pageNum = page - 1;
        this.getOutletRanking();
    }
}
