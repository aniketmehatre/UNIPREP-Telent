import { Component, OnInit } from '@angular/core';
import { PageFacadeService } from '../../page-facade.service';
import { Router } from '@angular/router';

@Component({
  selector: 'uni-founderstoollist',
  templateUrl: './founderstoollist.component.html',
  styleUrls: ['./founderstoollist.component.scss']
})
export class FounderstoollistComponent implements OnInit {


  constructor(  private pageFacade: PageFacadeService, private router:Router) { }

  ngOnInit(): void {
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  openAcademy(){
    this.router.navigate(['/pages/founderstool/foundersacademy']);
  }
  openInvestorTraining(){
    this.router.navigate(['/pages/founderstool/investorpitchtraining']);
  }
  openStartUpGlossary(){
    this.router.navigate(['/pages/founderstool/startupglossary']);
  }
  openEntreprenuerSkill(){
    this.router.navigate(['/pages/founderstool/entrepreneurskillmodule']);
  }
  openEntreprenuerSector(){
    this.router.navigate(['/pages/founderstool/entreprenuerproficiencymodule']);
  }
  openInvestorList(){
    this.router.navigate(['/pages/investor-list']);  
  }
}
