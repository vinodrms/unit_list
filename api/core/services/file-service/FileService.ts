import { IFileService } from './IFileService';
import { ThUtils } from '../../utils/ThUtils';
import { ThError } from '../../utils/th-responses/ThError';
import { ThStatusCode } from '../../utils/th-responses/ThResponse';

import { ThLogger, ThLogLevel } from '../../utils/logging/ThLogger';

import path = require('path');
import fs = require('fs');
var mkdirp = require('mkdirp');

export class FileService implements IFileService {
	private _utils: ThUtils;

	constructor() {
		this._utils = new ThUtils();
	}

	/**
	 * Create a new file
	 * @filePath - DirectoryPath
	 * @filename - Optional, should not contain extension, if filena is not provided unique name is generated
	 * @extension - file extension
	 * @data - Data to write in the file
	 */
	public createFile(filePath: string, filename: string, extension: string, data: string) {
		return new Promise<string>((resolve: { (result: string): void }, reject: { (err: ThError): void }) => {
			filename = (filename) ? filename : this._utils.generateShortId();
			let fullPath = filePath + path.sep + filename + '.' + extension;
			this.createPathIfNecessary(fullPath).then(() => {
				fs.writeFile(fullPath, data, (err) => {
					if (err) {
						var thError = new ThError(ThStatusCode.FileServiceErrorWritingFile, err);
						reject(thError);
					}
					resolve(fullPath);
				});
			}, reject)
		});
	}

	/**
	 * Create all necesary directories if path to location does not exits
	 * @fullPath: Path to file
	 */
	public createPathIfNecessary(fullPath):Promise<any> {
		return new Promise<void>((resolve: { (): void }, reject: { (err: ThError): void }) => {
			var filePath = path.parse(fullPath).dir;

			fs.exists(filePath, (exists) => {
				if (!exists) {
					mkdirp(filePath, (err) => {
						if (err) {
							var thError = new ThError(ThStatusCode.FileServiceErrorWritingFile, err);
							ThLogger.getInstance().logError(ThLogLevel.Error, "error creating output folder", { htmlOutputDir: filePath }, thError);
							reject(thError);
							return;
						}
						resolve();
					});
					return;
				}
				resolve();
			});
		});
	}

	/**
	 * Delete the file
	 * @fullPath: Full path to file
	 */
	deleteFile(fullPath) {
		fs.unlink(fullPath, (err) => { });
	}
}