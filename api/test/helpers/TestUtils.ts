import _ = require("underscore")

import {ThUtils} from '../../core/utils/ThUtils';

export class TestUtils {
    private _thUtils: ThUtils;

    constructor() {
        this._thUtils = new ThUtils();
    }

    public getRandomIntBetween(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    public getRandomFloatBetween(min: number, max: number): number {
        return this._thUtils.roundNumberToTwoDecimals(Math.random() * (max - min) + min);
    }
    public stringArraysAreEqual(firstArray: string[], secondArray: string[]): boolean {
        var diffArray: string[] = _.difference(firstArray, secondArray);
        return diffArray.length == 0 && firstArray.length == secondArray.length;
    }
    public getRandomListElement<T>(list: T[]): T {
        return list[this.getRandomIntBetween(0, list.length - 1)];
    }
    public getIdSampleFrom(list: Object[], sampleLength: number) {
        var idListSample: string[] = [];

        var sample = _.sample(list, Math.min(sampleLength, list.length));
        sample.forEach(sampleElement => {
            idListSample.push(sampleElement["id"]);
        });

        return idListSample;
    }

    /**
     * Delays running the function given as parameter.
     *
     * Example usage:
     *
     * function downloadImage(imageUrl) {
     *    ... download imageUrl ...
     * }
     *
     * var lazyDownloadImage = lazyFunction(downloadImage);
     *
     * lazyDownloadImage(URL) doesn't download the image. Instead,
     * it returns a function that when called downloads the image.
     * This comes especially useful when you want to pass this as
     * a parameter to other function. For instance, if you do:
     *
     * f(downloadImage(URL))
     *
     * downloadImage(URL) is called before f is called. If you want to
     * resolve the parameter lazily, i.e., download the image inside f,
     * you need to do:
     *
     * f(lazyDownloadImage(URL))
     *
     * and then inside f call the parameter as a function with no
     * parameters whenever you want to trigger the download.
     */
    public static lazyFunction(func) {
        return function (...args) {
            return function () {
                return func.apply(null, args);
            }
        };
    }

    /**
     * Runs the given asynchronous methods sequentially. I.e.,
     * it starts by running the first method in the array.
     * When that is finished, it starts running the second method
     * and so on. The last method in the asyncMethods array is
     * a special done function, which is called either when an
     * error is occured or when all other methods already
     * finished executing.
     */
    public static runSequentially(...asyncMethods) {
        // If methods = [M1, M2, done], in the end the executor will look
        // like this: M1.bind(this, M2.bind(this, done)).
        var done = asyncMethods[asyncMethods.length - 1];
        var executor = done;
        for (var i: number = asyncMethods.length - 2; i >= 0; i--) {
            var chained = function (testMethod, callback) {
                return testMethod().then(() => {
                    return callback();
                });
            };
            executor = chained.bind(null, asyncMethods[i], executor);
        }
        executor().catch((error: any) => {
            done(error);
        });
    }

    public get thUtils(): ThUtils {
        return this._thUtils;
    }
    public set thUtils(thUtils: ThUtils) {
        this._thUtils = thUtils;
    }
}
