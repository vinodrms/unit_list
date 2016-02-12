import {MongoPatcheType} from './ATransactionalMongoPatch';

export interface IMongoPatch {
	getPatchType(): MongoPatcheType;
}