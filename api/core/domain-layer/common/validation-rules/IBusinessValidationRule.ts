export interface IBusinessValidationRule<T> {
    isValidOn(businessObject: T): Promise<T>;
}