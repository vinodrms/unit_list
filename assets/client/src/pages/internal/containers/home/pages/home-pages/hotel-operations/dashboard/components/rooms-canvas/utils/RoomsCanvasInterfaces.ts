import {RoomItemInfoVM_UI_Properties} from '../../../../../../../../../services/hotel-operations/dashboard/rooms/view-models/RoomItemInfoVM';

export enum FilterValueType{
	All,
	Free,
	Occupied,
	Reserved,
	OutOfService
}

export interface IDragStyles {
	canCheckIn: RoomItemInfoVM_UI_Properties,
	canUpgrade: RoomItemInfoVM_UI_Properties,
	canNotCheckIn: RoomItemInfoVM_UI_Properties,
	default: RoomItemInfoVM_UI_Properties
}

export interface IFilterNotificationProperties{
	cssColor: string;
	textFirstPart: string;
	textSecondPart: string;
}

export interface IFilterNotification{
	Properties :IFilterNotificationProperties
}

export interface IFilterValue{
	currentValue: FilterValueType;
	newValue: FilterValueType;
}