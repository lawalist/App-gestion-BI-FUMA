import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import {LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { global } from '../global-variables/variable';
//import PouchDB from 'pouchdb';
//import { Storage } from '@ionic/storage';
var PouchDB = require("pouchdb");
PouchDB.plugin(require('pouchdb-authentication'));



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
  loading: any;
  pouchOpts = {
    skip_setup: true
  };


  constructor(public http: Http, public loadingCtrl: LoadingController) {
    this.db = new PouchDB('stock-fuma');
    this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => this.listener.emit(this.handleChange(change)));
    

    //this.remote = new PouchDB("http://localhost:5984/stock-fuma", this.pouchOpts);// 'http://localhost:5984/stock-fuma';//
    this.remote = new PouchDB("http://"+global.ip_serveur+":5984/stock-fuma", this.pouchOpts);
    let options = {
      live: true,
      retry: true,
      continuous: true
    }
     
    this.db.sync(this.remote, options);
  }

  showLoader(msg: any){
 
    this.loading = this.loadingCtrl.create({
      content: msg
    });
    this.loading.present();
  }

  register(username: any, mdpass: any, meta = {}){
    this.showLoader('Création du compte...');
    //let db = new PouchDB('http://localhost:5984/stock-fuma');
    this.remote.signup(username, mdpass,{metadata : meta}, (err, response) => {
      if(err){
        this.loading.dismiss();
        if (err.name === 'conflict') {
            return 'username exist';
          }else  if (err.name === 'forbidden') {
            return 'username invalide';
          } else{
            return 'erreur';
          }
      }else if(response){
        this.loading.dismiss();
        return 'success';
      }else{
        this.loading.dismiss();
        return 'echec';
      }
        
    });
  }

  login(username: any, mdpass: any){
    let ajaxOpts = {
      ajax: {
        headers: {
          Authorization: 'Basic ' + window.btoa(username + ':' + mdpass),
        }
      }
    };
    this.showLoader('Authentification...');
    this.remote.login(username, mdpass, ajaxOpts, (err, response) => {
      if (err) {
        this.loading.dismiss();
        if (err.name === 'unauthorized') {
          alert('nom ou mdpass incorrecte');
          return 'nom ou mdpass incorrecte';
        } else {
          alert('erreur');
          return 'erreur';
        }
      }else if(response){
        this.loading.dismiss();
        alert('success');
        return 'success';
      }else{
        this.loading.dismiss();
        alert('echec');
        return 'echec';
      }
    });
  }

  logout(){
    this.showLoader('Déconnexion...');
    this.remote.logout((err, response) => {
      if (err) {
        this.loading.dismissAll();
        return 'echec connexion';
      }else if(response){
        //this.data = null;
        //this.db.destroy().then(() => {
        //  console.log("base de données supprimée");
        //});
        
        this.loading.dismissAll();
        return 'success';
      }else{
        this.loading.dismiss();
        return 'echec';
      }
    });
  }

  getUser(username: any){
    this.remote.getUser(username, (err, response) => {
      if (err) {
        if (err.name === 'not_found') {
          return 'acces non autorise'
        } else {
          return 'erreur'
        }
      } else {
        return response;
      }
    });
  }

  getSession(){
    this.remote.getSession((err, response) => {
      if (err) {
        return 'erreur du réseau';
      } else if (!response.userCtx.name) {
        return 'Personne n\est connecté';
      } else {
        return response.userCtx.name;
      }
    });
  }

  updateUser(unsername: string){
    this.remote.putUser(unsername, {
      metadata : {
        email : 'robin@boywonder.com',
        birthday : '1932-03-27T00:00:00.000Z',
        likes : ['acrobatics', 'short pants', 'sidekickin\''],
      }
    }, (err, response) => {
      // etc.
    });
  }

  changerMdpass(){
    this.remote.changePassword('spiderman', 'will-remember', (err, response) => {
      if (err) {
        if (err.name === 'not_found') {
          // typo, or you don't have the privileges to see this user
        } else {
          // some other error
        }
      } else {
        // response is the user update response
        // {
        //   "ok": true,
        //   "id": "org.couchdb.user:spiderman",
        //   "rev": "2-09310a62dcc7eea42bf3d4f67e8ff8c4"
        // }
      }
    });
  }

  chagerUsername(){
    this.remote.changeUsername('spiderman', 'batman', (err) => {
      if (err) {
        if (err.name === 'not_found') {
          // typo, or you don't have the privileges to see this user
        } else if (err.taken) {
          // auth error, make sure that 'batman' isn't already in DB
        } else {
          // some other error
        }
      } else {
        // succeeded
      }
    });
  }



  doSync(){
    this.db = new PouchDB('stock-fuma');this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => this.listener.emit(this.handleChange(change)));
    //this.remote = new PouchDB("http://localhost:5984/stock-fuma", this.pouchOpts);// 'http://localhost:5984/stock-fuma';
    this.remote = new PouchDB("http://"+global.ip_serveur+":5984/stock-fuma", this.pouchOpts)
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

  getDocById(id){
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

  getPlageDocs(startkey, endkey){

    //si non vide
    let data: any;
    if(data){
      return data
    }

    

    return new Promise ( resolve => {
      this.db.allDocs({
        include_docs: true,
        startkey: startkey,
        endkey: endkey
      }).then((result) => {
        data = [];
        let doc = result.rows.map((row) => {
          data.push(row.doc);
        });

        resolve(data);

        this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => this.listener.emit(this.handleChange(change)));
      }).catch((err) => console.log(err));
    } );
  }


  createBoutique(boutique){
    this.db.post(boutique);
  }

  createDoc(doc){
    this.db.put(doc);
  }

  updateBoutique(boutique){
    this.db.put(boutique).catch((err) => console.log(err));
  }

  updateDoc(doc){
    this.db.put(doc).catch((err) => console.log(err));
  }

  deleteBoutique(boutique){
    this.db.remove(boutique).catch((err) => console.log(err));
  }

  deleteDoc(doc){
    this.db.remove(doc).catch((err) => console.log(err));
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
