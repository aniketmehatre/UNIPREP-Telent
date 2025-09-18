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
  fileUploadModalVisible: boolean = true;
  activeSectionCard: string = 'All Files';
  docsWallet: DocsWallet | null = null;
  form: FormGroup = new FormGroup({});
  uploadedFiles: { [key: string]: File } = {};
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
      education_cert: [null], //arr
      payslips: [null],
      experience_letters: [null],
      others: [null]
    });
  }

  getDocsFilter() {
    this.talentConnectService.getDocsFilter('ALL').subscribe({
      next: res => {
        this.docsWallet = res;
      },
      error: err => {

      }
    });
    this.talentConnectService.getDocsUploadedFiles().subscribe({
      next: res => {

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
  }

  uploadFile(type: FileType, event: any) {
    const file: File = event.target.files[0];
    if (!file) return;
    // if (type == FileType.AADHARBACK) {
    //   const maxSizeInMB = 2;
    //   const isUnderSizeLimit = file.size <= maxSizeInMB * 1024 * 1024;
    //   if (!isUnderSizeLimit) {
    //     this.toast.add({ severity: "error", summary: "Error", detail: "CV must be less than 2MB." });
    //     return;
    //   }
    //   const isImage = file.type.startsWith('image/');
    //   if (isImage) {
    //     this.toast.add({ severity: "error", summary: "Error", detail: "Please upload your CV in the doc, docx or pdf format." });
    //     return;
    //   }
    // }
    const maxSizeInMB = 5;
    const isUnderSizeLimit = file.size <= maxSizeInMB * 1024 * 1024;
    if (!isUnderSizeLimit) {
      this.toast.add({ severity: "error", summary: "Error", detail: type + " must be less than 5MB." });
      return;
    }
    // Store the file in uploadedFiles with a unique key
    const fileId = `${type}`
    this.uploadedFiles[fileId] = file;
    const reader = new FileReader()
    reader.readAsDataURL(file);
    switch (type) {
      case FileType.AADHARFRONT:
        this.form.get("aadhar_front")?.setValue(file.name);
        break;
      case FileType.AADHARBACK:
        this.form.get("aadhar_back")?.setValue(file.name);
        break;
      case FileType.PANFRONT:
        this.form.get("pan_front")?.setValue(file.name);
        break;
      case FileType.PANBACK:
        this.form.get("pan_back")?.setValue(file.name);
        break;
      case FileType.EDUCATIONCERT:
        this.form.get("education_cert")?.setValue(file.name);
        break;
      case FileType.PAYSLIP:
        this.form.get("payslips")?.setValue(file.name);
        break;
      case FileType.EXPERIENCELETTER:
        this.form.get("experience_letters")?.setValue(file.name);
        break;
      case FileType.OTHERS:
        this.form.get("others")?.setValue(file.name);
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
  openVideoPopup() {
    // this.pageFacade.openHowitWorksVideoPopup("docs-wallet");
  }
}
