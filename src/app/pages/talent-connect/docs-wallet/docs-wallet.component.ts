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

@Component({
  selector: 'uni-docs-wallet',
  standalone: true,
  imports: [CommonModule, PanelModule, InputTextModule, IconFieldModule, InputIconModule, CheckboxModule, SelectModule, ProgressBarModule,
    DialogModule, ButtonModule, PopoverModule
  ],
  templateUrl: './docs-wallet.component.html',
  styleUrls: ['./docs-wallet.component.scss']
})
export class DocsWalletComponent implements OnInit {

  filterDropdown: any[] = [{ id: 1, name: "Recently Added" }, { id: 2, name: "A to Z" }, { id: 3, name: "Z to A" }];
  fileUploadModalVisible: boolean = false;
  activeSectionCard: string = 'All Files';

  constructor(private pageFacade: PageFacadeService) { }

  ngOnInit(): void {
  }

  getActiveClassStatus(section: string) {
    return this.activeSectionCard == section;
  }

  setSwitchSection(section: string) {
    this.activeSectionCard = section;
  }

  uploadFile(event:any) {

  }

  openVideoPopup() {
    // this.pageFacade.openHowitWorksVideoPopup("docs-wallet");
  }
}
