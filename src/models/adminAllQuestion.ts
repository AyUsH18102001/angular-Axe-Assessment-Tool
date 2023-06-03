import { Option } from "./option";

export interface AdminAllQuestion {
    questionId:number,
    questionContent:string,
    questionTypeId:number|string,
    options:Option[]
}