import {Injectable, ReflectiveInjector, provide, DynamicComponentLoader, ViewContainerRef, Type, ComponentRef, ResolvedReflectiveProvider} from '@angular/core';
import {IModalService} from './IModalService';
import {ModalBackdropComponent} from './utils/components/ModalBackdropComponent';
import {ModalContainerComponent} from './utils/components/ModalContainerComponent';
import {ModalDialogRef} from './utils/ModalDialogRef';
import {ICustomModalComponent} from './utils/ICustomModalComponent';
import {ThError} from '../responses/ThError';
import {ConfirmationModalComponent} from './modals/confirmation/ConfirmationModalComponent';
import {ConfirmationModalInput, ConfirmationModalButtons} from './modals/confirmation/utils/ConfirmationModalInput';

@Injectable()
export class ModalService implements IModalService {
	private _viewContainerRef: ViewContainerRef;
	private _container: ComponentRef<ICustomModalComponent>;

	constructor(private _componentLoader: DynamicComponentLoader) { }

	public bootstrap(viewContainerRef: ViewContainerRef) {
		this._viewContainerRef = viewContainerRef;
	}

	public open<T>(componentType: Type, providers: ResolvedReflectiveProvider[]): Promise<ModalDialogRef<T>> {
		return new Promise<ModalDialogRef<T>>((resolve: { (result: ModalDialogRef<T>): void }, reject: { (err: ThError): void }) => {
			this.openCore<T>(resolve, reject, componentType, providers);
		});
	}
	private openCore<T>(resolve: { (result: ModalDialogRef<T>): void }, reject: { (err: ThError): void }, componentType: Type, providers: ResolvedReflectiveProvider[]) {
		let dialog = new ModalDialogRef<T>();
		let dialogProviders = ReflectiveInjector.resolve([provide(ModalDialogRef, { useValue: dialog })]);

		this._componentLoader.loadNextToLocation(ModalBackdropComponent, this._viewContainerRef, dialogProviders)
			.then((backdropRef: ComponentRef<any>) => {
				backdropRef.changeDetectorRef.detectChanges();
				
				dialog.backdropRef = backdropRef;
				return this._componentLoader.loadNextToLocation(ModalContainerComponent, backdropRef.instance.viewContainerRef, dialogProviders);
			})
			.then((containerRef: ComponentRef<any>) => {
				containerRef.changeDetectorRef.detectChanges();
				
				dialog.containerRef = containerRef;
				let modalDataProviders = ReflectiveInjector.resolve([provide(ModalDialogRef, { useValue: dialog })]).concat(providers);
				return this._componentLoader.loadNextToLocation(componentType, containerRef.instance.viewContainerRef, modalDataProviders);
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
        
		this.open<any>(ConfirmationModalComponent, ReflectiveInjector.resolve([
			provide(ConfirmationModalInput, { useValue: confirmationModalInput })
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