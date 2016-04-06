import {OpaqueToken, ElementRef, ResolvedProvider} from 'angular2/core';
import {ModalDialogInstance} from './utils/ModalDialogInstance';

export interface IModalService {
	bootstrap(elementRef: ElementRef);
	open<T>(componentType: FunctionConstructor, providers: ResolvedProvider[]): Promise<ModalDialogInstance<T>>;
	confirm(title: string, content: string, onConfirmCallback: { (): void }, onRejectCallback?: { (): void });
}
export const IModalService = new OpaqueToken("IModalService");