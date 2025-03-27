import { Component, OnInit } from '@angular/core';
import { TravelToolsService } from '../travel-tools.service';
import { Router } from '@angular/router';
import { CostOfLivingService } from '../../job-tool/cost-of-living/cost-of-living.service';
import { City } from 'src/app/@Models/cost-of-living';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { CarouselModule } from 'primeng/carousel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PromptService } from '../../prompt.service';
@Component({
    selector: 'uni-trip-length-finder',
    templateUrl: './trip-length-finder.component.html',
    styleUrls: ['./trip-length-finder.component.scss'],
    standalone: true,
    imports: [CommonModule,SkeletonModule,FluidModule,InputTextModule,TooltipModule,ButtonModule,MultiSelectModule,CarouselModule,InputGroupModule,InputGroupAddonModule,FormsModule,ReactiveFormsModule,InputTextModule,SelectModule]
})
export class TripLengthFinderComponent implements OnInit {

  constructor(
    private travelToolService: TravelToolsService,
    private router: Router,
    private costOfLivingService: CostOfLivingService,
    private toast: MessageService,
    private sanitizer: DomSanitizer,
    private prompt: PromptService
  ) { }

  recommendations: { id: number, question: string }[] = [
    { id: 1, question: "Which Destination are you planning to visit?" }
  ];
  isRecommendation: boolean = true;
  isResponsePage: boolean = false;
  isSavedPage: boolean = false;
  activePageIndex: number = 0;
  selectedData: { [key: string]: any } = {};
  invalidClass: boolean = false;
  recommendationData: SafeHtml;
  savedResponse: any = [];
  destinationLocationList: City[] = [];

  ngOnInit(): void {
    this.getCityList();
  }

  getCityList() {
    this.costOfLivingService.getCities().subscribe({
      next: response => {
        this.destinationLocationList = response;
      }
    });
  }

  getRecommendation(productId: number) {
    this.hideWarning(productId);
    if (!this.invalidClass) {
      let data = {
        country: this.selectedData[1].city_name ?? this.selectedData[1].country_name,
        mode: "trip_length_finder"
      };
      this.travelToolService.getChatgptRecommendations(data).subscribe((response:any) => {
        let chatGptResponse = response.response;
				// chatGptResponse = chatGptResponse
				// 	.replace(/```html|```/g, '')
        //   .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        //   .replace(/<head>(.*?)<\/head>/gs, ''); // Fix escaping;
				this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(chatGptResponse);
        this.isRecommendation = false;
        this.isResponsePage = true;
      })
    }
  }

  hideWarning(productId: number) {
    if (productId in this.selectedData) {
      this.invalidClass = false;
    } else {
      this.invalidClass = true;
    }
  }

  resetRecommendation() {
    this.recommendationData = "";
    this.isRecommendation = true;
    this.isResponsePage = false;
    this.isSavedPage = false;
    this.activePageIndex = 0;
    this.selectedData = [];
  }

  savedRecommendations() {
    this.isRecommendation = false;
    this.isResponsePage = false;
    this.isSavedPage = true;

    this.travelToolService.getTripList('trip_length_finder').subscribe(response => {
      this.savedResponse = response.data;
    })
  }

  clickRecommendation(response: any) {
    this.isRecommendation = false;
    this.isResponsePage = true;
    this.isSavedPage = false;
    this.recommendationData = response;
  }

  onSaveRes() {
    this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" });
  }

