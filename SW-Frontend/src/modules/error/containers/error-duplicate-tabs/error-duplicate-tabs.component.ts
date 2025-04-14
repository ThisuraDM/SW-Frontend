import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@app/auth/services/auth.service';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'SW-error-duplicate-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './error-duplicate-tabs.component.html',
  styleUrls: ['./error-duplicate-tabs.component.scss']
})
export class ErrorDuplicateTabsComponent implements OnInit {

  public countdown = 0; 
  constructor(private modalService: NgbModal,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.modalService.dismissAll();
    this.countdown = 5;
    const countdownInterval = setInterval(() => {
  
      this.countdown -= 1; // Decrease the countdown value by 1 second
      this.cdr.detectChanges();
      console.log(this.countdown);
      if (this.countdown <= 0) {
        clearInterval(countdownInterval); // Stop the interval when countdown reaches 0
        // Perform the logout action here
        this.authService.logout();
      }
    }, 1000);

  }


}
