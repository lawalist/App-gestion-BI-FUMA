import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import PouchDB from 'pouchdb';
//import { Storage } from '@ionic/storage';


/*
  Generated class for the GestionBoutique provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GestionBoutique {

  data: any;
  db: any;
  remote: any;
  listener: EventEmitter<any> = new EventEmitter();

  constructor(public http: Http) {
    this.db = new PouchDB('stock-fuma');this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => this.listener.emit(this.handleChange(change)));
    

    this.remote = 'http://localhost:5984/stock-fuma';
    let options = {
      live: true,
      retry: true,
      continuous: true
    } 

    this.db.sync(this.remote, options);
  }

  doSync(){
    this.db = new PouchDB('stock-fuma');this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => this.listener.emit(this.handleChange(change)));
    this.remote = 'http://localhost:5984/stock-fuma';
    let options = {
      live: true,
      retry: true,
      continuous: true
    } 

    this.db.sync(this.remote, options);
  }

  getBoutiqueById(id){
    return this.db.get(id);
  }

  public checkExists(id: string) {
        return this.getBoutiqueById(id).then(result => {
            return true
        }, error => {
            //not found error message
            if (error.status == "404") {
                return false
            } else {
                //other errors
                return false
            }
        });
    }


    reset(){
 
      this.data = null;
  
      this.db.destroy().then(() => {
        console.log("database removed");
      });
    }


  getBoutiques(){

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
          this.data.push(row.doc);
        });

        resolve(this.data);

        this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => this.listener.emit(this.handleChange(change)));
      }).catch((err) => console.log(err));
    } );
  }


  createBoutique(boutique){
    this.db.post(boutique);
  }

  updateBoutique(boutique){
    this.db.put(boutique).catch((err) => console.log(err));
  }

  deleteBoutique(boutique){
    this.db.remove(boutique).catch((err) => console.log(err));
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
