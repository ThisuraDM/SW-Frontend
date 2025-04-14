import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'SW-error-503-sudden-maintenance',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './error-503-sudden-maintenance.component.html',
    styleUrls: ['error-503-sudden-maintenance.component.scss'],
})
export class Error503SuddenMaintenanceComponent implements OnInit {
    constructor() {}
    ngOnInit() {}
}
