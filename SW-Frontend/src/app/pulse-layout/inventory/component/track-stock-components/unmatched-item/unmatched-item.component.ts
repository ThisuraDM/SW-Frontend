import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'SW-unmatched-item',
    templateUrl: './unmatched-item.component.html',
    styleUrls: ['./unmatched-item.component.scss'],
})
export class UnmatchedItemComponent implements OnInit {
    @Input() label = '';
    @Input() itemCode = '';

    constructor() {
    }

    ngOnInit(): void {
    }

}
