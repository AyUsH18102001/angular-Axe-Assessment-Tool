import { AdminAddQuestion } from "./adminAddQuestion";

export interface TestTypeAccordion {
    testypeId : number,
    short_name:string,
    test : string,
    questions : AdminAddQuestion[],
}