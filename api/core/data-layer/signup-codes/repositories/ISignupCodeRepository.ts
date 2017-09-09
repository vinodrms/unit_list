import {RoomCategoryDO} from '../../room-categories/data-objects/RoomCategoryDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../common/repo-data-objects/LazyLoadRepoDO';

export interface ISignupCodeRepository {
    getSignupCode(code: string);
    addSignupCode(code: string);
    deleteSignupCode(code: string);
}