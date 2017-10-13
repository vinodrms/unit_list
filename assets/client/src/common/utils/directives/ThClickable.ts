import { Directive, ElementRef, Renderer, AfterViewInit } from '@angular/core';

declare var $: any;

/**
 * Various clickable elements [e.g. the ones where the angular (click) callback is registered] do not work with keyboard inputs
 * This directive allows selection with the 'tab' key of the element and to trigger click when pressing 'Enter' or 'Space'
 */

@Directive({
    selector: '[th-clickable]'
})
export class ThClickableDirective implements AfterViewInit {
    private static spaceKey = 32;
    private static enterKey = 13;

    constructor(private renderer: Renderer,
        private element: ElementRef) { }

    ngAfterViewInit() {
        this.makeElementAccesibleByTab();
        this.registerKeyListener();
    }

    private makeElementAccesibleByTab() {
        this.renderer.setElementAttribute(this.element.nativeElement, "tabindex", "0");
    }

    private registerKeyListener() {
        $(this.element.nativeElement).keydown(function (e) {
            if (e.which === ThClickableDirective.spaceKey || e.which === ThClickableDirective.enterKey) {
                this.click();
            }
        });
    }
}
