import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThUtils} from '../../utils/ThUtils';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {ValidationResultParser} from '../common/ValidationResultParser';
import {SaveInvoiceGroupItemDO} from './SaveInvoiceGroupItemDO';
import {InvoiceGroupDO} from '../../data-layer/invoices/data-objects/InvoiceGroupDO';

export class SaveInvoiceGroupItem {
    private _thUtils: ThUtils;
    private _saveInvoiceGroupDO: SaveInvoiceGroupItemDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public save(saveInvoiceGroupDO: SaveInvoiceGroupItemDO): Promise<InvoiceGroupDO> {
        this._saveInvoiceGroupDO = saveInvoiceGroupDO;
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.saveCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.SaveRoomItemError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error saving invoice gorup", this._saveInvoiceGroupDO, thError);
                reject(thError);
            }
        });
    }

    private saveCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        var validationResult = SaveInvoiceGroupItemDO.getValidationStructure().validateStructure(this._saveInvoiceGroupDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._saveInvoiceGroupDO);
            parser.logAndReject("Error validating data for save invoice group", reject);
            return;
        }

        this.saveInvoiceGroupItem().then((savedInvoiceGroupItem: InvoiceGroupDO) => {
            resolve(savedInvoiceGroupItem);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.SaveInvoiceGroupItem, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error saving invoice group item", this._saveInvoiceGroupDO, thError);
            }
            reject(thError);
        });
    }

    private saveInvoiceGroupItem(): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this.saveInvoiceGroupItemCore(resolve, reject);
        });
    }
    private saveInvoiceGroupItemCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        // var actionFactory = new BedItemActionFactory(this._appContext, this._sessionContext);
        // var actionStrategy = actionFactory.getActionStrategy(this.getBedDO());
        // actionStrategy.save(resolve, reject);
    }
}