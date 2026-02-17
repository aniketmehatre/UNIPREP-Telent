import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
  AbstractControl,
  FormControl,
  ValidatorFn,
  FormsModule,
  ValidationErrors,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { Router, RouterModule } from "@angular/router";
import { SelectModule } from "primeng/select";
//import { CompanyProfileService } from "./company-profile.service";
import { finalize, forkJoin, Observable } from "rxjs";
import { MultiSelectModule } from "primeng/multiselect";
import { DatePickerModule } from "primeng/datepicker";
import { ProgressBarModule } from "primeng/progressbar";
//import { ProfileDetailsComponent } from "./profile-details/profile-details.component";
import { AvatarModule } from "primeng/avatar";
import { AvatarGroupModule } from "primeng/avatargroup";
import { ConfirmationService, MessageService } from "primeng/api";
import { FluidModule } from "primeng/fluid";
import { InputTextModule } from "primeng/inputtext";
import { EditorModule } from "primeng/editor";
import { GetuserdetailsService } from "src/app/getuserdetails.service";
import { PercentageLoaderComponent } from "src/app/components/percentage-loader/percentage-loader.component";
//import { PromptService } from "../prompt.service";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { InputGroupModule } from "primeng/inputgroup";
import { PageFacadeService } from "../../page-facade.service";
import { ProjectCreationService } from "./project-creation.service";

@Component({
  selector: "app-project-creation",
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ButtonModule,
    DatePickerModule,
    SelectModule
  ],
  templateUrl: "./project-creation.component.html",
  styleUrls: ["./project-creation.component.scss"],
})
export class ProjectCreationComponent implements OnInit, OnDestroy {
    [x: string]: any;
    
  private pageFacade = inject(PageFacadeService)
  projectForm!: FormGroup;
  selectedImages: File[] = [];
  selectedDocuments: File[] = [];
  imagePreviews: string[] = []; // Array to hold multiple image previews
  
  // Dropdown data
  serviceTypes: any[] = [];
  freelancingTypes: any[] = [];
  projectPriorities: any[] = [];
  currencies: any[] = [];
  isLoadingDropdowns: boolean = false;
  
