import {AppContext} from '../../utils/AppContext';
import {ACronJob} from './ACronJob';

import schedule = require('node-schedule');

export abstract class AHourlyCronJob extends ACronJob {
	protected getRecurrenceRule(): schedule.RecurrenceRule {
		return {
			minute: 0
		}
	}
}