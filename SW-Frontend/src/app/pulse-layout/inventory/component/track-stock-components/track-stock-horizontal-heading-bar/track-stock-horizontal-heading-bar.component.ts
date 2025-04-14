import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NavigationOptions} from '@app/SW-layout/inventory/models/trasfer-details';

@Component({
    selector: 'SW-track-stock-horizontal-heading-bar',
    templateUrl: './track-stock-horizontal-heading-bar.component.html',
    styleUrls: ['./track-stock-horizontal-heading-bar.component.scss']
})
export class TrackStockHorizontalHeadingBarComponent implements OnInit {

    @Input() inputData: {title: string, screenToNavigate: NavigationOptions} = {
        title: 'Stock Transfer Details',
        screenToNavigate: NavigationOptions.SEARCH
    };
    @Output() backClick = new EventEmitter<NavigationOptions>();

    constructor() {
    }

    ngOnInit(): void {
    }

    onBackClick(){
        if(this.inputData.title == 'Track Stock Details'){
            this.backClick.emit(NavigationOptions.SEARCH);
        }else{
            this.backClick.emit(this.inputData.screenToNavigate);
        }

    }

}
