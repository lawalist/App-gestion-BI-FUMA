import { Component } from '@angular/core';

import { AchatsPage } from '../achats/achats';
import { VentesPage } from '../ventes/ventes';
import { AdminPage } from '../admin/admin';
import { OperationsPage } from '../operations/operations'
import { GerantPage } from '../boutique/gerant/gerant'
import { AccueilPage } from '../accueil/accueil';
import { RapportPage } from '../rapport/rapport';
//import { ContactPage } from '../contact/contact';
//import { ProduitPage } from '../boutique/produit/produit'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  //tab1Root: any = VentesPage;
  tab1Root: any =  OperationsPage;
  //tab2Root: any = AchatsPage;
  //tab2Root: any = AchatsPage;
  tab2Root: any = RapportPage;
  tab3Root: any =  AdminPage;
  tab4Root: any =  GerantPage;
  tab5Root: any =  AccueilPage;
  tab6Root: any = '';

  premierLencement: boolean = true;

  constructor() {
    /*if(this.premierLencement){
      this.tab1Root = AccueilPage;
    }else{
      this.tab1Root = OperationsPage;
      //tab2Root: any = AchatsPage;
      this.tab2Root = '';//AchatsPage;
      this.tab3Root = AdminPage;
      this.tab4Root = GerantPage;
      this.tab5Root = AccueilPage;
      this.tab6Root = '';
    }*/
  }
}
