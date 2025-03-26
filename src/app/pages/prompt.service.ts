import { Injectable } from '@angular/core';
import { TravelToolsService } from './travel-tools/travel-tools.service';
import { DownloadRespose } from 'src/app/@Models/travel-tools.model';

@Injectable({
    providedIn: 'root'
})
export class PromptService {
    constructor(
        private travelService: TravelToolsService
    ) {
    }
    style: string = `<style>
            body{
                width: 100%;
                font-family: 'Poppins', sans-serif;
                color: black;
                text-align: left;
                line-height: 1.9;
                font-size: 16px;
            }
            .container {
                page-break-before: auto;
                page-break-after: auto;
            }
            .title-bar {
                border-bottom: 2px solid #f0780e;
                margin-bottom: 10px;
                page-break-after: avoid; 
            }
            .title-highlight {
                color: #f0780e;
                font-weight: bold;
                font-size: 22px;
            }
            li {
                page-break-inside: avoid;
                word-wrap: break-word;
            }
            ul {
                padding-left: 20px;
                page-break-inside: avoid;
            }
            .logo {
                display: block;
                margin: 20px auto;
                width: 220px;
            }
            .icon {
                color: rgb(63, 76, 131);
                margin-right: 10px;
            }
            .body-content h2,
            .body-content h3 {
                color: rgb(63, 76, 131);
            }
            .divider {
                height: 2px;
                background: linear-gradient(to right, rgb(63, 76, 131), #f0780e);
                margin: 20px 0;
            }
            .highlight {
                color: #f0780e;
                font-weight: bold;
                font-size: 20px;
            }
            .comparison-table th,
            .expense-table th,
            .forecast-table th,
            .budget-table th {
                background-color: rgb(63, 76, 131);
                color: white;
            }
            .comparison-table,
            .budget-table,
            .expense-table,
            .comparison-table,
            .forecast-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            .comparison-table th,
            .comparison-table td,
            .expense-table th,
            .expense-table td,
            .forecast-table th,
            .forecast-table td,
            .budget-table th,
            .budget-table td,
            .comparison-table th,
            .comparison-table td {
                border: 1px solid #ddd;
                padding: 10px;
                text-align: center;
            }
            .comparison-table th {
                background-color: rgb(63, 76, 131);
                color: white;
            }
            .insights,
            .summary,
            .business-info,
            .section-content,
            .job-list,
            .salary-info,
            .packing-list,
            .itinerary,
            .recommendations,
            .loan-details {
                padding: 15px;
                border-radius: 8px;
                font-size: 16px;
                page-break-inside: avoid;
            }
            .blue-background {
                background-color: #e3f2fd;
                page-break-inside: avoid;
            }
            h1, h2, h3,h4,h5,h6,p,div,span,ul,li {
                page-break-before: auto;
                page-break-after: auto; 
                page-break-inside: avoid;
                position: relative;
            }
            </style>`;
    responseBuilder(data: any) {
        let processedRecommendation = (data.response || '') + '<br>';

        processedRecommendation = this.extraContentRemover(processedRecommendation);
        let titleData = `
                <div class="title-bar">
                    <div style="width: 250px;">
                        <img style=" width: 100%; height: 100%;object-fit: contain;" src="https://api.uniprep.ai/uniprepapi/storage/app/public/prompt_modules/${data.file_name}.png" alt="Logo">
                    </div>
                </div>`;
        // Rebuild final content using the extracted part
        let finalRecommendation = `<html><head>${this.style}</head><body class="body-content">${titleData} ${data.inputString} ${processedRecommendation}</body></html>`;
        console.log(finalRecommendation);
        let paramData: DownloadRespose = {
            response: finalRecommendation,
            module_name: data.module_name,
            file_name: data.file_name
        };
        this.travelService.convertHTMLtoPDF(paramData).then(() => {
            console.log("PDF successfully generated.");
        }).catch(error => {
            console.error("Error generating PDF:", error);
        });
    }

    // Function to extract the content inside the "response-content" div
    // extractResponseContent(htmlString: string){
    //     const parser = new DOMParser();
    //     const doc: Document = parser.parseFromString(htmlString, "text/html");
    //     const responseContent: HTMLElement | null = doc.getElementById("response-content");
    //     return responseContent ? responseContent.outerHTML : "";
    // }

    extraContentRemover(response: string) {
        let htmlString: string = response;
        htmlString = htmlString
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert bold syntax
            .replace(/\(see https:\/\/g\.co\/ng\/security#xss\)/g, '') // Remove unwanted security message
            .replace(/SafeValue must use \[property\]=binding:/g, '') // Remove Angular security message
            .replace(/\(see https:\/\/angular\.dev\/best-practices\/security#preventing-cross-site-scripting-xss\)/g, '')
        // .replace(/<head>(.*?)<\/head>/gs, ''); // Fix escaping

        return htmlString;
    }

}
