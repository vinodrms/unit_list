export interface IFileService {
	createFile(path, filename, extension, data):Promise<String>;
	createPathIfNecessary(fullPath:string):Promise<void>;
	deleteFile(fullPath);
}