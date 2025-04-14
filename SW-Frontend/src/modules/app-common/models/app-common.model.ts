import { TemplateRef } from '@angular/core';

export interface CopyToClipboardOptions {
    debug?: boolean;
    message?: string;
    format?: string; // MIME type
}
export type CopyToClipboard = (text: string, options?: CopyToClipboardOptions) => boolean;

export interface NgbDateObject {
    endDate: Date,
    startDate: Date,
    selectedRange: SelectedDateRange,
}

export type SelectedDateRangeString =
    | 'Current Month'
    | 'Last 30 Days'
    | 'Last 60 Days'
    | 'Last 90 Days'
    | 'Custom';

export type SelectedDateRange =
    | 'TODAY'
    | 'YESTERDAY'
    | 'LAST_7_DAYS'
    | 'LAST_30_DAYS'
    | 'LAST_60_DAYS'
    | 'LAST_90_DAYS'
    | 'THIS_MONTH'
    | 'LAST_MONTH'
    | 'THIS_YEAR'
    | 'LAST_YEAR'
    | 'CUSTOM';

export type SBThemeColors =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'light'
    | 'dark'
    | 'black'
    | 'white'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'teal'
    | 'cyan'
    | 'blue'
    | 'indigo'
    | 'purple'
    | 'pink'
    | 'red-soft'
    | 'orange-soft'
    | 'yellow-soft'
    | 'green-soft'
    | 'teal-soft'
    | 'cyan-soft'
    | 'blue-soft'
    | 'indigo-soft'
    | 'purple-soft'
    | 'pink-soft'
    | 'primary-soft'
    | 'secondary-soft'
    | 'success-soft'
    | 'info-soft'
    | 'warning-soft'
    | 'danger-soft';

export interface TimelineData {
    markerText: string;
    itemContent?: string;
    itemTemplate?: TemplateRef<unknown>;
    markerFeatherIcon?: string;
    markerColor?: SBThemeColors;
    markerIndicatorTextColor?: SBThemeColors;
}
