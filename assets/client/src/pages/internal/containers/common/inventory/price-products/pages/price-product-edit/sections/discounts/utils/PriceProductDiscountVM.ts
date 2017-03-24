import { PriceProductConstraintContainer } from "../../constraints/constraints-list/utils/PriceProductConstraintContainer";
import { CustomerDO } from "../../../../../../../../../services/customers/data-objects/CustomerDO";

export class PriceProductDiscountVM {
    private _index: number;
    private _constraintContainer: PriceProductConstraintContainer;
    private _name: string;
    private _value: number;
    private _customerIdList: string[];
    private _customerListLabel: string;

    public get index(): number {
        return this._index;
    }
    public set index(index: number) {
        this._index = index;
    }

    public get constraintContainer(): PriceProductConstraintContainer {
        return this._constraintContainer;
    }
    public set constraintContainer(constraintContainer: PriceProductConstraintContainer) {
        this._constraintContainer = constraintContainer;
    }

    public get name(): string {
        return this._name;
    }
    public set name(name: string) {
        this._name = name;
    }

    public get value(): number {
        return this._value;
    }
    public set value(value: number) {
        this._value = value;
    }
    public get customerIdList(): string[] {
        return this._customerIdList;
    }
    public set customerIdList(customerIdList: string[]) {
        if (!_.isArray(customerIdList)) {
            this._customerIdList = [];
        }
        else {
            this._customerIdList = customerIdList;
        }
    }
    public get customerListLabel(): string {
        return this._customerListLabel;
    }
    public set customerListLabel(customerListLabel: string) {
        this._customerListLabel = customerListLabel;
    }

    public isPublic(): boolean {
        return this._customerIdList.length == 0
    }

    public updateCustomersLabel(customerMap: { [index: string]: CustomerDO }) {
        var label = "";
        _.forEach(this._customerIdList, customerId => {
            let customer = customerMap[customerId];
            if (customer) {
                if (label.length > 0) { label += ", "; }
                label += customer.customerNameAndEmailString;
            }
        });
        this._customerListLabel = label;
    }
}