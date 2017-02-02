export enum ThPeriodType {
    Day,
    Week,
    Month
}

export class ThPeriodOption {
    type: ThPeriodType;
    displayName: string;

    constructor(type: ThPeriodType, displayName: string) {
        this.type = type;
        this.displayName = displayName;
    }

    public static getValues(): ThPeriodOption[] {
        return [
            new ThPeriodOption(ThPeriodType.Day, "Day"),
            new ThPeriodOption(ThPeriodType.Week, "Week"),
            new ThPeriodOption(ThPeriodType.Month, "Month")
        ]
    }
}
