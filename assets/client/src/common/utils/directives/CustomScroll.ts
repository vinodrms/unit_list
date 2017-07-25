import { Directive, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';

declare var $: any;

@Directive({
    selector: '[customScroll]',
    host: {
        '(window:resize)': "onResize($event)"
    }
})
export class CustomScroll implements AfterViewInit, OnDestroy {
    private static scrollOffset = 20;

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

    private create() {
        var jqElement = this.getjQueryElement();
        jqElement.addClass('position-relative');
        jqElement.perfectScrollbar({
            wheelSpeed: 1,
            wheelPropagation: true,
            minScrollbarLength: 20
        });
        jqElement.perfectScrollbar('update');
    }

    private destroy() {
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

    public scrollUp() {
        this.scroll(-1);
    }
    public scrollDown() {
        this.scroll(1);
    }
    private scroll(direction: number) {
        var jqElement = this.getjQueryElement();
        let newScrollTop = jqElement.scrollTop() + (direction * CustomScroll.scrollOffset);
        jqElement.scrollTop(newScrollTop).perfectScrollbar('update');
    }
}