import { Component, Input } from '@angular/core';

@Component({
    selector: 'progress-bar',
    template: `
        <div *ngIf="progressPercentage < 100" style="font-size: 14px">
            {{ progressStatusText | translate }}
        </div>
        <div *ngIf="progressPercentage >= 100" style="font-size: 14px">
            {{ progressFinishedText | translate }}
        </div> 
        <div class="progress">
            <div class="progress-bar progress-bar-success" role="progressbar" [attr.aria-valuenow]="progressPercentage" aria-valuemin="0" aria-valuemax="100" [style.width]="progressPercentage + '%'">
                <span class="sr-only">{{ progressPercentage }}% Complete</span>
            </div>
        </div>
    `
})

export class ProgressBarComponent {

    private _progressPercentage: number;

    @Input()
    public set progressPercentage(percentage: number) {
        if (percentage > 100) {
            this._progressPercentage = 100;
            return;
        }
        if (percentage < 0) {
            this._progressPercentage = 0;
            return;
        }
        this._progressPercentage = Math.round(percentage);
    }

    @Input() progressStatusText: string = "";
    @Input() progressFinishedText: string = "";

    public get progressPercentage(): number {
        return this._progressPercentage;
    }

    constructor() {
        this.progressPercentage = 0;
    }
}