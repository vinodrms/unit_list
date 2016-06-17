export interface IBusinessValidationRuleFilter<T> {
    filterSync(businessObjectList: T[]): T[];
}