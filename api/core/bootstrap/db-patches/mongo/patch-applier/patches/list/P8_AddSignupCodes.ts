import { ATransactionalMongoPatch } from "../../utils/ATransactionalMongoPatch";
import { MongoSignupCodeRepository } from "../../../../../../data-layer/signup-codes/repositories/mongo/MongoSignupCodeRepository";
import { MongoPatchType } from "../MongoPatchType";
import { ThError } from "../../../../../../utils/th-responses/ThError";

declare var sails: any;

export class P8_AddSignupCodes extends ATransactionalMongoPatch {
    private signupCodesToAdd: string[] = [
        "Z9D89",
        "VF5AX",
        "UPZPL",
        "D9R1U",
        "UU6U2",
        "78EK1",
        "ERNU2",
        "QGMBC",
        "LI5FM",
        "OJQZT",
        "KIBXW",
        "GWTPZ",
        "1TSGR",
        "9J697",
        "63HDW",
        "PMA1F",
        "PBY58",
        "4OAOZ",
        "U8HKV",
        "BDYEL"
    ];

    private _settingsEntity: any;
    private _mongoSignupCodeRepository: MongoSignupCodeRepository;

    constructor() {
        super();
        
        this._mongoSignupCodeRepository = new MongoSignupCodeRepository();
    }
    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddSignupCodes;
    }

    protected applyCore(resolve: { (result: boolean): void }, reject: { (err: any): void }) {
        let promiseList = [];
        this.signupCodesToAdd.forEach((signupCode: string) => {
            promiseList.push(this._mongoSignupCodeRepository.addSignupCode(signupCode));
        });

        Promise.all(promiseList).then((result: any) => {
            resolve(result);
        }).catch((error: any) => {
            reject(error);
        });
    }
}