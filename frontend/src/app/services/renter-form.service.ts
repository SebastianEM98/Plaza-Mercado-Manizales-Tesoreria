import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class RenterFormService {

    constructor() { }

    localStringToNumber(numberString: string | null): number {
        if (numberString == null || numberString == undefined || numberString == '') {
            return 0;
        }

        if (typeof numberString != 'string') {
            return numberString;
        }

        return Number.parseFloat(numberString.replace(/,/g, ''));
    }

    
    dateToISOString(date: Date | null): string | null {
        if (date == null || date == undefined) {
            return null;
        } else {
            if (date.toString().trim() == '') {
                return null;
            }
            return date.toISOString().slice(0, 10);
        }
    }


    formatMoneyField(control: AbstractControl | null): void {
        if (control && control.value !== null) {
            const numericValue = this.localStringToNumber(control.value);
            control.setValue(numericValue.toLocaleString('en-US'));
        }
    }


    formatDateField(control: AbstractControl | null): void {
        if (control && control.value) {
            const formatedDateISO8601 = new Date(control.value.replace('Z', ''));
            control.setValue(formatedDateISO8601);
        }
    }


    setAgreementObservationsValue(agreementObservations: string | null): string {
        if (agreementObservations == null || agreementObservations == undefined) {
            return "SIN OBSERVACIÓN DEL ACUERDO";
        } else {
            if (agreementObservations.trim() == '') {
                return "SIN OBSERVACIÓN DEL ACUERDO";
            }
            return agreementObservations.trim();
        }
    }


    setAgreementFulfillmentClassColor(value: string | null): string {
        if (value === 'SI CUMPLE') {
            return 'renter-form-input-value-green';
        } else if (value === 'NO CUMPLE') {
            return 'renter-form-input-value-red';
        } else {
            return 'renter-form-input-value-orange';
        }
    }

    setPaymentAgreementStatusClassColor(value: string | null): string {
        if (value === 'COMPLETADO') {
            return 'renter-form-input-value-green';
        } else if (value === 'SIN COMPLETAR') {
            return 'renter-form-input-value-red';
        } else {
            return 'renter-form-input-value-orange';
        }
    }


    noWhitespaceValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
          const isWhitespace = (control.value || '').trim().length === 0;
          return isWhitespace ? { 'whitespace': true } : null;
        };
    }
}
