import {createAction} from "@ngrx/store";
import {SopDocUploadResponse, VerifyPlagPayload, VerifyResponse} from "../../../@Models/sop-response.model";
import {Course} from "../../../@Models/course.model";
import {Country} from "../../../@Models/country.model";
import {Univercity} from "../../../@Models/univercity.model";
import {GrammarResponse, PlagResponse} from "../../../@Models/plag.model";

export const uploadDoc = createAction('[SOP DOC] upload doc', (payload: {document: File}) => payload);
export const uploadDocSuccess = createAction('[SOP DOC] upload doc success', (payload: {data: SopDocUploadResponse}) => payload);

export const updateDoc = createAction('[SOP DOC] update doc', (payload: {docId: number, data: string}) => payload);
export const updateDocSuccess = createAction('[SOP DOC] update doc success', (payload: {data: SopDocUploadResponse}) => payload);

export const selectOptions = createAction('[SOP DOC] Select options doc');
export const selectOptionsSuccess = createAction('[SOP DOC] Select options success', (payload: {data: SopDocUploadResponse}) => payload);

export const loadCourse = createAction('[SOP DOC] load course');
export const loadCourseSuccess = createAction('[SOP DOC] load course success', (payload: {data: Course[]}) => payload);

export const loadCountries = createAction('[SOP DOC] load countries');
export const loadCountriesSuccess = createAction('[SOP DOC] load countries success', (payload: {data: Country[]}) => payload);

export const loadUnivercityByCountry = createAction('[SOP DOC] load univercity by country', (payload: {id: number}) => payload);
export const loadUnivercityByCountrySuccess = createAction('[SOP DOC] load univercity by country success', (payload: {data: Univercity[]}) => payload);

export const onSelectUnivercity = createAction('[SOP DOC] on select univercity', (payload: {id: number}) => payload);
export const onSelectCourses = createAction('[SOP DOC] on select courses', (payload: {ids: any[]}) => payload);

export const checkPlag = createAction('[SOP DOC] check plag', (payload: {data: string}) => payload);
export const checkPlagSuccess = createAction('[SOP DOC] check plag success', (payload: SopDocUploadResponse) => payload);

export const verifyPlag = createAction('[SOP DOC] verify plag');
export const verifyPlagSuccess = createAction('[SOP DOC] verify plag success', (payload: {data: SopDocUploadResponse}) => payload);

export const setPlagDoc = createAction('[SOP DOC] set plag data', (payload: {data: string}) => payload);

export const gotoDownload = createAction('[SOP DOC] goto download');
