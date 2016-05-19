require("sails-test-helper");
import should = require('should');

import {NotificationDO} from '../../../../core/data-layer/common/data-objects/notifications/NotificationDO';
import {INotificationService} from '../../../../core/services/notifications/INotificationService';
import {TestContext} from '../../../helpers/TestContext';
import {TestUtils} from '../../../helpers/TestUtils';
import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode, ThResponse} from '../../../../core/utils/th-responses/ThResponse';

describe("Notifications Integration Tests", function() {
    const BASE_TIMESTAMP = 1463665330;
    
    var HOTEL_Z_NOTIFICATION: NotificationDO;
    var HOTEL_A_EXPIRED_ENTRIES: NotificationDO;
    var HOTEL_A_UPDATED_PRODUCT: NotificationDO;
    var HOTEL_A_PLEASE_PAY: NotificationDO;
    var HOTEL_B_NEW_MESSAGES: NotificationDO;
    var HOTEL_C_EXPIRED_ENTRIES: NotificationDO;

	var notificationService: INotificationService;
    var addAndCheckNotification;
    var getAndCheckUndeliveredNotifications;

    before(function(done: any) {
        HOTEL_A_EXPIRED_ENTRIES = new NotificationDO();
        HOTEL_A_EXPIRED_ENTRIES.hotelId = 'HotelA';
        HOTEL_A_EXPIRED_ENTRIES.userId = 'johndoe';
        HOTEL_A_EXPIRED_ENTRIES.code = 'You have %num_entries% expired entries';
        HOTEL_A_EXPIRED_ENTRIES.parameterMap = { num_entries: 3 };
        HOTEL_A_EXPIRED_ENTRIES.timestamp = BASE_TIMESTAMP + 1;

        HOTEL_A_UPDATED_PRODUCT = new NotificationDO();
        HOTEL_A_UPDATED_PRODUCT.hotelId = 'HotelA';
        HOTEL_A_UPDATED_PRODUCT.userId = 'johndoe';
        HOTEL_A_UPDATED_PRODUCT.code = 'Your price product has been updated';
        HOTEL_A_UPDATED_PRODUCT.timestamp = BASE_TIMESTAMP + 2;

        HOTEL_A_PLEASE_PAY = new NotificationDO();
        HOTEL_A_PLEASE_PAY.hotelId = 'HotelA';
        HOTEL_A_PLEASE_PAY.userId = 'johndoe';
        HOTEL_A_PLEASE_PAY.code = 'Please pay';
        HOTEL_A_PLEASE_PAY.timestamp = BASE_TIMESTAMP + 3;

        HOTEL_B_NEW_MESSAGES = new NotificationDO();
        HOTEL_B_NEW_MESSAGES.hotelId = 'HotelB';
        HOTEL_B_NEW_MESSAGES.userId = 'johnniebravo';
        HOTEL_B_NEW_MESSAGES.code = 'You have %num_msg% new messages';
        HOTEL_B_NEW_MESSAGES.parameterMap = {num_msg: 10};
        HOTEL_B_NEW_MESSAGES.timestamp = BASE_TIMESTAMP + 4;

        HOTEL_C_EXPIRED_ENTRIES = new NotificationDO();
        HOTEL_C_EXPIRED_ENTRIES.hotelId = 'HotelC';
        HOTEL_C_EXPIRED_ENTRIES.userId = 'bigboss';
        HOTEL_C_EXPIRED_ENTRIES.code = 'You have between %from% and %to% expired entries';
        HOTEL_C_EXPIRED_ENTRIES.parameterMap = { from: 5, to: 10 };
        HOTEL_C_EXPIRED_ENTRIES.timestamp = BASE_TIMESTAMP + 5;

        HOTEL_Z_NOTIFICATION = new NotificationDO();
        HOTEL_Z_NOTIFICATION.hotelId = 'HotelZ';
        HOTEL_Z_NOTIFICATION.userId = 'myuser';
        HOTEL_Z_NOTIFICATION.code = 'My dummy notification';
        HOTEL_Z_NOTIFICATION.timestamp = BASE_TIMESTAMP + 6;

        notificationService = new TestContext().appContext.getServiceFactory().getNotificationService();

        addAndCheckNotification = 
            TestUtils.lazyFunction(addAndCheckNotificationImpl);
        getAndCheckUndeliveredNotifications = 
            TestUtils.lazyFunction(getAndCheckUndeliveredNotificationsImpl);
        
		done();
    });
    
    it("Should return persisted notification", function(done) {
        TestUtils.runSequentially(
            addAndCheckNotification(HOTEL_Z_NOTIFICATION),
            addAndCheckNotification(HOTEL_Z_NOTIFICATION),
            done);
    });
    
    it("Should return undelivered notification", function(done) {
        TestUtils.runSequentially(
            addAndCheckNotification(HOTEL_C_EXPIRED_ENTRIES),
            getAndCheckUndeliveredNotifications('HotelC', [HOTEL_C_EXPIRED_ENTRIES]),
            done);
    });

    it("Should return only undelivered notifications", function(done) { 
        TestUtils.runSequentially(
           getAndCheckUndeliveredNotifications('HotelB', []),
           addAndCheckNotification(HOTEL_A_EXPIRED_ENTRIES),
           addAndCheckNotification(HOTEL_B_NEW_MESSAGES),
           addAndCheckNotification(HOTEL_A_UPDATED_PRODUCT),
           getAndCheckUndeliveredNotifications('HotelA', [HOTEL_A_UPDATED_PRODUCT, HOTEL_A_EXPIRED_ENTRIES]),
           getAndCheckUndeliveredNotifications('HotelB', [HOTEL_B_NEW_MESSAGES]),
           getAndCheckUndeliveredNotifications('HotelA', []),
           getAndCheckUndeliveredNotifications('HotelB', []),
           getAndCheckUndeliveredNotifications('HotelA', []),
           addAndCheckNotification(HOTEL_A_PLEASE_PAY),
           getAndCheckUndeliveredNotifications('HotelA', [HOTEL_A_PLEASE_PAY]),
           done);
    });

    function addAndCheckNotificationImpl(notification: NotificationDO) {
        return notificationService.addNotification(notification).then((resultedNotification: NotificationDO) => {
            expectEqual(resultedNotification, notification, "added notification");
        });
    }
 
    function getAndCheckUndeliveredNotificationsImpl(hotelId: string, expectedList: NotificationDO[]) {
        return notificationService.getUndeliveredNotifications(hotelId).then((resultedNotificationList: NotificationDO[]) => {
            should.equal(resultedNotificationList.length, expectedList.length, "number of undelivered");
            for (var i: number = 0; i < expectedList.length; i++) {
                expectEqual(resultedNotificationList[i], expectedList[i], "undelivered notification");
            }
        });
    }
});

function expectEqual(actual: NotificationDO, expected: NotificationDO, message: string) {
    should.deepEqual(actual.hotelId, expected.hotelId, message + "#hotelId");
    should.deepEqual(actual.userId, expected.userId, message + "#userId");
    should.deepEqual(actual.code, expected.code, message + "#code");
    should.deepEqual(actual.parameterMap, expected.parameterMap, message + "#parameterMap");
}    
