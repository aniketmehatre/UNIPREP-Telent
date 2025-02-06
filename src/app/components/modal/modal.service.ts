import {ComponentFactoryResolver, Injectable, ViewContainerRef} from "@angular/core";
import {ModalComponent} from "./modal.component";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from "@env/environment";
import {Observable, Observer} from 'rxjs';
import {AnonymousSubject} from 'rxjs/internal/Subject';

export interface Message {
    source: string;
    content: string;
}

@Injectable()
export class ModalService {
    private rootViewContainer!: ViewContainerRef;
    private subject!: AnonymousSubject<MessageEvent>;

    //public messages: Subject<Message>;

    constructor(private factoryResolver: ComponentFactoryResolver, private http: HttpClient) {
        this.factoryResolver = factoryResolver;
        // this.messages = <Subject<Message>>this.connect('CHAT_URL').pipe(
        //     map(
        //         (response: MessageEvent): Message => {
        //             let data = JSON.parse(response.data)
        //             return data;
        //         }
        //     )
        // );
    }

    public connect(url: string): AnonymousSubject<MessageEvent> {
        if (!this.subject) {
            this.subject = this.create(url);
        }
        return this.subject;
    }

    private create(url: any): AnonymousSubject<MessageEvent> {
        let ws = new WebSocket(url);
        let observable = new Observable((obs: Observer<MessageEvent>) => {
            ws.onmessage = obs.next.bind(obs);
            ws.onerror = obs.error.bind(obs);
            ws.onclose = obs.complete.bind(obs);
            return ws.close.bind(ws);
        });
        let observer = {
            error: null,
            complete: null,
            next: (data: Object) => {

                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            }
        };
        // @ts-ignore
        return new AnonymousSubject<MessageEvent>(observer, observable);
    }


    setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
        this.rootViewContainer = viewContainerRef;
    }

    addDynamicComponent() {
        const factory = this.factoryResolver.resolveComponentFactory(ModalComponent);
        const component = factory.create(this.rootViewContainer.parentInjector);

        // Subscribe to the closeModal event and destroy the component
        component.instance.closeModal.subscribe(() => this.removeDynamicComponent(component));

        this.rootViewContainer.insert(component.hostView);
    }

    removeDynamicComponent(component: any) {
        component.destroy();
    }

    sendChatMessage(val: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/sentchatmessage", val, {headers: headers});
    }

    getChatHistoryForTheUser() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getchathistory", null, {headers: headers});
    }

    getChatReportOptions() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + "/chatreportoptions", {
            headers: headers,
        });
    }
    postReportChat(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/reportchat", data, {headers: headers});
    }
}
