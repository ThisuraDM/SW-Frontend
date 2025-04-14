import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'SW-status-verification-alerts',
    templateUrl: './status-verification-alerts.component.html'
})
export class StatusVerificationAlertsComponent implements OnInit {
    @Output() content = new EventEmitter<any>();
    @Output() outletSelect = new EventEmitter<NgbModalOptions>();

    constructor() {
    }

    ngOnInit(): void {
    }

    setModal() {
        this.content.emit('modalDefaultStatic');
    }
}
