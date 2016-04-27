import {Type, OpaqueToken, ViewContainerRef, ResolvedReflectiveProvider} from 'angular2/core';
import {ModalDialogInstance} from './utils/ModalDialogInstance';
import {ConfirmationModalButtons} from './modals/confirmation/utils/ConfirmationModalInput';

export interface IModalService {
	bootstrap(viewContainerRef: ViewContainerRef);
	open<T>(componentType: Type, providers: ResolvedReflectiveProvider[]): Promise<ModalDialogInstance<T>>;
	confirm(title: string, content: string, confirmationButtons: ConfirmationModalButtons, onConfirmCallback: { (): void }, onRejectCallback?: { (): void });
}
export const IModalService = new OpaqueToken("IModalService");