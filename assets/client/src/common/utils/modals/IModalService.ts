import {Type, OpaqueToken, ViewContainerRef, ResolvedReflectiveProvider} from '@angular/core';
import {ModalDialogRef} from './utils/ModalDialogRef';
import {ConfirmationModalButtons} from './modals/confirmation/utils/ConfirmationModalInput';

export interface IModalService {
	bootstrap(viewContainerRef: ViewContainerRef);
	open<T>(componentType: Type, providers: ResolvedReflectiveProvider[]): Promise<ModalDialogRef<T>>;
	confirm(title: string, content: string, confirmationButtons: ConfirmationModalButtons, onConfirmCallback: { (): void }, onRejectCallback?: { (): void });
}
export const IModalService = new OpaqueToken("IModalService");