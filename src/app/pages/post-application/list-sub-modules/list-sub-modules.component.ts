import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-sub-modules',
  templateUrl: './list-sub-modules.component.html',
  styleUrls: ['./list-sub-modules.component.css']
})
export class ListSubModulesComponent implements OnInit {
  selectedSubModule: any;
  subModuleList: any[] = [];
  constructor() { }

  ngOnInit(): void {
    this.subModuleList = [{
      "id": 1,
      "submodule_name": "Career Prospectus",
      "image": 'http://40.80.95.32/uniprepapi/storage/app/public/country-flags/singapore.svg',
      "status": 1,
      "created_at": null,
      "updated_at": null
    },
    {
      "id": 2,
      "submodule_name": "Document Checkist",
      "status": 1,
      "image": 'http://40.80.95.32/uniprepapi/storage/app/public/country-flags/singapore.svg',
      "created_at": null,
      "updated_at": null
    },
    {
      "id": 3,
      "submodule_name": "Admission Requirements",
      "status": 1,
      "image": 'http://40.80.95.32/uniprepapi/storage/app/public/country-flags/singapore.svg',
      "created_at": null,
      "updated_at": null
    },
    {
      "id": 4,
      "submodule_name": "Scholarships",
      "status": 1,
      "image": 'http://40.80.95.32/uniprepapi/storage/app/public/country-flags/singapore.svg',
      "created_at": null,
      "updated_at": null
    },
    {
      "id": 5,
      "submodule_name": "University Initial Deposit",
      "status": 1,
      "image": 'http://40.80.95.32/uniprepapi/storage/app/public/country-flags/singapore.svg',
      "created_at": null,
      "updated_at": null
    },
    {
      "id": 6,
      "submodule_name": "Education Loan",
      "status": 1,
      "image": 'http://40.80.95.32/uniprepapi/storage/app/public/country-flags/singapore.svg',
      "created_at": null,
      "updated_at": null
    }]
  }

  onSubModuleClick(id: any) {
    this.subModuleList.forEach((element: any) => {
      if (element.id === id) {
        this.selectedSubModule = element.country;
      }
    });
    this.selectedSubModule = id;
  }
}
