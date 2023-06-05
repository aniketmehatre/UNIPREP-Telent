import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input, OnDestroy,
  OnInit
} from '@angular/core';
import {Editor} from "primeng/editor";
import {DialogService} from 'primeng/dynamicdialog';
import {EditorDialog} from "./editor-dialog/editor-dialog";
import {SubSink} from "subsink";
var worddiff = require('word-diff');

@Directive({
  selector: '[uniEditor]',
  providers: [DialogService]
})
export class EditorDirective implements OnInit, OnDestroy {

  private subs = new SubSink();
  @HostBinding('class.sopeditor') sopeditor = true;

  @Input() options: string[] = [];

  @Input() color = 'yellow';

  private _textHighlight: {word: string; color: string;}[] = [];
  @Input() set textHighlight(data: {word: string; color: string;}[]) {
    this._textHighlight = data;
    this.applyTextHighlights();
  }
  get textHighlight() {
    return this._textHighlight;
  }

  private _highlight: string[] = [];
  @Input() set highlight(data: string[]) {
    this._highlight = data;
    this.applyHighlights();
  }
  get highlight() {
    return this._highlight;
  }

  constructor(
      private elem: ElementRef,
      private el: Editor,
      private dialogService: DialogService
  ) {}
  skipSelect = false;
  arrowKeyNames = ['arrowleft', 'arrowright', 'arrowdown', 'arrowup', 'meta', 'control', 'alt'];
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.arrowKeyNames.includes(event.key.toLowerCase())) {
      this.skipSelect = true;
    } else {
      this.skipSelect = false;
    }
  }
  @HostListener('document:mousedown', ['$event'])
  handleMouseEvent(event: any) {
    this.skipSelect = false;
  }
  text = '';

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.subs.sink = this.el.onTextChange.subscribe(tc => {
      // var diff = worddiff.diffString(this.text, tc.textValue);
    });
    this.subs.sink = this.el.onSelectionChange.subscribe(v => {
      if (!v.range || v?.range?.length > 0 || this.skipSelect) {
        return;
      }
      let currentPosition = v.range.index;
      let content: string = this.el.quill.container.textContent;
      let currentLetter = content.charAt(currentPosition);
      if (currentLetter.trim() == '') {
        return;
      }
      let startPosition =  this.findStarting(content, currentPosition);
      let endPosition =  this.findEnding(content, currentPosition);
      const foundText = content.substring(startPosition, endPosition);
      const found = this._highlight.find(v => foundText.includes(v));
      if (!found) {
        return;
      }
      let realStart = 0;
      let realEnd = 0;
      if (foundText.length !== found.length) {
        const idx = foundText.indexOf(found);
        realStart = startPosition+idx;
        realEnd = realStart+found.length;
      }
      const isExactText = (currentPosition >= realStart && currentPosition <=realEnd) || (realStart == 0 && realEnd == 0);
      if (!isExactText) {
        return;
      }
      let dynamicRef = this.dialogService.open(EditorDialog, {
        data: {options: this.options},
        header: 'Found Options',
        closeOnEscape: false,
      });
      dynamicRef?.onClose.subscribe((res: any) => {
        if (!res) {
          return;
        }
        const response = this.replaceFrom(content, res, realStart || startPosition, realEnd || endPosition);
        this.applyErrors(response);
      });
    });
  }
  replaceFrom(content: string, add: string, start: number, end: number) {
    const startTxt = content.substring(0, start);
    const endTxt = content.substring(end, content.length);
    return `${startTxt}${add}${endTxt}`
  }
  findStarting(content: string, current: number): number {
    if (current == 0) {
      return 0;
    }
    let cp = current - 1 ;
    let stop = false;
    while(stop == false) {
      if (content.charAt(cp).trim() == '') {
        stop = true;
        cp = cp+1;
        continue;
      }
      cp -= 1;
    }
    return cp;
  }

  findEnding(content: string, current: number): number {
    if (current == 0) {
      return 0;
    }
    let cp = current;
    let stop = false;
    while(stop == false) {
      if (content.charAt(cp).trim() == '') {
        stop = true;
        continue;
      }
      cp += 1;
    }
    return cp;
  }

  applyErrors(ctx: string = '') {
    let content: string = ctx || this.el.quill.container.textContent;
    this.highlight.forEach(op => {
      const regx = new RegExp(op, 'gi');
      content = content.replace(regx, `<span style="background: ${this.color}">${op}</span>`);
    });
    this.el.writeValue(content);
  }
  applyHighlights() {
    if (!this.el.quill) {
      return;
    }
    let content: string = this.el.quill.container.textContent;
    this.highlight.forEach(op => {
      const regx = new RegExp(op, 'gi');
      content = content.replace(regx, `<span style="background: ${this.color}">${op}</span>`);
    });
    this.el.writeValue(content);
  }
  applyTextHighlights() {
    if (!this.el.quill) {
      return;
    }
    let content: string = this.el.quill.container.textContent;
    this.textHighlight.forEach(op => {
      const regx = new RegExp(`\\b${op.word}\\b`, 'gi');
      content = content.replace(regx, `<span style="color: ${op.color}">${op.word}</span>`);
    });
    this.el.writeValue(content);
  }
}
