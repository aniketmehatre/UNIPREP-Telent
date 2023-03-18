import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DashboardService } from "./dashboard.service";

export interface getDashboardCount {
  "success": boolean,
  "registereduser": number,
  "popularquestioncount": number,
  "totalquestioncount": number
  "recentlyaddedquestion": number,
  "personalisedquestioncount": number
}

@Component({
  selector: 'uni-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboardCount: any = [];
  readProgressionPercentage: any;
  readQuizProgressionPercentage: any;
  responsiveOptions: any;
  columns = ['', '', '', '', '', '', ''];



  cars: any[] = [
    {
      "id": "1000",
      "code": "f230fh0g3",
      "name": "Bamboo Watch",
      "description": "Product Description",
      "image": "../../../assets/images/5.png",
      "price": 65,
      "category": "Accessories",
      "quantity": 24,
      "inventoryStatus": "INSTOCK",
      "rating": 5
    },
    {
      "id": "1001",
      "code": "nvklal433",
      "name": "Black Watch",
      "description": "Product Description",
      "image": "../../../assets/images/5a.png",
      "price": 72,
      "category": "Accessories",
      "quantity": 61,
      "inventoryStatus": "INSTOCK",
      "rating": 4
    },];
  text = `
Customer Experience: Create Connected CX by automating and optimizing routine Customer engagements. Adopt Omni Channel CRM to engage with your customers in a more personalized manner.
Employee Experience:  Empower your employees with Collaboration tools, Intuitive Design, Unified Desktop, Learning &amp; Knowledge management, Productivity Tools
SWOT PUBA Engine is capable of identifying historical behavior with set of actions performed by the users and help in quick deduction of suspicious behavior in privileged sessions.
Common root user credentials such as UNIX servers (wasadmin/oracle) are generally shared by different departments in a firm. This poses a hindrance in tracking individual user activity.
How SWOT helps to overcome this?
This University was named after Late Dr.C.N.Annadurai, former Chief Minister of Tamil Nadu. It offers higher education in Engineering, Technology, Architecture and Applied Sciences relevant to the current and projected needs of the society. Besides promoting research and disseminating knowledge gained therefrom, it fosters cooperation between the academic and industrial communities.
To disseminate high quality technical education to the rural mass with an Endeavour to transform them as a responsible citizen. Enriching the standard through high quality infrastructure and efficient teaching faculty. Encouraging research activities, development and teaching programmes on par with international standards. To mould the students who can facilitate the search of humanity for the knowledge.
`;
  constructor(private dashboardService: DashboardService) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }


  response = {
    "status": true,
    "response": {
      "result": true,
      "errors": [
        {
          "id": "e837180868",
          "offset": 355,
          "length": 4,
          "description": {
            "en": "Possible spelling mistake found."
          },
          "bad": "PUBA",
          "better": [
            "PUB",
            "CUBA",
            "PUBS",
            "PBA",
            "TUBA",
            "PUPA",
            "PUMA"
          ],
          "type": "spelling"
        },
        {
          "id": "e1756834020",
          "offset": 404,
          "length": 8,
          "description": {
            "en": "Possible spelling mistake. ‘behavior’ is American English."
          },
          "bad": "behavior",
          "better": [
            "behaviour"
          ],
          "type": "spelling"
        },
        {
          "id": "e1669055214",
          "offset": 498,
          "length": 8,
          "description": {
            "en": "Possible spelling mistake. ‘behavior’ is American English."
          },
          "bad": "behavior",
          "better": [
            "behaviour"
          ],
          "type": "spelling"
        },
        {
          "id": "e69373407",
          "offset": 583,
          "length": 8,
          "description": {
            "en": "Possible spelling mistake found."
          },
          "bad": "wasadmin",
          "better": [
            "was admin"
          ],
          "type": "spelling"
        },
        {
          "id": "e1522023545",
          "offset": 793,
          "length": 1,
          "description": {
            "en": "Add a space between sentences."
          },
          "bad": "C",
          "better": [
            " C"
          ],
          "type": "whitespace"
        },
        {
          "id": "e1514863829",
          "offset": 797,
          "length": 9,
          "description": {
            "en": "Add a space between sentences."
          },
          "bad": "Annadurai",
          "better": [
            " Annadurai"
          ],
          "type": "whitespace"
        },
        {
          "id": "e515588429",
          "offset": 994,
          "length": 8,
          "description": {
            "en": "Use a comma after introductory words"
          },
          "bad": "Besides ",
          "better": [
            "Besides, "
          ],
          "type": "typography"
        }
      ]
    }
  };

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadReadProgression();
    this.loadQuizProgression();
  }

  loadDashboardData() {
    this.dashboardService.getDashboardCounts().subscribe((res: any) => {
      if (res.status === 404) {

        return;
      }
      this.dashboardCount = res;
      console.log('res', res);
    }, err => {
      console.log('err', err);

    });
  }
  loadReadProgression() {
    this.dashboardService.getReadProgression({ countryId: 2 }).subscribe((res: any) => {
      if (res.status === 404) {

        return;
      }
      this.readProgressionPercentage = Math.round(res.readpercentage);
      console.log('this.readProgressionPercentage', this.readProgressionPercentage);
    }, err => {
      console.log('err', err);

    });
  }

  loadQuizProgression() {
    this.dashboardService.getQuizProgression({ countryId: 1 }).subscribe((res: any) => {
      if (res.status === 404) {

        return;
      }
      this.readQuizProgressionPercentage = res.quizpercentage;
      console.log('res', res);
    }, err => {
      console.log('err', err);

    });
  }

  select(event: any) {
    console.log(event)
  }

}
