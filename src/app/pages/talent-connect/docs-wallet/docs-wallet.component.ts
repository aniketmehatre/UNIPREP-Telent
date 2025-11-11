import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    DialogModule, ButtonModule, PopoverModule, ReactiveFormsModule, FormsModule
  ],
  templateUrl: './docs-wallet.component.html',
  styleUrls: ['./docs-wallet.component.scss']
})
export class DocsWalletComponent implements OnInit {

  @ViewChild("aadharFrontFileUpload") aadharFrontFileUpload: ElementRef;
  @ViewChild("aadharBackFileUpload") aadharBackFileUpload: ElementRef;
  @ViewChild("panFrontFileUpload") panFrontFileUpload: ElementRef;
  @ViewChild("panBackFileUpload") panBackFileUpload: ElementRef;
  @ViewChild("educationalFileUpload") educationalFileUpload: ElementRef;
  @ViewChild("payslipFileUpload") payslipFileUpload: ElementRef;
  @ViewChild("experienceFileUpload") experienceFileUpload: ElementRef;
  @ViewChild("otherFileUpload") otherFileUpload: ElementRef;

  filterDropdown: any[] = [{ id: 1, name: "Recently Added" }, { id: 2, name: "A to Z" }, { id: 3, name: "Z to A" }];
  fileUploadModalVisible: boolean = false;
  activeSectionCard: string = 'ALL';
  docsWallet: DocsWallet | null = null;
  docsWalletList: DocsWallet | null = null;
  form: FormGroup = new FormGroup({});
  uploadedFiles: { [key: string]: File[] } = {};
  fileType = FileType;
  searchText: string = '';
  existingFileList: any;
  fileRenameModalVisible: boolean = false;
  currentFile: any;
  newFileName: string = '';

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
        this.docsWalletList = JSON.parse(JSON.stringify(res));
        this.docsWallet = res;
      },
      error: err => {

      }
    });
    this.getDocsUploadedFiles();
  }

  getDocsUploadedFiles() {
    this.talentConnectService.getDocsUploadedFiles().subscribe({
      next: res => {
        this.existingFileList = res?.files;
      },
      error: err => {

      }
    });
  }

  getActiveClassStatus(section: string) {
    return this.activeSectionCard == section;
  }

  setSwitchSection(section: string) {
    this.activeSectionCard = section;
    this.searchText = '';
    this.getDocsFilter();
  }

  uploadFile(type: FileType, event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;
    if (files.length > 6) {
      this.toast.add({ severity: "error", summary: "Invalid File", detail: "You can upload a maximum of 5 files at a time." });
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    const maxSizeInMB = 5;
    const uploaded: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (type !== FileType.OTHERS && !allowedTypes.includes(file.type)) {
        this.toast.add({ severity: "error", summary: "Invalid File", detail: "Only PDF, JPG, JPEG, PNG are allowed." });
        continue;
      }
      if (file.size > maxSizeInMB * 1024 * 1024) {
        this.toast.add({ severity: "error", summary: "File Too Large", detail: `${file.name} must be less than 5MB.` });
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

  onRemoveFile(type: FileType, fileName: string, event: any) {
    event.stopPropagation();

    const fileId = `${type}`;
    if (!this.uploadedFiles[fileId]) return;

    // Remove the file from uploadedFiles array
    this.uploadedFiles[fileId] = this.uploadedFiles[fileId].filter(
      (f: File) => f.name !== fileName
    );

    const remainingNames = this.uploadedFiles[fileId].map((f: File) => f.name);
    this.form.get(this.mapFileTypeToControl(type))?.setValue(
      remainingNames.length > 0 ? remainingNames.join(", ") : null
    );

    if (this.uploadedFiles[fileId].length === 0) {
      delete this.uploadedFiles[fileId];
      this.fileInputMap[type]().nativeElement.value = "";
    }
  }

  mapFileTypeToControl(type: FileType): string {
    switch (type) {
      case FileType.AADHARFRONT: return "aadhar_front";
      case FileType.AADHARBACK: return "aadhar_back";
      case FileType.PANFRONT: return "pan_front";
      case FileType.PANBACK: return "pan_back";
      case FileType.EDUCATIONCERT: return "education_cert";
      case FileType.PAYSLIP: return "payslips";
      case FileType.EXPERIENCELETTER: return "experience_letters";
      case FileType.OTHERS: return "others";
      default: return "";
    }
  }

  fileInputMap: Record<FileType, () => ElementRef> = {
    [FileType.AADHARFRONT]: () => this.aadharFrontFileUpload,
    [FileType.AADHARBACK]: () => this.aadharBackFileUpload,
    [FileType.PANFRONT]: () => this.panFrontFileUpload,
    [FileType.PANBACK]: () => this.panBackFileUpload,
    [FileType.EDUCATIONCERT]: () => this.educationalFileUpload,
    [FileType.PAYSLIP]: () => this.payslipFileUpload,
    [FileType.EXPERIENCELETTER]: () => this.experienceFileUpload,
    [FileType.OTHERS]: () => this.otherFileUpload,
  };

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
    this.fileUploadModalVisible = false;
    this.uploadedFiles = {};
    this.form.reset();
  }

  onSearch() {
    const searchValue = this.searchText.toLowerCase();
    if (this.docsWallet?.files && this.docsWalletList?.files) {
      this.docsWallet.files = this.docsWalletList.files.filter((item) => {
        return item.name.toLowerCase().includes(searchValue);
      });
    }
  }

  onSortChange(event: any) {
    const value = event.value?.name;
    if (this.docsWallet?.files && this.docsWalletList?.files) {
      if (value === "A to Z") {
        this.docsWallet.files = [...this.docsWalletList.files].sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
      } else if (value === "Z to A") {
        this.docsWallet.files = [...this.docsWalletList.files].sort((a, b) =>
          b.name.toLowerCase().localeCompare(a.name.toLowerCase())
        );
      } else if (value === "Recently Added") {
        this.docsWallet.files = [...this.docsWalletList.files]; // original order
      }
    }
  }

  onShare(data: any) {
    console.log(data, 'data')
  }

onFavouriteFile(data: any) {
  this.talentConnectService.favouriteDocsWalletFile({ file_id: data.id }).subscribe({
    next: res => {
      const docWalletFile = this.docsWallet?.files?.find(item => item.id === data.id);
      if (docWalletFile) {
        docWalletFile.favourite = res.favourite;
      }
      const message = res.favourite
        ? "File added to your favorites successfully."
        : "File removed from your favorites.";

      const severity = res.favourite ? "success" : "info";

      this.toast.add({
        severity,
        summary: "Success",
        detail: message,
      });
    },
    error: () => {
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: "Could not add file to favorites. Please try again.",
      });
    }
  });
}

  onDownloadFile(data: any) {
    this.talentConnectService.downloadDocsWalletFile(data.id).subscribe({
      next: res => {
        this.toast.add({ severity: "success", summary: "Success", detail: "File downloaded successfully." });
        const url = window.URL.createObjectURL(res);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.name;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: err => {
        this.toast.add({ severity: "error", summary: "Error", detail: "Could not download the file. Please try again." });
      }
    });
  }

  onRenameFile(data: any) {
    this.fileRenameModalVisible = true;
    this.currentFile = data;
    this.newFileName = data.name?.split('.')?.[0];
  }

  onSaveNewFileName() {
    if (this.currentFile.name?.split('.')?.[0] == this.newFileName) {
      this.toast.add({ severity: "error", summary: "Error", detail: "File name unchanged. Please choose a different name." });
      return;
    }
    this.talentConnectService.renameDocsWalletFile({ file_id: this.currentFile.id, new_name: this.newFileName }).subscribe({
      next: res => {
        this.toast.add({ severity: "success", summary: "Success", detail: "File renamed successfully." });
        const docWalletFile = this.docsWallet?.files?.find(item => item.id == this.currentFile.id);
        docWalletFile.name = res?.file?.name;
        this.onCloseRenameModal();
        if (this.fileUploadModalVisible) {
          this.getDocsUploadedFiles();
        }
      },
      error: err => {
        this.toast.add({ severity: "error", summary: "Error", detail: err.error.message ?? "Could not rename the file. Please try again." });
      }
    });
  }

  onCloseRenameModal() {
    this.fileRenameModalVisible = false;
    this.currentFile = null;
    this.newFileName = '';
  }

  onDeleteFile(data: any) {
    this.talentConnectService.deleteDocsWalletFile({ file_id: data.id }).subscribe({
      next: res => {
        this.toast.add({ severity: "success", summary: "Success", detail: "File deleted successfully." });
        this.getDocsFilter();
      },
      error: err => {
        this.toast.add({ severity: "error", summary: "Error", detail: err.error.message ?? "Could not delete the file. Please try again." });
      }
    });
  }

  openVideoPopup() {
    // this.pageFacade.openHowitWorksVideoPopup("docs-wallet");
  }

}
