import { MongoPatchType } from '../patches/MongoPatchType';

export interface IMongoPatch {
	getPatchType(): MongoPatchType;
}