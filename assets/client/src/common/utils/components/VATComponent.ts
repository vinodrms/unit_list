import { Component, OnChanges, Input, SimpleChange, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { BaseComponent } from '../../../common/base/BaseComponent';
import { AppContext, ThError, ThServerApi } from '../AppContext';
import { UploadedFileResponse } from '../http/IThHttp';
import { CountriesService } from '../../../pages/internal/services/settings/CountriesService';
import { CountriesDO } from '../../../pages/internal/services/settings/data-objects/CountriesDO';
import { CountryDO } from '../../../pages/internal/services/common/data-objects/country/CountryDO';

import * as _ from "underscore";

export interface VatDetails {
	countryCode: string;
	fullVat: string;
}
export interface VatResponse {
	countryCode: string;
	vatNumber: string;
	fullVatNumber: string;
	companyName: string;
	companyAddress: string;
}

@Component({
	selector: 'vat-input',
	template: `
		<div class="row">
			<div class="col-xs-12 col-md-6 form-group">
				<label>{{ countryLabel | translate }}<span *ngIf="isRequired">*</span></label>
				<div class="input-group" [ngClass]="{'form-warning': displayCountryError()}">
					<select class="form-control" [ngModel]="vatDetails.countryCode" (ngModelChange)="didSelectCountryCode($event)" name="vatDetailsCountryCode">
						<option value="" disabled>{{ 'Select a country' | translate }}</option>
						<option *ngFor="let country of countryList" [value]="country.code">{{country.name}}</option>
					</select>
				</div>
				<label class="form-warning"><small><i class="fa fa-info-circle"></i> {{ 'Select a country' | translate }}</small></label>
			</div>
			<div class="col-xs-12 col-md-6 form-group">
				<label>{{ 'VAT Code' | translate }}<span *ngIf="isVatRequired">*</span>
				</label>
				<div class="input-group" *ngIf="vatDetails.countryCode" [ngClass]="{'form-warning': displayVatError()}">
					<span class="input-group-addon">{{convertedCountryCode}}</span>
					<input type="text" class="form-control" [formControl]="vatCodeControl">
				</div>
				<div class="form-control operational-input-group input-group" *ngIf="!vatDetails.countryCode" [ngClass]="{'form-warning': displayVatError()}">
					<span class="name field-value"></span>
				</div>
				<label class="form-warning"><small><i class="fa fa-info-circle"></i> {{ 'Insert a VAT Number' | translate }}</small></label>
			</div>
		</div>
	`
})

export class VATComponent extends BaseComponent implements OnInit {
	vatCodeControl: FormControl;
	countryList: CountryDO[];
	@Input() isRequired: boolean = true;
	@Input() isVatRequired: boolean = true;
	@Input() didSubmitForm: boolean = false;
	@Input() countryLabel: string = "Country";

	convertedCountryCode: string = "";
	private _vatDetails: VatDetails = {
		countryCode: "",
		fullVat: ""
	};
	public get vatDetails(): VatDetails {
		return this._vatDetails;
	}
	@Input()
	public set vatDetails(vatDetails: VatDetails) {
		if (vatDetails) {
			this._vatDetails = vatDetails;
		}
		this.preprocessVatDetails();
		this.vatCodeControl = new FormControl(this.vatDetails.fullVat);
		this.initVatSearchInput();
	}
	private preprocessVatDetails() {
		if (!this.vatDetails.fullVat || this.vatDetails.fullVat.length <= 2) {
			if (this.vatDetails.countryCode && _.isString(this.vatDetails.countryCode)) {
				this.convertedCountryCode = this._appContext.countryCodeVatConvertor.convertCountryCode(this.vatDetails.countryCode);
			}
			return;
		}
		var vatPrefix = this.vatDetails.fullVat.substr(0, 2);
		if (/^.*[A-Z].*/i.test(vatPrefix)) {
			this.convertedCountryCode = vatPrefix;
			this.vatDetails.fullVat = this.vatDetails.fullVat.substr(2);
		}
		else {
			this.convertedCountryCode = "";
		}
	}

	@Output() onVatDetailsChanged = new EventEmitter();
	@Output() onVatResponseReceived = new EventEmitter();

	constructor(private _appContext: AppContext, private _countriesService: CountriesService) {
		super();
	}

	private initVatSearchInput() {
		this.vatCodeControl.valueChanges
			.debounceTime(400)
			.distinctUntilChanged()
			.switchMap((vatCode: string) => {
				this.vatDetails.fullVat = vatCode;
				this.triggerVatDetailsChanged();
				return this._appContext.thHttp.get({
					serverApi: ThServerApi.ServiceVatVerifier,
					queryParameters: {
						countryCode: this.convertedCountryCode, vatNumber: this.vatCodeControl.value
					}
				})
			})
			.subscribe((vatResponse: VatResponse) => {
				this.onVatResponseReceived.next(vatResponse);
			}, (err: ThError) => {
				this.initVatSearchInput();
			});
	}

	public ngOnInit() {
		this._countriesService.getCountriesDO().subscribe((countries: CountriesDO) => {
			this.countryList = countries.countryList;
		});
	}
	public didSelectCountryCode(countryCode: string) {
		this.vatDetails.countryCode = countryCode;
		this.convertedCountryCode = this._appContext.countryCodeVatConvertor.convertCountryCode(this.vatDetails.countryCode);

		this.triggerVatDetailsChanged();
	}
	private triggerVatDetailsChanged() {
		var fullVat = this._appContext.countryCodeVatConvertor.getFullVat(this.vatDetails.countryCode, this.vatDetails.fullVat);
		if (!this.vatDetails.fullVat) {
			fullVat = "";
		}
		this.onVatDetailsChanged.next({
			countryCode: this.vatDetails.countryCode,
			fullVat: fullVat
		});
	}

	public displayCountryError(): boolean {
		return this.didSubmitForm && !this.vatDetails.countryCode && this.isRequired;
	}
	public displayVatError(): boolean {
		return this.didSubmitForm && !this.vatDetails.fullVat && this.isRequired && this.isVatRequired;
	}
}