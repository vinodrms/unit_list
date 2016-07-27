import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../localization/TranslationPipe';

@Component({
    selector: 'edit-save-button-group',
    template: `
        <div class="row">
            <div class="col-xs-12">
                <span class="pull-left edit-save-button-group-container">
                    <span *ngIf="!isEditing">
                        <button type="button" class="btn btn-danger btn-block btn-xs uppercase" (click)="triggerEditStart()">
                            <i class="fa unitpal-font">]</i> {{ changeText | translate }}
                        </button>
                    </span>
                    <span *ngIf="isEditing">
                        <button type="button" class="btn btn-primary btn-block btn-xs uppercase save-btn" (click)="triggerSavePressed()">
                            <i *ngIf="isSaving" class="fa fa-spinner fa-pulse"></i>
                            <i *ngIf="!isSaving" class="fa fa-save">]</i> 
                            {{ 'Save' | translate }}
                        </button>
                        <button type="button" class="btn btn-danger btn-block btn-xs cancel-btn" (click)="triggerEditEnd()">
                            <i class="fa unitpal-font">\\</i> 
                        </button>
                    </span>
                </span>
            </div>
        </div>
    `,
    pipes: [TranslationPipe]
})
export class EditSaveButtonGroupComponent {
    @Input() changeText: string = "Change";
    @Input() isSaving: boolean = false;
    @Input() isEditing: boolean = false;

    @Output() onEditStart = new EventEmitter<boolean>();
    public triggerEditStart() {
        this.onEditStart.next(true);
    }

    @Output() onEditEnd = new EventEmitter<boolean>();
    public triggerEditEnd() {
        this.onEditEnd.next(true);
    }

    @Output() onSavePressed = new EventEmitter<boolean>();
    public triggerSavePressed() {
        if(this.isSaving) { return; }
        this.onSavePressed.next(true);
    }

    constructor() { }
}