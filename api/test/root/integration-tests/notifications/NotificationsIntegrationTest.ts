require("sails-test-helper");
import should = require('should');

import {LazyLoadMetaResponseRepoDO} from '../../../../core/data-layer/common/repo-data-objects/LazyLoadRepoDO';
import {NotificationDO} from '../../../../core/data-layer/common/data-objects/notifications/NotificationDO';
import {ThNotificationCode} from '../../../../core/data-layer/common/data-objects/notifications/ThNotificationCode';
import {NotificationRepoDO, INotificationsRepository} from '../../../../core/data-layer/notifications/repositories/INotificationsRepository';
import {TestContext} from '../../../helpers/TestContext';
import {TestUtils} from '../../../helpers/TestUtils';
import {ThError} from '../../../../core/utils/th-responses/ThError';
import {ThStatusCode, ThResponse} from '../../../../core/utils/th-responses/ThResponse';

describe("Notifications Integration Tests", function() {
    const BASE_TIMESTAMP = 1463665330;
    
    var HOTEL_A_EXPIRED_ENTRIES: NotificationDO;
    var HOTEL_A_UPDATED_PRODUCT: NotificationDO;
    var HOTEL_A_PLEASE_PAY: NotificationDO;
    var HOTEL_B_NEW_MESSAGES: NotificationDO;
    var HOTEL_C_EXPIRED_ENTRIES: NotificationDO;
    var HOTEL_M_EXPIRED_ENTRIES: NotificationDO;
    var HOTEL_N_EXPIRED_ENTRIES: NotificationDO;
    var HOTEL_Z_NOTIFICATION: NotificationDO;

	var notificationsRepository: INotificationsRepository;
    var addAndCheckNotification;
    var getAndCheckUndeliveredNotifications;
    var getAndCheckNotificationList;
    var getAndCheckNotificationListCount;

    before(function(done: any) {
        HOTEL_A_EXPIRED_ENTRIES = new NotificationDO();
        HOTEL_A_EXPIRED_ENTRIES.hotelId = 'HotelA';
        HOTEL_A_EXPIRED_ENTRIES.userId = 'johndoe';
        HOTEL_A_EXPIRED_ENTRIES.code = ThNotificationCode.AllotmentArchivedAutomatically;
        HOTEL_A_EXPIRED_ENTRIES.parameterMap = { period: '01/01/2016 - 01/08/2016' };
        HOTEL_A_EXPIRED_ENTRIES.timestamp = BASE_TIMESTAMP + 1;

        HOTEL_A_UPDATED_PRODUCT = new NotificationDO();
        HOTEL_A_UPDATED_PRODUCT.hotelId = 'HotelA';
        HOTEL_A_UPDATED_PRODUCT.userId = 'johndoe';
        HOTEL_A_UPDATED_PRODUCT.code = ThNotificationCode.AllotmentArchivedAutomatically;
        HOTEL_A_UPDATED_PRODUCT.timestamp = BASE_TIMESTAMP + 2;

        HOTEL_A_PLEASE_PAY = new NotificationDO();
        HOTEL_A_PLEASE_PAY.hotelId = 'HotelA';
        HOTEL_A_PLEASE_PAY.userId = 'johndoe';
        HOTEL_A_PLEASE_PAY.code = ThNotificationCode.AllotmentArchivedAutomatically;
        HOTEL_A_PLEASE_PAY.timestamp = BASE_TIMESTAMP + 3;

        HOTEL_B_NEW_MESSAGES = new NotificationDO();
        HOTEL_B_NEW_MESSAGES.hotelId = 'HotelB';
        HOTEL_B_NEW_MESSAGES.userId = 'johnniebravo';
        HOTEL_B_NEW_MESSAGES.code = ThNotificationCode.AllotmentArchivedAutomatically;
        HOTEL_B_NEW_MESSAGES.parameterMap = { period: '01/01/2016 - 01/08/2016' };
        HOTEL_B_NEW_MESSAGES.timestamp = BASE_TIMESTAMP + 4;

        HOTEL_C_EXPIRED_ENTRIES = new NotificationDO();
        HOTEL_C_EXPIRED_ENTRIES.hotelId = 'HotelC';
        HOTEL_C_EXPIRED_ENTRIES.userId = 'bigboss';
        HOTEL_C_EXPIRED_ENTRIES.code = ThNotificationCode.AllotmentArchivedAutomatically;
        HOTEL_C_EXPIRED_ENTRIES.parameterMap = { period: '01/01/2016 - 01/08/2016' };
        HOTEL_C_EXPIRED_ENTRIES.timestamp = BASE_TIMESTAMP + 5;

        HOTEL_M_EXPIRED_ENTRIES = new NotificationDO();
        HOTEL_M_EXPIRED_ENTRIES.hotelId = 'HotelM';
        HOTEL_M_EXPIRED_ENTRIES.userId = 'captain america';
        HOTEL_M_EXPIRED_ENTRIES.code = ThNotificationCode.AllotmentArchivedAutomatically;
        HOTEL_M_EXPIRED_ENTRIES.parameterMap = { period: '01/01/2016 - 01/08/2016' };
        HOTEL_M_EXPIRED_ENTRIES.timestamp = BASE_TIMESTAMP + 6;

        HOTEL_N_EXPIRED_ENTRIES = new NotificationDO();
        HOTEL_N_EXPIRED_ENTRIES.hotelId = 'HotelN';
        HOTEL_N_EXPIRED_ENTRIES.userId = 'hugo boss';
        HOTEL_N_EXPIRED_ENTRIES.code = ThNotificationCode.AllotmentArchivedAutomatically;
        HOTEL_N_EXPIRED_ENTRIES.parameterMap = { period: '01/01/2016 - 01/08/2016' };
        HOTEL_N_EXPIRED_ENTRIES.timestamp = BASE_TIMESTAMP + 7;

        HOTEL_Z_NOTIFICATION = new NotificationDO();
        HOTEL_Z_NOTIFICATION.hotelId = 'HotelZ';
        HOTEL_Z_NOTIFICATION.userId = 'myuser';
        HOTEL_Z_NOTIFICATION.code = ThNotificationCode.AllotmentArchivedAutomatically;
        HOTEL_Z_NOTIFICATION.timestamp = BASE_TIMESTAMP + 6;

        notificationsRepository = new TestContext().appContext.getRepositoryFactory().getNotificationsRepository();

        addAndCheckNotification = 
            TestUtils.lazyFunction(addAndCheckNotificationImpl);
        getAndCheckUndeliveredNotifications = 
            TestUtils.lazyFunction(getAndCheckUndeliveredNotificationsImpl);
        getAndCheckNotificationList =
            TestUtils.lazyFunction(getAndCheckNotificationListImpl);
        getAndCheckNotificationListCount =
            TestUtils.lazyFunction(getAndCheckNotificationListCountImpl);
        
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

    it("Should return notifications matching search criteria", function(done) {
        TestUtils.runSequentially(
           getAndCheckNotificationList('HotelM', {}, []),
           getAndCheckNotificationListCount('HotelM', {}, 0),
           addAndCheckNotification(HOTEL_M_EXPIRED_ENTRIES),
           addAndCheckNotification(HOTEL_N_EXPIRED_ENTRIES),
           getAndCheckNotificationList('HotelM', {}, [HOTEL_M_EXPIRED_ENTRIES]),
           getAndCheckNotificationList('HotelN', {}, [HOTEL_N_EXPIRED_ENTRIES]),
           getAndCheckNotificationListCount('HotelN', {}, 1),
           done);
    });

    function addAndCheckNotificationImpl(notification: NotificationDO) {
        return notificationsRepository.addNotification(notification).then((resultedNotification: NotificationDO) => {
            expectEqual(resultedNotification, notification, "added notification");
        });
    }
 
    function getAndCheckUndeliveredNotificationsImpl(hotelId: string, expectedList: NotificationDO[]) {
        var meta: NotificationRepoDO.Meta = { hotelId: hotelId };
        return notificationsRepository.getUndeliveredNotifications(meta).then((resultedNotificationList: NotificationDO[]) => {
            expectEqualLists(resultedNotificationList, expectedList, "undelivered notifications");
        });
    }

    function getAndCheckNotificationListCountImpl(hotelId: string, searchCriteria: NotificationRepoDO.SearchCriteria, expectedCount: number) {
        var meta: NotificationRepoDO.Meta = { hotelId: hotelId };
        return notificationsRepository.getNotificationsListCount(meta, searchCriteria).then((response: LazyLoadMetaResponseRepoDO) => {
            should.equal(response.numOfItems, expectedCount, "expected count");
        });
    }
    
    function getAndCheckNotificationListImpl(hotelId: string, searchCriteria: NotificationRepoDO.SearchCriteria, expectedList: NotificationDO[]) {
        var meta: NotificationRepoDO.Meta = { hotelId: hotelId };
        return notificationsRepository.getNotificationList(meta, searchCriteria).then((searchResult: NotificationRepoDO.SearchResult) => {
            expectEqualLists(searchResult.notificationList, expectedList, "notification list");
        });
    }
});

function expectEqual(actual: NotificationDO, expected: NotificationDO, message: string) {
    should.deepEqual(actual.hotelId, expected.hotelId, message + "#hotelId");
    should.deepEqual(actual.userId, expected.userId, message + "#userId");
    should.deepEqual(actual.code, expected.code, message + "#code");
    should.deepEqual(actual.parameterMap, expected.parameterMap, message + "#parameterMap");
}

function expectEqualLists(actualList: NotificationDO[], expectedList: NotificationDO[], message: string) {
    should.equal(actualList.length, expectedList.length, message + "#notification count");
    for (var i: number = 0; i < expectedList.length; i++) {
        expectEqual(actualList[i], expectedList[i], message + "#wrong notification");
    }
}