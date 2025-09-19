import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { PageFacadeService } from '../../page-facade.service';
import { TalentConnectService } from '../talent-connect.service';
import { DocsWallet } from 'src/app/@Models/docs-wallet.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

export enum FileType {
  AADHARFRONT = "AadharFront",
  AADHARBACK = "AadharBack",
  PANFRONT = "PanFront",
  PANBACK = "PanBack",
  EDUCATIONCERT = "EducationCert",
  PAYSLIP = "PaySlip",
  EXPERIENCELETTER = "ExperienceLetter",
  OTHERS = "Others",
}

@Component({
  selector: 'uni-docs-wallet',
  standalone: true,
  imports: [CommonModule, PanelModule, InputTextModule, IconFieldModule, InputIconModule, CheckboxModule, SelectModule, ProgressBarModule,
    DialogModule, ButtonModule, PopoverModule, ReactiveFormsModule
  ],
  templateUrl: './docs-wallet.component.html',
  styleUrls: ['./docs-wallet.component.scss']
})
export class DocsWalletComponent implements OnInit {

  filterDropdown: any[] = [{ id: 1, name: "Recently Added" }, { id: 2, name: "A to Z" }, { id: 3, name: "Z to A" }];
  fileUploadModalVisible: boolean = false;
  activeSectionCard: string = 'ALL';
  docsWallet: DocsWallet | null = null;
  form: FormGroup = new FormGroup({});
  // uploadedFiles: { [key: string]: File } = {};
  uploadedFiles: { [key: string]: File[] } = {};
  fileType = FileType;

  constructor(private talentConnectService: TalentConnectService, private pageFacade: PageFacadeService,
    private toast: MessageService, private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getDocsFilter();
  }

  initializeForm() {
    this.form = this.fb.group({
      aadhar_front: [null],
      aadhar_back: [null],
      pan_front: [null],
      pan_back: [null],
      education_cert: [null],
      payslips: [null],
      experience_letters: [null],
      others: [null]
    });
  }

  getDocsFilter() {
    this.talentConnectService.getDocsFilter(this.activeSectionCard).subscribe({
      next: res => {
        this.docsWallet = res;
      },
      error: err => {

      }
    });
    // this.talentConnectService.getDocsUploadedFiles().subscribe({
    //   next: res => {

    //   },
    //   error: err => {

    //   }
    // });
  }
  getActiveClassStatus(section: string) {
    return this.activeSectionCard == section;
  }

  setSwitchSection(section: string) {
    this.activeSectionCard = section;
    this.getDocsFilter();
  }

  uploadFile(type: FileType, event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    const maxSizeInMB = 5;
    const uploaded: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (type !== FileType.OTHERS && !allowedTypes.includes(file.type)) {
        this.toast.add({
          severity: "error",
          summary: "Invalid File",
          detail: "Only PDF, JPG, JPEG, PNG are allowed."
        });
        continue;
      }
      if (file.size > maxSizeInMB * 1024 * 1024) {
        this.toast.add({
          severity: "error",
          summary: "File Too Large",
          detail: `${file.name} must be less than 5MB.`
        });
        continue;
      }
      const fileId = `${type}`;
      if (!this.uploadedFiles[fileId]) {
        this.uploadedFiles[fileId] = [];
      }
      this.uploadedFiles[fileId].push(file);
      uploaded.push(file.name);
    }

