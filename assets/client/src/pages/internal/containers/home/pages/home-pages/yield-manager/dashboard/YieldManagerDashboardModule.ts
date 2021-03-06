import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";

import {SharedPipesModule} from '../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../../../../../common/utils/components/modules/SharedComponentsModule';

import {YieldManagerDashboardComponent} from './YieldManagerDashboardComponent';
import {YieldFilterPaneComponent} from './components/yield-filter-pane/YieldFilterPaneComponent';
import {YieldColorFitlerItemComponent} from './components/yield-filter-pane/components/yield-color-filter-item/YieldColorFilterItemComponent';
import {YieldTextFilterItemComponent} from './components/yield-filter-pane/components/yield-text-filter-item/YieldTextFilterItemComponent';

import {YieldTimeFrameHeaderComponent} from './components/yield-timeframe-header/YieldTimeFrameHeaderComponent';
import {YieldKeyMetricsComponent} from './components/yield-key-metrics/YieldKeyMetricsComponent';
import {YieldPriceProductsComponent} from './components/yield-price-products/YieldPriceProductsComponent';
import {YieldActionsPanelComponent} from './components/yield-price-products/components/yield-actions-panel/YieldActionsPanelComponent';
import {PriceProductStateComponent} from './components/yield-price-products/components/price-product-state/PriceProductStateComponent';
import {YieldViewModeComponent} from './components/yield-view-mode/YieldViewModeComponent';

@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule],
    declarations: [YieldManagerDashboardComponent,
        YieldFilterPaneComponent, YieldColorFitlerItemComponent, YieldTextFilterItemComponent,
        YieldTimeFrameHeaderComponent, YieldKeyMetricsComponent,
        YieldPriceProductsComponent, YieldActionsPanelComponent, PriceProductStateComponent,
        YieldViewModeComponent,],
    exports: [YieldManagerDashboardComponent]
})
export class YieldManagerDashboardModule { }