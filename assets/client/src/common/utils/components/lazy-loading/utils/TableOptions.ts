import { LazyLoadTableMeta, TableRowCommand } from './LazyLoadTableMeta';

import * as _ from "underscore";

export class TableOptions {
	public static CollapsedClass = 'up-col-30p';
	public static NotCollapsedClassSingleAction = 'up-col-5p';
	public static NotCollapsedClassMultipleActions = 'up-col-10p';

	canSelect: boolean = false;
	canMultiSelect: boolean = false;
	canCopy: boolean = false;
	canEdit: boolean = false;
	canDelete: boolean = false;
	canAdd: boolean = false;
	canSearch: boolean = false;
	canAddExistingRow: boolean = false;
	canShowDetails: boolean = false;

	private _rowActionsNumber: number;

	constructor() {
		this._rowActionsNumber = 0;
	}

	public updatePageOptions(tableMeta: LazyLoadTableMeta) {
		this.canSelect = _.contains(tableMeta.supportedRowCommandList, TableRowCommand.Select);
		this.canMultiSelect = _.contains(tableMeta.supportedRowCommandList, TableRowCommand.MultipleSelect);
		this.canEdit = _.contains(tableMeta.supportedRowCommandList, TableRowCommand.Edit);
		this.canCopy = _.contains(tableMeta.supportedRowCommandList, TableRowCommand.Copy);
		this.canDelete = _.contains(tableMeta.supportedRowCommandList, TableRowCommand.Delete);
		this.canAdd = _.contains(tableMeta.supportedRowCommandList, TableRowCommand.Add);
		if (this.canAdd && !tableMeta.addButtonText) {
			tableMeta.addButtonText = "Add";
		}
		this.canSearch = _.contains(tableMeta.supportedRowCommandList, TableRowCommand.Search);
		if (this.canSearch && !tableMeta.searchInputPlaceholder) {
			tableMeta.searchInputPlaceholder = "Search";
		}
		this.canAddExistingRow = _.contains(tableMeta.supportedRowCommandList, TableRowCommand.AddExistingRow);
		this.canShowDetails = _.contains(tableMeta.supportedRowCommandList, TableRowCommand.ShowDetails);
		this._rowActionsNumber = this.getCountOfRowCommands(tableMeta, [TableRowCommand.Copy, TableRowCommand.Edit, TableRowCommand.Delete, TableRowCommand.AddExistingRow]);
	}
	private getCountOfRowCommands(tableMeta: LazyLoadTableMeta, rowCommandList: TableRowCommand[]): number {
		if (!_.isArray(rowCommandList)) { return 0; }
		var rowCommandCount = 0;
		_.forEach(rowCommandList, (rowCommand: TableRowCommand) => {
			if (_.contains(tableMeta.supportedRowCommandList, rowCommand)) {
				rowCommandCount++;
			}
		});
		return rowCommandCount;
	}

	public showRowActionsCell(): boolean {
		return this._rowActionsNumber > 0;
	}

	public getRowActionsCellClass(isCollapsed: boolean): string {
		if (isCollapsed) {
			return TableOptions.CollapsedClass;
		}
		if (this._rowActionsNumber <= 1) {
			return TableOptions.NotCollapsedClassSingleAction;
		}
		return TableOptions.NotCollapsedClassMultipleActions;
	}
}