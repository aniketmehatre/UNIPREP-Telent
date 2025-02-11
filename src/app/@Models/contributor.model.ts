export interface Contributor {
    isChecked: number
    id: number
    name: string
    details: any
    email: string
    phonenumber: string
    question_answer: QuestionAnswer[]
    totalstudent: number
    contributor_id: number
    payment_id: string
    contributor_stable_id: any
    payment_method: string
    amount: string
    payment_time: string
    userstatus: number
    contributiontier: string
    location: string
    image: string
    contributorID: string
  }
  
  export interface QuestionAnswer {
    question: string
    answer: string
  }

  export interface ContributorRes {
    success: boolean
    data: Contributor[]
    count: number
  }

  export interface ContributorDropDownRes {
    contributiontier: Contributiontier[]
    contributornames: Contributorname[]
    totalstudents: Totalstudent[]
    amounts: Amount[]
    paymentmethods: Paymentmethod[]
  }
  
  export interface Contributiontier {
    id: number
    contributiontier: string
    totalstudent: number
  }
  
  export interface Contributorname {
    name: string
  }
  
  export interface Totalstudent {
    totalstudent: number
  }
  
  export interface Amount {
    amount: string
  }
  
  export interface Paymentmethod {
    payment_method: string
  }