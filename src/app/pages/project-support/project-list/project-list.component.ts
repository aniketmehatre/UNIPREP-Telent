import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { TooltipModule } from "primeng/tooltip";
import { TagModule } from "primeng/tag";
import { SelectModule } from "primeng/select";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { PageFacadeService } from "../../page-facade.service";
import { ProjectCreationService } from "../project-creation/project-creation.service";
import { ObjectModel } from "src/app/@Models/object.model";

@Component({
  selector: "app-project-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    TooltipModule,
    TagModule,
    RouterModule,
    SelectModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.scss"],
})
export class ProjectListComponent implements OnInit {
  private pageFacade = inject(PageFacadeService);
  private projectService = inject(ProjectCreationService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  projects: any[] = [];
  filteredProjects: any[] = [];
  searchTerm: string = "";
  isLoading: boolean = false;
  totalProjects: number = 0;

  // Pagination
  page: number = 1;
  pageSize: number = 25;
  rowsPerPageOptions: number[] = [25, 50, 100];

  // Search form
  searchForm!: FormGroup;

  // Dropdown data for mapping IDs to names
  serviceTypes: any[] = [];
  freelancingTypes: any[] = [];
  projectPriorities: any[] = [];

  ngOnInit(): void {
    // Initialize search form with empty string
    this.searchForm = this.fb.group({
      search: [""],
    });

    // Initialize search term
    this.searchTerm = "";

    // Load dropdown data for mapping
    this.loadDropdowns();

    // Load projects
    this.loadProjects();

    // Subscribe to search input changes
    this.searchForm.get("search")?.valueChanges.subscribe((value) => {
      this.searchTerm = (value || "").trim();
      console.log("Search term changed:", this.searchTerm);
      this.filterProjects();
    });
  }

  loadDropdowns(): void {
    // Load service types
    this.projectService.getServiceTypes().subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
          this.serviceTypes = res;
        } else if (res?.data && Array.isArray(res.data)) {
          this.serviceTypes = res.data;
        } else if (res?.serviceTypes && Array.isArray(res.serviceTypes)) {
          this.serviceTypes = res.serviceTypes;
        }
      },
      error: (error) => {
        console.error('Error loading service types:', error);
      }
    });

    // Load freelancing types
    this.projectService.getFreelancingTypes().subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
          this.freelancingTypes = res;
        } else if (res?.data && Array.isArray(res.data)) {
          this.freelancingTypes = res.data;
        } else if (res?.freelancingTypes && Array.isArray(res.freelancingTypes)) {
          this.freelancingTypes = res.freelancingTypes;
        }
      },
      error: (error) => {
        console.error('Error loading freelancing types:', error);
      }
    });

    // Load project priorities
    this.projectService.getProjectPriorities().subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
          this.projectPriorities = res;
        } else if (res?.data && Array.isArray(res.data)) {
          this.projectPriorities = res.data;
        } else if (res?.projectPriorities && Array.isArray(res.projectPriorities)) {
          this.projectPriorities = res.projectPriorities;
        }
      },
      error: (error) => {
        console.error('Error loading project priorities:', error);
      }
    });
  }

  loadProjects(): void {
    this.isLoading = true;
    const params: ObjectModel = {
      page: this.page,
      perpage: this.pageSize,
    };

    this.projectService.getProjectList(params).subscribe({
      next: (response) => {
        console.log("API Response:", response);
        
        // Handle different response structures
        let projectsData: any[] = [];
        const responseData = response as any;
        
        if (responseData.status && responseData.data) {
          // If data is directly an array
          if (Array.isArray(responseData.data)) {
            projectsData = responseData.data;
          } 
          // If data is an object with a projects/projectList property
          else if (responseData.data.projects && Array.isArray(responseData.data.projects)) {
            projectsData = responseData.data.projects;
          }
          else if (responseData.data.projectList && Array.isArray(responseData.data.projectList)) {
            projectsData = responseData.data.projectList;
          }
          // If data is an object, try to find any array property
          else if (responseData.data && typeof responseData.data === 'object') {
            const arrayKey = Object.keys(responseData.data).find((key: string) => Array.isArray(responseData.data[key]));
            if (arrayKey) {
              projectsData = responseData.data[arrayKey];
            }
          }
        } 
        // If response.data is directly an array (without status)
        else if (Array.isArray(responseData.data)) {
          projectsData = responseData.data;
        }
        // If response itself is an array
        else if (Array.isArray(responseData)) {
          projectsData = responseData;
        }

        this.projects = projectsData;
        this.totalProjects = responseData.total || responseData.count || this.projects.length;
        
        console.log("Projects loaded:", this.projects.length, "Total:", this.totalProjects);
        if (this.projects.length > 0) {
          console.log("Sample project:", this.projects[0]);
          console.log("Sample project priority:", this.projects[0].project_priority);
          console.log("Sample project priority name:", this.projects[0].project_priority?.name);
        }
        
        // Always call filterProjects to initialize filteredProjects
        // Make sure to filter after projects are loaded
        setTimeout(() => {
          this.filterProjects();
        }, 0);
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading projects:", error);
        this.projects = [];
        this.filteredProjects = [];
        this.totalProjects = 0;
        this.isLoading = false;
      },
    });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = (input.value || "").trim();
    this.filterProjects();
  }

  filterProjects(): void {
    // If no search term, show all projects
    if (!this.searchTerm || !this.searchTerm.trim()) {
      this.filteredProjects = [...this.projects];
      console.log("No search term - showing all projects:", this.filteredProjects.length);
      return;
    }

    // Filter with search term
    const search = this.searchTerm.toLowerCase().trim();
    this.filteredProjects = this.projects.filter((project) => {
      // Use getter methods to get the display values (handles mapping, nested objects, etc.)
      const projectId = this.getProjectId(project).toLowerCase();
      const projectName = this.getProjectName(project).toLowerCase();
      const serviceType = this.getServiceType(project).toLowerCase();
      const freelancingType = this.getFreelancingType(project).toLowerCase();
      const priority = this.getProjectPriority(project).toLowerCase();
      const status = this.getProjectStatus(project).toLowerCase();
      const paymentStatus = this.getPaymentStatus(project).toLowerCase();

      // Also check raw status numbers for filtering (e.g., searching "1" should find status 1)
      const rawStatus = (project.projectStatus || 
                        project.project_status || 
                        project.status || 
                        "").toString().toLowerCase();
      const rawPaymentStatus = (project.project_payment_status || 
                               "").toString().toLowerCase();

      return (
        projectId.includes(search) ||
        projectName.includes(search) ||
        serviceType.includes(search) ||
        freelancingType.includes(search) ||
        priority.includes(search) ||
        status.includes(search) ||
        paymentStatus.includes(search) ||
        rawStatus.includes(search) || // Allow searching by status number too
        rawPaymentStatus.includes(search) // Allow searching by payment status number too
      );
    });
    
    console.log("Filtered projects:", this.filteredProjects.length, "Search term:", search);
  }

  onPageChange(event: any): void {
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadProjects();
  }

  getStatusSeverity(status: string): string {
    const statusLower = status?.toLowerCase() || "";
    switch (statusLower) {
      case "in progress":
      case "in_progress":
        return "info";
      case "completed":
      case "done":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
      case "rejected":
        return "danger";
      default:
        return "secondary";
    }
  }

  getPrioritySeverity(priority: string): string {
    if (!priority || priority === "N/A") {
      return "secondary";
    }
    
    const priorityLower = priority?.toLowerCase().trim() || "";
    
    switch (priorityLower) {
      case "high":
      case "urgent":
      case "critical":
        return "danger";
      case "medium":
      case "normal":
      case "moderate":
        return "warning";
      case "low":
        return "info";
      default:
        return "secondary";
    }
  }

  viewProject(project: any): void {
    const projectId = project.id || project.project_id || project.projectId;
    console.log("Project ID:", projectId);
    if (projectId) {
      this.router.navigate(["/pages/project-support/project-details", projectId]);
    }
  }

  openVideoPopup(): void {
    this.pageFacade.openHowitWorksVideoPopup("project-support");
  }

  getProjectId(project: any): string {
    return (
      project.project_id?.toString() ||
      project.id?.toString() ||
      project.projectId?.toString() ||
      "N/A"
    );
  }

  getProjectName(project: any): string {
    return (
      project.projectName ||
      project.project_name ||
      project.name ||
      "N/A"
    );
  }

  getServiceType(project: any): string {
    // First, check if there's a nested service_type object with name (from API response)
    if (project.service_type && typeof project.service_type === 'object') {
      return project.service_type.name || 
             project.service_type.label || 
             project.service_type.serviceType ||
             "N/A";
    }

    // Check for direct name/string values
    const serviceTypeName = project.servicesType || 
                           project.service_type || 
                           project.services_type;
    
    if (serviceTypeName && typeof serviceTypeName === 'string' && isNaN(Number(serviceTypeName))) {
      return serviceTypeName;
    }

    // Get the service type ID for mapping
    const serviceTypeId = project.service_type_id || 
                        project.serviceTypeId ||
                        project.service_type ||
                        project.servicesType ||
                        project.services_type;
    
    if (!serviceTypeId) {
      return "N/A";
    }

    // Try to find the service type name from dropdown
    const serviceType = this.serviceTypes.find(
      (st) => st.id === serviceTypeId || 
              st.value === serviceTypeId || 
              st.serviceType === serviceTypeId ||
              st.service_type === serviceTypeId ||
              st.serviceTypeId === serviceTypeId
    );

    return serviceType?.label || 
           serviceType?.name || 
           serviceType?.serviceType || 
           serviceType?.service_type ||
           serviceTypeId?.toString() || 
           "N/A";
  }

  getFreelancingType(project: any): string {
    // First, check if there's a nested freelancing_type object with name (from API response)
    if (project.freelancing_type && typeof project.freelancing_type === 'object') {
      return project.freelancing_type.name || 
             project.freelancing_type.label || 
             project.freelancing_type.freelancingType ||
             "N/A";
    }

    // Check for direct name/string values
    const freelancingTypeName = project.freelancingType || 
                               project.freelancing_type;
    
    if (freelancingTypeName && typeof freelancingTypeName === 'string' && isNaN(Number(freelancingTypeName))) {
      return freelancingTypeName;
    }

    // Get the freelancing type ID for mapping
    const freelancingTypeId = project.freelancing_type_id || 
                             project.freelancingTypeId ||
                             project.freelancing_type ||
                             project.freelancingType;
    
    if (!freelancingTypeId) {
      return "N/A";
    }

    // Try to find the freelancing type name from dropdown
    const freelancingType = this.freelancingTypes.find(
      (ft) => ft.id === freelancingTypeId || 
              ft.value === freelancingTypeId || 
              ft.freelancingType === freelancingTypeId ||
              ft.freelancing_type === freelancingTypeId
    );

    return freelancingType?.label || 
           freelancingType?.name || 
           freelancingType?.freelancingType || 
           freelancingType?.freelancing_type ||
           freelancingTypeId?.toString() || 
           "N/A";
  }

  getProjectPriority(project: any): string {
    if (!project) {
      return "N/A";
    }

    // First, check if there's a nested project_priority object with name (from API response)
    // This is the most common case based on the API structure
    if (project.project_priority) {
      // Check if it's an object (nested structure)
      if (typeof project.project_priority === 'object' && project.project_priority !== null && !Array.isArray(project.project_priority)) {
        // Try to get the name from the nested object
        if (project.project_priority.name) {
          return project.project_priority.name;
        }
        if (project.project_priority.label) {
          return project.project_priority.label;
        }
        if (project.project_priority.priority) {
          return project.project_priority.priority;
        }
        if (project.project_priority.projectPriority) {
          return project.project_priority.projectPriority;
        }
        
        // If nested object has an ID but no name, try to map it
        const nestedId = project.project_priority.id || project.project_priority.value;
        if (nestedId && this.projectPriorities && this.projectPriorities.length > 0) {
          const priority = this.projectPriorities.find(
            (p) => p.id === nestedId || 
                   p.value === nestedId || 
                   String(p.id) === String(nestedId)
          );
          if (priority && (priority.name || priority.label)) {
            return priority.name || priority.label;
          }
        }
      }
      // If it's a string (direct value), return it
      else if (typeof project.project_priority === 'string') {
        return project.project_priority;
      }
    }

    // Check for other possible field names
    if (project.projectPriority && typeof project.projectPriority === 'string') {
      return project.projectPriority;
    }
    
    if (project.priority && typeof project.priority === 'string') {
      return project.priority;
    }

    // Get the priority ID for mapping
    const priorityId = project.project_priority_id || 
                      project.projectPriorityId ||
                      project.priorityId ||
                      project.priority_id;
    
    // If we have an ID and dropdown data is loaded, try to map it
    if (priorityId && this.projectPriorities && this.projectPriorities.length > 0) {
      const priority = this.projectPriorities.find(
        (p) => p.id === priorityId || 
               p.value === priorityId || 
               String(p.id) === String(priorityId)
      );

      if (priority) {
        return priority.name || priority.label || priority.priority || String(priorityId);
      }
    }

    // Fallback: return the ID as string if available
    if (priorityId !== null && priorityId !== undefined) {
      return String(priorityId);
    }

    return "N/A";
  }

  getProjectStatus(project: any): string {
    // First, check if there's a nested project_status object with label
    if (project?.project_status?.label) {
      return project.project_status.label;
    }
    if (project?.project_status?.name) {
      return project.project_status.name;
    }
    
    // Get status ID from project
    const statusId = project?.project_status_id || 
                     project?.projectStatusId ||
                     project?.projectStatus ||
                     project?.project_status ||
                     project?.status;
    
    if (statusId === null || statusId === undefined || statusId === "") {
      return "N/A";
    }

    // If statusId is a string and not a number, return it
    if (typeof statusId === "string" && isNaN(Number(statusId))) {
      return statusId;
    }

    // Return the ID as string if not found in nested object
    return String(statusId);
  }

  getPaymentStatus(project: any): string {
    // First, check if there's a nested payment_status object with label
    if (project?.project_payment_status?.label) {
      return project.project_payment_status.label;
    }
    if (project?.project_payment_status?.name) {
      return project.project_payment_status.name;
    }
    
    // Get payment status ID from project
    const paymentStatusId = project?.project_payment_status_id || project?.payment_status_id;
    
    if (paymentStatusId === null || paymentStatusId === undefined || paymentStatusId === "") {
      return "N/A";
    }

    // If paymentStatusId is a string and not a number, return it
    if (typeof paymentStatusId === "string" && isNaN(Number(paymentStatusId))) {
      return paymentStatusId;
    }

    // Return the ID as string if not found in nested object
    return String(paymentStatusId);
  }

  getBadgeCount(project: any): number {
    // Return badge count if available (e.g., number of applicants, updates, etc.)
    return project.badge_count || project.applicant_count || project.update_count || 0;
  }
}

