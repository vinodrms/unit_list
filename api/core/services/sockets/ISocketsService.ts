export type SocketEvent =
    "NewNotification"

export interface SocketMessage {
    content: string
}

export interface SocketSendMessageReq {
    roomId: string,
    event: SocketEvent,
    message: SocketMessage,
}

export interface ISocketsService {   
    emitMessage(sendMessageReq: SocketSendMessageReq): Promise<boolean>;           
}