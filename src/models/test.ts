import { TestQuestion } from "./testQuestion";

export interface Test{
    testId?:number,
    testName:string,
    testCreator:number,
    testCreatedDate:Date,
    testQuestions:TestQuestion[],
    testRules:{
        rule:number
    }[],
    sqL_Count:number,
    mcQ_Count:number,
}