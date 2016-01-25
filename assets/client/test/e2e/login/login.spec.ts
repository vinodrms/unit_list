import {BrowserPageHelper} from '../helpers/browserpage.helper';

describe('Login Page', function() {
    var pageHelper = new BrowserPageHelper();
    
    beforeAll(function() {
        browser.driver.manage().window().maximize();
        browser.get('/');
    });
    beforeEach((done : any) => {
        pageHelper.checkBodyPresent(done);
    });

    it('should log in succesfully', function() {
        // TODO : log in
		expect(browser.getTitle()).toBe("UnitPal");
    });
});