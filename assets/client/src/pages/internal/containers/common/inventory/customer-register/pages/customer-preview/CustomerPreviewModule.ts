import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedPipesModule} from '../../../../../../../../common/utils/pipes/modules/SharedPipesModule';

import {CustomerPreviewComponent} from './CustomerPreviewComponent';

@NgModule({
    imports: [CommonModule, SharedPipesModule],
    declarations: [CustomerPreviewComponent],
    exports: [CustomerPreviewComponent],
})
export class CustomerPreviewModule { }