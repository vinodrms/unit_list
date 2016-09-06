import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SharedPipesModule} from '../../../../../../../common/utils/pipes/modules/SharedPipesModule';

import {YieldFilterModalComponent} from './YieldFilterModalComponent';

@NgModule({
    imports: [CommonModule, FormsModule, SharedPipesModule],
    declarations: [YieldFilterModalComponent],
    exports: [YieldFilterModalComponent],
})
export class YieldFilterModalModule { }