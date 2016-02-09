import {IImageStorage} from '../IImageStorage';

var cloudinary = require('cloudinary');

export class CloudinaryImageStorage implements IImageStorage{
    public upload(fileName: string): string {
        return '';
    }
}