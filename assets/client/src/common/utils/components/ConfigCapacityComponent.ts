import { Component, Input } from '@angular/core';
import { ConfigCapacityDO } from '../../../pages/internal/services/common/data-objects/bed-config/ConfigCapacityDO';

@Component({
    selector: 'config-capacity',
    template: `
    <span *ngIf="configCapacity">
        <span *ngIf="configCapacity.noAdults > 0">{{configCapacity.noAdults}} <span class="unitpal-font">:</span></span>
		<span *ngIf="configCapacity.noChildren > 0">{{configCapacity.noChildren}} <span class="unitpal-font">;</span></span>
        <span *ngIf="configCapacity.noBabies > 0">{{configCapacity.noBabies}} <span class="unitpal-font">B</span></span>
        <span *ngIf="configCapacity.noBabyBeds > 0">{{configCapacity.noBabyBeds}} <span class="unitpal-font">6</span></span>
    </span>
    `
})
export class ConfigCapacityComponent {
    @Input() configCapacity: ConfigCapacityDO;
    constructor() { }
}