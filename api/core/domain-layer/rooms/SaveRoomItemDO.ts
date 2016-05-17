import {IValidationStructure} from '../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../utils/th-validation/structure/PrimitiveValidationStructure';
import {ArrayValidationStructure} from '../../utils/th-validation/structure/ArrayValidationStructure';
import {StringValidationRule} from '../../utils/th-validation/rules/StringValidationRule';
import {NumberValidationRule} from '../../utils/th-validation/rules/NumberValidationRule';
import {RoomMaintenanceStatus} from '../../data-layer/rooms/data-objects/RoomDO';

export class SaveRoomItemDO {
    
    name: string;
    floor: number;
    categoryId: string;
    amenityIdList: string[];
    attributeIdList: string[];
    fileUrlList: string[];
    description: string;
    notes: string;
    maintenanceStatus: RoomMaintenanceStatus;
    
    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "id",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "hotelId",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "name",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule(100))
            },
            {
                key: "floor",
                validationStruct: new PrimitiveValidationStructure(new NumberValidationRule())
            },
            {
                key: "categoryId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "amenityIdList",
                validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new StringValidationRule()))
            },
            {
                key: "attributeIdList",
                validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new StringValidationRule()))
            },
            {
                key: "fileUrlList",
                validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new StringValidationRule(StringValidationRule.MaxUrlLength)))
            },
            {
                key: "description",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "notes",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "maintenanceStatus",
                validationStruct: new PrimitiveValidationStructure(new NumberValidationRule())
            }
        ])
    }
}