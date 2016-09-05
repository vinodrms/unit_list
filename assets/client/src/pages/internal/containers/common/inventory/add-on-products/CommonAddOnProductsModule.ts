import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {SharedPipesModule} from '../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../common/utils/components/modules/SharedComponentsModule';

import {AddOnProductOverviewComponent} from './pages/add-on-product-overview/AddOnProductOverviewComponent';
import {AddOnProductEditComponent} from './pages/add-on-product-edit/AddOnProductEditComponent';
import {AddOnProductsComponent} from './main/AddOnProductsComponent';

const CommonAddOnProductsComponentsDeclarations = [
    AddOnProductOverviewComponent,
    AddOnProductEditComponent,
    AddOnProductsComponent,
];

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [CommonAddOnProductsComponentsDeclarations],
    exports: [AddOnProductsComponent]
})
export class CommonAddOnProductsModule { }