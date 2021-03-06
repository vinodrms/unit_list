import {Observable, Observer} from 'rxjs/Rx';
import {ComponentRef} from '@angular/core';
import {ModalSize, ICustomModalComponent} from './ICustomModalComponent';

export class ModalDialogRef<T> {
	private _backdropRef: ComponentRef<any>;
	private _containerRef: ComponentRef<any>;
	private _contentRef: ComponentRef<ICustomModalComponent>;
	private _modalSize;

    private _resultObservable: Observable<T>;
	private _resultObserver: Observer<T>;

    constructor() {
		this._modalSize = ModalSize.Large;
		this._resultObservable = new Observable<T>((observer: Observer<T>) => {
			this._resultObserver = observer;
		});
    }

	public addResult(result: T) {
		if (this._resultObserver) {
			this._resultObserver.next(result);
		}
	}
	public addErrorResult(error: any) {
		if (this._resultObserver) {
			this._resultObserver.error(error);
		}
	}

    public close() {
        if (this._contentRef.instance.isBlocking && this._contentRef.instance.isBlocking() === true) {
			return;
		}
        this.destroy();
    }
	public closeForced() {
		this.destroy();
	}

    private destroy() {
		if (this._resultObserver) {
			this._resultObserver.complete();
		}
        this._containerRef.destroy();
        this._backdropRef.destroy();
        this._contentRef.destroy();
    }

	public get backdropRef(): ComponentRef<any> {
		return this._backdropRef;
	}
	public set backdropRef(backdropRef: ComponentRef<any>) {
		this._backdropRef = backdropRef;
	}

	public get containerRef(): ComponentRef<any> {
		return this._containerRef;
	}
	public set containerRef(containerRef: ComponentRef<any>) {
		this._containerRef = containerRef;
	}

	public get contentRef(): ComponentRef<ICustomModalComponent> {
		return this._contentRef;
	}
	public set contentRef(contentRef: ComponentRef<ICustomModalComponent>) {
		this._contentRef = contentRef;
		if (this._contentRef.instance.getSize) {
			this._modalSize = this._contentRef.instance.getSize();
		}
	}
	public get modalSize(): ModalSize {
		return this._modalSize;
	}
	public set modalSize(modalSize: ModalSize) {
		this._modalSize = modalSize;
	}

	get resultObservable(): Observable<T> {
        return this._resultObservable;
    }
}