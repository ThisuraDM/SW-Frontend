import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipePipe } from './pipes/date-pipe.pipe';
import { MonthPickerComponent } from './components/monthPicker/month-picker.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AppCommonModule } from '../../../modules/app-common/app-common.module';
import { FormsModule } from '@angular/forms';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { TxnPipe } from './pipes/txn.pipe';
import { MultilevelDropdownComponent } from './components/multilevel-dropdown/multilevel-dropdown.component';
import { NoDataComponent } from './components/no-data/no-data.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { ToggleButtonComponent } from './components/toggle-button/toggle-button.component';

@NgModule({
    declarations: [
        DatePipePipe,
        MonthPickerComponent,
        DateRangePickerComponent,
        SpinnerComponent,
        SkeletonLoaderComponent,
        TxnPipe,
        MultilevelDropdownComponent,
        NoDataComponent,
        ImageUploadComponent,
        ToggleButtonComponent,
    ],
    exports: [
        DatePipePipe,
        DateRangePickerComponent,
        MonthPickerComponent,
        SkeletonLoaderComponent,
        TxnPipe,
        MultilevelDropdownComponent,
        NoDataComponent,
        ImageUploadComponent,
        ToggleButtonComponent,
    ],
    imports: [
        CommonModule,
        AppCommonModule,
        FormsModule,
    ],
})
export class SWCommonModule {
}
