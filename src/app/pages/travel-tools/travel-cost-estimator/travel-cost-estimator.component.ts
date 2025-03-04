import { Component, OnInit } from '@angular/core';
import { TravelToolsService } from '../travel-tools.service';
// import { CountryandCurrency } from 'src/app/@Models/currency.model';
import { TravelCostEstimatorQuestionList } from '../trvel-tool-questions';
import { TravelCostEstimator } from 'src/app/@Models/chat-gpt.model';
import { Router, RouterModule } from '@angular/router';
import { CostOfLivingService } from '../../job-tool/cost-of-living/cost-of-living.service';
import { City } from 'src/app/@Models/cost-of-living';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { DownloadRespose } from 'src/app/@Models/travel-tools.model';

@Component({
	selector: "uni-travel-cost-estimator",
	templateUrl: "./travel-cost-estimator.component.html",
	styleUrls: ["./travel-cost-estimator.component.scss"],
	standalone: true,
	imports: [
		ToastModule, 
		CommonModule, 
		FormsModule, 
		ReactiveFormsModule, 
		CarouselModule, 
		ButtonModule, 
		RouterModule, 
		DialogModule, 
		MultiSelectModule, 
		SelectModule, 
		CardModule, 
		InputGroupModule, 
		InputTextModule, 
		InputGroupAddonModule,
		InputNumberModule
	],
	providers: [MessageService]
})
export class TravelCostEstimatorComponent implements OnInit {
	recommendations: { id: number; question: string }[] = TravelCostEstimatorQuestionList;
	trvelExperienceList: { id: number; name: string }[] = [
		{ id: 1, name: "Basic" },
		{ id: 2, name: "Standard" },
		{ id: 3, name: "Luxury" },
	];
	activePageIndex: number = 0;
	selectedData: { [key: string]: any } = { 3: 1 }; // Initialize with default value for days
	invalidClass: boolean = false;
	currencyList: CountryandCurrency[] = [];
	departureLocationList: City[] = [];
	destinationLocationList: City[] = [];
	countryandCurrencyList: CountryandCurrency[] = [];
	isRecommendationQuestion: boolean = true;
	isRecommendationData: boolean = false;
	isRecommendationSavedData: boolean = false;
	departureFilter: string = "";
	destinationFilter: string = "";
	currencyFilter: string = "";
	recommendationData: string = "";
	recommadationSavedQuestionList: TravelCostEstimator[] = [];
	isFromSavedData: boolean = false;
	cityList: City[] = [];
	toast: any;

	constructor(
		private travelToolsService: TravelToolsService, 
		private router: Router, 
		private costOfLivingService: CostOfLivingService,
		private messageService: MessageService
	) {}
  recommendations: { id: number, question: string }[] = TravelCostEstimatorQuestionList;
  trvelExperienceList: { id: number, name: string }[] = [
    { id: 1, name: 'Basic' },
    { id: 2, name: 'Standard' },
    { id: 3, name: 'Luxury' }
  ];
  activePageIndex: number = 0;
  selectedData: { [key: string]: any } = {};
  invalidClass: boolean = false;
  // currencyList: CountryandCurrency[] = [];
  departureLocationList: City[] = [];
  destinationLocationList: City[] = [];
  // countryandCurrencyList: CountryandCurrency[] = [];
  isRecommendationQuestion: boolean = true;
  isRecommendationData: boolean = false;
  isRecommendationSavedData: boolean = false;
  departureFilter: string = '';
  destinationFilter: string = '';
  // currencyFilter: string = '';
  recommendationData: string = '';
  recommadationSavedQuestionList: TravelCostEstimator[] = [];
  isFromSavedData: boolean = false;
  cityList: City[] = [];

	ngOnInit(): void {
		this.selectedData = { 3: 1 };

		this.getCityList();
		this.getCurrencyList();
	}

	getCityList() {
		this.costOfLivingService.getCities().subscribe({
			next: (response) => {
				this.cityList = response
				this.departureLocationList = response
				this.destinationLocationList = response
			},
		})
	}

	getCurrencyList() {
		this.travelToolsService.getCurrencies().subscribe({
			next: (response) => {
				this.countryandCurrencyList = response
				this.currencyList = response
			},
		})
	}

  // getCurrencyList() {
  //   this.travelToolsService.getCurrencies().subscribe({
  //     next: response => {
  //       this.countryandCurrencyList = response;
  //       this.currencyList = response;
  //     }
  //   });
  // }

