import { Component, Input, OnInit } from '@angular/core';
import { IconData } from '@app/SW/SW-common/components/icon/icon-data';

@Component({
    selector: 'SW-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {

    @Input() isActive: boolean = false;
    @Input() name: string = 'wallet';

    ass!: string;

    icons = IconData;

    constructor() {

    }

    ngOnInit(): void {
        this.getIcon();
    }

    getIcon() {
        this.icons.forEach(value => {
            if (value.name === this.name) {
                this.ass = value.src;
            }
        });
    }

}
