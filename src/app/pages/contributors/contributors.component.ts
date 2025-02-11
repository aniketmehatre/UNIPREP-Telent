import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'uni-contributors',
  templateUrl: './contributors.component.html',
  styleUrls: ['./contributors.component.scss']
})
export class ContributorsComponent implements OnInit {

  title: string = "";
  isViewContributor: boolean = false;

  contributorList: any[] = [
    { status: "Diamond", img: 'https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg', title: "Infosys", company: "LT Consulty Services", location: "Mysuru" },
    { status: "Premium", img: 'https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg', title: "GT Devegowda", company: "LT Consulty Services", location: "Mysuru" },
    { status: "Gold", img: 'https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg', title: "Joseph Vijay", company: "LT Consulty Services", location: "Mysuru" },
    { status: "Silver", img: 'https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg', title: "TCS", company: "LT Consulty Services", location: "Mysuru" },
    { status: "Bronze", img: 'https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg', title: "Tony Stark", company: "LT Consulty Services", location: "Mysuru" },
  ];
  contributorQandAList: any[] = [
    {
      question: "What are the prominent wotks by G T Devegowda?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum consequuntur nemo beatae est, laboriosam laudantium quisquam minima libero inventore vero! Totam blanditiis, iure non quibusdam ad cumque vel quae est nesciunt, minima magnam rerum iusto commodi consectetur fugit? Voluptate ducimus pariatur possimus eius esse unde architecto, asperiores quibusdam sequi magnam, nesciunt doloribus omnis repudiandae nostrum? Dignissimos error laborum voluptates? Fugiat dicta dolorem placeat magni, vitae eos. A adipisci nostrum perferendis dolore molestiae ab. Nesciunt officiis dolorem inventore ipsa! Aliquam delectus tempora molestiae, totam placeat sapiente asperiores consequuntur enim harum soluta iste nisi mollitia, voluptates ad veritatis quidem."
    },
    {
      question: "When was his first election?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum consequuntur nemo beatae est, laboriosam laudantium quisquam minima libero inventore vero! Totam blanditiis, iure non quibusdam ad cumque vel quae est nesciunt, minima magnam rerum iusto commodi consectetur fugit? Voluptate ducimus pariatur possimus eius esse unde architecto, asperiores quibusdam sequi magnam, nesciunt doloribus omnis repudiandae nostrum? Dignissimos error laborum voluptates? Fugiat dicta dolorem placeat magni, vitae eos. A adipisci nostrum perferendis dolore molestiae ab. Nesciunt officiis dolorem inventore ipsa! Aliquam delectus tempora molestiae, totam placeat sapiente asperiores consequuntur enim harum soluta iste nisi mollitia, voluptates ad veritatis quidem."
    },
    {
      question: "What are the other?",
      answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum consequuntur nemo beatae est, laboriosam laudantium quisquam minima libero inventore vero! Totam blanditiis, iure non quibusdam ad cumque vel quae est nesciunt, minima magnam rerum iusto commodi consectetur fugit? Voluptate ducimus pariatur possimus eius esse unde architecto, asperiores quibusdam sequi magnam, nesciunt doloribus omnis repudiandae nostrum? Dignissimos error laborum voluptates? Fugiat dicta dolorem placeat magni, vitae eos. A adipisci nostrum perferendis dolore molestiae ab. Nesciunt officiis dolorem inventore ipsa! Aliquam delectus tempora molestiae, totam placeat sapiente asperiores consequuntur enim harum soluta iste nisi mollitia, voluptates ad veritatis quidem."
    }
  ];
  contibutionTierList: any[] = [
    { id: 1, value: "Diamond" },
    { id: 1, value: "Premium" },
    { id: 1, value: "Gold" },
    { id: 1, value: "Silver" },
    { id: 1, value: "Bronze" },
  ];
  isQuestionAnswerVisible: boolean = false;
  filterFrom: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.filterFrom = this.fb.group({
      name: [''],
      contribution_tier: [''],
    })
  }

  viewSponsor(data: any) {
    this.isViewContributor = true;
    this.title = data.title;
  }

  viewOneQuestion() {

  }

  showFilter() {
    this.isQuestionAnswerVisible = true;
  }

  onFilter() {
    this.isQuestionAnswerVisible = false;
  }

  resetFilter() {
    this.isQuestionAnswerVisible = false;
  }

  onShowModal(event: any) {

  }

  goBack() {

  }
}
