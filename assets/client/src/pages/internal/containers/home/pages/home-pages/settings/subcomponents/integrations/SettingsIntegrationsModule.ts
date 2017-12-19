import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedPipesModule } from '../../../../../../../../../common/utils/pipes/modules/SharedPipesModule';
import { settingsIntegrationsRouting } from './SettingsIntegrationsRoutes';

import { SharedComponentsModule } from '../../../../../../../../../common/utils/components/modules/SharedComponentsModule';
import { SharedDirectivesModule } from '../../../../../../../../../common/utils/directives/modules/SharedDirectivesModule';

import { SettingsIntegrationsComponent } from './main/SettingsIntegrationsComponent';
import { SettingsBookingDotComIntegrationComponent } from './pages/bookingdotcom/SettingsBookingDotComIntegrationComponent';
import { BookingDotComIntegrationAuthenticationStepComponent } from './pages/bookingdotcom/steps/authentication/BookingDotComIntegrationAuthenticationStepComponent';
import { BookingDotComIntegrationRoomConfigurationStepComponent } from './pages/bookingdotcom/steps/room-configuration/BookingDotComIntegrationRoomConfigurationStepComponent';
import { BookingDotComIntegrationPriceProductConfigurationStepComponent } from './pages/bookingdotcom/steps/price-product-configuration/BookingDotComIntegrationPriceProductConfigurationStepComponent';
import { BookingDotComIntegrationHotelConfigurationStepService } from './pages/bookingdotcom/steps/hotel-configuration/service/BookingDotComIntegrationHotelConfigurationStepService';
import { BookingDotComIntegrationHotelConfigurationStepComponent } from './pages/bookingdotcom/steps/hotel-configuration/BookingDotComIntegrationHotelConfigurationStepComponent';

var settingsIntegrationsComponents = [
    SettingsIntegrationsComponent,
    SettingsBookingDotComIntegrationComponent,
    BookingDotComIntegrationAuthenticationStepComponent,
    BookingDotComIntegrationHotelConfigurationStepComponent,
    BookingDotComIntegrationRoomConfigurationStepComponent,
    BookingDotComIntegrationPriceProductConfigurationStepComponent
    
];
@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedPipesModule, SharedComponentsModule, SharedDirectivesModule, settingsIntegrationsRouting ],
    declarations: [settingsIntegrationsComponents, settingsIntegrationsComponents],
})
export class SettingsIntegrationsModule { }