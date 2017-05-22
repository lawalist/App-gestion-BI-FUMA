import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AutoCompleteService } from 'ionic2-auto-complete';

/*
  Generated class for the AutoCompletion provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AutoCompletion implements AutoCompleteService {

  labelAtribute = 'name';
  constructor(public http: Http) {
    console.log('Hello AutoCompletion Provider');
  }

  getResults(keyword: string){
    return this.http.get("https://restcountries.eu/rest/v1/"+keyword)
    .map(result => {
      return result.json().filter(item => item.name.toLowerCase().startsWith(keyword.toLowerCase()))
    }); 
  }

}
