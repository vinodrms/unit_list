import {Component, ViewChild, ViewContainerRef, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

/**
 * Represents the modal backdrop.
 */
@Component({
    selector: 'modal-backdrop',
    host: {
        '[style.position]': 'position',
        '[style.height]': 'height',
        '[style.width]': 'width',
        '[style.top]': 'top',
        '[style.left]': 'left',
        '[style.right]': 'right',
        '[style.bottom]': 'bottom'

    },
    template: '<div class="in modal-backdrop" #modalBackdrop></div>'
})
export class ModalBackdropComponent {
    @ViewChild('modalBackdrop', {read: ViewContainerRef}) viewContainerRef: ViewContainerRef;
    
    public position: string;
    public height: string;
    public width: string;
    public top: string;
    public left: string;
    public right: string;
    public bottom: string;

    constructor() {
        this.initDefaults();
    }
	private initDefaults() {
		this.height = '100%';
		this.width = '100%';
		this.top = this.left = this.right = this.bottom = '0';
	}
}

@NgModule({
    imports: [CommonModule],
    declarations: [ModalBackdropComponent],
    exports: [ModalBackdropComponent]
})
export class ModalBackdropModule { }