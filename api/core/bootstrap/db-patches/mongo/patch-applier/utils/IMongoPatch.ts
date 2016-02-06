import {MongoPatcheType} from './AMongoPatch';

export interface IMongoPatch {
	getPatchType(): MongoPatcheType;
}