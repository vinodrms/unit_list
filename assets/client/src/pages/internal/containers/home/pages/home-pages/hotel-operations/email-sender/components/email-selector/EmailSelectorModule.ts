import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SharedPipesModule} from '../../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {EmailSelectorComponent} from './EmailSelectorComponent';

@NgModule({
    imports: [CommonModule, FormsModule, SharedPipesModule],
    declarations: [EmailSelectorComponent],
    exports: [EmailSelectorComponent]
})
export class EmailSelectorModule { }