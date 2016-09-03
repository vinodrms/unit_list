import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormControl} from '@angular/forms';
import {TranslationPipe} from '../localization/TranslationPipe';

@Component({
    selector: 'debouncing-input-text',
    template: `
        <input type="text" class="form-control" [formControl]="textControl" placeholder="{{ inputPlaceholder | translate }}" [disabled]="inputDisabled">
    `
})
export class DebouncingInputTextComponent implements OnInit {
    public static DebounceTimeMillis = 400;

    @Input() inputPlaceholder: string = "";
    @Input() inputDisabled: boolean = false;
    @Input() set textValue(value: string) {
        if (this._didInitTextControl) {
            this.textControl.setValue(value, { emitEvent: false });
            return;
        }
        this._initialTextValue = value;
    }
    @Output() onTextChanged = new EventEmitter<string>();

    private _initialTextValue: string = "";
    textControl: FormControl;
    private _didInitTextControl: boolean = false;

    constructor() { }

    ngOnInit() {
        this.initializeTextControl();
    }

    private initializeTextControl() {
        this.textControl = new FormControl(this._initialTextValue);
        this.textControl.valueChanges
            .debounceTime(DebouncingInputTextComponent.DebounceTimeMillis)
            .distinctUntilChanged()
            .subscribe((text: string) => {
                this.onTextChanged.next(text);
            });
        this._didInitTextControl = true;
    }
}