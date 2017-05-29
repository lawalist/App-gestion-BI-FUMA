import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { DetailProduitPage } from '../../produit/detail-produit/detail-produit';

//provider
import { GestionBoutique } from '../../../../providers/gestion-boutique'
import { TranslateService } from '@ngx-translate/core';
import { global } from '../../../../global-variables/variable';

/*
  Generated class for the DetailTypeProduit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detail-type-produit',
  templateUrl: 'detail-type-produit.html'
})
export class DetailTypeProduitPage {

  typeProduit: any;
  produits: any = [];
  boutique_id: any;
  tacheAdmin = global.tacheAdmin;

  constructor(public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams, public gestionService: GestionBoutique) {
    this.translate.setDefaultLang(global.langue);
    this.typeProduit = this.navParams.data.typeProduit;
    this.boutique_id = this.navParams.data.boutique_id;
  }

  ionViewWillEnter() {
    this.translate.use(global.langue);
    //console.log('ionViewDidLoad DetailTypeProduitPage');
    this.gestionService.getPlageDocs(this.boutique_id + ':produit', this.boutique_id + ':produit:\ufff0').then((prods) => {
      this.produits = [];
      prods.forEach((res, index) => {
        if(res.type_produit === this.typeProduit.nom){
          this.produits.push(res);
        }
      });
    });
    

  }

  detailProduit(prod, boutique_id){
    this.navCtrl.push(DetailProduitPage, {'produit': prod, 'boutique_id': boutique_id});
  }

}
