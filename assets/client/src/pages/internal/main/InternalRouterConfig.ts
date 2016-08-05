import {provideRouter, RouterConfig} from '@angular/router';

import {MainWizardComponent} from '../containers/wizard/main/MainWizardComponent';
import {WizardBasicInformationComponent} from '../containers/wizard/pages/wizard-pages/basic-information/main/WizardBasicInformationComponent';
import {WizardBasicInfoIntroComponent} from '../containers/wizard/pages/wizard-pages/basic-information/pages/intro/WizardBasicInfoIntroComponent';
import {WizardBasicInfoOverviewComponent} from '../containers/wizard/pages/wizard-pages/basic-information/pages/overview/WizardBasicInfoOverviewComponent';
import {WizardBasicInfoPaymentsAndPoliciesComponent} from '../containers/wizard/pages/wizard-pages/basic-information/pages/payments-policies/WizardBasicInfoPaymentsAndPoliciesComponent';
import {WizardBasicInfoPropertyDetailsComponent} from '../containers/wizard/pages/wizard-pages/basic-information/pages/property-details/WizardBasicInfoPropertyDetailsComponent';
import {WizardBedsComponent} from '../containers/wizard/pages/wizard-pages/beds/WizardBedsComponent';
import {WizardRoomsComponent} from '../containers/wizard/pages/wizard-pages/rooms/WizardRoomsComponent';
import {WizardBreakfastComponent} from '../containers/wizard/pages/wizard-pages/breakfast/WizardBreakfastComponent';
import {WizardAddOnProductsComponent} from '../containers/wizard/pages/wizard-pages/add-on-products/WizardAddOnProductsComponent';
import {WizardPriceProductsComponent} from '../containers/wizard/pages/wizard-pages/price-products/WizardPriceProductsComponent';
import {WizardCustomerRegisterComponent} from '../containers/wizard/pages/wizard-pages/customer-register/WizardCustomerRegisterComponent';
import {WizardAllotmentsComponent} from '../containers/wizard/pages/wizard-pages/allotments/WizardAllotmentsComponent';

import {MainHomeComponent} from '../containers/home/main/MainHomeComponent';
import {HotelOperationsDashboardComponent} from '../containers/home/pages/home-pages/hotel-operations/dashboard/HotelOperationsDashboardComponent';
import {YieldManagerDashboardComponent} from '../containers/home/pages/home-pages/yield-manager/YieldManagerDashboardComponent';
import {BookingHistoryDashboardComponent} from '../containers/home/pages/home-pages/booking-history/BookingHistoryDashboardComponent';
import {SettingsContainerComponent} from '../containers/home/pages/home-pages/settings/container/SettingsContainerComponent';
import {SettingsBasicInformationComponent} from '../containers/home/pages/home-pages/settings/subcomponents/basic-information/main/SettingsBasicInformationComponent';
import {SettingsBasicInfoOverviewComponent} from '../containers/home/pages/home-pages/settings/subcomponents/basic-information/pages/overview/SettingsBasicInfoOverviewComponent';
import {SettingsBasicInfoPaymentsAndPoliciesComponent} from '../containers/home/pages/home-pages/settings/subcomponents/basic-information/pages/payments-policies/SettingsBasicInfoPaymentsAndPoliciesComponent';
import {SettingsBasicInfoPropertyDetailsComponent} from '../containers/home/pages/home-pages/settings/subcomponents/basic-information/pages/property-details/SettingsBasicInfoPropertyDetailsComponent';
import {SettingsBedsComponent} from '../containers/home/pages/home-pages/settings/subcomponents/beds/SettingsBedsComponent';
import {SettingsRoomsComponent} from '../containers/home/pages/home-pages/settings/subcomponents/rooms/SettingsRoomsComponent';
import {SettingsBreakfastComponent} from '../containers/home/pages/home-pages/settings/subcomponents/breakfast/SettingsBreakfastComponent';
import {SettingsAddOnProductsComponent} from '../containers/home/pages/home-pages/settings/subcomponents/add-on-products/SettingsAddOnProductsComponent';
import {SettingsPriceProductsComponent} from '../containers/home/pages/home-pages/settings/subcomponents/price-products/SettingsPriceProductsComponent';
import {SettingsCustomerRegisterComponent} from '../containers/home/pages/home-pages/settings/subcomponents/customer-register/SettingsCustomerRegisterComponent';
import {SettingsAllotmentsComponent} from '../containers/home/pages/home-pages/settings/subcomponents/allotments/SettingsAllotmentsComponent';

const routes: RouterConfig = [
    {
        path: '', component: MainHomeComponent,
        children: [
            { path: 'operations', component: HotelOperationsDashboardComponent },
            { path: 'yield-manager', component: YieldManagerDashboardComponent },
            { path: 'bookings', component: BookingHistoryDashboardComponent },
            {
                path: 'settings', component: SettingsContainerComponent,
                children: [
                    {
                        path: 'basic-info', component: SettingsBasicInformationComponent,
                        children: [
                            { path: 'overview', component: SettingsBasicInfoOverviewComponent },
                            { path: 'payments-policies', component: SettingsBasicInfoPaymentsAndPoliciesComponent },
                            { path: 'property-details', component: SettingsBasicInfoPropertyDetailsComponent },
                            { path: '**', redirectTo: "overview" }
                        ]
                    },
                    { path: 'beds', component: SettingsBedsComponent },
                    { path: 'rooms', component: SettingsRoomsComponent },
                    { path: 'breakfast', component: SettingsBreakfastComponent },
                    { path: 'add-on-products', component: SettingsAddOnProductsComponent },
                    { path: 'price-products', component: SettingsPriceProductsComponent },
                    { path: 'customer-register', component: SettingsCustomerRegisterComponent },
                    { path: 'allotments', component: SettingsAllotmentsComponent },
                    { path: '**', redirectTo: "basic-info/overview" }
                ]
            }
        ]
    },
    {
        path: 'wizard', component: MainWizardComponent,
        children: [
            {
                path: 'basic-info', component: WizardBasicInformationComponent,
                children: [
                    { path: 'intro', component: WizardBasicInfoIntroComponent },
                    { path: 'overview', component: WizardBasicInfoOverviewComponent },
                    { path: 'payments-policies', component: WizardBasicInfoPaymentsAndPoliciesComponent },
                    { path: 'property-details', component: WizardBasicInfoPropertyDetailsComponent },
                    { path: '**', redirectTo: "intro" }
                ]
            },
            { path: 'beds', component: WizardBedsComponent },
            { path: 'rooms', component: WizardRoomsComponent },
            { path: 'breakfast', component: WizardBreakfastComponent },
            { path: 'add-on-products', component: WizardAddOnProductsComponent },
            { path: 'price-products', component: WizardPriceProductsComponent },
            { path: 'customer-register', component: WizardCustomerRegisterComponent },
            { path: 'allotments', component: WizardAllotmentsComponent },
            { path: '**', redirectTo: "basic-info/intro" }
        ]
    }
];
export const InternalRouterConfig = [
    provideRouter(routes)
];