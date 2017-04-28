import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';


/*
  Generated class for the Gestion provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
//@Injectable()
export function testQuantite(val: number): ValidatorFn {

  return (control: AbstractControl): {[key: string]: any} => {
      const valid = (val <= control.value);
      return (valid) ? {testQuantiteOutput: true} : null;
      };
}

export function testQuantitePositive(): ValidatorFn {

  return (control: AbstractControl): {[key: string]: any} => {
      const valid = (0 <= control.value);
      return (valid) ? {testQuantitePositiveOutput: true} : null;
      };
}
