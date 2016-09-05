import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedPipesModule} from '../../../../../../../../common/utils/pipes/modules/SharedPipesModule';

import {BedSelectorModule} from '../room-edit/components/bed-selector/BedSelectorModule';
import {RoomPreviewComponent} from './RoomPreviewComponent';

@NgModule({
    imports: [CommonModule, SharedPipesModule, BedSelectorModule],
    declarations: [RoomPreviewComponent],
    exports: [RoomPreviewComponent],
})
export class CustomerPreviewModule { }