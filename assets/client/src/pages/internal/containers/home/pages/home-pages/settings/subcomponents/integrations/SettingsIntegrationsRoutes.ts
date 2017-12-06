import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsIntegrationsComponent } from './main/SettingsIntegrationsComponent';
import { SettingsBookingDotComIntegrationComponent } from './pages/bookingdotcom/SettingsBookingDotComIntegrationComponent';

const settingsIntegrationsRoutes: Routes = [
    {
        path: '', component: SettingsIntegrationsComponent,
        children: [
            { path: '', redirectTo: 'bookingdotcom', pathMatch: 'bookingdotcom' },
            { path: 'bookingdotcom', component: SettingsBookingDotComIntegrationComponent },


        ]
    }
];
export const settingsIntegrationsRouting: ModuleWithProviders = RouterModule.forChild(settingsIntegrationsRoutes);