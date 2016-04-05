import {Observable, Observer} from 'rxjs/Rx';
import {ComponentRef} from 'angular2/core';
import {ModalSize} from './ICustomModalComponent';

export class ModalDialogInstance<T> {
	private _backdropRef;
	private _containerRef;
	private _contentRef: ComponentRef;
	private _modalSize;

    private _resultObservable: Observable<T>;
	private _resultObserver: Observer<T>;

    constructor() {
		this._modalSize = ModalSize.Large;
		this._resultObservable = new Observable((observer: Observer<T>) => {
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
        this.dispose();
    }
	public closeForced() {
		this.dispose();
	}

    private dispose() {
		if (this._resultObserver) {
			this._resultObserver.complete();
		}
        this._containerRef.dispose();
        this._backdropRef.dispose();
        this._contentRef.dispose();
    }

	public get backdropRef(): ComponentRef {
		return this._backdropRef;
	}
	public set backdropRef(backdropRef: ComponentRef) {
		this._backdropRef = backdropRef;
	}

	public get containerRef(): ComponentRef {
		return this._containerRef;
	}
	public set containerRef(containerRef: ComponentRef) {
		this._containerRef = containerRef;
	}

	public get contentRef(): ComponentRef {
		return this._contentRef;
	}
	public set contentRef(contentRef: ComponentRef) {
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