import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {ThUtils} from '../../utils/ThUtils';
import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {SaveBedItemDO} from './SaveBedItemDO';
import {ValidationResultParser} from '../common/ValidationResultParser';
import {BedDO, BedAccommodationType} from '../../data-layer/common/data-objects/bed/BedDO';
import {BedTemplateDO} from '../../data-layer/common/data-objects/bed-template/BedTemplateDO';
import {BedItemActionFactory} from './actions/BedItemActionFactory';

export class SaveBedItem {
    private _thUtils: ThUtils;
    private _bedItemDO: SaveBedItemDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public save(bedItemDO: SaveBedItemDO): Promise<BedDO> {
        this._bedItemDO = bedItemDO;
        return new Promise<BedDO>((resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.saveCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.SaveBedItemError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error saving bed item", this._bedItemDO, thError);
                reject(thError);
            }
        });
    }
    private saveCore(resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) {
        if (!this.submittedStructureIsValid(reject)) {
            return;
        }

        var settingsRepository = this._appContext.getRepositoryFactory().getSettingsRepository();
        settingsRepository.getBedTemplates({ id: this._bedItemDO.bedTemplateId })
            .then((bedTemplatesList: BedTemplateDO[]) => {
                if (!this.bedTemplateIdIsValid(bedTemplatesList)) {
                    var thError = new ThError(ThStatusCode.SaveBedItemInvalidBedTemplateId, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid bed template id", this._bedItemDO, thError);
                    throw thError;
                }

                return this.saveBedItem();
            })
            .then((savedBedItem: BedDO) => {
                resolve(savedBedItem);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.SaveBedItemError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error saving bed item", this._bedItemDO, thError);
                }
                reject(thError);
            });

    }
    
    private bedTemplateIdIsValid(bedTemplatesList: BedTemplateDO[]) {
        var foundBedTemplate = _.find(bedTemplatesList, (bedTemplate: BedTemplateDO) => { return bedTemplate.id === this._bedItemDO.bedTemplateId });
        return !this._thUtils.isUndefinedOrNull(foundBedTemplate);
    }
    
    private submittedStructureIsValid(reject: { (err: ThError): void }): boolean {
        if (!this.sizeAndCapacityAreValid()) {
            var thError = new ThError(ThStatusCode.SaveBedItemInvalidSizeAndOrCapacity, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid size and/or capacity", this._bedItemDO, thError);
            reject(thError);
            return false;
        }

        var validationResult = SaveBedItemDO.getValidationStructure().validateStructure(this._bedItemDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._bedItemDO);
            parser.logAndReject("Error validating data for save bed item", reject);
            return false;
        }

        if (this._bedItemDO.accommodationType === BedAccommodationType.AdultsAndChildren) {
            validationResult = SaveBedItemDO.getSizeAndCapacityValidationStructure().validateStructure(this._bedItemDO);
            if (!validationResult.isValid()) {
                var parser = new ValidationResultParser(validationResult, this._bedItemDO);
                parser.logAndReject("Error validating data for save bed item", reject);
                return false;
            }
        }
        return true;
    }
    
    private sizeAndCapacityAreValid(): boolean {
        if (this._bedItemDO.accommodationType === BedAccommodationType.AdultsAndChildren) {
            return this.sizeAndCapacityExist();
        }
        else if (this._bedItemDO.accommodationType === BedAccommodationType.Babies) {
            return this.sizeAndCapacityAreNull();
        }
    }

    private sizeAndCapacityExist(): boolean {
        if (this._thUtils.isUndefinedOrNull(this._bedItemDO.size) || this._thUtils.isUndefinedOrNull(this._bedItemDO.capacity)) {
            return false;
        }
        return true;
    }
    private sizeAndCapacityAreNull(): boolean {
        if (!this._thUtils.isUndefinedOrNull(this._bedItemDO.size) || !this._thUtils.isUndefinedOrNull(this._bedItemDO.capacity)) {
            return false;
        }
        return true;
    }

    private getBedDO(): BedDO {
        var bed = new BedDO();
        bed.buildFromObject(this._bedItemDO);
        bed.hotelId = this._sessionContext.sessionDO.hotel.id;
        return bed;
    }
    private saveBedItem(): Promise<BedDO> {
        return new Promise<BedDO>((resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) => {
            this.saveBedItemCore(resolve, reject);
        });
    }
    private saveBedItemCore(resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) {
        var actionFactory = new BedItemActionFactory(this._appContext, this._sessionContext);
        var actionStrategy = actionFactory.getActionStrategy(this.getBedDO());
        actionStrategy.save(resolve, reject);
    }

}