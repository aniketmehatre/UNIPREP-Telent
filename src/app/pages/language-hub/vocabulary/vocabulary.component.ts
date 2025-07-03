import {Component, OnInit} from "@angular/core"
import {CommonModule, Location} from "@angular/common"
import {LanguageArrayGlobalService} from "../language-array-global.service"
import {PageFacadeService} from "../../page-facade.service"
import {LanguageHubService} from "../language-hub.service"
import {FormsModule} from "@angular/forms"
import {SkeletonModule} from "primeng/skeleton"
import {TooltipModule} from "primeng/tooltip"
import {ButtonModule} from "primeng/button"
import {MultiSelectModule} from "primeng/multiselect"
import {CarouselModule} from "primeng/carousel"
import {InputGroupModule} from "primeng/inputgroup"
import {InputGroupAddonModule} from "primeng/inputgroupaddon"
import {ActivatedRoute, RouterModule} from "@angular/router"
import {TranslateViewService} from "../translate-view/translate-view.service";
import {LanguageHubDataService} from "../language-hub-data.service";

@Component({
	selector: "app-vocabulary",
	templateUrl: "./vocabulary.component.html",
	styleUrls: ["./vocabulary.component.scss"],
	standalone: true,
	imports: [CommonModule, FormsModule, RouterModule, SkeletonModule, TooltipModule, ButtonModule, MultiSelectModule, CarouselModule, InputGroupModule, InputGroupAddonModule],
})
export class VocabularyComponent implements OnInit {
	alphabet: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
	searchTerm: string = ""
	isPlaying1: boolean = false
	words: any
	id: string | null = null;
	selectedLanguageCode: any
	playingStates: { [key: string]: boolean } = {};

	groupedWords: { letter: string; words: { id: number, english_words: string; searched_words: string }[] }[] = []


	constructor(private languageArrayGlobalService: LanguageArrayGlobalService, private pageFacade: PageFacadeService,
				private location: Location, private languageHubService: LanguageHubService,
				private translateViewService: TranslateViewService, private lhs: LanguageHubDataService,
				private route: ActivatedRoute) {
		this.lhs.dataLanguageCode$.subscribe((data) => {
			this.selectedLanguageCode = data
		})
	}

	getFormattedValues(): string {
		return this.languageArrayGlobalService.getItems().join(" -> ")
	}

	ngOnInit() {
		this.route.paramMap.subscribe((params: any) => {
			this.id = params.get('id'); // Get the value of "id"
		});
		this.getVocabularyRecord()
	}

	getVocabularyRecord() {
		let req = {
			language_id: this.id
		}
		this.languageHubService.getVocabulary(req).subscribe((_res) => {
			this.words = _res
			this.groupWordsByAlphabet()
		})
	}

	onClickLetter(letter: any) {
		let req = {
			language_id: this.id,
			letters: letter
		}
		this.languageHubService.getVocabulary(req).subscribe((_res) => {
			this.words = _res
			this.groupWordsByAlphabet()
		})
	}

	onClickLetterNew(character?: any) {
		character = character.toUpperCase();

		// Filter words starting with the specified character
		this.groupedWords = [{
			letter: character,
			words: this.words.filter((word: any) => word.english_words.startsWith(character))
		}].filter(group => group.words.length > 0);
	}

	filterWords() {
		if (!this.searchTerm) {
			// If no search term, reset to the full list
			this.groupWordsByAlphabet();
		} else {
			const searchTerm = this.searchTerm.toUpperCase(); // Normalize the search term for case-insensitive comparison
			// Filter the alphabet to include only those letters that match the starting character of the search term
			const relevantAlphabets = this.alphabet.filter(letter => letter.startsWith(searchTerm[0]));

			this.groupedWords = relevantAlphabets.map(letter => ({
				letter,
				words: this.words.filter((word: any) => word.english_words.toUpperCase().startsWith(searchTerm))
			})).filter(group => group.words.length > 0);
		}
	}

	groupWordsByAlphabet() {
		this.groupedWords = this.alphabet
			.map((letter) => ({
				letter,
				words: this.words.filter((word: any) => word.english_words.startsWith(letter)),
			}))
			.filter((group) => group.words.length > 0)
	}

	openVideoPopup() {
		this.pageFacade.openHowitWorksVideoPopup("language-hub")
	}

	goToHome(event: any) {
		this.languageArrayGlobalService.removeItem(this.languageArrayGlobalService.getItems().length - 1)
		this.location.back()
	}

	synthesizeSpeech(content: any, id: any) {
		this.translateViewService.synthesize(content, this.selectedLanguageCode).subscribe((response: any) => {
			const audioContent = response.audioContent
			const audioUrl = "data:audio/mp3;base64," + audioContent
			const audio = new Audio(audioUrl)
			audio.play()
			audio.addEventListener("ended", () => {
				this.isPlaying1 = false
			})
			this.playingStates[id] = false;
		})
	}

	togglePlayPause(id: number, content: any) {
		if (this.playingStates[id]) {
			this.playingStates[id] = false;
			this.synthesizeSpeech(content.searched_words, id)
		} else {
			this.playingStates[id] = true;
			this.synthesizeSpeech(content.searched_words, id)
		}
	}
}
