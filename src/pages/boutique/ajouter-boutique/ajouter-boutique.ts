import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { global } from '../../../global-variables/variable';

import { GestionBoutique } from '../../../providers/gestion-boutique';
import { Geolocation } from 'ionic-native';



/*
  Generated class for the AjouterBoutique page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ajouter-boutique',
  templateUrl: 'ajouter-boutique.html'
})
export class AjouterBoutiquePage {

  boutique: any;
  status: any = [];
  types: any = [];
  longitude: any ='';
  latitude: any = '';


  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public storage: Storage, public toastCtl: ToastController, public gestionService: GestionBoutique) {
    
    let d: Date = new Date();
    let s = this.createDate(d.getDate(), d.getMonth(), d.getFullYear());
    this.status = ['En construction', 'Fermée', 'Ouverte'];
    this.types = ['Fixe', 'Mobile', 'Point de vente'];

    this.boutique = this.formBuilder.group({
      _id: ['', Validators.required],
      nom: [''],
      type: ['', Validators.required],
      region: [''],
      departement: [''],
      commune: [''],
      village: [''],
      longitude: [''],
      latitude: [''],
      nom_op: [''],
      nom_union: [''],
      nom_federation: [''],
      nb_membre_op_proprietaire: [''],
      nb_femme: [''],
      status: ['', Validators.required],
      date_creation: [s, Validators.required],
      solde_caisse: [0, Validators.required],
      solde_tresor: [0, Validators.required],
      
    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AjouterBoutiquePage');
  }

  getPosition(){
    Geolocation.getCurrentPosition().then((resp) => {
      this.longitude = resp.coords.longitude;
      this.latitude = resp.coords.latitude;
      }, err => console.log(''));
  }

    createDate(jour: any, moi: any, annee: any){
    let s = annee+'-';
    moi += 1;
    if(moi < 10){
      s += '0'+moi+'-';
    }else{
      s += moi+'-';
    }

    if(jour < 10){
      s += '0'+jour;
    }else{
      s += jour;
    }
    return s;
  }

  ajouter(){
    let boutiq = this.boutique.value;
    boutiq.gerants = [];
    boutiq.type_produits = [];
    boutiq.operations = [];
    boutiq.produits = [];
    boutiq.ventes = [];
    boutiq.achats = [];
    this.gestionService.createBoutique(boutiq);
    this.storage.set('boutique_id', boutiq._id);
    let toast = this.toastCtl.create({
      message: 'Boutique sauvegardée...',
      duration: 3000,
      position: 'top'
    });
    toast.present();
    global.changerInfoBoutique = false;
    this.navCtrl.pop();
  }

  annuler(){
    this.navCtrl.pop();
  }
}
