import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { File } from 'ionic-native';
import * as FileSaver from 'file-saver';
import { Platform } from 'ionic-angular';

/*
  Generated class for the FileSave provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FileSave {

  constructor(public http: Http, public platform: Platform) {
    console.log('Hello FileSave Provider');
  }

  public save(fileDestiny, fileName, fileMimeType, fileData) {
      let blob = new Blob([fileData], {type: fileMimeType});

      if (!this.platform.is('android')) {
          FileSaver.saveAs(blob, fileName); 
      } else {
          File.writeFile(fileDestiny, fileName, blob, true).then(()=> {
              alert("Fichier créé dans: " + fileDestiny);
          }).catch(()=>{
          alert("Erreur de création du fichier dans: " + fileDestiny);
          })
      }
  }

  /*public getStorageDirectory():string {
        let src:string = "";

        if (this.platform.is('android')) {
         src = cordova.file.externalDataDirectory;
        }   

        return src;          
    }*/
 
}
