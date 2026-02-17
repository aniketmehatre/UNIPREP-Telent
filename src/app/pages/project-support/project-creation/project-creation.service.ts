import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { ObjectModel } from "src/app/@Models/object.model";

export interface ProjectCreation {
  projectName: string;
  projectDescription: string;
  projectRequirementDetails: string;
  servicesType: string;
  freelancingType: string;
  budgetCurrency: string;
  budgetMin: number;
  budgetMax: number;
  projectPriority: string;
  projectStartDate: string;
  projectRemarks?: string;
  referenceLinks?: string[];
  images?: File[];
  documents?: File[];
}

export interface ProjectResponse {
  status: boolean;
  message: string;
  data?: any;
}

export interface ProjectListResponse {
  status: boolean;
  data: any[];
  total?: number;
}

@Injectable({
  providedIn: "root",
})
export class ProjectCreationService {
  private http = inject(HttpClient);
  
  headers = new HttpHeaders().set("Accept", "application/json");

  /**
   * Get dropdown data using unified endpoint
   * @param type Optional type parameter: 'service_type', 'freelancing_type', 'project_priority', 'project_status', or undefined for all
   */
  getProjectDropdowns(type?: 'service_type' | 'freelancing_type' | 'project_priority' | 'project_status'): Observable<any> {
    let url = environment.ApiUrl + "/project-dropdowns";
    if (type) {
      url += `?type=${type}`;
    }
    return this.http.get<any>(url, { headers: this.headers });
  }

  /**
   * Get service types dropdown
   */
  getServiceTypes(): Observable<any> {
    return this.getProjectDropdowns('service_type');
  }

  /**
   * Get freelancing types dropdown
   */
  getFreelancingTypes(): Observable<any> {
    return this.getProjectDropdowns('freelancing_type');
  }

  /**
   * Get project priorities options
   */
  getProjectPriorities(): Observable<any> {
    return this.getProjectDropdowns('project_priority');
  }

  /**
   * Get currency list for projects
   */
  getCurrencyList(): Observable<any> {
    return this.http.get<any>(
      environment.ApiUrl + "/get-project-currency-list",
      { headers: this.headers }
    );
  }

