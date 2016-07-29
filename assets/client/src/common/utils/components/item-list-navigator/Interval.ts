export class Interval {
    values: number[];

    constructor(windowSize: number, private _minValue: number, private _maxValue: number) {
        this.values = [];
        for (var i = 0; i < windowSize; ++i) {
            this.values.push(i);
        }
    }

    public get firstWindowElement(): number {
        return _.first(this.values);
    }
    public get lastWindowElement(): number {
        return _.last(this.values);
    }

    public shiftWindowLeft() {
        if(this.firstWindowElement === this._minValue) {
            return;
        }
        this.values.splice(this.values.length - 1, 1);
        this.values.splice(0, 0, this.firstWindowElement - 1);     
    }
    public shiftWindowRight() {
        if(this.lastWindowElement === this._maxValue) {
            return;
        }
        this.values.splice(0, 1);
        this.values.splice(this.values.length, 0, this.lastWindowElement + 1);
    }
}