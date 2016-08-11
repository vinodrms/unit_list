export class Interval {
    values: number[];

    constructor(currentWindowSize: number, private _maxWindowsSize: number, private _minValue: number, private _maxValue: number) {
        this.values = [];
        for (var i = 0; i < currentWindowSize; ++i) {
            this.values.push(i);
        }
    }

    public get windowSize(): number {
        return this.values.length;
    }
    public get firstWindowElement(): number {
        return _.first(this.values);
    }
    public get lastWindowElement(): number {
        return _.last(this.values);
    }
    public get size(): number {
        return this._maxValue - this._minValue + 1;
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

    public addValue() {
        if(this.values.length < this._maxWindowsSize) {
            this.values.push(this.lastWindowElement + 1);    
        }
        this._maxValue++;
    }

    public removeValue(value: number) {
        var index = this.values.indexOf(value);
        if(index != -1) {
            if(value != this.lastWindowElement) {
                for(var i = index + 1; i < this.values.length; ++i) {
                    this.values[i]--;
                }
            }
            this.values.splice(index, 1); 
        }
        this._maxValue--;
        if(this._maxValue - this._minValue + 1 > this.windowSize && this._maxWindowsSize > this.windowSize) {
            if(this._maxValue > this.lastWindowElement) {
                this.values.push(this.lastWindowElement + 1);
            }   
            else if(this._minValue < this.firstWindowElement) {
                this.values.splice(0, 0, this.firstWindowElement - 1);
            } 
        }
    }

    public get maxValue(): number {
        return this._maxValue;
    }
}