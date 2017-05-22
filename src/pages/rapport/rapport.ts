import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Printer, PrintOptions, File } from 'ionic-native';
import { GestionBoutique } from '../../providers/gestion-boutique';

//import { FileSave } from '../../providers/file-save';

import * as FileSaver from 'file-saver';
//import {  } from '../../script/'

declare var cordova: any;

/*
  Generated class for the Rapport page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-rapport',
  templateUrl: 'rapport.html'
})
export class RapportPage {
  operations: any = [];
  boutique_id: any;
  allOperation: any = [];
  allTypeOperation: any = [];
  selectedTypeOperation: any = 'VENTE';
  selectedTypeRapport: any = 'Tous';
  total: any = 0;
  rapport: any = 'complet';
  print: any = '';
  rh: any = '';
  storageDirectory: string = '';
  nomOperation: string = '';


  constructor(public alertCtl: AlertController, public navCtrl: NavController, public platform: Platform, public navParams: NavParams, public storage: Storage, public gestionService: GestionBoutique) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RapportPage');
  }

  exportXLSX(){
    //let saveAs = require('file-saver');
    let date = new Date();
    //let dateHeure = date.toLocaleDateString()+ date.toLocaleTimeString();// + date.getTime().toLocaleString();
    let nom = date.getDate().toString() + (date.getMonth() + 1).toString() + date.getFullYear().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();
    
    let blob = new Blob([document.getElementById('rapport').innerHTML], {
      //type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
      type: "text/plain;charset=utf-8"
      //type: 'application/vnd.ms-excel;charset=utf-8'
      //type: "application/vnd.ms-excel;charset=utf-8"
    });

    if(!this.platform.is('android')){
      FileSaver.saveAs(blob, 'Rapport'+nom+'.xls');
    }else{

      //let src = cordova.file.externalDataDirectory;
      //File.createDir;
      //fileDestiny = file:///storage/rapport
      //emulated/o/android/data/com./files
      let fileDestiny: string = cordova.file.externalDataDirectory;
      File.writeFile(fileDestiny, 'Rapport'+nom+'.xls', blob, true).then(()=> {
              alert("Fichier <<Rapport"+nom+".xls>> est créé dans: " + fileDestiny);
          }).catch(()=>{
          alert("Erreur de création du fichier <<Rapport"+nom+".xls>> dans: " + fileDestiny);
          })
    }
     
     
     //   .saveAs(blob, "Rapport.xls");
  }

  /*saveFile() {
    let table = "<table><thead><tr><th>A</th><th>B</th><th>C</th></tr></thead><tbody>    <tr><td>1</td><td>2</td><td>3</td></tr>    <tr><td>1</td><td>2</td><td>3</td></tr>    <tr><td>1</td><td>2</td><td>3</td></tr>    <tr><td>1</td><td>2</td><td>3</td></tr>    </tbody>    </table>";
    this.fileService.save(this.storageDirectory, "export.xls", "application/vnd.ms-excel", table);
  }*/

  ionViewWillEnter(){
    let operations: any = [];
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getPlageDocs(id+':operation', id+':operation:\ufff0').then((data) => {
         //this.operations = data.operations;
         this.boutique_id = id;
            this.allOperation = data;
            this.allTypeOperation = data;
            if(this.selectedTypeOperation == 'TOUS'){
              //this.operations = data.operations;
              this.nomOperation = '';
              this.allTypeOperation = data;
              this.allTypeOperation.sort((a, b) => {
                return b.id - a.id;
              });
          
            }else{
              data.forEach((op, index) => {
                this.nomOperation = 'des '+ this.selectedTypeOperation + 's';
                if(op.type === this.selectedTypeOperation){
                  operations.push(op);
                }
              });

              //this.operations = operations;
              this.allTypeOperation = operations;
              this.allTypeOperation.sort((a, b) => {
                return b.id - a.id;
              });
              //this.calculTotal();
            }
            
            //fitrage
            operations = [];
            let dateJour = this.getDateJour();
            switch (this.selectedTypeRapport) {
              case 'Jour':
              this.rapport = 'journalier '+ this.nomOperation.toLowerCase();
              this.allTypeOperation.forEach((op, index) => {
                  if(op.date === dateJour){
                    operations.push(op);
                  }
                });
                this.operations = operations;
                //this.allTypeOperation = operations;
                this.calculTotal();
                //this.operations.reverse();
              break;
              case 'Semaine':
                this.rapport = 'hebdomadaire '+ this.nomOperation.toLowerCase()+': les derniers 7 jours';
                this.allTypeOperation.forEach((op, index) => {
                    if(this.estSemaine(op.date) == 1){
                      operations.push(op);
                    }
                  });
                this.operations = operations;
                this.calculTotal();
              break;
              case 'Moi':
              this.rapport = 'mensuel '+ this.nomOperation.toLowerCase()+': les derniers 30 jours';
                this.allTypeOperation.forEach((op, index) => {
                      if(this.estMoi(op.date) == 1){
                        operations.push(op);
                      }
                    });
                this.operations = operations;
                this.calculTotal();
                break;
              case 'Annee':
              this.rapport = 'annuel '+ this.nomOperation.toLowerCase()+': les derniers 366 jours';
                this.allTypeOperation.forEach((op, index) => {
                    if(this.estAnnee(op.date) == 1){
                      operations.push(op);
                    }
                  });
                this.operations = operations;
                this.calculTotal();
                break;
              case 'Tous':
                this.rapport = 'complet '+ this.nomOperation.toLowerCase();
                this.operations = this.allTypeOperation;
                this.calculTotal();
              break;
            }
            
            this.getItems1(this.rh);

            //this.operations.reverse();
            //this.allOperation.reverse();
            
       });
    });
  }

  onPrint(){
    let options: PrintOptions = {
        //name: 'Rapport',
        //printerId: 'printer007',
        duplex: true,
        landscape: true,
        grayscale: true
    };
    let content = document.getElementById('rapport');
    Printer.print(content, options);
  }

  calculTotal(){
   let total = 0;
    for(let op of this.operations){
      total += op.montant_total;
    }

    this.total = total;
  }

  filterTypeOperation(){
    let operations: any = [];
    if(this.selectedTypeOperation == 'TOUS'){
        operations = this.allOperation;
        this.nomOperation = '';
        this.allTypeOperation = this.allOperation;
        this.allTypeOperation.sort((a, b) => {
          return b.id - a.id;
        });
        //this.operations = operations;
        //this.calculTotal();
      }else{
        this.nomOperation = 'des '+ this.selectedTypeOperation + 's';
        this.allOperation.forEach((op, index) => {
        if(op.type === this.selectedTypeOperation){
          operations.push(op);
        }
      });
      this.allTypeOperation = operations;
      this.allTypeOperation.sort((a, b) => {
        return b.id - a.id;
      });
      //this.operations = operations;
      //this.calculTotal();
    }

    //filtre
    operations = [];
    let dateJour = this.getDateJour();
    switch (this.selectedTypeRapport) {
      case 'Jour':
      this.rapport = 'journalier '+ this.nomOperation.toLowerCase();
      this.allTypeOperation.forEach((op, index) => {
          if(op.date === dateJour){
            operations.push(op);
          }
        });
        this.operations = operations;
        //this.allTypeOperation = operations;
        this.calculTotal();
        //this.operations.reverse();
      break;
      case 'Semaine':
        this.rapport = 'hebdomadaire '+ this.nomOperation.toLowerCase()+': les derniers 7 jours';
        this.allTypeOperation.forEach((op, index) => {
            if(this.estSemaine(op.date) == 1){
              operations.push(op);
            }
          });
        this.operations = operations;
        this.calculTotal();
      break;
      case 'Moi':
      this.rapport = 'mensuel '+ this.nomOperation.toLowerCase()+': les derniers 30 jours';
        this.allTypeOperation.forEach((op, index) => {
              if(this.estMoi(op.date) == 1){
                operations.push(op);
              }
            });
          this.operations = operations;
          this.calculTotal();
        break;
      case 'Annee':
      this.rapport = 'annuel '+ this.nomOperation.toLowerCase()+': les derniers 366 jours';
        this.allTypeOperation.forEach((op, index) => {
            if(this.estAnnee(op.date) == 1){
              operations.push(op);
            }
          });
        this.operations = operations;
        this.calculTotal();
      break;
      case 'Tous':
        this.rapport = 'complet '+ this.nomOperation.toLowerCase();
        this.operations = this.allTypeOperation;
        this.calculTotal();
      break;
    }
    
    
    //this.operations.reverse();

    this.getItems1(this.rh);
  }


    getItems1(ev: any) {
    // Reset items back to all of the items
    //this.operations = this.allTypeOperation;


    // set val to the value of the searchbar
    let val = ev;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.operations = this.operations.filter((item) => {
        return (item.nom_produit.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });

      this.calculTotal();
    }
    }

  filterTypeRapport(){
    let dateJour = this.getDateJour();
    let operations: any = [];
    let oldOperations: any = [];
    oldOperations = this.operations;

    switch (this.selectedTypeRapport) {
      case 'Jour':
       this.rapport = 'journalier '+ this.nomOperation.toLowerCase();
       this.allTypeOperation.forEach((op, index) => {
          if(op.date === dateJour){
            operations.push(op);
          }
        });
        this.operations = operations;
        this.calculTotal();
        //this.operations.reverse();
       break;
      case 'Semaine':
        this.rapport = 'hebdomadaire '+ this.nomOperation.toLowerCase()+': les derniers 7 jours';
        this.allTypeOperation.forEach((op, index) => {
            if(this.estSemaine(op.date) == 1){
              operations.push(op);
            }
          });
        this.operations = operations;
        this.calculTotal();
       break;
      case 'Moi':
      this.rapport = 'mensuel '+ this.nomOperation.toLowerCase()+': les derniers 30 jours';
        this.allTypeOperation.forEach((op, index) => {
              if(this.estMoi(op.date) == 1){
                operations.push(op);
              }
            });
          this.operations = operations;
          this.calculTotal();
         break;
      case 'Annee':
      this.rapport = 'annuel '+ this.nomOperation.toLowerCase()+': les derniers 366 jours';
        this.allTypeOperation.forEach((op, index) => {
            if(this.estAnnee(op.date) == 1){
              operations.push(op);
            }
          });
        this.operations = operations;
        this.calculTotal();
       break;
      case 'Tous':
        this.rapport = 'complet '+ this.nomOperation.toLowerCase();
        this.operations = this.allTypeOperation;
        this.calculTotal();
        //this.operations.reverse();
       break;
    }

    this.getItems1(this.rh);
   }

   estSemaine(date: any){
     let dateJour = new Date();//
     let dateCourante = new Date(date.substr(0, 4), date.substr(5, 2) - 1,  date.substr(8, 2));
     let bn = dateJour.getTime() - dateCourante.getTime();
     let diff = Math.ceil(bn/(1000*60*60*24));

     if(diff <= 7){
        return 1;
     }else{
       return 0
     }
   }

    estMoi(date: any){
     let dateJour = new Date();//
     let dateCourante = new Date(date.substr(0, 4), date.substr(5, 2) - 1,  date.substr(8, 2));
     let bn = dateJour.getTime() - dateCourante.getTime();
     let diff = Math.ceil(bn/(1000*60*60*24));

     if(diff <= 30){
        return 1;
     }else{
       return 0
     }
   }

   estAnnee(date: any){
     let dateJour = new Date();//
     let dateCourante = new Date(date.substr(0, 4), date.substr(5, 2) - 1,  date.substr(8, 2));
     let bn = dateJour.getTime() - dateCourante.getTime();
     let diff = Math.ceil(bn/(1000*60*60*24));

     if(diff <= 366){
        return 1;
     }else{
       return 0
     }
   }

   getItems(ev: any) {
    // Reset items back to all of the items
    this.operations = this.allTypeOperation;


    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.operations = this.operations.filter((item) => {
        return (item.nom_produit.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });

      this.calculTotal();
    }
  }

  getDateJour(){
    let d: Date = new Date();
    //let s = this.createDate(, , );
    let jour = d.getDate();
    let moi = d.getMonth();
    let annee = d.getFullYear();
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

}
