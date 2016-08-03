import {Injectable} from '@angular/core';
import {Router, Event, NavigationEnd} from '@angular/router';
import {Location} from '@angular/common';
import {ThUtils} from '../ThUtils';
import {IAnalytics} from './IAnalytics';

@Injectable()
export class GoogleAnalytics implements IAnalytics {
    private _thUtils: ThUtils;
    private _currentRoute: string;

    constructor(private _router: Router, private _location: Location) {
        this._thUtils = new ThUtils();
        this.register();
    }
    private register() {
        this._router.events.subscribe((event: Event) => {
            this.handleEvent(event);
        });
    }
    private handleEvent(event: Event) {
        if (!(event instanceof NavigationEnd)) { return; }
        let newRoute = this._location.path() || '/';
        if (newRoute === this._currentRoute) { return; }
        this._currentRoute = newRoute;
        this.logPageView(this._currentRoute);
    }

    public logPageView(path: string) {
        if (this.googleAnalyticsIsDisabled()) { return; }
        ga("send", "pageview", path);
    }
    public logEvent(eventCategory: string, eventAction: string, eventLabel?: string) {
        if (this.googleAnalyticsIsDisabled()) { return; }
        ga("send", "event", eventCategory, eventAction, eventLabel);
    }

    private googleAnalyticsIsDisabled(): boolean {
        return typeof ga == 'undefined';
    }
}