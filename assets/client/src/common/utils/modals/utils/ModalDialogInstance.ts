import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {ComponentRef} from 'angular2/core';
import {ModalSize} from './ICustomModalComponent';

export class ModalDialogInstance {
	private _backdropRef;
	private _containerRef;
	private _contentRef: ComponentRef;
	private _modalSize;


    private _result: Observable<Object>;
	private _resultObserver: Observer<Object>;

    constructor() {
		this._modalSize = ModalSize.Large;
		this._result = Observable.create((observer: Observer<Object>) => {
			this._resultObserver = observer;
		});
    }

	public addResult(result: Object) {
		this._resultObserver.next(result);
	}

    public close() {
        if (this._contentRef.instance.isBlocking && this._contentRef.instance.isBlocking() === true) return;
        this.dispose();
    }
	public closeForced() {
		this.dispose();
	}

    private dispose() {
		this._resultObserver.complete();
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

	get result(): Observable<Object> {
        return this._result;
    }
}