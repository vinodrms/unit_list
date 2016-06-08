import {OpaqueToken} from '@angular/core';
import {SocketEvent} from './utils/SocketEvent';
import {SocketMessage} from './utils/SocketMessage';
import {Observable} from 'rxjs/Observable';

export interface ISocketsService {
    init(url?: string);
    getObservable(event: SocketEvent): Observable<SocketMessage>;
    release();     
}

export const ISocketsService = new OpaqueToken("ISocketsService");