export enum TableRowCommand {
	Copy,
	Edit,
	Delete,
	Select,
	Add,
	Search
}

export enum TableViewOption {
	Expanded,
	Collapsed
}

export enum TablePropertyType {
	StringType,
	NumberType,
	PercentageType,
	PriceType,
    CapacityType,
	NotesType,
    FontIconType
}

export interface TableColumnValueMeta {
	objectPropertyId: string;
	propertyType: TablePropertyType;
	dependentObjectPropertyId?: string;
    fonts?: Object;
    showInCollapsedView: boolean;
}

export interface TableColumnMeta {
	displayName: string;
	valueMeta: TableColumnValueMeta;
}

export interface LazyLoadTableMeta {
	columnMetaList: TableColumnMeta[];
	rowIdPropertySelector: string,
	supportedRowCommandList: TableRowCommand[];
	addButtonText?: string;
	searchInputPlaceholder?: string;
	autoSelectRows: boolean;
}