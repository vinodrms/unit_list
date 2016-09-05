import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedPipesModule} from '../../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../../../../common/utils/components/modules/SharedComponentsModule';

import {BedSelectorComponent} from './BedSelectorComponent';

@NgModule({
    imports: [CommonModule, 
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [BedSelectorComponent],
    exports: [BedSelectorComponent],
})
export class BedSelectorModule { }