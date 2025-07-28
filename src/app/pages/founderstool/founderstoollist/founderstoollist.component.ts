import { Component, OnInit } from '@angular/core';
import { PageFacadeService } from '../../page-facade.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/services/location.service';
import { FoundersToolsData } from './founders-tool-list-data';
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { SharedModule } from 'src/app/shared/shared.module';
import { StorageService } from 'src/app/services/storage.service';
@Component({
  selector: 'uni-founderstoollist',
  templateUrl: './founderstoollist.component.html',
  styleUrls: ['./founderstoollist.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, RouterModule, SharedModule]
})
export class FounderstoollistComponent implements OnInit {
  founderToolsList = FoundersToolsData;

  constructor(private pageFacade: PageFacadeService, private router: Router, private locationService: LocationService,
    private storage: StorageService, private authService: AuthService,) { }

  ngOnInit(): void {
  }

  get filteredFoundersTool(): any[] {
    if (this.storage.get('home_country_name') === 'India') {
      return this.founderToolsList;
    } else {
      const excludedTitles = [
        'Global Entrepreneur Visa'
      ];
      return this.founderToolsList.filter(tool => !excludedTitles.includes(tool.title));
    }
  }
  openAcademy() {
    this.router.navigate(['/pages/founderstool/foundersacademy']);
  }
  openInvestorTraining() {
    this.router.navigate(['/pages/founderstool/investorpitchtraining']);
  }
  openStartUpGlossary() {
    this.router.navigate(['/pages/founderstool/startupglossary']);
  }
  openEntreprenuerSkill() {
    this.router.navigate(['/pages/founderstool/entrepreneurskillmodule']);
  }
  openEntreprenuerSector() {
    this.router.navigate(['/pages/founderstool/entreprenuerproficiencymodule']);
  }

  openGovernmentFundsOpportunity() {
    this.router.navigate(['/pages/founderstool/governmentfunds']);
  }

  openMarketingAnaylsis() {
    this.router.navigate(['/pages/founderstool/marketing-anaylsis']);
  }

  openInvestorList() {
    this.router.navigate(['/pages/investor-list']);
  }

  navigateSubModule(url: string, launch_soon: any) {
    if (launch_soon) {
      return launch_soon;
    }
    this.router.navigateByUrl(url);
  }
}
