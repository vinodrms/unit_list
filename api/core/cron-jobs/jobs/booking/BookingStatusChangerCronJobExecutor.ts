import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {ThAuditLogger} from '../../../utils/logging/ThAuditLogger';
import {ICronJobExecutor} from '../../utils/cron/executor/ICronJobExecutor';
import {JobExecutorDO} from '../../utils/cron/executor/JobExecutorDO';
import {BookingProcessFactory, BookingStatusChangerProcessType} from '../../../domain-layer/bookings/processes/BookingProcessFactory';
import {IBookingStatusChangerProcess} from '../../../domain-layer/bookings/processes/IBookingStatusChangerProcess';
import {BookingDO} from '../../../data-layer/bookings/data-objects/BookingDO';
import {BookingPriceType} from '../../../data-layer/bookings/data-objects/price/BookingPriceDO';
import {NotificationDO} from '../../../data-layer/common/data-objects/notifications/NotificationDO';
import {ThNotificationCode} from '../../../data-layer/common/data-objects/notifications/ThNotificationCode';

import util = require('util');
import _ = require('underscore');

export class BookingStatusChangerCronJobExecutor implements ICronJobExecutor {
    constructor(private _executorDO: JobExecutorDO) {
    }
    public execute() {
        var bookingProcessFactory = new BookingProcessFactory(this._executorDO.appContext, this._executorDO.hotel);
        var markBookingsAsGuaranteedProcess: IBookingStatusChangerProcess = bookingProcessFactory.getBookingStatusChangerProcess(BookingStatusChangerProcessType.MarkBookingsAsGuaranteed);
        var markBookingsAsNoShowProcess: IBookingStatusChangerProcess = bookingProcessFactory.getBookingStatusChangerProcess(BookingStatusChangerProcessType.MarkBookingsAsNoShow);

        markBookingsAsGuaranteedProcess.changeStatuses(this._executorDO.thTimestamp)
            .then((guaranteedBookingList: BookingDO[]) => {
                if (guaranteedBookingList.length > 0) {
                    this.sendNotificationsForGuaranteedBookings(guaranteedBookingList);
                    this.auditLogForGuaranteedBookings(guaranteedBookingList);
                }
                return markBookingsAsNoShowProcess.changeStatuses(this._executorDO.thTimestamp);
            }).then((noShowBookingList: BookingDO[]) => {
                if (noShowBookingList.length > 0) {
                    this.sendNotificationsForNoShowBookings(noShowBookingList);
                    this.auditLogForNoShowBookings(noShowBookingList);
                }
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingStatusChangerCronJobExecutorError, error);
                ThLogger.getInstance().logBusiness(ThLogLevel.Error, "[Cron] Error changing booking statuses", { executorDO: this._executorDO }, thError);
            });
    }

    private sendNotificationsForGuaranteedBookings(guaranteedBookingList: BookingDO[]) {
        this.sendNotification(NotificationDO.buildNotificationDO(
            {
                hotelId: this._executorDO.hotel.id,
                code: ThNotificationCode.BookingsMarkedAsGuaranteed,
                parameterMap: { noBookings: guaranteedBookingList.length }
            }));
    }
    private auditLogForGuaranteedBookings(guaranteedBookingList: BookingDO[]) {
        ThAuditLogger.getInstance().log({
            message: util.format("Marked %s bookings as Guaranteed for hotel *%s*", guaranteedBookingList.length, this._executorDO.hotel.contactDetails.name)
        });
    }

    private sendNotificationsForNoShowBookings(noShowBookingList: BookingDO[]) {
        var noBookingsWithPenalty = this.getNumberOfNoShowBookingsWithPenalty(noShowBookingList);
        if (noBookingsWithPenalty > 0) {
            this.sendNotification(NotificationDO.buildNotificationDO(
                {
                    hotelId: this._executorDO.hotel.id,
                    code: ThNotificationCode.BookingsMarkedAsNoShowWithPenalty,
                    parameterMap: { noBookings: noShowBookingList.length, noBookingsWithPenalty: noBookingsWithPenalty }
                }));
            return;
        }
        this.sendNotification(NotificationDO.buildNotificationDO(
            {
                hotelId: this._executorDO.hotel.id,
                code: ThNotificationCode.BookingsMarkedAsNoShow,
                parameterMap: { noBookings: noShowBookingList.length }
            }));
    }
    private getNumberOfNoShowBookingsWithPenalty(noShowBookingList: BookingDO[]): number {
        var filteredBookings = _.filter(noShowBookingList, (booking: BookingDO) => {
            return booking.price.priceType === BookingPriceType.Penalty;
        });
        return filteredBookings.length;
    }
    private auditLogForNoShowBookings(noShowBookingList: BookingDO[]) {
        var noBookingsWithPenalty = this.getNumberOfNoShowBookingsWithPenalty(noShowBookingList);
        ThAuditLogger.getInstance().log({
            message: util.format("Marked %s bookings as No Show (%s with penalty) for hotel *%s*", noShowBookingList.length, noBookingsWithPenalty, this._executorDO.hotel.contactDetails.name)
        });
    }

    private sendNotification(notification: NotificationDO) {
        var notificationsService = this._executorDO.appContext.getServiceFactory().getNotificationService();
        notificationsService.addNotification(notification).then((result: any) => { }).catch((error: any) => { });
    }
}