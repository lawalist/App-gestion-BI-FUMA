import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { GestionBoutique } from '../../../providers/gestion-boutique';
import { Geolocation } from 'ionic-native';


/*
  Generated class for the ModifierBoutique page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modifier-boutique',
  templateUrl: 'modifier-boutique.html'
})
export class ModifierBoutiquePage {

  boutique: any;
  ancienBoutique: any;
  status: any = [];
  types: any = [];
  selectedStatus: any = '';
  selectedType: any = '';
  longitude: any ='';
  latitude: any = '';

  constructor(public loading: LoadingController, public toastCtl: ToastController, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public gestionService: GestionBoutique) {

    this.ancienBoutique = this.navParams.get('boutique');
    this.status = ['En construction', 'Fermée', 'Ouverte'];
    this.types = ['Fixe', 'Mobile', 'Point de vente'];
    this.selectedStatus = this.ancienBoutique.status;
    this.selectedType = this.ancienBoutique.type;
    this.longitude = this.ancienBoutique.longitude;
    this.latitude = this.ancienBoutique.latitude;

    this.boutique = this.formBuilder.group({
      _id: [this.ancienBoutique._id],
      _rev: [this.ancienBoutique._rev],
      nom: [this.ancienBoutique.nom],
      type: [this.ancienBoutique.type],
      type_boutique: [this.ancienBoutique.type_boutique, Validators.required],
      region: [this.ancienBoutique.region],
      departement: [this.ancienBoutique.departement],
      commune: [this.ancienBoutique.commune],
      village: [this.ancienBoutique.village],
      longitude: [this.ancienBoutique.longitude],
      latitude: [this.ancienBoutique.latitude],
      nom_op: [this.ancienBoutique.nom_op],
      nom_union: [this.ancienBoutique.nom_union],
      nom_federation: [this.ancienBoutique.nom_federation],
      nb_membre_op_proprietaire: [this.ancienBoutique.nb_membre_op_proprietaire],
      nb_femme: [this.ancienBoutique.nb_femme],
      status: [this.ancienBoutique.status, Validators.required],
      date_creation: [this.ancienBoutique.date_creation, Validators.required],
      solde_caisse: [this.ancienBoutique.solde_caisse, Validators.required],
      solde_tresor: [this.ancienBoutique.solde_tresor, Validators.required],
      created_at: [this.ancienBoutique.created_at],
      created_by: [this.ancienBoutique.created_by],
    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ModifierBoutiquePage');
  }

  getPosition(){
    /*let load = this.loading.create({
      content: 'Obtension de la position en cours...',
      //duration: 300
    });
    load.present();*/
    Geolocation.getCurrentPosition().then((resp) => {
      setTimeout(0);
      this.longitude = resp.coords.longitude;
      this.latitude = resp.coords.latitude;
      //load.dismissAll();
    }).catch((error) => {
      //load.dismissAll();
      console.log('Error getting location', error);
    });
  }

  modifier(boutique){
    let boutiq = this.boutique.value;
    //achat._id = this.ancienAchat._id;
    //boutiq._rev = this.ancienBoutique._rev;
    boutiq.gerants = this.ancienBoutique.gerants;
    boutiq.type_produits = this.ancienBoutique.type_produits;
    boutiq.produits = this.ancienBoutique.produits;
    boutiq.operations = this.ancienBoutique.operations;
    boutiq.ventes = this.ancienBoutique.ventes;
    boutiq.achats = this.ancienBoutique.achats;
    this.gestionService.updateBoutique(boutiq);
    
    let toast = this.toastCtl.create({
      message: 'Modification sauvegardée...',
      duration: 3000,
      position: 'top'
    });
    toast.present();
    this.navCtrl.pop();
  }

  annuler(){
    this.navCtrl.pop();
  }

}
