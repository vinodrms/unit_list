import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {SharedPipesModule} from '../../pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../directives/modules/SharedDirectivesModule';

import {EditSaveButtonGroupComponent} from '../button-groups/EditSaveButtonGroupComponent';
import {ChartComponent} from '../chart/ChartComponent';
import {DocumentHistoryViewerComponent} from '../document-history/DocumentHistoryViewerComponent';
import {FileAttachmentsComponent} from '../file-attachments/FileAttachmentsComponent';
import {ImageUploadComponent} from '../image-upload/ImageUploadComponent';
import {ItemListNavigatorComponent} from '../item-list-navigator/ItemListNavigatorComponent';
import {LazyLoadingTableComponent} from '../lazy-loading/LazyLoadingTableComponent';
import {ThHourSelectComponent} from '../th-hour-select/ThHourSelectComponent';
import {ConfigCapacityComponent} from '../ConfigCapacityComponent';
import {DebouncingInputTextComponent} from '../DebouncingInputTextComponent';
import {LoadingButtonComponent} from '../LoadingButtonComponent';
import {LoadingComponent} from '../LoadingComponent';
import {PercentageInputNumberComponent} from '../PercentageInputNumberComponent';
import {SearchInputTextComponent} from '../SearchInputTextComponent';
import {ThButtonComponent} from '../ThButtonComponent';
import {ThDatePickerComponent} from '../ThDatePickerComponent';
import {ThDateIntervalPickerComponent} from '../ThDateIntervalPickerComponent';
import {VATComponent} from '../VATComponent';

const SharedComponents = [
    EditSaveButtonGroupComponent,
    ChartComponent,
    DocumentHistoryViewerComponent,
    FileAttachmentsComponent,
    ImageUploadComponent,
    ItemListNavigatorComponent,
    LazyLoadingTableComponent,
    ThHourSelectComponent,
    ConfigCapacityComponent,
    DebouncingInputTextComponent,
    LoadingButtonComponent,
    LoadingComponent,
    PercentageInputNumberComponent,
    SearchInputTextComponent,
    ThButtonComponent,
    ThDatePickerComponent,
    ThDateIntervalPickerComponent,
    VATComponent
];

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule,
        SharedPipesModule, SharedDirectivesModule],
    declarations: [SharedComponents],
    exports: [SharedComponents]
})
export class SharedComponentsModule { }