  // Date picker minimum date (today)
  minDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private toast: MessageService,
    private projectService: ProjectCreationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      projectName: ["", [Validators.required, this.maxWordsValidator(20)]],
      projectDescription: ["", [Validators.required, this.maxWordsValidator(200)]],
      projectRequirementDetails: ["", Validators.required],
      servicesType: ["", Validators.required],
      freelancingType: ["", Validators.required],
      budgetCurrency: ["", Validators.required],
      budgetMin: [0, [Validators.required, Validators.min(1)]],
      budgetMax: [0, [Validators.required, Validators.min(1)]],
      budgetPercentage: [0, [Validators.min(0), Validators.max(100)]],
      projectPriority: ["", Validators.required],
      projectStartDate: ["", Validators.required],
      projectRemarks: [""],
      referenceLinks: this.fb.array([this.createReferenceLinkForm()]),
    });

    // Subscribe to freelancing type changes to update budget field requirements
    this.projectForm.get("freelancingType")?.valueChanges.subscribe((value) => {
      this['updateBudgetFieldValidation'](value);
    });

    // Subscribe to budget changes to validate min < max
    this.projectForm.get("budgetMin")?.valueChanges.subscribe(() => {
      this.projectForm.get("budgetMax")?.updateValueAndValidity();
    });

    this.projectForm.get("budgetMax")?.valueChanges.subscribe(() => {
      const min = this.projectForm.get("budgetMin")?.value;
      const max = this.projectForm.get("budgetMax")?.value;
      const budgetMaxControl = this.projectForm.get("budgetMax");
      if (min && max && min >= max) {
        budgetMaxControl?.setErrors({ minGreaterThanMax: true });
      } else if (budgetMaxControl?.hasError("minGreaterThanMax")) {
        const currentErrors = budgetMaxControl.errors;
        if (currentErrors) {
          const { minGreaterThanMax, ...otherErrors } = currentErrors;
          const hasOtherErrors = Object.keys(otherErrors).length > 0;
          budgetMaxControl.setErrors(hasOtherErrors ? otherErrors : null);
          budgetMaxControl.updateValueAndValidity({ emitEvent: false });
        }
      }
    });

    // Load dropdown data
    this.loadDropdowns();
  }

  // Word count validator for plain text (not HTML)
  maxWordsValidator = (maxWords: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const text = String(control.value).trim();
      if (text === "") {
        return null;
      }
      
      // Count words - split by whitespace and filter out empty strings
      const words = text.split(/\s+/).filter(word => word.length > 0);
      const wordCount = words.length;
      
      if (wordCount > maxWords) {
        return {
          maxWords: {
            actual: wordCount,
            max: maxWords
          }
        };
      }
      
      return null;
    };
  };

  // Get word count for a given text
  getWordCount(text: string | null | undefined): number {
    if (!text) {
      return 0;
    }
    const trimmed = String(text).trim();
    if (trimmed === "") {
      return 0;
    }
    const words = trimmed.split(/\s+/).filter(word => word.length > 0);
    return words.length;
  }

  loadDropdowns(): void {
    this.isLoadingDropdowns = true;
    
    // Option 1: Load all dropdowns at once using getDropdownData (if API exists)
    // Uncomment below if projectcreationdropdownlist API is available
    /*
    this.projectService.getDropdownData().subscribe({
      next: (res) => {
        // Handle response structure - adjust based on actual API response
        if (res?.serviceTypes) {
          this.serviceTypes = res.serviceTypes;
        } else if (res?.data?.serviceTypes) {
          this.serviceTypes = res.data.serviceTypes;
        }
        
        if (res?.freelancingTypes) {
          this.freelancingTypes = res.freelancingTypes;
        } else if (res?.data?.freelancingTypes) {
          this.freelancingTypes = res.data.freelancingTypes;
        }
        
        if (res?.projectPriorities) {
          this.projectPriorities = res.projectPriorities;
        } else if (res?.data?.projectPriorities) {
          this.projectPriorities = res.data.projectPriorities;
        }
        
        this.isLoadingDropdowns = false;
      },
      error: (error) => {
        console.error('Error loading dropdown data:', error);
        this.isLoadingDropdowns = false;
        // Fallback: Load individual dropdowns if getDropdownData fails
        this.loadIndividualDropdowns();
      }
    });
    */
    
    // Option 2: Load individual dropdowns (currently active)
    // Use this if projectcreationdropdownlist API is not available
    this.loadIndividualDropdowns();
  }

  // Method to load dropdowns individually
  loadIndividualDropdowns(): void {
    let completedRequests = 0;
    const totalRequests = 4;

    // Load service types
    this.projectService.getServiceTypes().subscribe({
      next: (res) => {
        console.log('Service Types API Response:', res);
        
        let serviceTypesData: any[] = [];
        
        if (Array.isArray(res)) {
          serviceTypesData = res;
        } else if (res?.data && Array.isArray(res.data)) {
          serviceTypesData = res.data;
        } else if (res?.serviceTypes && Array.isArray(res.serviceTypes)) {
          serviceTypesData = res.serviceTypes;
        } else if (res?.success && res?.data && Array.isArray(res.data)) {
          serviceTypesData = res.data;
        } else if (res?.data?.serviceTypes && Array.isArray(res.data.serviceTypes)) {
          serviceTypesData = res.data.serviceTypes;
        } else {
          console.warn('Service Types: Unexpected response structure', res);
          serviceTypesData = [];
        }
        
        // Filter active items, sort by sort_order, and transform for PrimeNG Select
        this.serviceTypes = serviceTypesData
          .filter((item: any) => item.is_active === 1)
          .sort((a: any, b: any) => {
            const orderA = a.sort_order ?? 0;
            const orderB = b.sort_order ?? 0;
            return orderA - orderB;
          })
          .map((item: any) => ({
            id: item.id,
            label: item.label || item.name || String(item.id),
            value: item.id
          }));
        
        console.log('Service Types loaded:', this.serviceTypes.length, this.serviceTypes);
        completedRequests++;
        if (completedRequests === totalRequests) {
          this.isLoadingDropdowns = false;
        }
      },
      error: (error) => {
        console.error('Error loading service types:', error);
        this.serviceTypes = [];
        completedRequests++;
        if (completedRequests === totalRequests) {
          this.isLoadingDropdowns = false;
        }
      }
    });

    // Load freelancing types
    this.projectService.getFreelancingTypes().subscribe({
      next: (res) => {
        console.log('Freelancing Types API Response:', res);
        
        if (Array.isArray(res)) {
          this.freelancingTypes = res;
        } else if (res?.data && Array.isArray(res.data)) {
          this.freelancingTypes = res.data;
        } else if (res?.freelancingTypes && Array.isArray(res.freelancingTypes)) {
          this.freelancingTypes = res.freelancingTypes;
        } else if (res?.success && res?.data && Array.isArray(res.data)) {
          this.freelancingTypes = res.data;
        } else if (res?.data?.freelancingTypes && Array.isArray(res.data.freelancingTypes)) {
          this.freelancingTypes = res.data.freelancingTypes;
        } else {
          console.warn('Freelancing Types: Unexpected response structure', res);
          this.freelancingTypes = [];
        }
        
        console.log('Freelancing Types loaded:', this.freelancingTypes.length, this.freelancingTypes);
        completedRequests++;
        if (completedRequests === totalRequests) {
          this.isLoadingDropdowns = false;
        }
      },
      error: (error) => {
        console.error('Error loading freelancing types:', error);
        this.freelancingTypes = [];
        completedRequests++;
        if (completedRequests === totalRequests) {
          this.isLoadingDropdowns = false;
        }
      }
    });

    // Load project priorities
    this.projectService.getProjectPriorities().subscribe({
      next: (res) => {
        console.log('Project Priorities API Response:', res);
        
        if (Array.isArray(res)) {
          this.projectPriorities = res;
        } else if (res?.data && Array.isArray(res.data)) {
          this.projectPriorities = res.data;
        } else if (res?.projectPriorities && Array.isArray(res.projectPriorities)) {
          this.projectPriorities = res.projectPriorities;
        } else if (res?.success && res?.data && Array.isArray(res.data)) {
          this.projectPriorities = res.data;
        } else if (res?.data?.projectPriorities && Array.isArray(res.data.projectPriorities)) {
          this.projectPriorities = res.data.projectPriorities;
        } else {
          console.warn('Project Priorities: Unexpected response structure', res);
          this.projectPriorities = [];
        }
        
        console.log('Project Priorities loaded:', this.projectPriorities.length, this.projectPriorities);
        completedRequests++;
        if (completedRequests === totalRequests) {
          this.isLoadingDropdowns = false;
        }
      },
      error: (error) => {
        console.error('Error loading project priorities:', error);
        this.projectPriorities = [];
        completedRequests++;
        if (completedRequests === totalRequests) {
          this.isLoadingDropdowns = false;
        }
      }
    });

    // Load currencies
    this.projectService.getCurrencyList().subscribe({
      next: (res) => {
        console.log('Currencies API Response:', res);
        
        let currencyData: any[] = [];
        
        if (Array.isArray(res)) {
          currencyData = res;
        } else if (res?.data && Array.isArray(res.data)) {
          currencyData = res.data;
        } else if (res?.success && res?.data && Array.isArray(res.data)) {
          currencyData = res.data;
        } else {
          console.warn('Currencies: Unexpected response structure', res);
          currencyData = [];
        }
        
        // Transform for PrimeNG Select: use currency_symbol for both label and value
        this.currencies = currencyData.map((item: any) => ({
          label: item.currency_symbol || item.symbol || String(item.id),
          value: item.currency_symbol || item.symbol || String(item.id)
        }));
        
        console.log('Currencies loaded:', this.currencies.length, this.currencies);
        completedRequests++;
        if (completedRequests === totalRequests) {
          this.isLoadingDropdowns = false;
        }
      },
      error: (error) => {
        console.error('Error loading currencies:', error);
        this.currencies = [];
        completedRequests++;
        if (completedRequests === totalRequests) {
          this.isLoadingDropdowns = false;
        }
      }
    });
  }

  /**
   * Helper methods for dropdown value and label extraction
   */
  getServiceTypeValue = (serviceType: any): any => {
    return serviceType?.value || serviceType?.id || serviceType?.serviceType || serviceType?.service_type || serviceType;
  }

  getServiceTypeLabel = (serviceType: any): string => {
    return serviceType?.label || serviceType?.name || serviceType?.serviceType || serviceType?.service_type || String(serviceType || '');
  }

  getFreelancingTypeValue = (freelancingType: any): any => {
    return freelancingType?.value || freelancingType?.id || freelancingType?.freelancingType || freelancingType?.freelancing_type || freelancingType;
  }

  getFreelancingTypeLabel = (freelancingType: any): string => {
    return freelancingType?.label || freelancingType?.name || freelancingType?.freelancingType || freelancingType?.freelancing_type || String(freelancingType || '');
  }

  getPriorityValue = (priority: any): any => {
    return priority?.value || priority?.id || priority?.priority || priority?.project_priority || priority;
  }

  getPriorityLabel = (priority: any): string => {
    return priority?.label || priority?.name || priority?.priority || priority?.project_priority || String(priority || '');
  }

  trackByServiceType = (index: number, item: any): any => {
    return this['getServiceTypeValue'](item) || index;
  }

  trackByFreelancingType = (index: number, item: any): any => {
    return this['getFreelancingTypeValue'](item) || index;
  }

  trackByPriority = (index: number, item: any): any => {
    return this['getPriorityValue'](item) || index;
  }

  urlValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || control.value.trim() === "") {
      return null; // Optional field
    }
    
    let urlToValidate = control.value.trim();
    
    // If URL doesn't start with http:// or https://, try adding https://
    if (!urlToValidate.match(/^https?:\/\//i)) {
      urlToValidate = "https://" + urlToValidate;
    }
    
    try {
      new URL(urlToValidate);
      return null;
    } catch {
      return { invalidUrl: true };
    }
  };

  submit(): void {
    // Mark all form controls as touched
    this.projectForm.markAllAsTouched();
    
    // Mark all reference link controls as touched
    this.referenceLinksFormArray.controls.forEach((control) => {
      control.markAllAsTouched();
    });

    if (this.projectForm.invalid) {
      // Check for specific validation errors
      let errorMessage = "Please fill all required fields correctly before submitting.";
      
      const budgetMaxError = this.projectForm.get("budgetMax")?.errors;
      if (budgetMaxError?.["minGreaterThanMax"]) {
        errorMessage = "Maximum budget must be greater than minimum budget.";
      }
      
      // Check for reference links validation errors
      const referenceLinksArray = this.referenceLinksFormArray;
      const hasInvalidReferenceLink = referenceLinksArray.controls.some(
        (control) => {
          const urlControl = (control as FormGroup).get("url");
          return urlControl?.invalid && urlControl?.touched;
        }
      );
      if (hasInvalidReferenceLink) {
        errorMessage = "Please enter valid URLs for all reference links.";
      }

      this.toast.add({
        severity: "warn",
        summary: "Validation Error",
        detail: errorMessage,
      });
      return;
    }

    // Process reference links - filter out empty URLs and normalize them
    // Ensure we always have an array, even if FormArray is empty
    const referenceLinksFormValue = this.referenceLinksFormArray?.value || [];
    const referenceLinks = Array.isArray(referenceLinksFormValue)
      ? referenceLinksFormValue
          .map((link: { url: string }) => {
            if (!link || !link.url || link.url.trim() === "") {
              return null;
            }
            let normalizedUrl = link.url.trim();
            // Add https:// if protocol is missing
            if (!normalizedUrl.match(/^https?:\/\//i)) {
              normalizedUrl = "https://" + normalizedUrl;
            }
            return normalizedUrl;
          })
          .filter((url: string | null) => url !== null) as string[]
      : [];

    // Format date if it's a Date object
    let projectStartDate = this.projectForm.value.projectStartDate;
    if (projectStartDate instanceof Date) {
      // Format as YYYY-MM-DD for backend
      projectStartDate = projectStartDate.toISOString().split('T')[0];
    }

    // Ensure images and documents are File objects
    const imagesToUpload = this.selectedImages.filter(img => img instanceof File);
    const documentsToUpload = this.selectedDocuments.filter(doc => doc instanceof File);
    
    console.log('=== File Upload Validation ===');
    console.log('Selected Images Count:', this.selectedImages.length);
    console.log('Valid Images Count:', imagesToUpload.length);
    console.log('Selected Documents Count:', this.selectedDocuments.length);
    console.log('Valid Documents Count:', documentsToUpload.length);
    
    if (this.selectedImages.length > 0 && imagesToUpload.length === 0) {
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: "Selected images are not valid files. Please re-upload them.",
      });
      return;
    }
    
    if (this.selectedDocuments.length > 0 && documentsToUpload.length === 0) {
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: "Selected documents are not valid files. Please re-upload them.",
      });
      return;
    }
    
    // Handle budget based on freelancing type
    const isSuccessFee = this['isSuccessFeeType']();
    
    // Build payload with snake_case field names for backend
    const payload: any = {
      project_name: this.projectForm.get("projectName")?.value || "",
      project_description: this.projectForm.get("projectDescription")?.value || "",
      project_requirement_details: this.projectForm.get("projectRequirementDetails")?.value || "",
      services_type: this.projectForm.get("servicesType")?.value || "",
      freelancing_type: this.projectForm.get("freelancingType")?.value || "",
      project_priority: this.projectForm.get("projectPriority")?.value || "",
      project_start_date: projectStartDate,
      project_remarks: this.projectForm.get("projectRemarks")?.value || "",
      reference_links: referenceLinks || [], // Always ensure it's an array, even if empty
      images: imagesToUpload,
      documents: documentsToUpload,
    };
    
    // Handle budget fields based on freelancing type
    if (isSuccessFee) {
      // For Success fee/outcome, use percentage
      payload.budget_percentage = this.projectForm.get("budgetPercentage")?.value || 0;
      payload.budget_currency = "";
      payload.budget_min = 0;
      payload.budget_max = 0;
    } else {
      // For regular budget, use currency and min/max
      payload.budget_currency = this.projectForm.get("budgetCurrency")?.value || "";
      payload.budget_min = this.projectForm.get("budgetMin")?.value || 0;
      payload.budget_max = this.projectForm.get("budgetMax")?.value || 0;
      payload.budget_percentage = 0;
    }

    // Validate that images are File objects
    if (imagesToUpload.length > 0) {
      console.log('=== Images to Upload ===');
      imagesToUpload.forEach((img, index) => {
        console.log(`Image ${index + 1}:`, {
          name: img.name,
          size: img.size,
          type: img.type,
          lastModified: img.lastModified,
          isFile: img instanceof File
        });
      });
    } else {
      console.log('No images to upload');
    }
    
    // Validate that documents are File objects
    if (documentsToUpload.length > 0) {
      console.log('=== Documents to Upload ===');
      documentsToUpload.forEach((doc, index) => {
        console.log(`Document ${index + 1}:`, {
          name: doc.name,
          size: doc.size,
          type: doc.type,
          lastModified: doc.lastModified,
          isFile: doc instanceof File
        });
      });
    } else {
      console.log('No documents to upload');
    }
    
    console.log('=== Final Payload Summary ===');
    console.log('Project Name:', payload.project_name);
    console.log('Services Type:', payload.services_type);
    console.log('Freelancing Type:', payload.freelancing_type);
    console.log('Budget Currency:', payload.budget_currency);
    console.log('Budget Min:', payload.budget_min);
    console.log('Budget Max:', payload.budget_max);
    console.log('Budget Percentage:', payload.budget_percentage);
    console.log('Images Count:', payload.images?.length || 0);
    console.log('Documents Count:', payload.documents?.length || 0);
    console.log('Reference Links Count:', payload.reference_links?.length || 0);
    console.log('Has Images:', payload.images && payload.images.length > 0);
    console.log('Has Documents:', payload.documents && payload.documents.length > 0);

    // Validate files are present before submission
    if (imagesToUpload.length > 0 || documentsToUpload.length > 0) {
      console.log('=== Files are ready for upload ===');
      console.log(`Images: ${imagesToUpload.length}, Documents: ${documentsToUpload.length}`);
    } else {
      console.log('=== No files to upload (this is OK if user didn\'t select any) ===');
    }

    // Call the service to create project
    this.projectService.createProject(payload).subscribe({
      next: (response) => {
        console.log('=== Project Creation Response ===');
        console.log('Response:', response);
        
        this.toast.add({
          severity: "success",
          summary: "Success",
          detail: response.message || "Project created successfully",
        });
        
        // Reset form after successful submission
        this.projectForm.reset();
        // Clean up image previews
        this.removeSelectedImages();
        this.selectedDocuments = [];
        
        // Navigate to project list page after successful creation
        setTimeout(() => {
          this.router.navigate(["/pages/project-support"]);
        }, 1000); // Small delay to show success message
      },
      error: (error) => {
        console.error('Error creating project:', error);
        
        // Check if it's a 401 error - this means authentication issue
        if (error?.status === 401) {
          this.toast.add({
            severity: "error",
            summary: "Authentication Error",
            detail: "Your session has expired. Please login again.",
          });
          // Don't manually navigate - let the interceptor handle it
          return;
        }
        
        // Check if it's a 404 error - API endpoint doesn't exist
        if (error?.status === 404) {
          this.toast.add({
            severity: "error",
            summary: "API Error",
            detail: "The create project API endpoint is not available. Please contact support.",
          });
          return;
        }
        
        // Check if it's a 500 error - server error
        if (error?.status === 500) {
          this.toast.add({
            severity: "error",
            summary: "Server Error",
            detail: "Server error occurred. Please try again later.",
          });
          return;
        }
        
        // Generic error handling
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: error?.error?.message || error?.message || "Failed to create project. Please try again.",
        });
      }
    });
  }

  onImagesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const newFiles = Array.from(input.files);
      console.log('New images selected:', newFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));
      
      // Filter only image files
      const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
      if (imageFiles.length !== newFiles.length) {
        this.toast.add({
          severity: "warn",
          summary: "Warning",
          detail: `${newFiles.length - imageFiles.length} non-image file(s) were ignored.`,
        });
      }
      
      // Add new image files to existing ones
      this.selectedImages = [...this.selectedImages, ...imageFiles];
      
      // Create previews for new images
      imageFiles.forEach((file) => {
        this.imagePreviews.push(URL.createObjectURL(file));
      });
      
      console.log('Total images after selection:', this.selectedImages.length);
      console.log('Image previews count:', this.imagePreviews.length);
    }
    
    // Reset input to allow selecting the same file again
    if (input) {
      input.value = '';
    }
  }

  removeImage(index: number) {
    // Revoke object URL to prevent memory leaks
    if (this.imagePreviews[index]) {
      URL.revokeObjectURL(this.imagePreviews[index]);
    }
    // Remove from both arrays
    this.imagePreviews.splice(index, 1);
    this.selectedImages.splice(index, 1);
  }

  onDocumentsChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const newFiles = Array.from(input.files);
      console.log('New documents selected:', newFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));
      
      // Add new files to existing ones (support multiple uploads)
      this.selectedDocuments = [...this.selectedDocuments, ...newFiles];
      
      console.log('Total documents after selection:', this.selectedDocuments.length);
    }
    // Reset input to allow selecting the same file again
    if (input) {
      input.value = '';
    }
  }

  removeDocument(index: number) {
    this.selectedDocuments.splice(index, 1);
  }

  removeAllDocuments() {
    this.selectedDocuments = [];
  }

  removeSelectedImages() {
    // Revoke all object URLs to prevent memory leaks
    this.imagePreviews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });
    this.selectedImages = [];
    this.imagePreviews = [];
  }
  // Reference Links FormArray methods
  get referenceLinksFormArray(): FormArray {
    return this.projectForm.get("referenceLinks") as FormArray;
  }

  createReferenceLinkForm(): FormGroup {
    return this.fb.group({
      url: ["", this.urlValidator],
    });
  }

  addReferenceLink(): void {
    this.referenceLinksFormArray.push(this.createReferenceLinkForm());
  }

  removeReferenceLink(index: number): void {
    if (this.referenceLinksFormArray.length > 1) {
      this.referenceLinksFormArray.removeAt(index);
    } else {
      this.toast.add({
        severity: "warn",
        summary: "Warning",
        detail: "At least one reference link field is required",
      });
    }
  }

  getReferenceLinkForm(index: number): FormGroup {
    return this.referenceLinksFormArray.at(index) as FormGroup;
  }

  /**
   * Check if selected freelancing type is "Success fee/outcome"
   */
  isSuccessFeeType = (): boolean => {
    const selectedType = this.projectForm.get("freelancingType")?.value;
    if (!selectedType) return false;

    // Check against the selected value or find in freelancingTypes array
    const selectedTypeLower = String(selectedType).toLowerCase();
    if (selectedTypeLower.includes("success") && (selectedTypeLower.includes("fee") || selectedTypeLower.includes("outcome"))) {
      return true;
    }

    // Also check in the freelancingTypes array
    const typeObj = this.freelancingTypes.find(
      (type) =>
        (type.value || type.id || type.freelancingType || type) == selectedType
    );
    if (typeObj) {
      const label = (typeObj.label || typeObj.name || typeObj.freelancingType || "").toLowerCase();
      return label.includes("success") && (label.includes("fee") || label.includes("outcome"));
    }

    return false;
  }

  /**
   * Update budget field validation based on freelancing type
   */
  updateBudgetFieldValidation = (freelancingType: string): void => {
    const isSuccessFee = this['isSuccessFeeType']();
    const budgetCurrency = this.projectForm.get("budgetCurrency");
    const budgetMin = this.projectForm.get("budgetMin");
    const budgetMax = this.projectForm.get("budgetMax");
    const budgetPercentage = this.projectForm.get("budgetPercentage");

    if (isSuccessFee) {
      // For Success fee/outcome: percentage is required, currency/min/max are not
      budgetCurrency?.clearValidators();
      budgetCurrency?.updateValueAndValidity();
      budgetMin?.clearValidators();
      budgetMin?.updateValueAndValidity();
      budgetMax?.clearValidators();
      budgetMax?.updateValueAndValidity();
      budgetPercentage?.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      budgetPercentage?.updateValueAndValidity();
    } else {
      // For other types: currency/min/max are required, percentage is not
      budgetCurrency?.setValidators([Validators.required]);
      budgetCurrency?.updateValueAndValidity();
      budgetMin?.setValidators([Validators.required, Validators.min(1)]);
      budgetMin?.updateValueAndValidity();
      budgetMax?.setValidators([Validators.required, Validators.min(1)]);
      budgetMax?.updateValueAndValidity();
      budgetPercentage?.clearValidators();
      budgetPercentage?.updateValueAndValidity();
    }
  }

    openVideoPopup(){
    this.pageFacade.openHowitWorksVideoPopup('company-profile');
  }

  ngOnDestroy() {
    // Clean up all image preview URLs to prevent memory leaks
    this.removeSelectedImages();
  }
}
