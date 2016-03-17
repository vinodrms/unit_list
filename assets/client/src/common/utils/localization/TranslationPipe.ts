import {Pipe, PipeTransform, EventEmitter, OnDestroy} from 'angular2/core';
import {isPresent} from "angular2/src/facade/lang";
import {ThUtils} from '../ThUtils';
import {TranslationService} from './TranslationService';

@Pipe({
	name: 'translate',
	pure: false // stateful pipe
})
export class TranslationPipe implements PipeTransform, OnDestroy {
	private static TemplateVariableRegex: RegExp = /%\s?([^{}\s]*)\s?%/g;

	private _thUtils: ThUtils;
	private _onLangChange: EventEmitter<string>;

	private _previousPhrase: string;
    private _previousArgs: any[];
	private _pipeValue: string;

	constructor(private _translationService: TranslationService) {
		this._thUtils = new ThUtils();
	}

	public transform(phrase: string, args: any[]): any {
		if (phrase === this._previousPhrase && _.isEqual(args, this._previousArgs)) {
			return this._pipeValue;
		}
		this._previousPhrase = phrase;
		this._previousArgs = args;

		this.updatePipeValue();
		this.dispose();
		this._onLangChange = this._translationService.onLangChange.subscribe((event: any) => {
            this.updatePipeValue();
        });

		return this._pipeValue;
	}

	private updatePipeValue() {
		var translatedMessage = this._translationService.getTranslation(this._previousPhrase);
		if (!_.isArray(this._previousArgs) || this._previousArgs.length === 0 || !_.isObject(this._previousArgs[0])) {
			this._pipeValue = translatedMessage;
			return;
		}
		this._pipeValue = this.applyTemplateRegex(translatedMessage, this._previousArgs[0]);
	}
	private applyTemplateRegex(message: string, parameters: Object): string {
		return message.replace(TranslationPipe.TemplateVariableRegex, (substring: string, actualKey: string) => {
			if (this._thUtils.isUndefinedOrNull(parameters, actualKey)) {
				return "";
			}
			return parameters[actualKey];
		});
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