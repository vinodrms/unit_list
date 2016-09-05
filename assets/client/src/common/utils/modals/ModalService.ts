import {Injectable, ReflectiveInjector, ViewContainerRef, Type, ComponentRef, ResolvedReflectiveProvider} from '@angular/core';
import {IModalService} from './IModalService';
import {ModuleLoaderService} from '../module-loader/ModuleLoaderService';
import {ModalDialogRef} from './utils/ModalDialogRef';
import {ICustomModalComponent} from './utils/ICustomModalComponent';
import {ModalBackdropModule, ModalBackdropComponent} from './utils/components/ModalBackdropComponent';
import {ModalContainerModule, ModalContainerComponent} from './utils/components/ModalContainerComponent';
import {ThError} from '../responses/ThError';
import {ConfirmationModalModule, ConfirmationModalComponent} from './modals/confirmation/ConfirmationModalComponent';
import {ConfirmationModalInput, ConfirmationModalButtons} from './modals/confirmation/utils/ConfirmationModalInput';

@Injectable()
export class ModalService implements IModalService {
	private _viewContainerRef: ViewContainerRef;
	private _container: ComponentRef<ICustomModalComponent>;
	private _moduleLoaderService: ModuleLoaderService;

	constructor() {
	}

	bootstrap(viewContainerRef: ViewContainerRef, moduleLoaderService: ModuleLoaderService) {
		this._viewContainerRef = viewContainerRef;
		this._moduleLoaderService = moduleLoaderService;
	}

	public open<T>(moduleType: Type<any>, componentType: Type<any>, providers: ResolvedReflectiveProvider[]): Promise<ModalDialogRef<T>> {
		return new Promise<ModalDialogRef<T>>((resolve: { (result: ModalDialogRef<T>): void }, reject: { (err: ThError): void }) => {
			this.openCore<T>(resolve, reject, moduleType, componentType, providers);
		});
	}
	private openCore<T>(resolve: { (result: ModalDialogRef<T>): void }, reject: { (err: ThError): void },
		moduleType: Type<any>, componentType: Type<any>, providers: ResolvedReflectiveProvider[]) {
		let dialog = new ModalDialogRef<T>();
		let dialogProviders = ReflectiveInjector.resolve([{ provide: ModalDialogRef, useValue: dialog }]);

		this._moduleLoaderService.loadNextToLocation(ModalBackdropModule, ModalBackdropComponent, this._viewContainerRef, dialogProviders)
			.then((backdropRef: ComponentRef<any>) => {
				dialog.backdropRef = backdropRef;
				return this._moduleLoaderService.loadNextToLocation(ModalContainerModule, ModalContainerComponent, backdropRef.instance.viewContainerRef, dialogProviders);
			})
			.then((containerRef: ComponentRef<any>) => {
				dialog.containerRef = containerRef;
				let modalDataProviders = ReflectiveInjector.resolve([{ provide: ModalDialogRef, useValue: dialog }]).concat(providers);
				return this._moduleLoaderService.loadNextToLocation(moduleType, componentType, containerRef.instance.viewContainerRef, modalDataProviders);
			})
			.then((contentRef: ComponentRef<ICustomModalComponent>) => {
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
		$('.modal .modal-body').css('max-height', $(window).height() * 0.7);
	}

	public confirm(title: string, content: string, confirmationButtons: ConfirmationModalButtons, onConfirmCallback: { (): void }, onRejectCallback?: { (): void }) {
		var confirmationModalInput = new ConfirmationModalInput();
		confirmationModalInput.title = title;
		confirmationModalInput.content = content;
        confirmationModalInput.buttons = confirmationButtons;

		this.open<any>(ConfirmationModalModule, ConfirmationModalComponent, ReflectiveInjector.resolve([
			{ provide: ConfirmationModalInput, useValue: confirmationModalInput }
		])).then((modalInstance: ModalDialogRef<any>) => {
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