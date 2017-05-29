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

  labelAttribute = "code_produit";
  data: any = [];
  constructor(public http: Http) {
    console.log('Hello AutoCompletion Provider');
  }

  getResults(keyword:string) {
    //let test: any = [{'name':'sani'}, {'name':'issa'}, {'name':'moussa'}, {'name':'idi'}, {'name':'ali'},];
    /*return this.http.get("https://restcountries.eu/rest/v1/name/"+keyword)
      .map(
        result =>
        {
          return result.json()
            .filter(item => item.name.toLowerCase().startsWith(keyword.toLowerCase()) )
        });*/ 
        if(this.data.length){
          return this.data.filter(item => item.code_produit.toLowerCase().startsWith(keyword.toLowerCase()));
        }else{
          return
        }
        
  }


}
