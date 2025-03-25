import { SafeHtml } from "@angular/platform-browser"

export interface DownloadRespose{
    response: any
    module_name: string
    file_name: string
}

export interface sendDownloadParams{
    module_name: string,
    file_name: string,
    response: SafeHtml,
    inputString: string
}