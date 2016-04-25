import {LazyLoadTableMeta, TableRowCommand} from './LazyLoadTableMeta';

export class TableOptions {
	canSelect: boolean = false;
	canMultiSelect: boolean = false;
	canCopy: boolean = false;
	canEdit: boolean = false;
	canDelete: boolean = false;
	canAdd: boolean = false;
	canSearch: boolean = false;

	constructor() {
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
	}
}