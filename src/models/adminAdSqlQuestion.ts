import { SqlQuery } from "./sqlQuery";

export interface AdminAddSqlQuestion{
    questionId?:number,
    questionContent:string,
    questionTitle:string,
    sqL_Answer:SqlQuery
}