  /**
   * Create a new project
   */
  createProject(paramData: any): Observable<ProjectResponse> {
    const formData = new FormData();
    
    // Append form fields with snake_case names for backend
    formData.append("project_name", paramData.project_name || "");
    formData.append("project_description", paramData.project_description || "");
    formData.append("project_requirement_details", paramData.project_requirement_details || "");
    formData.append("services_type", paramData.services_type || "");
    formData.append("freelancing_type", paramData.freelancing_type || "");
    formData.append("project_priority", paramData.project_priority || "");
    formData.append("project_start_date", paramData.project_start_date || "");
    
    // Handle budget fields
    if (paramData.budget_percentage !== undefined && paramData.budget_percentage !== null && paramData.budget_percentage !== 0) {
      // Success fee/outcome type - use percentage
      formData.append("budget_percentage", paramData.budget_percentage.toString());
      formData.append("budget_currency", paramData.budget_currency || "");
      formData.append("budget_min", "0");
      formData.append("budget_max", "0");
    } else {
      // Regular budget - use currency and min/max
      formData.append("budget_currency", paramData.budget_currency || "");
      formData.append("budget_min", (paramData.budget_min || 0).toString());
      formData.append("budget_max", (paramData.budget_max || 0).toString());
      formData.append("budget_percentage", "0");
    }
    
    if (paramData.project_remarks) {
      formData.append("project_remarks", paramData.project_remarks);
    }

    // Append reference links as reference_links[] format (matching images[] and documents[] pattern)
    if (Array.isArray(paramData.reference_links) && paramData.reference_links.length > 0) {
      paramData.reference_links.forEach((link: string) => {
        formData.append('reference_links[]', link);
      });
    } else {
      // If empty or not an array, send empty array by appending an empty value
      // Some backends require at least one entry to recognize it as an array
      formData.append("reference_links[]", "");
    }

    // Append images as images[] format for project logo
    console.log('=== Service: Processing Images ===');
    console.log('paramData.images exists:', !!paramData.images);
    console.log('paramData.images is array:', Array.isArray(paramData.images));
    console.log('paramData.images length:', paramData.images?.length || 0);
    
    if (paramData.images && Array.isArray(paramData.images) && paramData.images.length > 0) {
      paramData.images.forEach((image: File, index: number) => {
        if (image instanceof File) {
          formData.append('images[]', image, image.name);
          console.log(`Appended image ${index + 1}: ${image.name} (${image.size} bytes, ${image.type})`);
        } else {
          console.warn(`Image ${index + 1} is not a File object:`, typeof image, image);
        }
      });
      
      // Log for debugging
      console.log(`Successfully appended ${paramData.images.length} image(s) to FormData as images[]`);
    } else {
      console.log('No images to append - images array is empty or invalid');
    }

    // Append documents as documents[] format
    console.log('=== Service: Processing Documents ===');
    console.log('paramData.documents exists:', !!paramData.documents);
    console.log('paramData.documents is array:', Array.isArray(paramData.documents));
    console.log('paramData.documents length:', paramData.documents?.length || 0);
    
    if (paramData.documents && Array.isArray(paramData.documents) && paramData.documents.length > 0) {
      paramData.documents.forEach((document: File, index: number) => {
        if (document instanceof File) {
          formData.append('documents[]', document, document.name);
          console.log(`Appended document ${index + 1}: ${document.name} (${document.size} bytes, ${document.type})`);
        } else {
          console.warn(`Document ${index + 1} is not a File object:`, typeof document, document);
        }
      });
      
      // Log for debugging
      console.log(`Successfully appended ${paramData.documents.length} document(s) to FormData as documents[]`);
    } else {
      console.log('No documents to append - documents array is empty or invalid');
    }
    
    // Debug: Log FormData contents (only in development)
    console.log('=== Service: FormData Contents ===');
    let fileCount = 0;
    let nonFileCount = 0;
    formData.forEach((value, key) => {
      if (value instanceof File) {
        fileCount++;
        console.log(`${key}: File - ${value.name} (${value.size} bytes, type: ${value.type})`);
      } else {
        nonFileCount++;
        if (typeof value === 'string' && value.length < 100) {
          console.log(`${key}: ${value}`);
        } else {
          console.log(`${key}: [${typeof value}] (length: ${String(value).length})`);
        }
      }
    });
    console.log(`FormData Summary: ${fileCount} file(s), ${nonFileCount} non-file field(s)`);

    // For FormData, don't set Content-Type header - browser will set it automatically with boundary
    // But we can pass Accept header and let interceptor add Authorization
    const formDataHeaders = new HttpHeaders().set("Accept", "application/json");
    
    return this.http.post<ProjectResponse>(
      environment.ApiUrlEmployer + "/create-project",
      formData,
      { headers: formDataHeaders }
    );
  }

  /**
   * Update an existing project
   */
  updateProject(id: number, paramData: any): Observable<ProjectResponse> {
    const formData = new FormData();
    
    formData.append("id", id.toString());
    formData.append("project_name", paramData.project_name || "");
    formData.append("project_description", paramData.project_description || "");
    formData.append("project_requirement_details", paramData.project_requirement_details || "");
    formData.append("services_type", paramData.services_type || "");
    formData.append("freelancing_type", paramData.freelancing_type || "");
    formData.append("project_priority", paramData.project_priority || "");
    formData.append("project_start_date", paramData.project_start_date || "");
    
    // Handle budget fields
    if (paramData.budget_percentage !== undefined && paramData.budget_percentage !== null && paramData.budget_percentage !== 0) {
      // Success fee/outcome type - use percentage
      formData.append("budget_percentage", paramData.budget_percentage.toString());
      formData.append("budget_currency", paramData.budget_currency || "");
      formData.append("budget_min", "0");
      formData.append("budget_max", "0");
    } else {
      // Regular budget - use currency and min/max
      formData.append("budget_currency", paramData.budget_currency || "");
      formData.append("budget_min", (paramData.budget_min || 0).toString());
      formData.append("budget_max", (paramData.budget_max || 0).toString());
      formData.append("budget_percentage", "0");
    }
    
    if (paramData.project_remarks) {
      formData.append("project_remarks", paramData.project_remarks);
    }

    // Append reference links as reference_links[] format (matching images[] and documents[] pattern)
    if (Array.isArray(paramData.reference_links) && paramData.reference_links.length > 0) {
      paramData.reference_links.forEach((link: string) => {
        formData.append('reference_links[]', link);
      });
    } else {
      // If empty or not an array, send empty array by appending an empty value
      // Some backends require at least one entry to recognize it as an array
      formData.append("reference_links[]", "");
    }

    // Append images as images[] format for project logo
    if (paramData.images && paramData.images.length > 0) {
      paramData.images.forEach((image: File) => {
        formData.append('images[]', image, image.name);
      });
    }

    // Append documents as documents[] format
    if (paramData.documents && paramData.documents.length > 0) {
      paramData.documents.forEach((document: File) => {
        formData.append('documents[]', document, document.name);
      });
    }

    // For FormData, don't set Content-Type header - browser will set it automatically with boundary
    const formDataHeaders = new HttpHeaders().set("Accept", "application/json");
    
    return this.http.post<ProjectResponse>(
      environment.ApiUrlEmployer + "/updateproject",
      formData,
      { headers: formDataHeaders }
    );
  }

