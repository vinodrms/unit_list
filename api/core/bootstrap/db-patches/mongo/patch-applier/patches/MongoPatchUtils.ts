import { ATransactionalMongoPatch } from '../utils/ATransactionalMongoPatch';
import { MongoPatch0 } from './patch0/MongoPatch0';
import { MongoPatch1 } from './patch1/MongoPatch1';
import { MongoPatch2 } from './patch2/MongoPatch2';
import { MongoPatch3 } from './patch3/MongoPatch3';
import { MongoPatch4 } from './patch4/MongoPatch4';
import { MongoPatch5 } from './patch5/MongoPatch5';

export class MongoPatchUtils {
	public static get PatchList(): ATransactionalMongoPatch[] {
		return [
			new MongoPatch0(),
			new MongoPatch1(),
			new MongoPatch2(),
			new MongoPatch3(),
			new MongoPatch4(),
			new MongoPatch5(),

		];
	}
}