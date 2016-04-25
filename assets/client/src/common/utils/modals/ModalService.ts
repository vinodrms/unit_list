import {Injectable, Injector, provide, DynamicComponentLoader, ElementRef, ComponentRef, ResolvedProvider} from 'angular2/core';
import {IModalService} from './IModalService';
import {ModalBackdropComponent} from './utils/components/ModalBackdropComponent';
import {ModalContainerComponent} from './utils/components/ModalContainerComponent';
import {ModalDialogInstance} from './utils/ModalDialogInstance';
import {ThError} from '../responses/ThError';
import {ConfirmationModalComponent} from './modals/confirmation/ConfirmationModalComponent';
import {ConfirmationModalInput, ConfirmationModalButtons} from './modals/confirmation/utils/ConfirmationModalInput';

@Injectable()
export class ModalService implements IModalService {
	private _elementRef: ElementRef;
	private _container: ComponentRef;

	constructor(private _componentLoader: DynamicComponentLoader) { }

	public bootstrap(elementRef: ElementRef) {
		this._elementRef = elementRef;
	}

	public open<T>(componentType: FunctionConstructor, providers: ResolvedProvider[]): Promise<ModalDialogInstance<T>> {
		return new Promise<ModalDialogInstance<T>>((resolve: { (result: ModalDialogInstance<T>): void }, reject: { (err: ThError): void }) => {
			this.openCore<T>(resolve, reject, componentType, providers);
		});
	}
	private openCore<T>(resolve: { (result: ModalDialogInstance<T>): void }, reject: { (err: ThError): void }, componentType: FunctionConstructor, providers: ResolvedProvider[]) {
		let dialog = new ModalDialogInstance<T>();
		let dialogProviders = Injector.resolve([provide(ModalDialogInstance, { useValue: dialog })]);

		this._componentLoader.loadNextToLocation(ModalBackdropComponent, this._elementRef, dialogProviders)
			.then((backdropRef: ComponentRef) => {
				dialog.backdropRef = backdropRef;

				return this._componentLoader.loadIntoLocation(ModalContainerComponent, backdropRef.location, 'modalBackdrop', dialogProviders)
			})
			.then((containerRef: ComponentRef) => {
				let modalDataProviders = Injector.resolve([provide(ModalDialogInstance, { useValue: dialog })]).concat(providers);
				dialog.containerRef = containerRef;

				return this._componentLoader.loadIntoLocation(componentType, containerRef.location, "modalDialog", modalDataProviders);
			})
			.then((contentRef: ComponentRef) => {
				this.updateModalBodyMaxHeight();
				dialog.contentRef = contentRef;
				resolve(dialog);
			})
			.catch((err: any) => {
				console.error(err);
				reject(new ThError("Error opening popup"));
			});
	}
	private updateModalBodyMaxHeight() {
		$('.modal .modal-body').css('overflow-y', 'auto');
		$('.modal .modal-body').css('max-height', $(window).height() * 0.8);
	}

	public confirm(title: string, content: string, confirmationButtons: ConfirmationModalButtons, onConfirmCallback: { (): void }, onRejectCallback?: { (): void }) {
		var confirmationModalInput = new ConfirmationModalInput();
		confirmationModalInput.title = title;
		confirmationModalInput.content = content;
        confirmationModalInput.buttons = confirmationButtons;
        
		this.open<any>(<any>ConfirmationModalComponent, Injector.resolve([
			provide(ConfirmationModalInput, { useValue: confirmationModalInput })
		])).then((modalInstance: ModalDialogInstance<any>) => {
			modalInstance.resultObservable.subscribe((result: any) => {
				onConfirmCallback();
			}, (err: any) => {
				if (onRejectCallback) {
					onRejectCallback();
				}
			});
		});
	}
}