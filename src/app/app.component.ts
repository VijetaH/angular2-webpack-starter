/*
 * Angular 2 decorators and services
 */
import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild, Input, Injectable
} from '@angular/core';
import {AppState} from './app.service';
import {products} from './products';
import {Http} from '@angular/http';
import {Observable, BehaviorSubject} from 'rxjs/Rx';
import {
    GridComponent,
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';

import {
    toODataString
} from '@progress/kendo-data-query';

/* Example service */
@Injectable()
export class CategoriesService extends BehaviorSubject<GridDataResult> {
    private BASE_URL: string = 'http://services.odata.org/V4/Northwind/Northwind.svc/';
    private tableName: string = 'Categories';

    constructor(private http: Http) {
        super(null);
    }

    public query(state): void {
        this.fetch(this.tableName, state)
            .subscribe(x => super.next(x));
    }

    private fetch(tableName: string, state: any): Observable<GridDataResult> {
        const queryStr = `${toODataString(state)}&$count=true`;
        return this.http
            .get(`${this.BASE_URL}${tableName}?${queryStr}`)
            .map(response => response.json())
            .map(response => (<GridDataResult>{
                data: response.value,
                total: parseInt(response['@odata.count'], 10)
            }));
    }
}
/*
 * App Component
 * Top Level Component
 */
@Component({
    providers: [CategoriesService],
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './app.component.css'
    ],
    templateUrl: './app.html'
})
export class AppComponent implements OnInit {
    public angularclassLogo = 'assets/img/angularclass-avatar.png';
    public name = 'Angular 2 Webpack Starter';
    public url = 'https://twitter.com/AngularClass';
    public title = 'Realtime charts';
    public series: any[] = [{
        name: 'Surveymonkey',
        data: [1, 2, 3, 1, 4, 3, 1, 5, 4, 2]
    }, {
        name: 'Eventbrite',
        data: [1, 2, 2, 3, 4, 3, 1, 5, 4, 2]
    }, {
        name: 'Hubspot',
        data: [6, 2, 3, 3, 4, 2, 1, 1, 4, 2]
    }, {
        name: 'Sendgrid',
        data: [1, 2, 3, 3, 4, 3, 1, 2, 4, 2]
    }];

    public onButtonClick() {
        this.title = 'Hello from Kendo UI!';
    }

    public ngOnInit() {
        console.log('Initial App State', this.appState.state);
    }

    public ngAfterViewInit(): void {
        this.grid.dataStateChange
            .do(({skip, take}: DataStateChangeEvent) => {
                this.skip = skip;
                this.pageSize = take;
            })
            .subscribe(x => this.service.query(x));
    }

    private view: Observable<GridDataResult>;
    private pageSize: number = 5;
    private skip: number = 0;

    private categories: number[] = [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011];
    private gridData: any[] = products;

    @ViewChild(GridComponent) private grid: GridComponent;

    constructor(public appState: AppState, private service: CategoriesService) {
        this.view = service;

        this.service.query({skip: this.skip, take: this.pageSize});
    }
}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
