import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventsService } from './events.service';
import { DatePipe } from '@angular/common';
interface country {
  id: number,
  country: string,
  flag: string,
  status: number,
  created_at: string,
  updated_at: string
};
@Component({
  selector: 'uni-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  activeButton: number =1;
  upcomingevent:boolean=false;
  postevent:boolean=false;
  newfile = "none";
  countries: country[] = [];
  filterform:FormGroup;
  perpage:number = 8;
  totalcount: number=0;
  totalcountpost:number=0;
  pageno:number = 1;
  upcommingevent: any[] = [];
  postevetdetaisl: any[] = [];
  constructor(private fb: FormBuilder, private service:EventsService,private datePipe: DatePipe) { 
    this.filterform = this.fb.group({
      from: [''],
      to: [''],
      country: ['']
    });
  }

  ngOnInit(): void {
    this.setActiveButton(this.activeButton)
    this.service.GetCountryList().subscribe((response) => {
      this.countries = response;
    });
    let data = {
      perpage : this.perpage,
      page : 1,
    }
    this.geteventupcomming(data)
    this.getpostevent(data)
  }


  // Button styles
  button1Style = {
    'background-color': '#FFFFFF',
    color: '#000000',
    
  };

  button2Style = {
    'background-color': '#FFFFFF',
    color: '#000000'
  };

  setActiveButton(buttonNumber: number): void {
    console.log(buttonNumber);
    
    // Reset styles for both buttons
    this.button1Style = {
      'background-color': '#FFFFFF',
      color: '#000000'
    };

    this.button2Style = {
      'background-color': '#FFFFFF',
      color: '#000000'
    };

    // Set styles for the clicked button
    if (buttonNumber === 1) {
      this.activeButton = 1;
      this.upcomingevent=true;
      this.postevent=false;
      this.button1Style = {
        'background-color': '#3F4C83',
        color: '#FFFFFF'
      };
    } else if (buttonNumber === 2) {
      this.activeButton = 2;
      this.postevent=true;
      this.upcomingevent=false;
      this.button2Style = {
        'background-color': '#3F4C83',
        color: '#FFFFFF'
      };
    }
  }

  // pop up closing
  closenewfilePopup() {
    this.newfile = "none";
  }
  // filterpop-up
  filterpopup(){
    this.setActiveButton(1)
    this.newfile = "block";   
  }
  paginate(event: any){
    this.pageno = event.page + 1;
    this.perpage = event.rows;
    let data = {
      perpage : this.perpage,
      page : event.page + 1,
      to:this.filterform.value.to,
      from:this.filterform.value.from,
      country:this.filterform.value.country,
    }
    this.geteventupcomming(data);
  }
  paginatepost(event:any){
    this.pageno = event.page + 1;
    this.perpage = event.rows;
    let data = {
      perpage : this.perpage,
      page : event.page + 1,
    }
    this.getpostevent(data);
  }
  geteventupcomming(data:any){
    this.service.getupcommingevent(data).subscribe((res) => {
      this.upcommingevent=[]  
      res.events.forEach((list: any) => {
        var bindingdata = {
          id:list.id,
          eventname:list.eventname,
          companylogo: list.companylogo,
          speakername: list.speakername,
          designation: list.designation,
          eventlink: list.eventlink,
          date: this.datechang(list.date),
          country:list.countryName,
          from: this.timeformatchange(list.from),
          to:this.timeformatchange(list.to),
          eventdescription:list.eventdescription,
          countrylog:list.countryFlag,
          daysago:list.remainingTime
        }
        this.totalcount=res.count
        this.upcommingevent.push(bindingdata)
      })
      this.newfile = "none";
    })
  }
  // format changing contact
  datechang(originalDate:any){
    return this.datePipe.transform(originalDate, 'dd MMM yy');
  }
  formattedTime:any;
  timeformatchange(originalTime:any){
    const timeArray = originalTime.split(':');
    const date = new Date();
    date.setHours(parseInt(timeArray[0], 10));
    date.setMinutes(parseInt(timeArray[1], 10));
    date.setSeconds(parseInt(timeArray[2], 10));

    // Format the Date object as "10 AM" using Angular's DatePipe
    return this.datePipe.transform(date, 'h:mm a');
  
  }
  filtersubmit(){
    var data={
      to:this.filterform.value.to,
      from:this.filterform.value.from,
      country:this.filterform.value.country,
      page:1,
      perpage:this.perpage
    }
    this.geteventupcomming(data)
  }
  // post event
  getpostevent(data:any){
    this.service.postevets(data).subscribe((res) => {
      this.postevetdetaisl=[] 
      res.events.forEach((list: any) => {
        var bindingdata = {
          id:list.id,
          eventname:list.eventname,
          companylogo: list.companylogo,
          speakername: list.speakername,
          designation: list.designation,
          eventlink: list.eventlink,
          date: this.datechang(list.date),
          country:list.countryName,
          from: this.timeformatchange(list.from),
          to:this.timeformatchange(list.to),
          eventdescription:list.eventdescription,
          countrylog:list.countryFlag
        }
        this.totalcountpost=res.count
        this.postevetdetaisl.push(bindingdata)
      })
    })
  }
}
