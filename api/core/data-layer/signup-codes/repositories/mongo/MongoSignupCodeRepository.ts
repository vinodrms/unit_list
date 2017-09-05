import { MongoRepository, MongoErrorCodes, MongoSearchCriteria } from '../../../common/base/MongoRepository';
import { MongoQueryBuilder } from '../../../common/base/MongoQueryBuilder';
import { ISignupCodeRepository } from "../ISignupCodeRepository";
import { ThError } from "../../../../utils/th-responses/ThError";
import { SignupCodeDO } from "../../data-objects/SignupCodeDO";
import { ThStatusCode } from "../../../../utils/th-responses/ThResponse";
import { ThLogLevel, ThLogger } from "../../../../utils/logging/ThLogger";

declare var sails: any;

export class MongoSignupCodeRepository extends MongoRepository implements ISignupCodeRepository {
    constructor() {
        var signupCodesEntity = sails.models.signupcodesentity;
        super(signupCodesEntity);
    }

    public getSignupCode(code: string): Promise<SignupCodeDO> {
        return new Promise<SignupCodeDO>((resolve: { (result: SignupCodeDO): void }, reject: { (err: ThError): void }) => {
            this.getSignupCodeCore(resolve, reject, code);
        });
    }
    private getSignupCodeCore(resolve: { (result: SignupCodeDO): void }, reject: { (err: ThError): void }, code: string) {
        this.findOneDocument({ "value": code },
            () => {
                let thError = new ThError(ThStatusCode.SignupCodeRepositorySignupCodeNotFound, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Sign up code not found.", { signupCode: code }, thError);
                reject(thError);
            },
            (err: Error) => {
                let thError = new ThError(ThStatusCode.SignupCodeRepositoryErrorGettingSignupCode, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting sign up code by value.", { signupCode: code }, thError);
                reject(thError);
            },
            (foundSignupCode: Object) => {
                let signupCode: SignupCodeDO = new SignupCodeDO();
                signupCode.buildFromObject(foundSignupCode);
                resolve(signupCode);
            }
        );
    }

    public addSignupCode(code: string) {
        return new Promise<SignupCodeDO>((resolve: { (result: SignupCodeDO): void }, reject: { (err: ThError): void }) => {
            this.addSignupCodeCore(resolve, reject, code);
        });
    }
    private addSignupCodeCore(resolve: { (result: SignupCodeDO): void }, reject: { (err: ThError): void }, code: string) {
        let signupCode = new SignupCodeDO();
        signupCode.value = code;

        this.createDocument(signupCode,
            (err: Error) => {
                this.logAndReject(err, reject, { signupCode: code }, ThStatusCode.SignupCodeRepositoryErrorAddingSignupCode);
            },
            (createdSignupCode: Object) => {
                let signupCode: SignupCodeDO = new SignupCodeDO();
                signupCode.buildFromObject(createdSignupCode);
                resolve(signupCode);
            }
        );
    }

    public deleteSignupCode(code: string) {
        return new Promise<number>((resolve: { (result: number): void }, reject: { (err: ThError): void }) => {
            this.deleteSignupCodeCore(resolve, reject, code);
        });
    }
    private deleteSignupCodeCore(resolve: { (result: number): void }, reject: { (err: ThError): void }, code: string) {
        
    }

    private logAndReject(err: Error, reject: { (err: ThError): void }, context: Object, defaultStatusCode: ThStatusCode) {
        var thError = new ThError(defaultStatusCode, err);
        ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding the sign up code", context, thError);
        reject(thError);
    }
}