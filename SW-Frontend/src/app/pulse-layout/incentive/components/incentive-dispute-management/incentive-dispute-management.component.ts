import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'SW-incentive-dispute-management',
  templateUrl: './incentive-dispute-management.component.html',
  styleUrls: ['./incentive-dispute-management.component.scss']
})
export class IncentiveDisputeManagementComponent implements OnInit {
  @Output() onBackClick = new EventEmitter<boolean>();

  constructor() { }
  public tableDataList=new Array();
  ngOnInit(): void {
  }

}