  customFilterFunction(type: string) {
    if (type === 'departure') {
      if (this.departureFilter === "") {
        this.departureLocationList = this.cityList;
        return;
      }
      this.departureLocationList = this.cityList.filter(city =>
        city?.city_name?.toLowerCase().includes(this.departureFilter.toLowerCase()) || city?.country_name?.toLowerCase().includes(this.departureFilter.toLowerCase())
      );
    }
    else if (type === 'destination') {
      if (this.destinationFilter === "") {
        this.destinationLocationList = this.cityList;
        return;
      }
      this.destinationLocationList = this.cityList.filter(city =>
        city?.city_name?.toLowerCase().includes(this.destinationFilter.toLowerCase()) || city?.country_name?.toLowerCase().includes(this.destinationFilter.toLowerCase())
      );
    }
    // else {
    //   if (this.currencyFilter === "") {
    //     this.currencyList = this.countryandCurrencyList;
    //     return;
    //   }
    //   this.currencyList = this.countryandCurrencyList.filter(item =>
    //     item?.currency_code?.toLowerCase().includes(this.currencyFilter.toLowerCase()) || item?.country?.toLowerCase().includes(this.currencyFilter.toLowerCase())
    //   );
    // }
  }

  resetFunction(type: string) {
    if (type === 'departure') {
      this.departureFilter = '';
      this.departureLocationList = this.cityList;
    }
    else if (type === 'destination') {
      this.destinationFilter = '';
      this.destinationLocationList = this.cityList;
    }
    // else {
    //   this.currencyFilter = '';
    //   this.currencyList = this.countryandCurrencyList;
    // }
  }

	next(itemId: number) {
		this.departureFilter = ""
		this.destinationFilter = ""
		this.departureLocationList = this.cityList
		this.destinationLocationList = this.cityList
		this.invalidClass = false
		if (itemId in this.selectedData) {
			if (this.activePageIndex < this.recommendations.length - 1) {
				this.activePageIndex++
			}
		} else {
			this.invalidClass = true
		}
	}

	getRecommendation() {
		let data: any = {
			country: this.selectedData[1].city_name ?? this.selectedData[1].country_name,
			destination: this.selectedData[2].city_name ?? this.selectedData[2].country_name,
			duration: this.selectedData[3],
			experience: this.selectedData[4],
			currency: this.selectedData[5],
			mode: "travelcostestimator",
		}
		this.travelToolsService.getChatgptRecommendations(data).subscribe({
			next: (response) => {
				this.isRecommendationQuestion = false
				this.isRecommendationData = true
				this.isRecommendationSavedData = false
				this.recommendationData = response.response
			},
			error: (error) => {
				this.isRecommendationData = false
			},
		})
	}

	resetRecommendation() {
		this.activePageIndex = 0
		this.selectedData = { 3: 1 }
		this.isRecommendationQuestion = true
		this.isRecommendationData = false
		this.isRecommendationSavedData = false
		this.isFromSavedData = false
	}


	saveRecommadation() {
		if (!this.isFromSavedData) {
			this.travelToolsService.getTripList("travelcostestimator").subscribe({
				next: (response) => {
					this.isRecommendationQuestion = false
					this.isRecommendationData = false
					this.isRecommendationSavedData = true
					this.recommadationSavedQuestionList = response.data
				},
				error: (error) => {},
			})
		} else {
			this.isRecommendationQuestion = false
			this.isRecommendationData = false
			this.isRecommendationSavedData = true
		}
	}

  showRecommandationData(data: string) {
    this.isRecommendationQuestion = false;
    this.isRecommendationData = true;
    this.isRecommendationSavedData = false;
    this.isFromSavedData = true;
    this.recommendationData = data;
  }

  onSaveRes() {
    this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" });
  }

  downloadRecommadation() {

    let departureLocation = this.selectedData[1].city_name+', '+this.selectedData[1].country_name;
    let destinationLocation = this.selectedData[2].city_name+', '+this.selectedData[2].country_name;
    let addingInput = `<p><strong>Input:<br></strong></p>`;
    this.recommendations.forEach(values =>{
      addingInput += `<p><strong>${values.question}</strong></p>`;
      let currentAnswer = "";
      if(values.id == 1){
        currentAnswer = departureLocation;
      }else if(values.id == 2){
        currentAnswer = destinationLocation;
      }else if(values.id == 3){
        currentAnswer = `${ this.selectedData[3] } Days`;
      }else if(values.id == 4){
        currentAnswer = this.selectedData[4];
      }
      // else if(values.id == 5){
      //   currentAnswer = `${ this.selectedData[5] } Currency`;
      // }
      addingInput += `<p><strong>${ currentAnswer }</strong></p><br>`;
    });
    let finalRecommendation = addingInput+ '<p><strong>Response:<br></strong></p>' + this.recommendationData;

    let paramData: DownloadRespose = {
      response: finalRecommendation,
      module_name: "Travel Cost Estimator",
      file_name: "travel_cost_estimator"
    };
    this.travelToolsService.convertHTMLtoPDF(paramData).then(() => {
      console.log("PDF successfully generated.");
    }).catch(error =>{
      console.error("Error generating PDF:", error);
    })
  }

  goBack() {
    this.router.navigateByUrl('/pages/travel-tools');
  }

}
