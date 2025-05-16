import { Injectable } from '@angular/core';
import { TravelToolsService } from './travel-tools/travel-tools.service';
import { DownloadRespose } from 'src/app/@Models/travel-tools.model';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PromptService {
    headers = new HttpHeaders().set("Accept", "application/json");
    constructor(
        private travelService: TravelToolsService,
        private http: HttpClient
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
            .detail-table th,
            .budget-table th {
                background-color: rgb(63, 76, 131);
                color: white;
            }
            .comparison-table,
            .budget-table,
            .expense-table,
            .comparison-table,
            .detail-table,
            .forecast-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            .expense-table th,
            .expense-table td,
            .detail-table th,
            .detail-table td,
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
                page-break-before: auto;
                page-break-after: auto; 
                page-break-inside: auto;
            }
            .loan-details, .insights {
                page-break-inside: avoid;
            }
            .blue-background {
                background-color: #e3f2fd;
                page-break-inside: avoid;
            }
            h1, h2, h3,h4,h5,h6,p,div,span {
                page-break-before: auto;
                page-break-after: auto; 
                page-break-inside: auto;
                position: relative;
            }
            </style>`;
    responseBuilder(data: any) {
        let processedRecommendation = (data.response || '') + '<br>';
        processedRecommendation = this.extraContentRemover(processedRecommendation);
        let imageUrl = `https://${environment.domain}/uniprepapi/storage/app/public/prompt_modules/${ data.file_name }.png`;
        let titleData = `
                <div class="title-bar">
                    <div style="width: 250px;">
                        <img style=" width: 100%; height: 100%;object-fit: contain;" src="${ imageUrl }" alt="Logo">
                    </div>
                </div>`;
        let inputData = `<p style="color: #f0780e;"><strong>Input:<br></strong></p>${ data.inputString }<div class="divider"></div><p><strong>Response:<br></strong></p>`;
        // Rebuild final content using the extracted part
        let finalRecommendation = `<html><head>${ this.style }</head><body class="body-content">${ titleData } ${ inputData } ${ processedRecommendation }</body></html>`;
        let paramData: DownloadRespose = {
            response: finalRecommendation,
            module_name: data.module_name,
            file_name: data.file_name
        };
        if(data.module_name === 'Trip Length Finder'){
            this.travelService.downloadAiRecommendation(paramData).subscribe({
                next : (response: any) =>{
                    console.log("response", response);
                    return;
                }
            });
            return;
        }
        
        this.travelService.convertHTMLtoPDF(paramData).then(() => {
            console.log("PDF successfully generated.");
        }).catch(error => {
            console.error("Error generating PDF:", error);
        });
    }

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

    getAicredits(){
        return this.http.get<number>(`${environment.ApiUrl}/getAIcredCount`, {
            headers: this.headers,
        });
    }
}
