import {ModalDialogInstance} from './ModalDialogInstance';

export enum ModalSize {
	Small,
	Large
}

export interface ICustomModalComponent {
	isBlocking(): boolean;
	getSize(): ModalSize;
}