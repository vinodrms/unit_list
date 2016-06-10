import {Directive, AfterViewInit, OnDestroy, ElementRef} from '@angular/core';

@Directive({
    selector: '[customScroll]',
    host: {
        '(window:resize)': "onResize($event)"
    }
})
export class CustomScroll implements AfterViewInit, OnDestroy {
    constructor(private _el: ElementRef) {
    }

    ngAfterViewInit() {
        var jqElement = this.getjQueryElement();
        jqElement.addClass('position-relative');
        jqElement.perfectScrollbar({
            wheelSpeed: 2,
            wheelPropagation: true,
            minScrollbarLength: 20
        });
        jqElement.perfectScrollbar('update');
    }

    ngOnDestroy() {
        var jqElement = this.getjQueryElement();
        jqElement.perfectScrollbar('destroy');
    }
    onResize(event) {
        this.updateScrollableRegion();
    }
    private updateScrollableRegion() {
        var jqElement = this.getjQueryElement();
        jqElement.perfectScrollbar('update');
    }

    private getjQueryElement(): any {
        return $(this._el.nativeElement);
    }

    public scheduleScrollRegionUpdate() {
        setTimeout(() => {
            this.updateScrollableRegion();
        });
    }
}