    switch (type) {
      case FileType.AADHARFRONT:
        this.form.get("aadhar_front")?.setValue(uploaded[0] || null);
        break;
      case FileType.AADHARBACK:
        this.form.get("aadhar_back")?.setValue(uploaded[0] || null);
        break;
      case FileType.PANFRONT:
        this.form.get("pan_front")?.setValue(uploaded[0] || null);
        break;
      case FileType.PANBACK:
        this.form.get("pan_back")?.setValue(uploaded[0] || null);
        break;
      case FileType.EDUCATIONCERT:
        this.form.get("education_cert")?.setValue(uploaded.join(", "));
        break;
      case FileType.PAYSLIP:
        this.form.get("payslips")?.setValue(uploaded.join(", "));
        break;
      case FileType.EXPERIENCELETTER:
        this.form.get("experience_letters")?.setValue(uploaded.join(", "));
        break;
      case FileType.OTHERS:
        this.form.get("others")?.setValue(uploaded.join(", "));
        break;
    }
  }

  extractLastName(fileName: string): string {
    if (!fileName) return "";
    const extension = fileName.split('.').pop(); // get "extension"
    const baseName = fileName.split("/").pop() as string; // remove extension
    let shortened = baseName;
    if (baseName.length > 15) {
      shortened = baseName.slice(0, 12) + '...';
    }
    return `${shortened}.${extension}`;
  }

  onRemoveFile(type: FileType, formCtrl: any, event: any) {
    event.stopPropagation();
    formCtrl.value = '';
    delete this.uploadedFiles[type];
    // this.fileInput.nativeElement.value = "";
  }

  onSubmit() {
    const formDataValue = this.form.value;
    const formData = new FormData();
    if (this.uploadedFiles[this.fileType.AADHARFRONT]?.[0] || formDataValue.aadhar_front) {
      formData.append("aadhar_front", this.uploadedFiles[this.fileType.AADHARFRONT]?.[0] ?? formDataValue.aadhar_front);
    }
    if (this.uploadedFiles[this.fileType.AADHARBACK]?.[0] || formDataValue.aadhar_back) {
      formData.append("aadhar_back", this.uploadedFiles[this.fileType.AADHARBACK]?.[0] ?? formDataValue.aadhar_back);
    }
    if (this.uploadedFiles[this.fileType.PANFRONT]?.[0] || formDataValue.pan_front) {
      formData.append("pan_front", this.uploadedFiles[this.fileType.PANFRONT]?.[0] ?? formDataValue.pan_front);
    }
    if (this.uploadedFiles[this.fileType.PANFRONT]?.[0] || formDataValue.pan_back) {
      formData.append("pan_back", this.uploadedFiles[this.fileType.PANBACK]?.[0] ?? formDataValue.pan_back);
    }
    if (this.uploadedFiles[this.fileType.EDUCATIONCERT]?.length || formDataValue.education_cert) {
      if (this.uploadedFiles[this.fileType.EDUCATIONCERT]?.length) {
        this.uploadedFiles[this.fileType.EDUCATIONCERT].forEach((file, index) =>
          formData.append(`education_cert[${index}]`, file)
        );
      } else {
        formData.append(`education_cert`, formDataValue.education_cert);
      }
    }
    if (this.uploadedFiles[this.fileType.PAYSLIP]?.length || formDataValue.payslips) {
      if (this.uploadedFiles[this.fileType.PAYSLIP]?.length) {
        this.uploadedFiles[this.fileType.PAYSLIP].forEach((file, index) =>
          formData.append(`payslips[${index}]`, file)
        );
      } else {
        formData.append("payslips", formDataValue.payslips);
      }
    }
    if (this.uploadedFiles[this.fileType.EXPERIENCELETTER]?.length || formDataValue.experience_letters) {
      if (this.uploadedFiles[this.fileType.EXPERIENCELETTER]?.length) {
        this.uploadedFiles[this.fileType.EXPERIENCELETTER].forEach((file, index) =>
          formData.append(`experience_letters[${index}]`, file)
        );
      } else {
        formData.append("experience_letters", formDataValue.experience_letters);
      }
    }
    if (this.uploadedFiles[this.fileType.OTHERS]?.length || formDataValue.others) {
      if (this.uploadedFiles[this.fileType.OTHERS]?.length) {
        this.uploadedFiles[this.fileType.OTHERS].forEach((file, index) =>
          formData.append(`others[${index}]`, file)
        );
      } else {
        formData.append("others", formDataValue.others);
      }
    }
    this.talentConnectService.uploadDocsWallet(formData).subscribe({
      next: res => {
        this.toast.add({ severity: "success", summary: "Success", detail: "Files uploaded successfully" });
        this.getDocsFilter();
        this.onClose();
      },
      error: err => {
        this.toast.add({ severity: "error", summary: "Error", detail: "File upload failed" });
      }
    });
  }

  onClose() {
    this.uploadedFiles = {};
    this.form.reset();
  }

  openVideoPopup() {
    // this.pageFacade.openHowitWorksVideoPopup("docs-wallet");
  }

}
