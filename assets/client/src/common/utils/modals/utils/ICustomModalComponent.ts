import {ModalDialogInstance} from './ModalDialogInstance';

export enum ModalSize {
	Small,
	Large
}

export interface ICustomModalComponent {
    dialog: ModalDialogInstance;
	isBlocking(): boolean;
	getSize(): ModalSize;
}