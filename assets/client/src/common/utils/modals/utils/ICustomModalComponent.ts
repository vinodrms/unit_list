import {ModalDialogInstance} from './ModalDialogInstance';

export enum ModalSize {
	Small,
	Large,
	Medium
}

export interface ICustomModalComponent {
	isBlocking(): boolean;
	getSize(): ModalSize;
}