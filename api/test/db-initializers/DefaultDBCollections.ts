export class DefaultDBCollections {    
	constructor() {}
	public loadCollections() : Promise<Object> {
		return new Promise<Object>((resolve, reject) => {
			resolve(true);
		});
	}
}