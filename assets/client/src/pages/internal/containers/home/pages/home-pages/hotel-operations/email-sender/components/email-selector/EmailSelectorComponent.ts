import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {ThDataValidators} from '../../../../../../../../../../common/utils/form-utils/utils/ThDataValidators';
import {CustomerDO} from '../../../../../../../../services/customers/data-objects/CustomerDO';
import {EmailRecipientBuilder} from './utils/EmailRecipientBuilder';
import {EmailRecipientVM} from './utils/EmailRecipientVM';

import * as _ from "underscore";

@Component({
    selector: 'email-selector',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/email-sender/components/email-selector/template/email-selector.html'
})
export class EmailSelectorComponent implements OnInit {
    @Output() onEmailListChanged = new EventEmitter<string[]>();
    public triggerOnEmailListChanged() {
        this.onEmailListChanged.next(this.getSelectedEmailList());
    }

    private _customerList: CustomerDO[];
    public get customerList(): CustomerDO[] {
        return this._customerList;
    }
    @Input()
    public set customerList(customerList: CustomerDO[]) {
        this._customerList = customerList;
        this.loadDependentData();
    }

    private _disabled: boolean;
    public get disabled(): boolean {
        return this._disabled;
    }
    @Input()
    public set disabled(disabled: boolean) {
        this._disabled = disabled;
    }

    private emailRecipientList: EmailRecipientVM[];

    private _didInit: boolean = false;
    private _recipientId: number = 0;

    private _selectAll: boolean;
    newEmail: string = "";

    constructor(private _appContext: AppContext) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._customerList)) { return; }
        var emailRecipientBuilder = new EmailRecipientBuilder(this._customerList);
        this.emailRecipientList = emailRecipientBuilder.getEmailRecipientList([]);
        this._selectAll = false;
        this.triggerOnEmailListChanged();
    }

    public get selectAll(): boolean {
        return this._selectAll;
    }
    public set selectAll(selectAll: boolean) {
        this._selectAll = selectAll;
        if (selectAll) {
            this.selectAllValidEmailRecipients();
            return;
        }
        this.deselectAll();
    }
    private selectAllValidEmailRecipients() {
        _.forEach(this.emailRecipientList, (emailRecipient: EmailRecipientVM) => {
            if (emailRecipient.isValid) {
                emailRecipient.selected = true;
            }
        });
        this.triggerOnEmailListChanged();
    }
    private deselectAll() {
        _.forEach(this.emailRecipientList, (emailRecipient: EmailRecipientVM) => {
            emailRecipient.selected = false;
        });
        this.triggerOnEmailListChanged();
    }

    public get dirtyNewEmail(): boolean {
        return this.newEmail.length > 0;
    }
    public get validNewEmail(): boolean {
        return ThDataValidators.isValidEmail(this.newEmail);
    }
    public addNewEmail() {
        if (!this.validNewEmail) { return; };
        var emailRecipientVM = new EmailRecipientVM(this._recipientId + "", "", this.newEmail);
        emailRecipientVM.selected = true;
        this.emailRecipientList.push(emailRecipientVM);
        this._recipientId++;
        this.newEmail = "";
        this.triggerOnEmailListChanged();
    }
    public didChangeRecipient(recipient: EmailRecipientVM) {
        if (!recipient.isValid) { return; }
        recipient.selected = !recipient.selected;
        this.triggerOnEmailListChanged();
    }

    private getSelectedEmailList(): string[] {
        var emailList: string[] = [];
        _.forEach(this.emailRecipientList, (emailRecipient: EmailRecipientVM) => {
            if (emailRecipient.selected && emailRecipient.isValid) {
                emailList.push(emailRecipient.email);
            }
        });
        return _.uniq(emailList);
    }
}