import {BaseController} from './base/BaseController';

class BedConfigurationsController extends BaseController {
    
    public addBedConfiguration(req: Express.Request, res: Express.Response) {
    
    }    
    
    public getBedConfiguration(req: Express.Request, res: Express.Response) {
                
    }       
}

var bedConfigurationsController = new BedConfigurationsController();
module.exports = {
    addBedConfiguration: bedConfigurationsController.addBedConfiguration.bind(bedConfigurationsController),
    getBedConfigurationByHotelId: bedConfigurationsController.getBedConfiguration.bind(bedConfigurationsController)
}