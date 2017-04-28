import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import PouchDB from 'pouchdb';

/*
  Generated class for the Gestion provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GestionAchats {

  data: any;
  db: any;
  remote: any;

  constructor(public http: Http) {
    this.db = new PouchDB('stock-fuma');
    this.remote = 'http://localhost:5984/stock-fuma';
    let options = {
      live: true,
      retry: true,
      continuous: true
    } 

    this.db.sync(this.remote, options);
  }

  getListeAchats(){

    //si non vide
    if(this.data){
      return this.data
    }

    return new Promise ( resolve => {
      this.db.allDocs({
        include_docs: true
      }).then((result) => {
        this.data = [];
        let doc = result.rows.map((row) => {
          if(row.doc.type == 'achat'){
            this.data.push(row.doc);
          }
        });

        resolve(this.data);

        this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => this.handleChange(change));
      }).catch((err) => console.log(err));
    } );
  }


  createAchat(stock){
    this.db.post(stock);
  }

  updateAchat(stock){
    this.db.put(stock).catch((err) => console.log(err));
  }

  deleteAchat(stock){
    this.db.remove(stock).catch((err) => console.log(err));
  }

  handleChange(change){
    let changeDoc = null;
    let changeIndex = null;

    this.data.forEach((doc, index) => {
      if(doc._id === change.id){
        changeDoc = doc;
        changeIndex = index;
      }
    });

    //le document a ete supprime

    if(change.delete){
      this.data.splice(changeIndex, 1);
    }else{
      //mise a jour
      if(changeDoc){
        this.data[changeIndex] = change.doc;
      }
      //ajout
      else{
        this.data.push(change.doc);
      }
    }
  }
}
