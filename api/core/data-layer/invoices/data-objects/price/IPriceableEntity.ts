export interface IPriceableEntity {
    getPrice(): Promise<number>;
}