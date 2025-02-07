import {NgModule} from "@angular/core";
import {EditorDirective} from "./editor.directive";
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {EditorDialog} from "./editor-dialog/editor-dialog";
import {NgForOf} from "@angular/common";
@NgModule({
    imports: [EditorDirective], // ✅ Import standalone directive instead
    exports: [EditorDirective] // ✅ Now you can export it
  })
export class SharedDirectives {}