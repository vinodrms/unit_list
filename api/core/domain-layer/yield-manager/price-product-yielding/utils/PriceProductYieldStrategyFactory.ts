import {IPriceProductYieldStrategy} from './IPriceProductYieldStrategy';
import {PriceProductYieldingDO, PriceProductYieldAction} from '../PriceProductYieldingDO';
import {OpenStrategy} from './strategies/OpenStrategy';
import {CloseStrategy} from './strategies/CloseStrategy';
import {OpenForArrivalStrategy} from './strategies/OpenForArrivalStrategy';
import {CloseForArrivalStrategy} from './strategies/CloseForArrivalStrategy';
import {OpenForDepartureStrategy} from './strategies/OpenForDepartureStrategy';
import {CloseForDepartureStrategy} from './strategies/CloseForDepartureStrategy';

export class PriceProductYieldStrategyFactory {
    public getYieldStrategy(yieldDO: PriceProductYieldingDO): IPriceProductYieldStrategy {
        switch (yieldDO.action) {
            case PriceProductYieldAction.Open:
                return new OpenStrategy();
            case PriceProductYieldAction.Close:
                return new CloseStrategy();
            case PriceProductYieldAction.OpenForArrival:
                return new OpenForArrivalStrategy();
            case PriceProductYieldAction.CloseForArrival:
                return new CloseForArrivalStrategy();
            case PriceProductYieldAction.OpenForDeparture:
                return new OpenForDepartureStrategy();
            case PriceProductYieldAction.CloseForDeparture:
                return new CloseForDepartureStrategy();
        }
    }
}