  /**
   * Get project list with filters
   */
  getProjectList(params: ObjectModel): Observable<ProjectListResponse> {
    return this.http.post<ProjectListResponse>(
      environment.ApiUrl + "/freelancer-project-list",
      params,
      { headers: this.headers }
    );
  }

  /**
   * Get project by ID
   */
  getProjectById(id: number): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(
      environment.ApiUrl + "/freelancer-project-details",
      { id: id },
      { headers: this.headers }
    );
  }

  /**
   * Get project documents by project ID
   */
  getProjectDocuments(projectId: number): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/list-project-documents",
      { 
        project_id: projectId,
        user_type: "user"
      },
      { headers: this.headers }
    );
  }

  /**
   * Get project activities by project ID with pagination
   */
  getProjectActivities(projectId: number, page: number = 1, perPage: number = 20): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/get-project-activity",
      { 
        project_id: projectId, 
        user_type: "user",
        page: page, 
        per_page: perPage 
      },
      { headers: this.headers }
    );
  }

  /**
   * Get bank details for a project (dummy API - backend can implement later)
   */
  getProjectBankDetails(projectId: number): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/get-project-bank-details",
      {
        project_id: projectId,
        user_type: "user",
      },
      { headers: this.headers }
    );
  }

  /**
   * Update bank details for a project (dummy API - backend can implement later)
   */
  updateProjectBankDetails(projectId: number, bankDetails: any): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/update-project-bank-details",
      {
        project_id: projectId,
        user_type: "user",
        ...bankDetails,
      },
      { headers: this.headers }
    );
  }

  /**
   * Create a new activity for project
   */
  createProjectActivity(projectId: number, activityTitle: string, activityDescription: string, attachments: File[] = []): Observable<any> {
    const formData = new FormData();
    formData.append("user_type", "user");
    formData.append("projectId", projectId.toString());
    formData.append("activityTitle", activityTitle);
    formData.append("activityDescription", activityDescription);
    
    // Append attachments as array format
    if (attachments && attachments.length > 0) {
      attachments.forEach((attachment) => {
        formData.append('attachments[]', attachment, attachment.name);
      });
    }

    const formDataHeaders = new HttpHeaders().set("Accept", "application/json");
    
    return this.http.post<any>(
      environment.ApiUrl + "/create-project-activity",
      formData,
      { headers: formDataHeaders }
    );
  }

  /**
   * Get project form data for editing
   */
  getFormDataProjectById(id: number): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(
      environment.ApiUrlEmployer + "/editproject",
      { id: id },
      { headers: this.headers }
    );
  }


  /**
   * Update project status
   */
  updateProjectStatus(paramData: any): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(
      environment.ApiUrlEmployer + "/updateprojectstatus",
      paramData,
      { headers: this.headers }
    );
  }

  

  /**
   * Get project count
   */
  getProjectCount(): Observable<any> {
    return this.http.post<any>(
      `${environment.ApiUrlEmployer}/getprojectcount`,
      {},
      { headers: this.headers }
    );
  }

  /**
   * Clear project session
   */
  clearProjectSession(): Observable<any> {
    return this.http.get<any>(
      environment.ApiUrlEmployer + "/clearprojectsession",
      { headers: this.headers }
    );
  }

  // Private data storage for project data
  private projectData: any;

  setProjectData(data: any) {
    this.projectData = data;
  }

  getProjectData() {
    return this.projectData;
  }

  // Private form data storage
  private formData: any;

  setFormData(data: any) {
    this.formData = data;
  }

  getFormData() {
    return this.formData;
  }
}

