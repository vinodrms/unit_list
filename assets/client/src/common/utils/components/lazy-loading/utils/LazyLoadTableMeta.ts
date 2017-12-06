export enum TableRowCommand {
	Copy,
	Edit,
	Delete,
	Select,
	Add,
	Search,
	MultipleSelect,
	AddExistingRow,
	ShowDetails
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
    FontIconType,
	DateIntervalType,
	FontIconWithTextType,
	TimestampType,
	TextInputType,
	CheckboxInputType
}

export interface TableColumnValueMeta {
	objectPropertyId: string;
	propertyType: TablePropertyType;
	dependentObjectPropertyId?: string;
    fonts?: Object;
	normalStyle?: string,
	collapsedStyle?: string,
    showInCollapsedView: boolean;
	isSortable?: boolean;
}

export class TableColumnMeta {
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
	noResultsPlaceholder?: string;
}