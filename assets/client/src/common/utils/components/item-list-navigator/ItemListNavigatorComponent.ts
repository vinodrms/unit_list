import {Component, Input, Output, EventEmitter, OnInit, SimpleChange} from '@angular/core';
import {AppContext, ThError} from '../../AppContext';
import {Interval} from './Interval';
import {Observable} from 'rxjs/Observable';
import {ItemListNavigatorConfig} from './ItemListNavigatorConfig';

@Component({
    selector: 'item-list-navigator',
    templateUrl: '/client/src/common/utils/components/item-list-navigator/template/item-list-navigator.html'
})
export class ItemListNavigatorComponent implements OnInit {
    public interval: Interval;

    @Input() config: ItemListNavigatorConfig;

    @Input() itemsAdded: Observable<number>;
    @Input() itemRemoved: Observable<number>;
    @Input() selectItemTriggered: Observable<number>;
    @Input() reset: Observable<ItemListNavigatorConfig>;

    @Output() displayedItemsUpdated = new EventEmitter();

    private _firstSelectedItemIndex: number;

    constructor() {
    }

    ngOnInit() {
        this.init(this.config);
        
        this.reset.subscribe((newConfig: ItemListNavigatorConfig) => {            
            this.init(newConfig);
        });

        this.itemsAdded.subscribe((noOfItems: number) => {
            for(var i = 0; i < noOfItems; ++i) {
                this.interval.addValue();
            }
            this.selectItem(this.interval.maxValue);
        });

        this.itemRemoved.subscribe((itemToBeRemovedIndex: number) => {
            this.interval.removeValue(itemToBeRemovedIndex);
            if(this.firstSelectedItemIndex + this.config.numberOfSimultaneouslySelectedItems > this.interval.lastWindowElement) {
                this.selectItem(Math.max(0, this.interval.lastWindowElement - this.config.numberOfSimultaneouslySelectedItems + 1));
            }            
        });

        this.selectItemTriggered.subscribe((itemToBeSelected: number) => {
            this.selectItem(itemToBeSelected);           
        });
    }

    private init(config: ItemListNavigatorConfig) {
        this.config = config;

        this.firstSelectedItemIndex = 0;
        this.interval = new Interval(Math.min(this.config.maxNumberOfDisplayedItems, this.config.initialNumberOfItems),
            this.config.maxNumberOfDisplayedItems, 0, this.config.initialNumberOfItems - 1);
    }

    public itemSelected(index: number): boolean {
        for (var i = 0; i < this.config.numberOfSimultaneouslySelectedItems; ++i) {
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

        return this.firstSelectedItemIndex === this.numberOfItems - this.config.numberOfSimultaneouslySelectedItems;
    }
    private totalNumberOfItemsLowerOrEqThanMaxNumberOfSimulatenouslyDisplayedItems(): boolean {
        return this.numberOfItems <= this.config.numberOfSimultaneouslySelectedItems;
    }
    private get numberOfItems(): number {
        return this.interval.size;
    }
    public next() {
        this.firstSelectedItemIndex++;
        if (this.interval.lastWindowElement == this.firstSelectedItemIndex + this.config.numberOfSimultaneouslySelectedItems - 1) {
            this.interval.shiftWindowRight();
        }
    }
    public prev() {
        this.firstSelectedItemIndex--;

        if (this.interval.firstWindowElement == this.firstSelectedItemIndex && this.firstSelectedItemIndex != 0) {
            this.interval.shiftWindowLeft();
        }
    }
    private selectItem(selectedItemIndex: number) {
        if (selectedItemIndex + this.config.numberOfSimultaneouslySelectedItems > this.numberOfItems) {
            if (!this.itemSelected(selectedItemIndex)) {
                this.firstSelectedItemIndex = this.numberOfItems - this.config.numberOfSimultaneouslySelectedItems;
                this.shiftRightIfNecessary();
            }
            return;
        }

        this.firstSelectedItemIndex = selectedItemIndex;

        if (this.interval.lastWindowElement < this.firstSelectedItemIndex + this.config.numberOfSimultaneouslySelectedItems) {
            this.shiftRightIfNecessary();
        }

        if (this.interval.firstWindowElement === this.firstSelectedItemIndex) {
            this.interval.shiftWindowLeft();
        }
    }

    private shiftRightIfNecessary() {
        var numberOfRightShifts = this.config.numberOfSimultaneouslySelectedItems - (this.interval.lastWindowElement - this.firstSelectedItemIndex);
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