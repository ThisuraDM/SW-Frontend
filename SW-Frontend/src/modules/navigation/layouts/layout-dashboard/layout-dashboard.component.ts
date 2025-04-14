import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { UtilityService } from '@common/services';
import { sideNavItems, sideNavSections } from '@modules/navigation/data/side-nav-dashboard.data';
import { NavigationService } from '@modules/navigation/services';
import { Subscription } from 'rxjs';

import { LocalStorageService } from '../../../../services/local-storage.service';

@Component({
    selector: 'sbpro-layout-dashboard',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './layout-dashboard.component.html',
    styleUrls: ['layout-dashboard.component.scss'],
})
export class LayoutDashboardComponent implements OnInit, OnDestroy {
    @Input() static = false;
    @Input() light = false;
    @Input() rtl = false;
    @HostBinding('class.sidenav-toggled') sideNavHidden = false;
    subscription: Subscription = new Subscription();
    sideNavItems = sideNavItems;
    sideNavSections = sideNavSections;
    sidenavStyle = 'sidenav-dark';

    constructor(
        public utilityService: UtilityService,
        public navigationService: NavigationService,
        private changeDetectorRef: ChangeDetectorRef,
        private localStorageService: LocalStorageService
    ) {}
    ngOnInit() {
        if (this.light) {
            this.sidenavStyle = 'sidenav-light';
        }
        this.subscription.add(
            this.navigationService.sideNavVisible$().subscribe((isVisible) => {
                this.sideNavHidden = !isVisible;
                this.changeDetectorRef.markForCheck();
            })
        );
        this.checkPermissions();
    }

