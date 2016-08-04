import {OpaqueToken} from '@angular/core';

export interface IAnalytics {
    logPageView(path: string);
    logEvent(eventCategory: string, eventAction: string, eventLabel?: string);
}
export const IAnalytics = new OpaqueToken("IAnalytics");