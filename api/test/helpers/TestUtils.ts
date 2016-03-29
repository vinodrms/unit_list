import _ = require("underscore")

export class TestUtils {
    public getRandomIntBetween(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    public getRandomFloatBetween(min: number, max: number): number {
        return Math.random() * (max - min) + min;
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
}