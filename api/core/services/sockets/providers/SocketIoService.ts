import {SocketSendMessageReq, ISocketsService} from '../ISocketsService';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';

export class SocketIoService implements ISocketsService {

    constructor(private _io: SocketIO.Server) {

    }

    public emitMessage(sendMessageReq: SocketSendMessageReq): Promise<boolean> {
        return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
            this.emitMessageCore(resolve, reject, sendMessageReq);
        });
    }

    private emitMessageCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }, sendMessageReq: SocketSendMessageReq) {
        try {
            this._io.to(sendMessageReq.roomId).emit(sendMessageReq.event, sendMessageReq.message);
            resolve(true);
        } catch (e) {
            resolve(false);
        }
    }

}