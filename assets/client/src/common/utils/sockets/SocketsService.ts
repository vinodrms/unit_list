import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Injectable} from '@angular/core';
import {ISocketsService} from './ISocketsService';
import {SocketEvent} from './utils/SocketEvent';
import {SocketMessage} from './utils/SocketMessage';
import {AppContext} from '../AppContext';

@Injectable()
export class SocketsService implements ISocketsService {

    private _socket: SocketIOClient.Socket;
    private _newNotificationsObservable: Observable<SocketMessage>;

    constructor(private _appContext: AppContext) {
    }

    public init(url?: string) {
        this.connect(url);
        this.registerEventListeners();
    }

    private connect(url?: string) {
        if (this._appContext.thUtils.isUndefinedOrNull(url)) {
            url = '/';
        }
        this._socket = io.connect(url);
    }

    private registerEventListeners() {
        this._newNotificationsObservable = new Observable<SocketMessage>((observer: Observer<SocketMessage>) => {
            this._socket.on('NewNotification', (message: SocketMessage) => {
                observer.next(message);
            });
        }).share();
    }

    public getObservable(event: SocketEvent): Observable<SocketMessage> {
        switch (event) {
            case 'NewNotification':
                return this._newNotificationsObservable;

            default:
                return this._newNotificationsObservable;
        }
    }

    public release() {
        this._socket.disconnect();        
    }
}