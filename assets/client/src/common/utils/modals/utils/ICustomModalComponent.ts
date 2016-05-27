export enum ModalSize {
	Small,
	Medium,
	Large,
	XLarge
}

export interface ICustomModalComponent {
	isBlocking(): boolean;
	getSize(): ModalSize;
}