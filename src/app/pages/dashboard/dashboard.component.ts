import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'uni-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  columns = ['', '', '', '', '', '', ''];
  text = `
Customer Experience: Create Connected CX by automating and optimizing routine Customer engagements. Adopt Omni Channel CRM to engage with your customers in a more personalized manner.
Employee Experience:  Empower your employees with Collaboration tools, Intuitive Design, Unified Desktop, Learning &amp; Knowledge management, Productivity Tools
SWOT PUBA Engine is capable of identifying historical behavior with set of actions performed by the users and help in quick deduction of suspicious behavior in privileged sessions.
Common root user credentials such as UNIX servers (wasadmin/oracle) are generally shared by different departments in a firm. This poses a hindrance in tracking individual user activity.
How SWOT helps to overcome this?
This University was named after Late Dr.C.N.Annadurai, former Chief Minister of Tamil Nadu. It offers higher education in Engineering, Technology, Architecture and Applied Sciences relevant to the current and projected needs of the society. Besides promoting research and disseminating knowledge gained therefrom, it fosters cooperation between the academic and industrial communities.
To disseminate high quality technical education to the rural mass with an Endeavour to transform them as a responsible citizen. Enriching the standard through high quality infrastructure and efficient teaching faculty. Encouraging research activities, development and teaching programmes on par with international standards. To mould the students who can facilitate the search of humanity for the knowledge.
`;
  constructor() { }

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
  
  }

  select(event: any) {
    console.log(event)
  }

}
