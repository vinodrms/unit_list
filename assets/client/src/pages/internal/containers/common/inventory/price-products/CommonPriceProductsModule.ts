import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {SharedPipesModule} from '../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../common/utils/components/modules/SharedComponentsModule';

import {PriceProductsComponent} from './main/PriceProductsComponent';
import {PriceProductOverviewComponent} from './pages/price-product-overview/PriceProductOverviewComponent';
import {PriceProductEditContainerComponent} from './pages/price-product-edit/container/PriceProductEditContainerComponent';
import {PriceProductEditTopSectionComponent} from './pages/price-product-edit/sections/top-section/PriceProductEditTopSectionComponent';
import {PriceProductEditRoomCategoriesSectionComponent} from './pages/price-product-edit/sections/room-categories/PriceProductEditRoomCategoriesSectionComponent';
import {PriceProductEditAddOnProductsSectionComponent} from './pages/price-product-edit/sections/add-on-products/PriceProductEditAddOnProductsSectionComponent';
import {PriceProductEditTaxesSectionComponent} from './pages/price-product-edit/sections/taxes/PriceProductEditTaxesSectionComponent';
import {PriceProductEditPricesSectionComponent} from './pages/price-product-edit/sections/prices/PriceProductEditPricesSectionComponent';
import {PriceProductEditFiltersSectionComponent} from './pages/price-product-edit/sections/filters/PriceProductEditFiltersSectionComponent';
import {PriceProductEditCancellationSectionComponent} from './pages/price-product-edit/sections/cancellation/PriceProductEditCancellationSectionComponent';
import {PriceProductEditConstraintsSectionComponent} from './pages/price-product-edit/sections/constraints/constraints-list/PriceProductEditConstraintsSectionComponent';
import {PriceProductEditNotesSectionComponent} from './pages/price-product-edit/sections/notes/PriceProductEditNotesSectionComponent';

const CommonPriceProductsComponentsDeclarations = [
    PriceProductsComponent,
    PriceProductOverviewComponent,
    PriceProductEditContainerComponent,
    PriceProductEditTopSectionComponent,
    PriceProductEditRoomCategoriesSectionComponent,
    PriceProductEditAddOnProductsSectionComponent,
    PriceProductEditTaxesSectionComponent,
    PriceProductEditPricesSectionComponent,
    PriceProductEditFiltersSectionComponent,
    PriceProductEditCancellationSectionComponent,
    PriceProductEditConstraintsSectionComponent,
    PriceProductEditNotesSectionComponent,
];

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [CommonPriceProductsComponentsDeclarations],
    exports: [PriceProductsComponent]
})
export class CommonPriceProductsModule { }