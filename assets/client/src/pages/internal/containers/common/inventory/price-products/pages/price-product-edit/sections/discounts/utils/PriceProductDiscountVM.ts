import { PriceProductConstraintContainer } from "../../constraints/constraints-list/utils/PriceProductConstraintContainer";

export class PriceProductDiscountVM {
    private _index: number;
    private _constraintContainer: PriceProductConstraintContainer;
    private _name: string;
    private _value: number;

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
}