    checkPermissions() {
        const permissions = this.localStorageService.getPermissions();
        if (permissions != null) {
            permissions.forEach((value: string) => {
                if (value === 'KPI_DASHBOARD_BC') {
                    this.sideNavItems.dashboards.active = true;
                    this.sideNavSections
                        .filter((navSection) => navSection.text == 'DASHBOARD')
                        .forEach((navSection) => (navSection.active = true));
                    this.sideNavItems.dashboards.submenu?.forEach((value1) => {
                        if (value1.text == 'BC') {
                            value1.active = true;
                        }
                    });
                }
                if (value === 'KPI_DASHBOARD_DEALER') {
                    this.sideNavItems.dashboardDealer.active = true;
                    this.sideNavSections
                        .filter((navSection) => navSection.text == 'DASHBOARD')
                        .forEach((navSection) => (navSection.active = true));
                    this.sideNavItems.dashboards.submenu?.forEach((value1) => {
                        if (value1.text == 'Dealer') {
                            value1.active = true;
                        }
                    });
                }
                if (value === 'INCENTIVE_DEALER') {
                    this.sideNavItems.incentiveDealer.active = true;
                    this.sideNavSections
                        .filter((navSection) => navSection.text == 'DASHBOARD')
                        .forEach((navSection) => (navSection.active = true));
                    this.sideNavItems.dashboards.submenu?.forEach((value1) => {
                        if (value1.text == 'Dealer') {
                            value1.active = true;
                        }
                    });
                }
                if (value == 'CNU_CPD') {
                    this.sideNavItems.cnucpd.active = true;
                    this.sideNavSections
                        .filter((navSection) => navSection.text == 'STORE MANAGEMENT')
                        .forEach((navSection) => (navSection.active = true));
                    this.sideNavItems.cnucpd.submenu?.forEach((value1) => {
                        if (value1.text == 'CNU/CPD') {
                            value1.active = true;
                        }
                    });
                }
                if (value == 'BC_THRESHOLD_UPDATE') {
                    this.sideNavItems.threshold.active = true;
                    this.sideNavSections
                        .filter((navSection) => navSection.text == 'STORE MANAGEMENT')
                        .forEach((navSection) => (navSection.active = true));
                    this.sideNavItems.threshold.submenu?.forEach((value1) => {
                        if (value1.text == 'Threshold Management') {
                            value1.active = true;
                        }
                    });
                }
                if (value == 'DEALER_DEVICE_THRESHOLD') {
                    this.sideNavItems.deviceThreshold.active = true;
                    this.sideNavSections
                        .filter((navSection) => navSection.text == 'STORE MANAGEMENT')
                        .forEach((navSection) => (navSection.active = true));
                    this.sideNavItems.threshold.submenu?.forEach((value1) => {
                        if (value1.text == 'Device Threshold') {
                            value1.active = true;
                        }
                    });
                }
                if (value == 'EWALLET_OTHER') {
                    this.sideNavItems.eWallet.active = true;
                    this.sideNavSections
                        .filter((navSection) => navSection.text == 'STORE MANAGEMENT')
                        .forEach((navSection) => (navSection.active = true));
                    this.sideNavItems.eWallet.submenu?.forEach((value1) => {
                        if (value1.text == 'eWallet') {
                            value1.active = true;
                        }
                    });
                }
                if (value == 'ADMIN_PW_RESET') {
                    this.sideNavItems.user.active = true;
                    this.sideNavSections
                        .filter((navSection) => navSection.text == 'USER MANAGEMENT')
                        .forEach((navSection) => (navSection.active = true));
                    this.sideNavItems.user.submenu?.forEach((value1) => {
                        if (value1.text == 'Reset Password') {
                            value1.active = true;
                        }
                    });
                }
                if (value == 'VIEW_STOCK_DEALER') {
                    this.sideNavItems.inventory.active = true;
                    this.sideNavSections
                        .filter((navSection) => navSection.text == 'Inventory Management')
                        .forEach((navSection) => (navSection.active = true));
                    this.sideNavItems.inventory.submenu?.forEach((value1) => {
                        if (value1.link == '/store/inventory/dealer-search-stock') {
                            value1.active = true;
                        }
                    });
                }
                if (value == 'VIEW_STOCK_BC') {
                    this.sideNavItems.inventory.active = true;
                    this.sideNavSections
                        .filter((navSection) => navSection.text == 'Inventory Management')
                        .forEach((navSection) => (navSection.active = true));
                    this.sideNavItems.inventory.submenu?.forEach((value1) => {
                        if (value1.link == '/store/inventory/bc-search-stock') {
                            value1.active = true;
                        }
                    });
                }
                if (value == 'STOCK_TRANSFER_BC') {
                    this.sideNavItems.inventory.active = true;
                    this.sideNavSections
                        .filter((navSection) => navSection.text == 'Inventory Management')
                        .forEach((navSection) => (navSection.active = true));
                    this.sideNavItems.inventory.submenu?.forEach((value1) => {
                        if (value1.link == '/store/inventory/bc-stock-request-other-store') {
                            value1.active = true;
                        }
                    });
                }
                if (value == 'RECEIPT_REPRINT_BC') {
                    this.sideNavItems.receiptReprint.active = true;
                    this.sideNavSections
                        .filter((navSection) => navSection.text == 'STORE MANAGEMENT')
                        .forEach((navSection) => (navSection.active = true));
                }
                if (value == 'RECEIPT_REPRINT_DEALER') {
                    this.sideNavItems.receiptReprintDealer.active = true;
                    this.sideNavSections
                        .filter((navSection) => navSection.text == 'STORE MANAGEMENT')
                        .forEach((navSection) => (navSection.active = true));
                }
                if (value == 'TRACK_STOCK_TRANSFER_DEALER') {
                    this.sideNavItems.inventory.active = true;
                    this.sideNavSections
                        .filter((navSection) => navSection.text == 'Inventory Management')
                        .forEach((navSection) => (navSection.active = true));
                    this.sideNavItems.inventory.submenu?.forEach((value1) => {
                        if (value1.link == '/store/inventory/dealer-track-stock-transfer') {
                            value1.active = true;
                        }
                    });
                }
                if (value == 'TRACK_STOCK_TRANSFER_BC') {
                    this.sideNavItems.inventory.active = true;
                    this.sideNavSections
                        .filter((navSection) => navSection.text == 'Inventory Management')
                        .forEach((navSection) => (navSection.active = true));
                    this.sideNavItems.inventory.submenu?.forEach((value1) => {
                        if (value1.link == '/store/inventory/bc-track-stock-transfer-bc-to-bc') {
                            value1.active = true;
                        }
                    });
                }
                if (value == 'STOCK_ACKNOWLEDGEMENT_DEALER') {
                    this.sideNavItems.inventory.active = true;
                    this.sideNavSections
                        .filter((navSection) => navSection.text == 'Inventory Management')
                        .forEach((navSection) => (navSection.active = true));
                    this.sideNavItems.inventory.submenu?.forEach((value1) => {
                        if (value1.link == '/store/inventory/dealer-stock-acknowledgement') {
                            value1.active = true;
                        }
                    });
                }

                if (value == 'PHYSICAL_STOCK_ORDERING_DEALER') {
                    this.sideNavItems.inventory.active = true;
                    this.sideNavSections
                        .filter((navSection) => navSection.text == 'Inventory Management')
                        .forEach((navSection) => (navSection.active = true));
                    this.sideNavItems.inventory.submenu?.forEach((value1) => {
                        if (value1.link == '/store/inventory/dealer-physical-stock-ordering') {
                            value1.active = true;
                        }
                    });
                }
                if (value == 'REINSTATE_RECHARGE_CARD_BC') {
                    this.sideNavItems.customerService.active = true;
                    this.sideNavSections
                        .filter((navSection) => navSection.text == 'Customer Service')
                        .forEach((navSection) => (navSection.active = true));
                    this.sideNavItems.inventory.submenu?.forEach((value1) => {
                        if (value1.link == '/customer-service/reinstate-recharge-card') {
                            value1.active = true;
                        }
                    });
                }
            });
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    closeSideNavIfOpen() {
        const BOOTSTRAP_LG_WIDTH = 992;
        if (this.utilityService.window.innerWidth >= 992) {
            return;
        }
        // After the lg breakpoint, hidden is actually visible.
        // So the toggleSideNav below only will fire if the screen is < 992px
        // and the sideNav is open.
        if (this.sideNavHidden) {
            this.navigationService.toggleSideNav(true);
        }
    }
}
