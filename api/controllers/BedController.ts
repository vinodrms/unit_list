import {BaseController} from './base/BaseController';

class BedController extends BaseController {
    
    public getBeds(req: Express.Request, res: Express.Response) {
                
    }
    
    public saveBedItem(req: Express.Request, res: Express.Response) {
    
    }
    
    public deleteBedItem(req: Express.Request, res: Express.Response) {
                
    } 
}

var bedController = new BedController();
module.exports = {
    getBeds: bedController.getBeds.bind(bedController),
    saveBedItem: bedController.saveBedItem.bind(bedController),
    deleteBedItem: bedController.deleteBedItem.bind(bedController)
}