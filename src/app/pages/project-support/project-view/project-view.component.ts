import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ProjectCreationService } from "../project-creation/project-creation.service";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { TableModule } from "primeng/table";
import { EditorModule } from "primeng/editor";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { environment } from "@env/environment";

@Component({
  selector: "app-project-view",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    TagModule,
    TableModule,
    EditorModule,
    DialogModule,
    InputTextModule
  ],
  templateUrl: "./project-view.component.html",
  styleUrls: ["./project-view.component.scss"],
})
export class ProjectViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectCreationService);
  private toast = inject(MessageService);
  private fb = inject(FormBuilder);

  projectId: number | null = null;
  project: any = null;
  isLoading: boolean = false;
  activeTab: string = "Information";

  // Dropdown data for mapping
  serviceTypes: any[] = [];
  freelancingTypes: any[] = [];
  projectPriorities: any[] = [];
  projectStatuses: any[] = [];

  // Transaction history data
  transactions: any[] = [];

  // Bank details
  isBankEditVisible: boolean = false;
  isLoadingBankDetails: boolean = false;
  isSavingBankDetails: boolean = false;
  private bankDetailsLoaded: boolean = false;

  bankDetailsForm = this.fb.group({
    account_holder_name: ["", Validators.required],
    bank_name: ["", Validators.required],
    account_number: ["", Validators.required],
    ifsc_code: ["", Validators.required],
    account_type: ["", Validators.required],
    upi_id: [""],
  });

  // Cached project images to avoid infinite loops
  projectImages: any[] = [];
  
  // Cached reference links to avoid infinite loops
  referenceLinks: string[] = [];

  // Internal documents data
  internalDocuments: any[] = [];

  // Project documents data
  projectDocuments: any[] = [];
  isLoadingDocuments: boolean = false;
  documentsTotal: number = 0;

  // Activity data
  activities: any[] = [];
  isLoadingActivities: boolean = false;
  expandedActivityId: number | null = null;
  
  // Activity pagination
  activitiesPage: number = 1;
  activitiesPerPage: number = 20;
  activitiesTotal: number = 0;
  hasMoreActivities: boolean = false;
  
  // Activity posting
  activityContent: string = "";
  activityTitle: string = "";
  activityAttachments: File[] = [];
  isPostingActivity: boolean = false;
  activityEditorOptions: any = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'align': [] }],
      ['link'],
    ],
    placeholder: 'Type your message...',
  };

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectId = params["id"] ? Number(params["id"]) : null;
      if (this.projectId) {
        this.loadProject();
        this.loadDropdowns();
      }
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
        }
      },
      error: (error) => {
        console.error("Error loading service types:", error);
      },
    });

    // Load freelancing types
    this.projectService.getFreelancingTypes().subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
          this.freelancingTypes = res;
        } else if (res?.data && Array.isArray(res.data)) {
          this.freelancingTypes = res.data;
        }
      },
      error: (error) => {
        console.error("Error loading freelancing types:", error);
      },
    });

    // Load project priorities
    this.projectService.getProjectPriorities().subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
          this.projectPriorities = res;
        } else if (res?.data && Array.isArray(res.data)) {
          this.projectPriorities = res.data;
        }
      },
      error: (error) => {
        console.error("Error loading project priorities:", error);
      },
    });

    // Load project statuses
    this.projectService.getProjectDropdowns('project_status').subscribe({
      next: (res) => {
        let statusesData: any[] = [];
        
        if (Array.isArray(res)) {
          statusesData = res;
        } else if (res?.data && Array.isArray(res.data)) {
          statusesData = res.data;
        } else if (res?.success && res?.data && Array.isArray(res.data)) {
          statusesData = res.data;
        }
        
        // Filter active items and sort by sort_order
        this.projectStatuses = statusesData
          .filter((item: any) => item.is_active === 1)
          .sort((a: any, b: any) => {
            const orderA = a.sort_order ?? 0;
            const orderB = b.sort_order ?? 0;
            return orderA - orderB;
          });
      },
      error: (error) => {
        console.error("Error loading project statuses:", error);
        this.projectStatuses = [];
      },
    });
  }

  loadProject(): void {
    if (!this.projectId) return;

    this.isLoading = true;
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (response) => {
        console.log("Project data:", response);
        
        if (response.status && response.data) {
          this.project = response.data;
        } else if (response.data) {
          this.project = response.data;
        } else {
          this.project = response;
        }
        
        // Cache project images and reference links to avoid infinite loops in template
        this.projectImages = this.getProjectImages();
        this.referenceLinks = this.getReferenceLinks();
        
        // Extract internal documents from response
        this.internalDocuments = this.project?.project_internal_documents || [];
        
        // Debug: Log project data to see structure (only once)
        console.log("=== Project Data Loaded ===");
        console.log("Project ID:", this.projectId);
        console.log("Project Name:", this.getProjectName());
        console.log("Cached Project Images Count:", this.projectImages.length);
        console.log("Cached Reference Links Count:", this.referenceLinks.length);
        if (this.projectImages.length > 0) {
          console.log("First cached image:", this.projectImages[0]);
          console.log("First image URL:", this.getImageUrl(this.projectImages[0]));
          console.log("First image name:", this.getImageName(this.projectImages[0], 0));
        }
        
        // Load transaction history
        this.loadTransactionHistory();
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading project:", error);
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load project details. Please try again.",
        });
        this.isLoading = false;
        // Navigate back to project list on error
        setTimeout(() => {
          this.router.navigate(["/pages/project-support"]);
        }, 2000);
      },
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    
    // Load documents when Documents tab is clicked
    if (tab === "Documents" && this.projectId && this.projectDocuments.length === 0 && !this.isLoadingDocuments) {
      this.loadProjectDocuments();
    }
    
    // Load activities when Activity tab is clicked
    if (tab === "Activity" && this.projectId && this.activities.length === 0 && !this.isLoadingActivities) {
      this.loadProjectActivities();
    }
    
    // Load bank details when Bank Details tab is clicked
    if (tab === "Bank Details" && this.projectId) {
      this.loadBankDetails();
    }
  }

  loadBankDetails(): void {
    if (!this.projectId || this.isLoadingBankDetails) return;
    if (this.bankDetailsLoaded) return;

    this.isLoadingBankDetails = true;

    this.projectService.getProjectBankDetails(this.projectId).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res;
        const bankDetails = data?.bank_details ?? data;

        this.project = this.project ?? {};
        this.project.bank_details = bankDetails ?? this.project.bank_details ?? {};

        this.bankDetailsLoaded = true;
        this.isLoadingBankDetails = false;
      },
      error: (error) => {
        console.error("Error loading bank details:", error);
        this.isLoadingBankDetails = false;
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load bank details.",
        });
      },
    });
  }

  openBankDetailsDialog(): void {
    if (!this.projectId) return;

    // Always refresh once before editing so dialog shows latest from backend
    this.isLoadingBankDetails = true;
    this.projectService.getProjectBankDetails(this.projectId).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res;
        const bankDetails = data?.bank_details ?? data;

        this.project = this.project ?? {};
        this.project.bank_details = bankDetails ?? this.project.bank_details ?? {};
        this.bankDetailsLoaded = true;

        const bd = this.project.bank_details ?? {};
        this.bankDetailsForm.reset({
          account_holder_name: bd.account_holder_name || "",
          bank_name: bd.bank_name || "",
          account_number: bd.account_number || "",
          ifsc_code: bd.ifsc_code || "",
          account_type: bd.account_type || "",
          upi_id: bd.upi_id || "",
        });

        this.isLoadingBankDetails = false;
        this.isBankEditVisible = true;
      },
      error: (error) => {
        console.error("Error loading bank details for edit:", error);
        this.isLoadingBankDetails = false;
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load bank details.",
        });
      },
    });
  }

  onBankEditCancel(): void {
    this.isBankEditVisible = false;
  }

  saveBankDetails(): void {
    if (!this.projectId) return;

    if (this.bankDetailsForm.invalid) {
      this.bankDetailsForm.markAllAsTouched();
      return;
    }

    const payload = this.bankDetailsForm.getRawValue();
    this.isSavingBankDetails = true;

    this.projectService.updateProjectBankDetails(this.projectId, payload).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res;
        const updated = data?.bank_details ?? payload;

        this.project = this.project ?? {};
        this.project.bank_details = updated;
        this.bankDetailsLoaded = true;

        this.toast.add({
          severity: "success",
          summary: "Saved",
          detail: "Bank details updated.",
        });

        this.isSavingBankDetails = false;
        this.isBankEditVisible = false;
      },
      error: (error) => {
        console.error("Error saving bank details:", error);
        this.isSavingBankDetails = false;
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to update bank details.",
        });
      },
    });
  }

  // Getter methods for display
  getProjectId(): string {
    return (
      this.project?.project_id?.toString() ||
      this.projectId?.toString() ||
      "N/A"
    );
  }

  getProjectName(): string {
    return (
      this.project?.projectName ||
      this.project?.project_name ||
      this.project?.name ||
      "N/A"
    );
  }

  getServiceType(): string {
    if (this.project?.service_type?.name) {
      return this.project.service_type.name;
    }
    if (this.project?.service_type?.label) {
      return this.project.service_type.label;
    }
    const serviceTypeId = this.project?.servicesType || this.project?.service_type;
    if (serviceTypeId) {
      const serviceType = this.serviceTypes.find(
        (st) => st.id === serviceTypeId || st.serviceTypeId === serviceTypeId
      );
      return serviceType?.name || serviceType?.label || String(serviceTypeId);
    }
    return "N/A";
  }

  getFreelancingType(): string {
    if (this.project?.freelancing_type?.name) {
      return this.project.freelancing_type.name;
    }
    if (this.project?.freelancing_type?.label) {
      return this.project.freelancing_type.label;
    }
    const freelancingTypeId =
      this.project?.freelancingType || this.project?.freelancing_type;
    if (freelancingTypeId) {
      const freelancingType = this.freelancingTypes.find(
        (ft) => ft.id === freelancingTypeId || ft.freelancingTypeId === freelancingTypeId
      );
      return (
        freelancingType?.name ||
        freelancingType?.label ||
        String(freelancingTypeId)
      );
    }
    return "N/A";
  }

  getProjectPriority(): string {
    if (this.project?.project_priority?.name) {
      return this.project.project_priority.name;
    }
    if (this.project?.project_priority?.label) {
      return this.project.project_priority.label;
    }
    const priorityId =
      this.project?.projectPriority || this.project?.project_priority;
    if (priorityId) {
      const priority = this.projectPriorities.find(
        (p) => p.id === priorityId || p.priorityId === priorityId
      );
      return priority?.name || priority?.label || String(priorityId);
    }
    return "N/A";
  }

  getProjectStatus(): string {
    // First, check if there's a nested project_status object with label/name
    if (this.project?.project_status?.label) {
      return this.project.project_status.label;
    }
    if (this.project?.project_status?.name) {
      return this.project.project_status.name;
    }
    
    // Get status ID from project - prioritize project_status_id
    const statusId =
      this.project?.project_status_id || this.project?.status_id;
    
    if (statusId === null || statusId === undefined || statusId === "") {
      return "N/A";
    }

    // Find status in dropdown data using ID
    if (this.projectStatuses && this.projectStatuses.length > 0) {
      const statusObj = this.projectStatuses.find(
        (status: any) => status.id === Number(statusId) || status.id === statusId
      );
      if (statusObj?.label) {
        return statusObj.label;
      }
      if (statusObj?.name) {
        return statusObj.name;
      }
    }

    // If not found in dropdown data, return the ID as string
    return String(statusId);
  }

  getStatusSeverity(): string {
    const status = this.getProjectStatus().toLowerCase();
    if (status === "in progress") return "success";
    if (status === "completed") return "info";
    if (status === "pending") return "warning";
    if (status === "cancelled") return "danger";
    return "secondary";
  }

  getQuotedBudget(): string {
    const assignment = this.project?.assignments?.[0];
    
    if (!assignment) {
      return "N/A";
    }

    const amount = assignment.employer_budget_amount;
    const currency = assignment.employer_budget_currency || this.project?.currency_code || "INR";

    if (amount === null || amount === undefined || amount === "") {
      return "N/A";
    }

    // Format the number with commas and 2 decimal places
    const formattedAmount = Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return `${currency} ${formattedAmount}`;
  }

  getBudgetRange(): string {
    // Check for budget_percentage first (for Success fee/outcome type)
    const budgetPercentage = 
      this.project?.budget_percentage || 
      this.project?.budgetPercentage;
    
    if (budgetPercentage !== null && budgetPercentage !== undefined && budgetPercentage !== "" && Number(budgetPercentage) > 0) {
      const percentage = Number(budgetPercentage);
      return `${percentage}%`;
    }
    
    // Otherwise, use budget_min and budget_max with currency
    const currency = 
      this.project?.currency_code || 
      "Rs.";
    
    // Handle string values like "0.00" by converting to number
    const minStr = 
      this.project?.budget_min || 
      "0";
    const maxStr = 
      this.project?.budget_max || 
      "0";
    
    const min = Number(minStr) || 0;
    const max = Number(maxStr) || 0;
    
    // If both are 0, return N/A
    if (min === 0 && max === 0) {
      return "N/A";
    }
    
    return `${currency} ${min.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - ${currency} ${max.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  getProjectStartDate(): string {
    const date = this.project?.project_start_date;
    if (!date) return "N/A";
    
    if (date instanceof Date) {
      return date.toLocaleDateString("en-GB");
    }
    
    // Try to parse date string
    const dateObj = new Date(date);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString("en-GB");
    }
    
    return String(date);
  }

  getProjectDescription(): string {
    return (
      this.project?.project_description ||
      ""
    );
  }

  getProjectRequirementDetails(): string {
    return (
      this.project?.project_requirement_details ||
      ""
    );
  }

  getProjectRemarks(): string {
    return (      
      this.project?.project_remarks ||
      ""
    );
  }

  getReferenceLinks(): string[] {
    if (!this.project) {
      return [];
    }

    // Check multiple possible field names
    let referenceLinks =  
      this.project?.reference_links;

    // If it's already an array
    if (Array.isArray(referenceLinks)) {
      return referenceLinks.filter((link: any) => link && typeof link === "string" && link.trim() !== "");
    }

    // If it's a string, try to parse as JSON
    if (typeof referenceLinks === "string") {
      try {
        const parsed = JSON.parse(referenceLinks);
        if (Array.isArray(parsed)) {
          return parsed.filter((link: any) => link && typeof link === "string" && link.trim() !== "");
        }
        if (parsed && typeof parsed === "string" && parsed.trim() !== "") {
          return [parsed];
        }
      } catch {
        // If not JSON, return as single item array if not empty
        if (referenceLinks.trim() !== "") {
          return [referenceLinks];
        }
      }
    }

    return [];
  }

  getProjectImages(): any[] {
    if (!this.project) {
      return [];
    }

    // Check project_image - it can be an array or a single object
    const projectLogo = this.project?.project_image;

    if (!projectLogo) {
      return [];
    }

    // If project_image is an array of objects
    if (Array.isArray(projectLogo)) {
      // Filter out null, undefined, and empty values
      return projectLogo.filter((img: any) => {
        console.log("img:", img);
        if (img === null || img === undefined || img === "") {
          return false;
        }
        // If it's an object, ensure it has some content (has path, url, or filename)
        if (typeof img === "object") {
          if (Object.keys(img).length === 0) {
            return false;
          }
          // Check if it has at least one of the expected properties
          if (img.path || img.url || img.filename) {
            return true;
          }
          return false;
        }
        return true;
      });
    }

    // If project_image is a single object with {path, url, filename}
    if (typeof projectLogo === "object" && !Array.isArray(projectLogo)) {
      // Check if it has the expected structure
      if (projectLogo.path || projectLogo.url || projectLogo.filename) {
        return [projectLogo];
      }
      return [];
    }

    // If it's a string (single image URL - fallback case)
    if (typeof projectLogo === "string" && projectLogo.trim() !== "") {
      return [{ url: projectLogo, path: projectLogo, filename: projectLogo.split('/').pop() || 'image.jpg' }];
    }

    return [];
  }

  getImageUrl(image: any): string {
    if (!image) {
      return "";
    }

    // Priority order: url (full URL) > path (relative path) > other fields
    // API returns objects with {path, url, filename} structure
    if (typeof image === "string") {
      // If it's already a string, check if it's a full URL
      if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
      }
      // If it's a relative path, prepend API URL
      const cleanPath = image.replace(/^\//, "");
      return `${environment.ApiUrlEmployer}/${cleanPath}`;
    }

    // If it's an object, check for url first (full URL from API)
    if (image?.url && typeof image.url === "string" && image.url.trim() !== "") {
      return image.url;
    }

    // If no url, check for path (relative path)
    if (image?.path && typeof image.path === "string" && image.path.trim() !== "") {
      const cleanPath = image.path.replace(/^\//, "");
      // If path doesn't start with storage, add it
      if (cleanPath.startsWith("storage/")) {
        return `${environment.ApiUrlEmployer}/${cleanPath}`;
      }
      return `${environment.ApiUrlEmployer}/storage/${cleanPath}`;
    }

    // Fallback to other possible field names
    const fallbackFields = [
      'image_url', 'image_path', 'file_path', 'file_url', 
      'logo_url', 'logo_path', 'project_image'
    ];

    for (const field of fallbackFields) {
      if (image?.[field] && typeof image[field] === "string" && image[field].trim() !== "") {
        const value = image[field];
        if (value.startsWith("http://") || value.startsWith("https://")) {
          return value;
        }
        const cleanPath = value.replace(/^\//, "");
        return `${environment.ApiUrlEmployer}/${cleanPath}`;
      }
    }

    return "";
  }

  getImageSize(image: any): string {
    if (image?.size) {
      const sizeInMB = image.size / (1024 * 1024);
      return `${sizeInMB.toFixed(1)} mb`;
    }
    return "N/A";
  }

  getImageName(image: any, index: number): string {
    // Priority order: filename > name > original_name > file_name > fallback
    if (image?.filename && typeof image.filename === "string") {
      return image.filename;
    }
    if (image?.name && typeof image.name === "string") {
      return image.name;
    }
    if (image?.original_name && typeof image.original_name === "string") {
      return image.original_name;
    }
    if (image?.file_name && typeof image.file_name === "string") {
      return image.file_name;
    }
    // Try to extract filename from path or url
    if (image?.path && typeof image.path === "string") {
      const pathParts = image.path.split('/');
      if (pathParts.length > 0) {
        return pathParts[pathParts.length - 1];
      }
    }
    if (image?.url && typeof image.url === "string") {
      const urlParts = image.url.split('/');
      if (urlParts.length > 0) {
        return urlParts[urlParts.length - 1];
      }
    }
    return `Image ${index + 1}`;
  }

  handleImageError(event: any): void {
    console.error("Image load error:", event);
    event.target.style.display = "none";
    // Optionally show a placeholder
    const container = event.target.parentElement;
    if (container) {
      container.innerHTML = '<div class="d-flex align-items-center justify-content-center h-100 text-muted"><i class="fas fa-image fa-2x"></i></div>';
    }
  }

  loadTransactionHistory(): void {
    // Check multiple possible field names for transactions
    this.transactions = 
      this.project?.transactions || 
      this.project?.transaction_history || 
      this.project?.transactionHistory ||
      this.project?.payments ||
      [];

    // If it's not an array, try to convert it
    if (!Array.isArray(this.transactions)) {
      if (typeof this.transactions === "string") {
        try {
          this.transactions = JSON.parse(this.transactions);
        } catch {
          this.transactions = [];
        }
      } else {
        this.transactions = [];
      }
    }

    console.log("Transaction history loaded:", this.transactions);
  }

  getTransactionDescription(transaction: any): string {
    return transaction?.description || 
           transaction?.transaction_description || 
           transaction?.note ||
           "N/A";
  }

  getTransactionId(transaction: any): string {
    return transaction?.transaction_id || 
           transaction?.transactionId || 
           transaction?.id ||
           transaction?.payment_id ||
           "N/A";
  }

  getPaymentDate(transaction: any): string {
    const date = transaction?.payment_date || 
                 transaction?.paymentDate || 
                 transaction?.date ||
                 transaction?.created_at ||
                 transaction?.createdAt;
    
    if (!date) return "N/A";
    
    if (date instanceof Date) {
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    }
    
    const dateObj = new Date(date);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    }
    
    return String(date);
  }

  getTransactionAmount(transaction: any): string {
    const amount = transaction?.amount || 
                   transaction?.total_amount ||
                   transaction?.totalAmount ||
                   0;
    
    const currency = transaction?.currency || 
                     transaction?.currency_code || 
                     transaction?.currencyCode ||
                     "INR";
    
    if (amount === 0 || amount === null || amount === undefined) {
      return `${currency} 0`;
    }
    
    return `${currency} ${Number(amount).toLocaleString("en-IN")}`;
  }

  getInvoiceUrl(transaction: any): string {
    return transaction?.invoice_url || 
           transaction?.invoiceUrl || 
           transaction?.invoice ||
           transaction?.invoice_path ||
           "";
  }

  viewInvoice(transaction: any): void {
    const invoiceUrl = this.getInvoiceUrl(transaction);
    if (invoiceUrl) {
      if (invoiceUrl.startsWith("http://") || invoiceUrl.startsWith("https://")) {
        window.open(invoiceUrl, "_blank");
      } else {
        const fullUrl = `${environment.ApiUrlEmployer}/${invoiceUrl.replace(/^\//, "")}`;
        window.open(fullUrl, "_blank");
      }
    } else {
      this.toast.add({
        severity: "info",
        summary: "Invoice",
        detail: "Invoice not available for this transaction.",
      });
    }
  }

  loadProjectDocuments(): void {
    if (!this.projectId) {
      return;
    }

    this.isLoadingDocuments = true;
    this.projectService.getProjectDocuments(this.projectId).subscribe({
      next: (response) => {
        console.log("Project documents response:", response);
        
        if (response.success && response.data && Array.isArray(response.data)) {
          this.projectDocuments = response.data;
          this.documentsTotal = response.total || 0;
          
          console.log("Documents loaded:", this.projectDocuments.length, "categories");
          console.log("Total documents:", this.documentsTotal);
        } else if (response.data && Array.isArray(response.data)) {
          this.projectDocuments = response.data;
          this.documentsTotal = response.total || response.data.length;
        } else {
          this.projectDocuments = [];
          this.documentsTotal = 0;
        }
        
        this.isLoadingDocuments = false;
      },
      error: (error) => {
        console.error("Error loading project documents:", error);
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load project documents. Please try again.",
        });
        this.isLoadingDocuments = false;
        this.projectDocuments = [];
        this.documentsTotal = 0;
      },
    });
  }

  downloadDocument(document: any): void {
    if (!document?.fileUrl) {
      this.toast.add({
        severity: "warn",
        summary: "Warning",
        detail: "Document URL not available.",
      });
      return;
    }

    const url = document.fileUrl;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      window.open(url, "_blank");
    } else {
      const fullUrl = `${environment.ApiUrlEmployer}/${url.replace(/^\//, "")}`;
      window.open(fullUrl, "_blank");
    }
  }

  getInternalDocIcon(doc: any): string {
    const ext = (doc.extension || doc.file_icon || "").toLowerCase();
    if (ext === "pdf") return "fa-file-pdf text-danger";
    if (["doc", "docx"].includes(ext)) return "fa-file-word text-primary";
    if (["xls", "xlsx"].includes(ext)) return "fa-file-excel text-success";
    return "fa-file-alt text-secondary";
  }

  downloadInternalDoc(doc: any): void {
    const url = doc.file_url || doc.url;
    if (url) {
      if (url.startsWith("http://") || url.startsWith("https://")) {
        window.open(url, "_blank");
      } else {
        const fullUrl = `${environment.ApiUrlEmployer}/${url.replace(/^\//, "")}`;
        window.open(fullUrl, "_blank");
      }
    } else {
      this.toast.add({
        severity: "warn",
        summary: "Warning",
        detail: "Internal document URL not available.",
      });
    }
  }

  getDocumentIcon(categoryKey: string): string {
    const iconMap: { [key: string]: string } = {
      proposal: "fa-file-alt",
      contract: "fa-file-contract",
      invoice: "fa-file-invoice",
      receipt: "fa-receipt",
      report: "fa-file-chart-line",
      other: "fa-file",
    };
    return iconMap[categoryKey?.toLowerCase()] || "fa-file";
  }

  loadProjectActivities(page: number = 1): void {
    if (!this.projectId) {
      return;
    }

    this.isLoadingActivities = true;
    this.activitiesPage = page;
    
    this.projectService.getProjectActivities(this.projectId, page, this.activitiesPerPage).subscribe({
      next: (response) => {
        console.log("Project activities response:", response);
        
        let activitiesData: any[] = [];
        
        if (response.success && response.data && Array.isArray(response.data)) {
          activitiesData = response.data;
          this.activitiesTotal = response.total || response.data.length;
        } else if (response.data && Array.isArray(response.data)) {
          activitiesData = response.data;
          this.activitiesTotal = response.total || response.data.length;
        } else if (Array.isArray(response)) {
          activitiesData = response;
          this.activitiesTotal = response.length;
        }
        
        // Map activities and add isExpanded property
        if (page === 1) {
          this.activities = activitiesData.map((activity: any) => ({
            ...activity,
            isExpanded: false
          }));
        } else {
          // Append to existing activities for pagination
          const newActivities = activitiesData.map((activity: any) => ({
            ...activity,
            isExpanded: false
          }));
          this.activities = [...this.activities, ...newActivities];
        }
        
        // Check if there are more activities to load
        this.hasMoreActivities = this.activities.length < this.activitiesTotal;
        
        this.isLoadingActivities = false;
      },
      error: (error) => {
        console.error("Error loading project activities:", error);
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: error?.error?.message || "Failed to load project activities. Please try again.",
        });
        this.isLoadingActivities = false;
        if (page === 1) {
          this.activities = [];
        }
      },
    });
  }

  loadMoreActivities(): void {
    if (!this.isLoadingActivities && this.hasMoreActivities) {
      this.loadProjectActivities(this.activitiesPage + 1);
    }
  }

  toggleActivity(activityId: number): void {
    const activity = this.activities.find(a => a.id === activityId);
    if (activity) {
      activity.isExpanded = !activity.isExpanded;
      this.expandedActivityId = activity.isExpanded ? activityId : null;
    }
  }

  postActivity(): void {
    if (!this.projectId) {
      return;
    }

    // Extract plain text from HTML for title and description
    const plainText = this.stripHtml(this.activityContent);
    
    if (!plainText || plainText.trim() === "") {
      this.toast.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please enter activity content before posting.",
      });
      return;
    }

    // Extract title (first line or first 50 characters)
    const titleText = plainText.split('\n')[0].trim();
    const activityTitle = titleText.length > 50 
      ? titleText.substring(0, 50) + '...' 
      : titleText || 'Activity Update';

    // Use full content as description
    const activityDescription = this.activityContent;

    this.isPostingActivity = true;
    this.projectService.createProjectActivity(
      this.projectId, 
      activityTitle, 
      activityDescription, 
      this.activityAttachments
    ).subscribe({
      next: (response) => {
        console.log("Activity created successfully:", response);
        
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: response.message || "Activity posted successfully",
        });
        
        // Clear form
        this.activityContent = "";
        this.activityTitle = "";
        this.activityAttachments = [];
        
        // Reload activities from first page
        this.loadProjectActivities(1);
        
        this.isPostingActivity = false;
      },
      error: (error) => {
        console.error("Error posting activity:", error);
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: error?.error?.message || "Failed to post activity. Please try again.",
        });
        this.isPostingActivity = false;
      },
    });
  }

  stripHtml(html: string): string {
    if (!html) return "";
    // Create a temporary DOM element to extract text
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  onActivityAttachmentChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const newFiles = Array.from(input.files);
      this.activityAttachments = [...this.activityAttachments, ...newFiles];
      
      // Reset input to allow selecting the same file again
      if (input) {
        input.value = '';
      }
    }
  }

  removeActivityAttachment(index: number): void {
    this.activityAttachments.splice(index, 1);
  }

  getActivityStatusSeverity(status: string): string {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("progress")) return "info";
    if (statusLower.includes("complete") || statusLower.includes("completed")) return "success";
    if (statusLower.includes("pending")) return "warning";
    if (statusLower.includes("cancel") || statusLower.includes("cancelled")) return "danger";
    return "secondary";
  }

  getActivityStatusColor(status: string): string {
    if (!status) return "#28a745"; // Default green
    
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes("progress") || statusLower.includes("in progress")) {
      return "#28a745"; // Green
    } else if (statusLower.includes("completed") || statusLower.includes("done")) {
      return "#007bff"; // Blue
    } else if (statusLower.includes("pending") || statusLower.includes("waiting")) {
      return "#ffc107"; // Yellow/Orange
    } else if (statusLower.includes("cancelled") || statusLower.includes("cancelled")) {
      return "#dc3545"; // Red
    }
    
    return "#28a745"; // Default green
  }

  // Helper method to get activity preview (truncated HTML)
  getActivityPreview(content: string, maxLength: number = 150): string {
    if (!content) return '';
    
    // Strip HTML tags for length calculation
    const plainText = this.stripHtml(content);
    
    if (plainText.length <= maxLength) {
      return content;
    }
    
    // Truncate and add ellipsis
    const truncated = plainText.substring(0, maxLength) + '...';
    return truncated;
  }

  // Helper method to extract date from createdAtFormatted
  getActivityDate(dateTimeString: string): string {
    if (!dateTimeString) return 'dd/mm/yyyy';
    
    // If it's already formatted like "16/01/26 2:29pm"
    if (dateTimeString.includes('/')) {
      const parts = dateTimeString.split(' ');
      if (parts.length > 0) {
        // Convert "16/01/26" to "16/01/2026" or keep as is
        const datePart = parts[0];
        // If it's in format "dd/mm/yy", convert to "dd/mm/yyyy"
        if (datePart.match(/^\d{2}\/\d{2}\/\d{2}$/)) {
          const [day, month, year] = datePart.split('/');
          return `${day}/${month}/20${year}`;
        }
        return datePart;
      }
    }
    
    // If it's a full datetime string like "2026-01-16 14:29:51"
    try {
      const date = new Date(dateTimeString);
      if (!isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
    } catch (e) {
      console.error('Error parsing date:', e);
    }
    
    return 'dd/mm/yyyy';
  }

  // Helper method to extract time from createdAtFormatted
  getActivityTime(dateTimeString: string): string {
    if (!dateTimeString) return '12:00 pm';
    
    // If it's already formatted like "16/01/26 2:29pm"
    if (dateTimeString.includes(' ')) {
      const parts = dateTimeString.split(' ');
      if (parts.length > 1) {
        return parts[1]; // Return "2:29pm"
      }
    }
    
    // If it's a full datetime string like "2026-01-16 14:29:51"
    try {
      const date = new Date(dateTimeString);
      if (!isNaN(date.getTime())) {
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        return `${hours}:${minutes} ${ampm}`;
      }
    } catch (e) {
      console.error('Error parsing time:', e);
    }
    
    return '12:00 pm';
  }

  truncateText(text: string, maxLength: number = 150): string {
    if (!text) return "";
    // Remove HTML tags for truncation
    const plainText = text.replace(/<[^>]*>/g, "");
    if (plainText.length <= maxLength) return text;
    return plainText.substring(0, maxLength) + "...";
  }

  downloadAttachment(attachment: any): void {
    if (!attachment?.fileUrl && !attachment?.url) {
      this.toast.add({
        severity: "warn",
        summary: "Warning",
        detail: "Attachment URL not available.",
      });
      return;
    }

    const url = attachment.fileUrl || attachment.url;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      window.open(url, "_blank");
    } else {
      const fullUrl = `${environment.ApiUrlEmployer}/${url.replace(/^\//, "")}`;
      window.open(fullUrl, "_blank");
    }
  }
}

