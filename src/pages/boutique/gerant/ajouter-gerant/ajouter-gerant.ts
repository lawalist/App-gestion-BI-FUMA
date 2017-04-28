import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { GestionBoutique } from '../../../../providers/gestion-boutique';
import { Storage } from '@ionic/storage';
import { Camera, ImagePicker, Geolocation } from 'ionic-native';

/*
  Generated class for the Ajoutergerant page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ajouter-gerant',
  templateUrl: 'ajouter-gerant.html'
})
export class AjouterGerantPage {
  
  status: any = [];
  gerant: any;
  selectedStatus: any = '';
  gerants: any = [] ;
  matricule:any = '';
  boutique_id: any;
  lettreNom: string = '';
  lettrePrenom: string = '';
  last_id: any;
  index: any;
  path: any;
  longitude: any = '';
  latitude: any = '';

  constructor(public toastCtl: ToastController, public storage: Storage, public alertCtl: AlertController, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public gestionService: GestionBoutique) {
    
    this.last_id = this.navParams.data.last_id;
    this.boutique_id = this.navParams.data.boutique_id;

    
    let d: Date = new Date();
    this.calculMatricule();
    let s = this.createDate(d.getDate(), d.getMonth(), d.getFullYear());
    this.status = ['En fonction', 'Abandon'];

    this.gerant = this.formBuilder.group({
      id: [this.matricule, Validators.required],
      nom: ['', Validators.required],
      //prenom: ['', Validators.required],
      status: ['', Validators.required],
      date_debut_fonction: [s],
      date_fin_fonction: [''],
      raison: ['']
    });
  }

  getPosition(){
    Geolocation.getCurrentPosition().then((resp) => {
      this.longitude = resp.coords.longitude;
      this.latitude = resp.coords.latitude;
      let alert = this.alertCtl.create({
        title: 'Ma position',
        subTitle: 'Longitude = '+ this.longitude + '<br>Latitude = '+ this.latitude,
        buttons:['ok']
      });

      alert.present();
      
       //console.log("Latitude: ", resp.coords.latitude);
       //console.log("Longitude: ", resp.coords.longitude);
      }, err => console.log(''));
  }

  openCamera(){
    let option = {
      sourceType: Camera.PictureSourceType.CAMERA,
      destinationType: Camera.DestinationType.NATIVE_URI,
      correctOrientation: true,
      saveToPhotoAlbum: true
    };

    Camera.getPicture(option).then((pathe) => {
      this.path = pathe;
    }, (err) => console.log(err))
  }

  chooseImage(){
    let option = {
      maximumImagesCount: 1
    };

    ImagePicker.getPictures(option).then((result) => {
     /* for (var i = 0; i < results.length; i++) {
          //console.log('Image URI: ' + results[i]);
          
      }*/
      this.path = result;
    }, (err) => console.log(err) );
  }

  keyupNom(){
    let v = this.gerant.value;
    if(v.nom.length > 0){
      this.lettreNom = v.nom.substr(0, 1).toUpperCase();
      this.calculMatricule();
    }
  }

  keyupPrenom(){
    let v = this.gerant.value;
    if(v.prenom.length > 0){
      this.lettrePrenom = v.prenom.substr(0, 1).toUpperCase();
      this.calculMatricule();
    }
  }

  calculMatricule(){
    let id_int  = parseInt(this.last_id);
    id_int++;
    let matricule = '';
    if(id_int < 10){
      matricule = '00'+id_int.toString();
    }else if(id_int < 100){
      matricule = '0'+id_int.toString();
    }else{
      matricule = id_int.toString();
    }

    this.matricule = this.boutique_id.toString() + this.lettreNom + this.lettrePrenom + matricule;
    //return matricule;
  }

  ionViewDidLoad() {
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         this.gerants = data.gerants;
       });
    });
  }

  ionViewWillEnter(){
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         this.gerants = data.gerants;
       });
    });
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


  onChange(){
    this.verifierStatusEnFonction();
  }

  verifierStatusEnFonction(){
    //on verifie s'il n'existe qu'un seul gerant qui q le status <<En fonction>>
    this.gerants.forEach((prop, index) => {
      if((prop.status == 'En fonction')  && (prop.status === this.selectedStatus)){
        this.index = index;
        let alert = this.alertCtl.create({
          title: 'Avertissement!',
          message: 'Il existe déjà un gérant de la boutique qui a le status <strong>En fonction</strong>.<br> Ce dernier prendra automatiquement le status Abandon!',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                //this.selectedStatus = '';
              }
            }
          ]
        });
    alert.present();
    
      }
    });
    
  }


  ajouter(){
    let boutique: any = {} ;
    let gerants: any = [] ;
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         boutique = data;
         if(data.gerants){
          gerants = data.gerants;
         }
         
         //for(let boutique of boutiques){
          gerants.push(this.gerant.value);
          if(this.index){
            gerants[this.index].status = 'Abandon';
          }
          
          boutique.gerants = gerants;

          this.gestionService.updateBoutique(boutique);
        //}
       });
    });

    let toast = this.toastCtl.create({
      message: 'Gérant sauvegardée...',
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
