import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPipesModule} from '../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {WizardStepsComponent} from './WizardStepsComponent';

@NgModule({
    imports: [CommonModule, SharedPipesModule],
    declarations: [WizardStepsComponent],
    exports: [WizardStepsComponent],
})
export class WizardStepsModule { }