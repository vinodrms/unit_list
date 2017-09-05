export enum TokenType {
    Bearer
}

let TokenTypeName: { [index: number]: string; } = {};
TokenTypeName[TokenType.Bearer] = "Bearer";

export { TokenTypeName };