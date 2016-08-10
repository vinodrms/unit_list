import {Component, Input, Output, EventEmitter, OnInit, SimpleChange} from '@angular/core';
import {AppContext, ThError} from '../../AppContext';
import {Interval} from './Interval';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'item-list-navigator',
    templateUrl: '/client/src/common/utils/components/item-list-navigator/template/item-list-navigator.html',
    directives: [],
    pipes: []
})
export class ItemListNavigatorComponent implements OnInit {
    public interval: Interval;

    @Input() maxNumberOfDisplayedItems: number;
    @Input() numberOfSimultaneouslySelectedItems: number;
    
    @Input() totalNumberOfItems: number;
    @Input() totalNumberOfinvoicesChangedObservable: Observable<number>;

    @Output() displayedItemsUpdated = new EventEmitter();

    private _firstSelectedItemIndex: number;

    constructor() {
    }

    ngOnInit() {
        this.firstSelectedItemIndex = 0;
        this.interval = new Interval(Math.min(this.maxNumberOfDisplayedItems, this.totalNumberOfItems),
            this.maxNumberOfDisplayedItems, 0, this.totalNumberOfItems - 1);

        this.totalNumberOfinvoicesChangedObservable.subscribe((totalNumberOfItems: number) => {
            if (this.totalNumberOfItems < totalNumberOfItems) {
                this.totalNumberOfItems = totalNumberOfItems;
                this.interval.addValue();
                this.selectItem(this.interval.maxValue);
            }
            else {
                // this.totalNumberOfItems = totalNumberOfItems;
                // this.interval.removeValue();
                // this.selectItem(this.interval.maxValue);
            }
        });
    }

    public itemSelected(index: number): boolean {
        for (var i = 0; i < this.numberOfSimultaneouslySelectedItems; ++i) {
            if (index === this.firstSelectedItemIndex + i) {
                return true;
            }
        }
        return false;
    }
    public get previousItemsButtonDisabled(): boolean {
        if (this.totalNumberOfItemsLowerOrEqThanMaxNumberOfSimulatenouslyDisplayedItems())
            return true;

        return this.firstSelectedItemIndex === 0;
    }
    public get nextItemsButtonDisabled(): boolean {
        if (this.totalNumberOfItemsLowerOrEqThanMaxNumberOfSimulatenouslyDisplayedItems())
            return true;

        return this.firstSelectedItemIndex === this.numberOfItems - this.numberOfSimultaneouslySelectedItems;
    }
    private totalNumberOfItemsLowerOrEqThanMaxNumberOfSimulatenouslyDisplayedItems(): boolean {
        return this.numberOfItems <= this.numberOfSimultaneouslySelectedItems;
    }
    private get numberOfItems(): number {
        return this.totalNumberOfItems;
    }
    public next() {
        this.firstSelectedItemIndex++;
        if (this.interval.lastWindowElement == this.firstSelectedItemIndex + this.numberOfSimultaneouslySelectedItems - 1) {
            this.interval.shiftWindowRight();
        }
    }
    public prev() {
        this.firstSelectedItemIndex--;

        if (this.interval.firstWindowElement == this.firstSelectedItemIndex && this.firstSelectedItemIndex != 0) {
            this.interval.shiftWindowLeft();
        }
    }
    public selectItem(selectedItemIndex: number) {
        if (selectedItemIndex + this.numberOfSimultaneouslySelectedItems > this.numberOfItems) {
            if (!this.itemSelected(selectedItemIndex)) {
                this.firstSelectedItemIndex = this.numberOfItems - this.numberOfSimultaneouslySelectedItems;
                this.shiftRightIfNecessary();
            }
            return;
        }

        this.firstSelectedItemIndex = selectedItemIndex;

        if (this.interval.lastWindowElement < this.firstSelectedItemIndex + this.numberOfSimultaneouslySelectedItems) {
            this.shiftRightIfNecessary();
        }

        if (this.interval.firstWindowElement === this.firstSelectedItemIndex) {
            this.interval.shiftWindowLeft();
        }
    }

    private shiftRightIfNecessary() {
        var numberOfRightShifts = this.numberOfSimultaneouslySelectedItems - (this.interval.lastWindowElement - this.firstSelectedItemIndex);
        for (var i = 0; i < numberOfRightShifts; ++i) {
            this.interval.shiftWindowRight();
        }
    }

    private set firstSelectedItemIndex(newSelectedItemIndex: number) {
        this._firstSelectedItemIndex = newSelectedItemIndex;
        this.displayedItemsUpdated.emit(this._firstSelectedItemIndex);
    }
    private get firstSelectedItemIndex(): number {
        return this._firstSelectedItemIndex;
    }
}