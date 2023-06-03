export interface QuestionAttempted {
    questionAttemptedId:number,
    questionId:number,
    optionIndex:number,
    sqlQuery?:string,
    sqlResult?:boolean,
}