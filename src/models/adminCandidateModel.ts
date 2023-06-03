import { QuestionAttempted } from "./questionAttempted";

export interface CandidateModel{
    userId: number,
    firstName: string,
    lastName: string,
    email: string,
    college:string,
    userResumeFileName:string,
    userProfileImage:string,
    phone: string,
    selectionStatus: number,
    violation: number,
    isAdmin: boolean,
    userTest: {
      userTestId: number,
      endTest: boolean,
      score: number,
      attempted: number
    },
    questionAttempted:QuestionAttempted[]
}