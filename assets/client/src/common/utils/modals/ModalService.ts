import {Injectable, Injector, provide, DynamicComponentLoader, ElementRef, ComponentRef, ResolvedProvider} from 'angular2/core';
import {IModalService} from './IModalService';
import {ModalBackdropComponent} from './utils/components/ModalBackdropComponent';
import {ModalContainerComponent} from './utils/components/ModalContainerComponent';
import {ModalDialogInstance} from './utils/ModalDialogInstance';
import {ThError} from '../responses/ThError';

@Injectable()
export class ModalService implements IModalService {
	private _elementRef: ElementRef;
	private _container: ComponentRef;

	constructor(private _componentLoader: DynamicComponentLoader) { }

	public bootstrap(elementRef: ElementRef) {
		this._elementRef = elementRef;
	}

	public open(componentType: FunctionConstructor, providers: ResolvedProvider[]): Promise<ModalDialogInstance> {
		return new Promise<ModalDialogInstance>((resolve: { (result: ModalDialogInstance): void }, reject: { (err: ThError): void }) => {
			this.openCore(resolve, reject, componentType, providers);
		});
	}
	private openCore(resolve: { (result: ModalDialogInstance): void }, reject: { (err: ThError): void }, componentType: FunctionConstructor, providers: ResolvedProvider[]) {
		let dialog = new ModalDialogInstance();
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
				dialog.contentRef = contentRef;
				resolve(dialog);
			})
			.catch((err: any) => {
				reject(new ThError("Error opening popup"));
			});
	}
}