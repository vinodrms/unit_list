import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedPipesModule} from '../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../../common/utils/components/modules/SharedComponentsModule';

import {BedSelectorModule} from '../room-edit/components/bed-selector/BedSelectorModule';
import {RoomPreviewComponent} from './RoomPreviewComponent';

@NgModule({
    imports: [CommonModule, SharedPipesModule, SharedDirectivesModule, SharedComponentsModule, BedSelectorModule],
    declarations: [RoomPreviewComponent],
    exports: [RoomPreviewComponent],
})
export class RoomPreviewModule { }