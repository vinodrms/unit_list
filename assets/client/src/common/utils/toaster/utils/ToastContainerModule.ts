import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ToastContainerComponent} from './ToastContainerComponent';

@NgModule({
    imports: [CommonModule],
    declarations: [ToastContainerComponent],
    exports: [ToastContainerComponent]
})
export class ToastContainerModule { }