import {Directive, OnInit, OnDestroy, ElementRef} from '@angular/core';

declare var jQuery: any;

@Directive({ selector: '[printableSection]' })
export class PrintableSection implements OnInit, OnDestroy {

    constructor(private _el: ElementRef) {

    }

    ngOnInit() {
        var jqElement = jQuery(this._el.nativeElement);
        jqElement.simplebar();
        jqElement.addClass('printable-section');
    }

    ngOnDestroy() {

    }
}