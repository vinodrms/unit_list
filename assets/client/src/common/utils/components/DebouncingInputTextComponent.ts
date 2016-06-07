import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Control} from '@angular/common';
import {TranslationPipe} from '../localization/TranslationPipe';

@Component({
    selector: 'debouncing-input-text',
    template: `
        <input type="text" class="form-control" [ngFormControl]="textControl" placeholder="{{ inputPlaceholder | translate }}" [disabled]="inputDisabled">
    `,
    pipes: [TranslationPipe]
})
export class DebouncingInputTextComponent implements OnInit {
    public static DebounceTimeMillis = 400;

    @Input() inputPlaceholder: string = "";
    @Input() inputDisabled: boolean = false;
    @Input() set textValue(value: string) {
        if (this._didInitTextControl) {
            this.textControl.updateValue(value, { emitEvent: false });
            return;
        }
        this._initialTextValue = value;
    }
    @Output() onTextChanged = new EventEmitter<string>();

    private _initialTextValue: string = "";
    textControl: Control;
    private _didInitTextControl: boolean = false;

    constructor() { }

    ngOnInit() {
        this.initializeTextControl();
    }

    private initializeTextControl() {
        this.textControl = new Control(this._initialTextValue);
        this.textControl.valueChanges
            .debounceTime(DebouncingInputTextComponent.DebounceTimeMillis)
            .distinctUntilChanged()
            .subscribe((text: string) => {
                this.onTextChanged.next(text);
            });
        this._didInitTextControl = true;
    }
}