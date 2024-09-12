import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'uni-academic-tools-stream',
  templateUrl: './academic-tools-stream.component.html',
  styleUrls: ['./academic-tools-stream.component.scss']
})
export class AcademicToolsStreamComponent implements OnInit {
  modulesList: any[] = [
    { id: 1, name: 'stream select for accounting', imageLink: 'https://bcdn.mindler.com/bloglive/wp-content/uploads/2016/07/06132451/10th-01.png' },
    { id: 2, name: 'stream select for accounting', imageLink: 'https://bcdn.mindler.com/bloglive/wp-content/uploads/2016/07/06132451/10th-01.png' },
    { id: 3, name: 'stream select for accounting', imageLink: 'https://bcdn.mindler.com/bloglive/wp-content/uploads/2016/07/06132451/10th-01.png' },
    { id: 4, name: 'stream select for accounting', imageLink: 'https://bcdn.mindler.com/bloglive/wp-content/uploads/2016/07/06132451/10th-01.png' },
    { id: 5, name: 'stream select for accounting', imageLink: 'https://bcdn.mindler.com/bloglive/wp-content/uploads/2016/07/06132451/10th-01.png' },
    { id: 6, name: 'stream select for accounting', imageLink: 'https://bcdn.mindler.com/bloglive/wp-content/uploads/2016/07/06132451/10th-01.png' },
    { id: 7, name: 'stream select for accounting', imageLink: 'https://bcdn.mindler.com/bloglive/wp-content/uploads/2016/07/06132451/10th-01.png' },
    { id: 8, name: 'stream select for accounting', imageLink: 'https://bcdn.mindler.com/bloglive/wp-content/uploads/2016/07/06132451/10th-01.png' },
    { id: 9, name: 'stream select for accounting', imageLink: 'https://bcdn.mindler.com/bloglive/wp-content/uploads/2016/07/06132451/10th-01.png' },
    { id: 10, name: 'stream select for accounting', imageLink: 'https://bcdn.mindler.com/bloglive/wp-content/uploads/2016/07/06132451/10th-01.png' },
    { id: 11, name: 'stream select for accounting', imageLink: 'https://bcdn.mindler.com/bloglive/wp-content/uploads/2016/07/06132451/10th-01.png' } 
  ];
  academicType: string = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(response => {
      this.academicType = response['id'];
    });
  }
  goBack() {
    if (window.history.length > 1) {
      this.location.back()
    } else {
      this.router.navigate(['/pages/modules/academic-tools'])
    }
  }

}
