import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { LanguageHubDataService } from "../language-hub-data.service"
import { Location } from "@angular/common"
import { TranslateViewService } from "./translate-view.service"
import { transliterate as tr } from "transliteration"
import { ActivatedRoute, RouterModule } from "@angular/router"
import { LanguageHubService } from "../language-hub.service"
import { MessageService } from "primeng/api"
import { FormsModule } from "@angular/forms"
import { SkeletonModule } from "primeng/skeleton"
import { TooltipModule } from "primeng/tooltip"
import { ButtonModule } from "primeng/button"
import { MultiSelectModule } from "primeng/multiselect"
import { CarouselModule } from "primeng/carousel"
import { InputGroupModule } from "primeng/inputgroup"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { StorageService } from "../../../storage.service"
import { PageFacadeService } from "../../page-facade.service"
@Component({
	selector: "uni-translate-view",
	templateUrl: "./translate-view.component.html",
	styleUrls: ["./translate-view.component.scss"],
	standalone: true,
	imports: [CommonModule, RouterModule, FormsModule, SkeletonModule, TooltipModule, ButtonModule, MultiSelectModule, CarouselModule, InputGroupModule, InputGroupAddonModule],
})
export class TranslateViewComponent implements OnInit {
	translatedText = ""
	selectedLanguage: any
	selectedSubmoduleName: any = ""
	selectedLanguageName: any = ""
	questionId: string | null = ""

	constructor(private translateViewService: TranslateViewService, private lhs: LanguageHubDataService, private _location: Location, private route: ActivatedRoute, private languageHubService: LanguageHubService, private toast: MessageService, private storage: StorageService, private pageFacade: PageFacadeService) {
		this.lhs.dataLanguageCode$.subscribe((data) => {
			this.selectedLanguage = data
		})
		//once if i went previous page.this value is not giving correct value
		// this.lhs.dataSubmoduleName$.subscribe((data) => {
		// 	this.selectedSubmoduleName = data
		// })
		this.lhs.dataLanguageName$.subscribe((data) => {
			this.selectedLanguageName = data
		})
	}

	ngOnInit(): void {
		this.selectedSubmoduleName = this.storage.get("selectedSubmoduleName");
		this.questionId = this.route.snapshot.paramMap.get("id")
		if (this.questionId) {
			this.getQuestionsList(this.questionId)
		} else {
			const value = this.storage.get("languageHubData")
			if (value !== null) {
				try {
					this.text1 = JSON.parse(value).english
					this.text3 = JSON.parse(value).englishanswer
					this.translateText(this.text1, this.text3)
				} catch (e) {
					console.error("Failed to parse JSON:", e)
				}
			} else {
				console.log("No data found for 'languageHubData' in localStorage.")
			}
		}
	}

	goBack() {
		this._location.back()
	}

	openVideoPopup() {
		this.pageFacade.openHowitWorksVideoPopup("language-hub");
	}
	
	translateText(text1: any, text2: any) {
		if (text1) {
			this.translateViewService.translate(text1, this.selectedLanguage).subscribe((response: any) => {
				this.text2 = response.data.translations[0].translatedText
				this.transliterate2 = tr(response.data.translations[0].translatedText)
			})
		}
		if (text2) {
			this.translateViewService.translate(text2, this.selectedLanguage).subscribe((response: any) => {
				this.text4 = response.data.translations[0].translatedText
				this.transliterate4 = tr(response.data.translations[0].translatedText)
			})
		}
	}

	synthesizeSpeech(content: any) {
		this.translateViewService.synthesize(content, this.selectedLanguage).subscribe((response: any) => {
			const audioContent = response.audioContent
			const audioUrl = "data:audio/mp3;base64," + audioContent
			const audio = new Audio(audioUrl)
			audio.play()
			audio.addEventListener("ended", () => {
				this.isPlaying1 = false
				this.isPlaying2 = false
				this.isPlaying3 = false
				this.isPlaying4 = false
				this.isPlaying5 = false
				this.isPlaying6 = false
			})
		})
	}

	text1: string = ""
	text2: string = ""
	transliterate2: string = ""
	text3: string = ""
	text4: string = ""
	transliterate4: string = ""

	isPlaying1: boolean = false
	isPlaying2: boolean = false
	isPlaying3: boolean = false
	isPlaying4: boolean = false
	isPlaying5: boolean = false
	isPlaying6: boolean = false

	togglePlayPause(textAreaNumber: number, content: any) {
		switch (textAreaNumber) {
			case 1:
				this.isPlaying1 = !this.isPlaying1
				this.synthesizeSpeech(content)
				break
			case 2:
				this.isPlaying2 = !this.isPlaying2
				this.synthesizeSpeech(content)
				break
			case 3:
				this.isPlaying3 = !this.isPlaying3
				this.synthesizeSpeech(content)
				break
			case 4:
				this.isPlaying4 = !this.isPlaying4
				this.synthesizeSpeech(content)
				break
			case 5:
				this.isPlaying5 = !this.isPlaying5
				this.synthesizeSpeech(content)
				break
			case 6:
				this.isPlaying6 = !this.isPlaying6
				this.synthesizeSpeech(content)
				break
		}
	}

	translate(text1: any, text2: any) {
		this.translateText(text1, text2)
	}
	getQuestionsList(id: string) {
		this.languageHubService.getQuestion({ question_id: id }).subscribe(
			(_res: any) => {
				const value = _res.questions[0]
				if (value !== null) {
					try {
						this.text1 = value.english
						this.text3 = value.englishanswer
						this.translateText(this.text1, this.text3)
					} catch (e) {
						console.error("Failed to parse JSON:", e)
					}
				}
			},
			(error) => {
				this._location.back()
				this.toast.add({ severity: "info", summary: "Info", detail: "No Data Found" })
				console.error("Error:", error)
			}
		)
	}
}
