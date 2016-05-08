import {Pipe, PipeTransform, EventEmitter, OnDestroy} from '@angular/core';
import {ThUtils} from '../ThUtils';
import {ThTranslation} from './ThTranslation';

@Pipe({
	name: 'translate',
	pure: false // stateful pipe
})
export class TranslationPipe implements PipeTransform, OnDestroy {
	private _onLangChange: EventEmitter<string>;

	private _previousPhrase: string;
    private _previousParams: Object;
	private _pipeValue: string;

	constructor(private _thTranslation: ThTranslation) {
	}

	public transform(phrase: string, phraseParams: Object): any {
		if (phrase === this._previousPhrase && _.isEqual(phraseParams, this._previousParams)) {
			return this._pipeValue;
		}
		this._previousPhrase = phrase;
		this._previousParams = phraseParams;

		this.updatePipeValue();
		this.destroy();
		this._onLangChange = this._thTranslation.onLangChange.subscribe((event: any) => {
            this.updatePipeValue();
        });

		return this._pipeValue;
	}

	private updatePipeValue() {
		var parameters: Object = {};
		if (_.isObject(this._previousParams)) {
			parameters = this._previousParams;
		}
		this._pipeValue = this._thTranslation.translate(this._previousPhrase, parameters);
	}

    public ngOnDestroy(): void {
        this.destroy();
    }
	private destroy(): void {
        if (this._onLangChange) {
            this._onLangChange.unsubscribe();
            this._onLangChange = undefined;
        }
    }
}