export interface Register{
    firstName: string,
    lastName:string,
    email:string,
    college:string,
    phone:string,
    selectionStatus: 0,
    violation: 0,
    userResumeFileName:string,
    userProfileImage:string
    isAdmin: false,
    userTest: {
        endTest: false,
        score: 0,
        attempted: 0
    }
}