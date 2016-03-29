import {Pipe, PipeTransform, EventEmitter, OnDestroy} from 'angular2/core';
import {isPresent} from "angular2/src/facade/lang";
import {ThUtils} from '../ThUtils';
import {ThTranslation} from './ThTranslation';

@Pipe({
	name: 'translate',
	pure: false // stateful pipe
})
export class TranslationPipe implements PipeTransform, OnDestroy {
	private _onLangChange: EventEmitter<string>;

	private _previousPhrase: string;
    private _previousArgs: any[];
	private _pipeValue: string;

	constructor(private _thTranslation: ThTranslation) {
	}

	public transform(phrase: string, args: any[]): any {
		if (phrase === this._previousPhrase && _.isEqual(args, this._previousArgs)) {
			return this._pipeValue;
		}
		this._previousPhrase = phrase;
		this._previousArgs = args;

		this.updatePipeValue();
		this.dispose();
		this._onLangChange = this._thTranslation.onLangChange.subscribe((event: any) => {
            this.updatePipeValue();
        });

		return this._pipeValue;
	}

	private updatePipeValue() {
		var parameters = null;
		if (_.isArray(this._previousArgs) && this._previousArgs.length > 0 && _.isObject(this._previousArgs[0])) {
			parameters = this._previousArgs[0];
		}
		this._pipeValue = this._thTranslation.translate(this._previousPhrase, parameters);
	}

    public ngOnDestroy(): void {
        this.dispose();
    }
	private dispose(): void {
        if (isPresent(this._onLangChange)) {
            this._onLangChange.unsubscribe();
            this._onLangChange = undefined;
        }
    }
}