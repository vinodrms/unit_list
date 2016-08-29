import {IAssignRoomStrategy} from '../strategies/IAssignRoomStrategy';
import {AssignRoomParam} from './AssignRoomParam';

export class AssignRoomModalInput {
    private _assignRoomStrategy: IAssignRoomStrategy;
    private _assignRoomParam: AssignRoomParam;

    constructor(assignRoomStrategy: IAssignRoomStrategy, assignRoomParam: AssignRoomParam) {
        this._assignRoomStrategy = assignRoomStrategy;
        this._assignRoomParam = assignRoomParam;
    }

    public get assignRoomStrategy(): IAssignRoomStrategy {
        return this._assignRoomStrategy;
    }
    public set assignRoomStrategy(assignRoomStrategy: IAssignRoomStrategy) {
        this._assignRoomStrategy = assignRoomStrategy;
    }
    public get assignRoomParam(): AssignRoomParam {
        return this._assignRoomParam;
    }
    public set assignRoomParam(assignRoomParam: AssignRoomParam) {
        this._assignRoomParam = assignRoomParam;
    }

    public didSelectRoom(): boolean {
        return _.isString(this._assignRoomParam.roomId);
    }
    public selectRoom(roomId: string) {
        this._assignRoomParam.roomId = roomId;
    }
}