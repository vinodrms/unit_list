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
        this.create();
    }

    ngOnDestroy() {
        this.destroy();
    }

    onResize(event) {
        this.updateScrollableRegion();
    }

    private create(){
        var jqElement = this.getjQueryElement();
        jqElement.addClass('position-relative');
        jqElement.perfectScrollbar({
            wheelSpeed: 1,
            wheelPropagation: true,
            minScrollbarLength: 20
        });
        jqElement.perfectScrollbar('update');
    }

    private destroy(){
        var jqElement = this.getjQueryElement();
        jqElement.perfectScrollbar('destroy');
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

    /* Note: This is needed on yield-manager,
    *  scroll update does not seem to work, only forcing a destroy and recreating makes it work properly.
    */
    public forceRecreate(){
        this.destroy();
        setTimeout(()=>{
            this.create();
        });
    }
}