import {SopDocUploadResponse, VerifyResponse} from "../../../@Models/sop-response.model";
import {createReducer, on} from "@ngrx/store";
import {
    checkPlagSuccess, gotoDownload,
    loadCountriesSuccess,
    loadCourseSuccess,
    loadUnivercityByCountry,
    loadUnivercityByCountrySuccess,
    onSelectCourses,
    onSelectUnivercity,
    selectOptionsSuccess,
    setPlagDoc,
    updateDocSuccess,
    uploadDocSuccess,
    verifyPlagSuccess
} from "./actions";
import {Course} from "../../../@Models/course.model";
import {Country} from "../../../@Models/country.model";
import {Univercity} from "../../../@Models/univercity.model";
import {GrammarResponse, PlagResponse} from "../../../@Models/plag.model";

export interface SopState {
    docId?: number;
    document?: string;
    country?: number;
    university?: number;
    course?: string[];
    grammer?: GrammarResponse;
    Plagiarism?: PlagResponse;
    stage?: number;
    positive?: string[];
    negative?: string[];
    courses: Course[];
    countries: Country[];
    univercities: Univercity[];
}
export const initialState: SopState = {
    stage: 1,
    document: '',
    courses: [],
    countries: [],
    univercities: [],
    positive: [],
    negative: []
}

export const sopReducer = createReducer(
    initialState,
    on(uploadDocSuccess, (state, payload) => ({...state, docId: payload.data.docId, document: payload.data.document, stage: payload.data.stage})),
    on(updateDocSuccess, (state, payload) => ({...state, docId: payload.data.docId, document: payload.data.document, stage: payload.data.stage})),
    on(selectOptionsSuccess, (state, payload) => ({...state, docId: payload.data.docId, stage: payload.data.stage})),
    on(loadUnivercityByCountry, (state, payload) => ({...state, country: payload.id, university: -1})),
    on(onSelectUnivercity, (state, payload) => ({...state, university: payload.id})),
    on(onSelectCourses, (state, payload) => ({...state, course: payload.ids})),
    on(loadCourseSuccess, (state, payload) => ({...state, courses: payload.data})),
    on(loadCountriesSuccess, (state, payload) => ({...state, countries: payload.data})),
    on(loadUnivercityByCountrySuccess, (state, payload) => ({...state, univercities: [{id: -1, name: 'Select', status: -1},...payload.data]})),

    on(checkPlagSuccess, (state, payload) => ({...state, Plagiarism: payload.Plagiarism, document: payload.document, grammer: payload.grammer})),
    on(verifyPlagSuccess, (state, payload) => ({...state, stage: payload.data.stage, document: payload.data.document, positive: payload.data.positive, negative: payload.data.negative})),
    on(setPlagDoc, (state, payload) => ({...state, plagarizedDoc: payload.data})),
    on(gotoDownload, (state, payload) => ({...state, stage: 5})),
);