  downloadRecommadation() {
    // let content = "    <div class=\"container\">\n        <h3 class=\"title-highlight\"><i class=\"fas fa-calendar-alt icon\"></i> Recommended Duration</h3>\n        <p class=\"section-content\">\n            For your trip to <strong>Médéa</strong>, we recommend a duration of approximately <strong>3 to 5 days</strong> for a fulfilling experience. \n            - 🗓️ This timeframe allows you to explore the beautiful landscapes and rich history of the region.\n            - 🏛️ You can visit significant landmarks and indulge in local culture without feeling rushed.\n            - 🌆 Consider spending more time if you want to immerse yourself in nature or local events.\n            - 🍽️ Enjoy sampling the local cuisine and discovering hidden gems around the city.\n            - 🚶‍♂️ A longer stay allows for spontaneous day trips to nearby attractions.\n            - 🌍 Make sure to plan your itinerary to make the most of your adventure!\n        </p>\n        <div class=\"divider\"></div>\n        <h3 class=\"title-highlight\"><i class=\"fas fa-route icon\"></i> Sample Itinerary</h3>\n        <ul>\n            <li>Day 1: Arrive in Médéa, explore the local markets and enjoy a traditional dinner. 🍽️</li>\n            <li>Day 2: Visit the historic sites including the Médéa Citadel and local museums. 🏰</li>\n            <li>Day 3: Take a day trip to the nearby scenic mountains for hiking and nature. 🏞️</li>\n            <li>Day 4: Discover local art galleries and enjoy a cooking class in the evening. 🎨👩‍🍳</li>\n            <li>Day 5: Relax at a local café and enjoy the ambiance before departure. ☕</li>\n        </ul>\n        <div class=\"divider\"></div>\n        <h3 class=\"title-highlight\"><i class=\"fas fa-bed icon\"></i> Accommodation Tips</h3>\n        <p class=\"section-content\">\n            When staying in Médéa, consider the following options for accommodation:\n            - 🏨 Look for hotels that offer a blend of comfort and local charm, such as boutique hotels.\n            - 🌟 Check online platforms for reviews to find the best-rated places to stay.\n            - 🏡 Consider vacation rentals for a more homely experience, especially if traveling in a group.\n            - 📍 Choose accommodations close to major attractions to minimize travel time.\n            - 💰 Budget-friendly options are available, so consider your needs and preferences carefully.\n            - 🛏️ Always check for amenities like free Wi-Fi and breakfast options to enhance your stay.\n        </p>\n        <div class=\"divider\"></div>\n        <h3 class=\"title-highlight\"><i class=\"fas fa-lightbulb icon\"></i> Additional Considerations</h3>\n        <p class=\"section-content\">\n            Keep these considerations in mind for a smooth trip:\n            - 🌦️ Check the weather forecast before your trip to pack appropriately.\n            - 💳 Familiarize yourself with the local currency, which is the Algerian Dinar (DZD).\n            - 📱 Learn a few basic phrases in Arabic or French to enhance communication with locals.\n            - 🚦 Be aware of local customs and etiquette to respect the culture.\n            - 🚕 Plan your transportation ahead of time; local taxis and buses can be convenient.\n            - 🔍 Always have a backup plan for activities in case of unexpected changes.\n        </p>\n        <div class=\"divider\"></div>\n        <h3 class=\"title-highlight\"><i class=\"fas fa-check-circle icon\"></i> Conclusion</h3>\n        <p class=\"section-content blue-background\">\n            In summary, a trip to <strong>Médéa</strong> can be an enriching experience with the right planning. \n            - 🗺️ By allowing yourself <strong>3 to 5 days</strong>, you can fully enjoy the local culture, history, and natural beauty. \n            - ✨ Make sure to create a balanced itinerary that includes relaxation and exploration! \n            - 🚀 Safe travels and enjoy your adventure in this beautiful destination!\n        </p>\n    </div>\n"
    // let content =  "    <div class=\"container\">\n        <h3 class=\"title-highlight\"><i class=\"fas fa-calendar-alt icon\"></i> Recommended Duration</h3>\n        <p class=\"section-content\">\n            - For a fulfilling experience in <strong>Mysuru</strong>, a trip length of <strong>3 to 4 days</strong> is recommended. 🗓️<br>\n            - This duration allows you to explore the city's rich heritage, stunning palaces, and vibrant markets. 🏰<br>\n            - You will have enough time to visit all major attractions without feeling rushed. 🏞️<br>\n            - A longer stay provides flexibility for day trips to nearby attractions like Coorg or Srirangapatna. 🚗🌳<br>\n            - Ensure to allocate time for local cuisine tasting and shopping in the famous silk and sandalwood markets. 🍽️🛍️<br>\n            - If you enjoy cultural events, plan your visit during festivals like Dasara for an immersive experience! 🎉\n        </p>\n        <div class=\"divider\"></div>\n        <h3 class=\"title-highlight\"><i class=\"fas fa-route icon\"></i> Sample Itinerary</h3>\n        <ul>\n            <li><strong>Day 1:</strong> Arrive in Mysuru, visit the <strong>Mysore Palace</strong> and explore the local markets. 🏰🛒</li>\n            <li><strong>Day 2:</strong> Day trip to <strong>Chamundi Hill</strong> and <strong>St. Philomena's Church</strong>. 🚙⛪</li>\n            <li><strong>Day 3:</strong> Visit <strong>Brindavan Gardens</strong> in the morning and relax at <strong>Karanji Lake</strong>. 🌳🌼</li>\n            <li><strong>Day 4:</strong> Explore <strong>Mysuru Zoo</strong> and enjoy local cuisine before departure. 🦁🍛</li>\n        </ul>\n        <div class=\"divider\"></div>\n        <h3 class=\"title-highlight\"><i class=\"fas fa-bed icon\"></i> Accommodation Tips</h3>\n        <p class=\"section-content\">\n            - Choose accommodations close to the city center for easy access to major attractions. 🏨🚶‍♂️<br>\n            - Popular areas include <strong>Krishna Nagar</strong> and <strong>near Mysore Palace</strong>. 🗺️<br>\n            - Consider staying in heritage hotels for a unique experience. 🏛️<br>\n            - Budget travelers can find affordable guesthouses and hostels. 💰<br>\n            - Check for amenities like free breakfast, Wi-Fi, and transportation services. 🌐<br>\n            - Always read recent reviews for a better understanding of the property. 📝\n        </p>\n        <div class=\"divider\"></div>\n        <h3 class=\"title-highlight\"><i class=\"fas fa-lightbulb icon\"></i> Additional Considerations</h3>\n        <p class=\"section-content\">\n            - Best time to visit is between <strong>October and March</strong> when the weather is pleasant. 🌤️<br>\n            - Be mindful of local customs and dress modestly while visiting temples. 🙏<br>\n            - Use local transport options like auto-rickshaws and buses for a more authentic experience. 🚌<br>\n            - Keep some local currency (Indian Rupees) handy for markets and local eateries. 💵<br>\n            - Stay hydrated and carry sunscreen, especially if visiting during peak hours. ☀️<br>\n            - Consider learning a few basic Kannada phrases to enhance your interactions. 🗣️\n        </p>\n        <div class=\"divider\"></div>\n        <h3 class=\"title-highlight\"><i class=\"fas fa-check-circle icon\"></i> Conclusion</h3>\n        <p class=\"section-content blue-background\">\n            - A visit to <strong>Mysuru</strong> offers a blend of history, culture, and culinary delights. 🌆<br>\n            - With a <strong>3 to 4 day</strong> itinerary, you can enjoy the best of the city while immersing yourself in its vibrant atmosphere. 🥳<br>\n            - Whether it's the stunning palace or the delicious Mysore Pak, there’s something for everyone! 🍬✨<br>\n            - Plan your trip accordingly to make the most of this enchanting city. 🌟\n        </p>\n    </div>\n"
    // this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(content);
    // let selectedCityAndCountry = 'Médéa';
    let selectedCityAndCountry = this.selectedData[1].city_name+', '+this.selectedData[1].country_name;
    let addingInput: string = `
      <p style="color: #3f4c83;"><strong>Which Destination are you planning to visit?</strong></p>
      <p>${ selectedCityAndCountry }</p>`;
    let params: any = {
      module_name: "Trip Length Finder",
      file_name: "trip_length_finder",
      response: this.recommendationData,
      inputString: addingInput
    };
    this.prompt.responseBuilder(params);
  }

  goBack() {
    this.router.navigateByUrl('/pages/travel-tools');
  }

}