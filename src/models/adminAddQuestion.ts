import { AdminAddOption } from "./adminAddOption";

export interface AdminAddQuestion {
    questionId?:number,
    questionContent:string,
    isSQL?:boolean,
    questionTypeId:number|string,
    testTypeId:number,
    questionImage:string|null
    options:AdminAddOption[],
    d_date?:Date,
    d_id?:number,
    i_date?:Date,
    i_id?:number,
    u_date?:Date,
    u_id?:number,
    short_name?:string,
}