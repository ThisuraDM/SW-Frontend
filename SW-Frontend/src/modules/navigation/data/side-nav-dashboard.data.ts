import { SideNavItems, SideNavSection } from '@modules/navigation/models';

export const sideNavSections: SideNavSection[] = [
    {
        text: 'DASHBOARD',
        items: ['dashboards', 'dashboardDealer', 'incentiveDealer'],
        active: false,
    },
    {
        text: 'STORE MANAGEMENT',
        items: ['cnucpd', 'threshold', 'deviceThreshold', 'eWallet', 'inventory', 'receiptReprint', 'receiptReprintDealer', 'customerService'],
        active: false,
    },
    {
        text: 'USER MANAGEMENT',
        items: ['user'],
        active: false,
    },
];

export const sideNavItems: SideNavItems = {
    dashboards: {
        icon: 'kpi-dashboard',
        link: '/dashboard',
        text: 'KPI Dashboard',
        active: false,
    },
    dashboardDealer: {
        icon: 'kpi-dashboard',
        link: '/dashboard/dealer-kpi-dashboard',
        text: 'KPI Dashboard',
        active: false,
    },
    incentiveDealer: {
        icon: 'inactive',
        link: '/incentive',
        text: 'Incentives',
        active: false,
    },
    cnucpd: {
        icon: 'cnu-cpd',
        text: 'CNU/CPD',
        link: '/store/cnu-cpd-bc',
        active: false,
    },
    threshold: {
        icon: 'device-threshold',
        link: '/store/threshold-bc',
        text: 'Threshold Management',
        active: false,
    },
    deviceThreshold:{
        icon: 'device-threshold',
        link: '/store/device-threshold-dealer',
        text: 'Device Threshold',
        active: false,
    },
    eWallet: {
        icon: 'wallet',
        text: 'eWallet',
        link: '/store/ewallet',
        active: false,
    },
    user: {
        icon: 'user-management',
        submenu: [
            {
                text: 'Change Password',
                link: '/user/change-password',
                active: false,
            },
            {
                text: 'Reset Password',
                link: '/user/reset-password',
                active: false,
            },
        ],
        text: 'User',
        active: false,
    },
    inventory: {
        icon: 'inventory-management',
        submenu: [
            {
                text: 'View Stock',
                link: '/store/inventory/dealer-search-stock',
                active: false,
            },
            {
                text: 'View Stock',
                link: '/store/inventory/bc-search-stock',
                active: false,
            },
            {
                text: 'Stock Request',
                link: '/store/inventory/bc-stock-request-other-store',
                active: false,
            },
            {
                text: 'Track Stock',
                link: '/store/inventory/bc-track-stock-transfer-bc-to-bc',
                active: false,
            },
            {
                text: 'Track Stock',
                link: '/store/inventory/dealer-track-stock-transfer',
                active: false,
            },
            {
                text: 'Stock Acknowledgement',
                link: '/store/inventory/dealer-stock-acknowledgement',
                active: false,
            },
            {
                text: 'Physical Stock Ordering',
                link: '/store/inventory/dealer-physical-stock-ordering',
                active: false,
            },
        ],
        text: 'Inventory Management',
        active: false,
    },
    customerService: {
        icon: 'customer-service',
        submenu: [
            {
                text: 'Reinstate Recharge Card',
                link: '/customer-service/reinstate-recharge-card',
                active: true,
            },
        ],
        text: 'Customer Service',
        active: false,
    },
    receiptReprint: {
        icon: 'receipt-reprint',
        link: '/store/receipt-reprint-bc',
        text: 'Receipt Reprint',
        active: false,
    },
    receiptReprintDealer: {
        icon: 'receipt-reprint',
        link: '/store/receipt-reprint-dealer',
        text: 'Receipt Reprint',
        active: false,
    },

};
