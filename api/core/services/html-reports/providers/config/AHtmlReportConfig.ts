import {IHtmlReportConfig, HtmlReportConfigDO} from './IHtmlReportConfig';
import {UnitPalConfig} from '../../../../utils/environment/UnitPalConfig';

import querystring = require('querystring');
import URL = require('url');

export abstract class AHtmlReportConfig implements IHtmlReportConfig {
    
    protected _reportConfig: HtmlReportConfigDO;
    
    constructor(protected _unitPalConfig: UnitPalConfig) {
            
    }
    
    /**
	 * Returns the formatted URL for the HTML page corresponding to this report;
     * e.g.: http://host:port/path?param1=value1&param2=value2
	 */
    public getHtmlReportPageURL(queryParams: Object): string {
        return this._unitPalConfig.getAppContextRoot() + '/' + this._reportConfig.htmlTemplateURLPath + '?' + querystring.stringify(queryParams);     
    }
    
    /**
	 * Returns the absolute path for the report file that will be written on the disk
	 */
    public getOutputPath(queryParams: Object): string {
        return this._reportConfig.reportOutputPath + '/' + this.getFileName(queryParams);
    }
    
    /**
	 * Returns the name for the report file that will be written on the disk
	 */
    protected abstract getFileName(queryParams: Object): string;        
}