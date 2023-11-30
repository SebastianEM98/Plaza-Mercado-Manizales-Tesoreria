import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { RenterService } from 'src/app/services/renter.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Renter } from 'src/app/interfaces/renter';
import { RenterFormService } from 'src/app/services/renter-form.service';


@Component({
    selector: 'app-edit-renter',
    templateUrl: './edit-renter.component.html',
    styleUrls: ['./edit-renter.component.css']
})
export class EditRenterComponent implements OnInit {

    loading = false;
    renter!: Renter;
    renterId: string = '';
    internalExternalValues = [{ value: 'INTERNO' }, { value: 'EXTERNO' }];
    statusValues = [{ value: 'POR DEFINIR' }, { value: 'CON ACUERDO DE PAGO' }, { value: 'JURÍDICO' }, { value: 'JURÍDICO CON ACUERDO DE PAGO' }];
    paymentAgreementValues = [{ value: 'SIN REALIZAR' }, { value: 'A' }, { value: '2A' }, { value: '3A' }, { value: '4A' }, { value: '5A' }];
    periodicityValues = [{ value: 15, viewValue: 'QUINCENAL (15)'}, { value: 30, viewValue: 'MENSUAL (30)'}];
    paymentTypeValues = [{ value: 'ABONA' }, { value: 'ACUERDO' }];
    actualDate: Date;
    minStartDate: Date;
    renterForm: FormGroup;
    capitalValueNumber: number = 0;
    interestValueNumber: number = 0;
    totalValueNumber: number = 0;

    constructor(
        private fb: FormBuilder,
        private _renterService: RenterService,
        private _renterFormService: RenterFormService,
        private _snackbarService: SnackbarService,
        private router: Router,
        private _route: ActivatedRoute,
    ) {
        this.actualDate = new Date();
        this.minStartDate = new Date();

        this.renterForm = this.fb.group({
            name: ['', [Validators.required, this._renterFormService.noWhitespaceValidator()]],
            nit: [null, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(4), Validators.maxLength(15)]],
            locations: [null, [Validators.required, this._renterFormService.noWhitespaceValidator()]],
            internal_external: [null, Validators.required],
            activity: ['', [Validators.required, this._renterFormService.noWhitespaceValidator()]],
            initial_wallet_balance: [null, Validators.required],
            actual_wallet_balance: [null, Validators.required],
            normal_monthly_billing: [null, Validators.required],
            status: [''],
            payment_agreement: ['', this._renterFormService.noWhitespaceValidator()],
            agreement_date: [null],
            capital_value: [null],
            interest_value: [null],
            total_value: [null],
            agreed_value: [null],
            quota_value: [null],
            quotas_number: [null],
            periodicity: [null],
            start_date: [null],
            initial_overdue_bill_date: [null],
            agreement_observations: ['', this._renterFormService.noWhitespaceValidator()],
            agreement_expiration_date: [null],
            agreement_fulfillment: [null],
            january_bill: [null],
            january_payment_detail: [null],
            january_capital_payment: [null],
            january_payment_type: [null],
            february_bill: [null],
            february_payment_detail: [null],
            february_capital_payment: [null],
            february_payment_type: [null],
            march_bill: [null],
            march_payment_detail: [null],
            march_capital_payment: [null],
            march_payment_type: [null],
            april_bill: [null],
            april_payment_detail: [null],
            april_capital_payment: [null],
            april_payment_type: [null],
            may_bill: [null],
            may_payment_detail: [null],
            may_capital_payment: [null],
            may_payment_type: [null],
            june_bill: [null],
            june_payment_detail: [null],
            june_capital_payment: [null],
            june_payment_type: [null],
            july_bill: [null],
            july_payment_detail: [null],
            july_capital_payment: [null],
            july_payment_type: [null],
            august_bill: [null],
            august_payment_detail: [null],
            august_capital_payment: [null],
            august_payment_type: [null],
            september_bill: [null],
            september_payment_detail: [null],
            september_capital_payment: [null],
            september_payment_type: [null],
            october_bill: [null],
            october_payment_detail: [null],
            october_capital_payment: [null],
            october_payment_type: [null],
            november_bill: [null],
            november_payment_detail: [null],
            november_capital_payment: [null],
            november_payment_type: [null],
            december_bill: [null],
            december_payment_detail: [null],
            december_capital_payment: [null],
            december_payment_type: [null],
            bad_debts: [null],
            remaining_agreement_payment: [null],
            payment_agreement_status: [null]
        });

        this.checkPaymentAgreementValue(this.renterForm.value.payment_agreement);
        this.renterForm.get('payment_agreement')?.valueChanges.subscribe((paymentAgreement) => {
            this.checkPaymentAgreementValue(paymentAgreement);
        });

        this.renterForm.get('capital_value')?.valueChanges.subscribe((inputCapitalValue) => {
            this.capitalValueNumber = this._renterFormService.localStringToNumber(inputCapitalValue);
            this.totalValueNumber = this.updateTotalValue();
            this.renterForm.get('total_value')?.setValue(this.totalValueNumber.toLocaleString('en-US'));
        });

        this.renterForm.get('interest_value')?.valueChanges.subscribe((inputInterestValue) => {
            this.interestValueNumber = this._renterFormService.localStringToNumber(inputInterestValue);
            this.totalValueNumber = this.updateTotalValue();
            this.renterForm.get('total_value')?.setValue(this.totalValueNumber.toLocaleString('en-US'));
        });
    }


    ngOnInit(): void {
        this._route.params.subscribe({
            next: (params) => {
                this.renterId = params['id'];
                this.getRenter(this.renterId);
            }
        });

        this.renterForm.get('total_value')?.disable();
        this.renterForm.get('quotas_number')?.disable();
        this.renterForm.get('agreement_fulfillment')?.disable();
        this.renterForm.get('remaining_agreement_payment')?.disable();
        this.renterForm.get('payment_agreement_status')?.disable();
    }

    getRenter(renterId: string) {
        this._renterService.getRenter(renterId).subscribe({
            next: (resData) => {
                this.renter = resData.renter;
                this.setRenterDataToInputs();
            },
            error: (err: HttpErrorResponse) => {
                this._snackbarService.showErrorMessage(err, "bottom", "red-snackbar", "Ha ocurrido un error al obtener la información del arrendatario");
                setTimeout(() => {
                    this.router.navigate(['central-abastos']);
                }, 1200);
            }
        });
    }

    editRenter() {

        const renter = {
            name: this.renterForm.value.name.trim().toUpperCase(),
            document: this.renter.document,
            type_person: this.renter.type_person,
            nit: this.renterForm.value.nit,
            locations: this.renterForm.value.locations.trim().toUpperCase(),
            internal_external: this.renterForm.value.internal_external,
            activity: this.renterForm.value.activity.trim().toUpperCase(),

            initial_wallet_balance: this._renterFormService.localStringToNumber(this.renterForm.value.initial_wallet_balance),
            actual_wallet_balance: this._renterFormService.localStringToNumber(this.renterForm.value.actual_wallet_balance),
            normal_monthly_billing: this._renterFormService.localStringToNumber(this.renterForm.value.normal_monthly_billing),
            
            status: this.renterForm.value.status,
            payment_agreement: this.renterForm.value.payment_agreement,
            agreement_date: this._renterFormService.dateToISOString(this.renterForm.value.agreement_date),
            capital_value: this.capitalValueNumber,
            interest_value: this.interestValueNumber,
            agreed_value: this.renterForm.value.agreed_value,
            quota_value: this._renterFormService.localStringToNumber(this.renterForm.value.quota_value),
            periodicity: this.renterForm.value.periodicity,
            start_date: this._renterFormService.dateToISOString(this.renterForm.value.start_date),
            initial_overdue_bill_date: this._renterFormService.dateToISOString(this.renterForm.value.initial_overdue_bill_date),
            agreement_observations: this._renterFormService.setAgreementObservationsValue(this.renterForm.value.agreement_observations),
            
            agreement_expiration_date: this._renterFormService.dateToISOString(this.renterForm.value.agreement_expiration_date),
            
            january_bill: this._renterFormService.localStringToNumber(this.renterForm.value.january_bill),
            january_payment_detail: this.renterForm.value.january_payment_detail.trim().toUpperCase(),
            january_capital_payment: this._renterFormService.localStringToNumber(this.renterForm.value.january_capital_payment),
            january_payment_type: this.renterForm.value.january_payment_type,
                    
            february_bill: this._renterFormService.localStringToNumber(this.renterForm.value.february_bill),
            february_payment_detail: this.renterForm.value.february_payment_detail.trim().toUpperCase(),
            february_capital_payment: this._renterFormService.localStringToNumber(this.renterForm.value.february_capital_payment),
            february_payment_type: this.renterForm.value.february_payment_type,
                
            march_bill: this._renterFormService.localStringToNumber(this.renterForm.value.march_bill),
            march_payment_detail: this.renterForm.value.march_payment_detail.trim().toUpperCase(),
            march_capital_payment: this._renterFormService.localStringToNumber(this.renterForm.value.march_capital_payment),
            march_payment_type: this.renterForm.value.march_payment_type,
             
            april_bill: this._renterFormService.localStringToNumber(this.renterForm.value.april_bill),
            april_payment_detail: this.renterForm.value.april_payment_detail.trim().toUpperCase(),
            april_capital_payment: this._renterFormService.localStringToNumber(this.renterForm.value.april_capital_payment),
            april_payment_type: this.renterForm.value.april_payment_type,

            may_bill: this._renterFormService.localStringToNumber(this.renterForm.value.may_bill),
            may_payment_detail: this.renterForm.value.may_payment_detail.trim().toUpperCase(),
            may_capital_payment: this._renterFormService.localStringToNumber(this.renterForm.value.may_capital_payment),
            may_payment_type: this.renterForm.value.may_payment_type,
                
            june_bill: this._renterFormService.localStringToNumber(this.renterForm.value.june_bill),
            june_payment_detail: this.renterForm.value.june_payment_detail.trim().toUpperCase(),
            june_capital_payment: this._renterFormService.localStringToNumber(this.renterForm.value.june_capital_payment),
            june_payment_type: this.renterForm.value.june_payment_type,
            
            july_bill: this._renterFormService.localStringToNumber(this.renterForm.value.july_bill),
            july_payment_detail: this.renterForm.value.july_payment_detail.trim().toUpperCase(),
            july_capital_payment: this._renterFormService.localStringToNumber(this.renterForm.value.july_capital_payment),
            july_payment_type: this.renterForm.value.july_payment_type,

            august_bill: this._renterFormService.localStringToNumber(this.renterForm.value.august_bill),
            august_payment_detail: this.renterForm.value.august_payment_detail.trim().toUpperCase(),
            august_capital_payment: this._renterFormService.localStringToNumber(this.renterForm.value.august_capital_payment),
            august_payment_type: this.renterForm.value.august_payment_type,

            september_bill: this._renterFormService.localStringToNumber(this.renterForm.value.september_bill),
            september_payment_detail: this.renterForm.value.september_payment_detail.trim().toUpperCase(),
            september_capital_payment: this._renterFormService.localStringToNumber(this.renterForm.value.september_capital_payment),
            september_payment_type: this.renterForm.value.september_payment_type,

            october_bill: this._renterFormService.localStringToNumber(this.renterForm.value.october_bill),
            october_payment_detail: this.renterForm.value.october_payment_detail.trim().toUpperCase(),
            october_capital_payment: this._renterFormService.localStringToNumber(this.renterForm.value.october_capital_payment),
            october_payment_type: this.renterForm.value.october_payment_type,

            november_bill: this._renterFormService.localStringToNumber(this.renterForm.value.november_bill),
            november_payment_detail: this.renterForm.value.november_payment_detail.trim().toUpperCase(),
            november_capital_payment: this._renterFormService.localStringToNumber(this.renterForm.value.november_capital_payment),
            november_payment_type: this.renterForm.value.november_payment_type,

            december_bill: this._renterFormService.localStringToNumber(this.renterForm.value.december_bill),
            december_payment_detail: this.renterForm.value.december_payment_detail.trim().toUpperCase(),
            december_capital_payment: this._renterFormService.localStringToNumber(this.renterForm.value.december_capital_payment),
            december_payment_type: this.renterForm.value.december_payment_type,

            bad_debts: this._renterFormService.localStringToNumber(this.renterForm.value.bad_debts)
        }
        
        this._renterService.updateRenter(this.renterId, renter).subscribe({
            next: (resData) => {
                this.fakeLoading();
            },
            error: (err: HttpErrorResponse) => {
                this._snackbarService.showErrorMessage(err, "bottom", "red-snackbar", "Ha ocurrido un error al actualizar el arrendatario");
            }
        });
    }

    setRenterDataToInputs() {
        this.renterForm.setValue({
            name: this.renter.name,
            nit: this.renter.nit,
            locations: this.renter.locations,
            internal_external: this.renter.internal_external,
            activity: this.renter.activity,
            initial_wallet_balance: this.renter.financial_information.initial_wallet_balance,
            actual_wallet_balance: this.renter.financial_information.actual_wallet_balance,
            normal_monthly_billing: this.renter.financial_information.normal_monthly_billing,
            status: this.renter.payment_agreement_rights.status,
            payment_agreement: this.renter.payment_agreement_rights.payment_agreement,
            agreement_date: this.renter.payment_agreement_rights.agreement_date,
            capital_value: this.renter.payment_agreement_rights.capital_value,
            interest_value: this.renter.payment_agreement_rights.interest_value,
            total_value: this.renter.payment_agreement_rights.total_value,
            agreed_value: this.renter.payment_agreement_rights.agreed_value,
            quota_value: this.renter.payment_agreement_rights.quota_value,
            quotas_number: this.renter.payment_agreement_rights.quotas_number,
            periodicity: this.renter.payment_agreement_rights.periodicity,
            start_date: this.renter.payment_agreement_rights.start_date,
            initial_overdue_bill_date: this.renter.payment_agreement_rights.initial_overdue_bill_date,
            agreement_observations: this.renter.payment_agreement_rights.agreement_observations,
            agreement_expiration_date: this.renter.tracking_payment_receipts.agreement_expiration_date,
            agreement_fulfillment: this.renter.tracking_payment_receipts.agreement_fulfillment,
            january_bill: this.renter.capital_payments.january.bill,
            january_payment_detail: this.renter.capital_payments.january.payment_detail,
            january_capital_payment: this.renter.capital_payments.january.capital_payment,
            january_payment_type: this.renter.capital_payments.january.payment_type,
            february_bill: this.renter.capital_payments.february.bill,
            february_payment_detail: this.renter.capital_payments.february.payment_detail,
            february_capital_payment: this.renter.capital_payments.february.capital_payment,
            february_payment_type: this.renter.capital_payments.february.payment_type,
            march_bill: this.renter.capital_payments.march.bill,
            march_payment_detail: this.renter.capital_payments.march.payment_detail,
            march_capital_payment: this.renter.capital_payments.march.capital_payment,
            march_payment_type: this.renter.capital_payments.march.payment_type,
            april_bill: this.renter.capital_payments.april.bill,
            april_payment_detail: this.renter.capital_payments.april.payment_detail,
            april_capital_payment: this.renter.capital_payments.april.capital_payment,
            april_payment_type: this.renter.capital_payments.april.payment_type,
            may_bill: this.renter.capital_payments.may.bill,
            may_payment_detail: this.renter.capital_payments.may.payment_detail,
            may_capital_payment: this.renter.capital_payments.may.capital_payment,
            may_payment_type: this.renter.capital_payments.may.payment_type,
            june_bill: this.renter.capital_payments.june.bill,
            june_payment_detail: this.renter.capital_payments.june.payment_detail,
            june_capital_payment: this.renter.capital_payments.june.capital_payment,
            june_payment_type: this.renter.capital_payments.june.payment_type,
            july_bill: this.renter.capital_payments.july.bill,
            july_payment_detail: this.renter.capital_payments.july.payment_detail,
            july_capital_payment: this.renter.capital_payments.july.capital_payment,
            july_payment_type: this.renter.capital_payments.july.payment_type,
            august_bill: this.renter.capital_payments.august.bill,
            august_payment_detail: this.renter.capital_payments.august.payment_detail,
            august_capital_payment: this.renter.capital_payments.august.capital_payment,
            august_payment_type: this.renter.capital_payments.august.payment_type,
            september_bill: this.renter.capital_payments.september.bill,
            september_payment_detail: this.renter.capital_payments.september.payment_detail,
            september_capital_payment: this.renter.capital_payments.september.capital_payment,
            september_payment_type: this.renter.capital_payments.september.payment_type,
            october_bill: this.renter.capital_payments.october.bill,
            october_payment_detail: this.renter.capital_payments.october.payment_detail,
            october_capital_payment: this.renter.capital_payments.october.capital_payment,
            october_payment_type: this.renter.capital_payments.october.payment_type,
            november_bill: this.renter.capital_payments.november.bill,
            november_payment_detail: this.renter.capital_payments.november.payment_detail,
            november_capital_payment: this.renter.capital_payments.november.capital_payment,
            november_payment_type: this.renter.capital_payments.november.payment_type,
            december_bill: this.renter.capital_payments.december.bill,
            december_payment_detail: this.renter.capital_payments.december.payment_detail,
            december_capital_payment: this.renter.capital_payments.december.capital_payment,
            december_payment_type: this.renter.capital_payments.december.payment_type,
            bad_debts: this.renter.bad_debts,
            remaining_agreement_payment: this.renter.remaining_agreement_payment,
            payment_agreement_status: this.renter.payment_agreement_status
        });

        this.formatMoneyFields();
        this.formatDateFields();
        this.minStartDate = new Date(this.renterForm.get('agreement_date')?.value) || null;
    }

    formatMoneyFields() {
        const moneyFields = [
            'initial_wallet_balance', 'actual_wallet_balance', 'normal_monthly_billing',
            'capital_value', 'interest_value', 'total_value', 'quota_value',
            'january_bill', 'january_capital_payment',
            'february_bill', 'february_capital_payment',
            'march_bill', 'march_capital_payment',
            'april_bill', 'april_capital_payment',
            'may_bill', 'may_capital_payment',
            'june_bill', 'june_capital_payment',
            'july_bill', 'july_capital_payment',
            'august_bill', 'august_capital_payment',
            'september_bill', 'september_capital_payment',
            'october_bill', 'october_capital_payment',
            'november_bill', 'november_capital_payment',
            'december_bill', 'december_capital_payment',
            'bad_debts', 'remaining_agreement_payment'
        ];
    
        moneyFields.forEach(fieldName => {
            const control = this.renterForm.get(fieldName);
            this._renterFormService.formatMoneyField(control);
        });
    }

    formatDateFields() {
        const dateFields = ['agreement_date', 'start_date', 'initial_overdue_bill_date', 'agreement_expiration_date'];
    
        dateFields.forEach(fieldName => {
            const control = this.renterForm.get(fieldName);
            this._renterFormService.formatDateField(control);
        });
    }

    setAgreementFulfillmentClassColor() {
        const agreementFulfillmentValue = this.renterForm.get('agreement_fulfillment')?.value;
        return this._renterFormService.setAgreementFulfillmentClassColor(agreementFulfillmentValue);
    }

    setPaymentAgreementStatusClassColor() {
        const paymentAgreementStatusValue = this.renterForm.get('payment_agreement_status')?.value;
        return this._renterFormService.setPaymentAgreementStatusClassColor(paymentAgreementStatusValue);
    }

    checkAgreedValue() {
        const capitalValueControl = this.renterForm.get('capital_value');
        const interestValueControl = this.renterForm.get('interest_value');
        const agreedValueControl = this.renterForm.get('agreed_value');

        if (this.capitalValueNumber != 0 && this.capitalValueNumber) {
            interestValueControl?.setValidators([Validators.required]);
            agreedValueControl?.setValidators([Validators.required]);
        } else if (this.interestValueNumber != 0 && this.interestValueNumber) {
            capitalValueControl?.setValidators([Validators.required]);
            agreedValueControl?.setValidators([Validators.required]);
        } else {
            capitalValueControl?.clearValidators();
            interestValueControl?.clearValidators();
            agreedValueControl?.clearValidators();
        }

        capitalValueControl?.updateValueAndValidity();
        interestValueControl?.updateValueAndValidity();
        agreedValueControl?.updateValueAndValidity();
    }

    checkPaymentAgreementValue(paymentAgreement: string) {
        const agreementDateControl = this.renterForm.get('agreement_date');
        const capitalValueControl = this.renterForm.get('capital_value');
        const interestValueControl = this.renterForm.get('interest_value');
        const agreedValueControl = this.renterForm.get('agreed_value');
        const quotaValueControl = this.renterForm.get('quota_value');
        const periodicityControl = this.renterForm.get('periodicity');
        const startDateControl = this.renterForm.get('start_date');
        const initialOverdueBillDateControl = this.renterForm.get('initial_overdue_bill_date');
        const agreementObservationsControl = this.renterForm.get('agreement_observations');
        const agreementExpirationDateControl = this.renterForm.get('agreement_expiration_date');

        if (paymentAgreement === 'SIN REALIZAR') {
            agreementDateControl?.disable(); agreementDateControl?.clearValidators(); agreementDateControl?.setValue(null);
            capitalValueControl?.disable(); capitalValueControl?.clearValidators(); capitalValueControl?.setValue(null);
            interestValueControl?.disable(); interestValueControl?.clearValidators(); interestValueControl?.setValue(null);
            agreedValueControl?.disable(); agreedValueControl?.clearValidators(); agreedValueControl?.setValue(null);
            quotaValueControl?.disable(); quotaValueControl?.clearValidators(); quotaValueControl?.setValue(null);
            periodicityControl?.disable(); periodicityControl?.clearValidators(); periodicityControl?.setValue(null);
            startDateControl?.disable(); startDateControl?.clearValidators(); startDateControl?.setValue(null);
            initialOverdueBillDateControl?.disable(); initialOverdueBillDateControl?.clearValidators(); initialOverdueBillDateControl?.setValue(null);
            agreementObservationsControl?.disable(); agreementObservationsControl?.clearValidators(); agreementObservationsControl?.setValue("SIN OBSERVACIÓN DEL ACUERDO");
            agreementExpirationDateControl?.disable(); agreementExpirationDateControl?.clearValidators(); agreementExpirationDateControl?.setValue(null);
        } else {
            agreementDateControl?.enable(); agreementDateControl?.setValidators([Validators.required]);
            capitalValueControl?.enable(); capitalValueControl?.setValidators([Validators.required]);
            interestValueControl?.enable(); interestValueControl?.setValidators([Validators.required]);
            agreedValueControl?.enable(); agreedValueControl?.setValidators([Validators.required]);
            quotaValueControl?.enable(); quotaValueControl?.setValidators([Validators.required]);
            periodicityControl?.enable(); periodicityControl?.setValidators([Validators.required]);
            startDateControl?.enable(); startDateControl?.setValidators([Validators.required]);
            initialOverdueBillDateControl?.enable(); initialOverdueBillDateControl?.setValidators([Validators.required]);
            agreementObservationsControl?.enable(); agreementObservationsControl?.setValidators([Validators.required]);
            agreementExpirationDateControl?.enable(); agreementExpirationDateControl?.setValidators([Validators.required]);
        }

        agreementDateControl?.updateValueAndValidity();
        capitalValueControl?.updateValueAndValidity();
        interestValueControl?.updateValueAndValidity();
        agreedValueControl?.updateValueAndValidity();
        quotaValueControl?.updateValueAndValidity();
        periodicityControl?.updateValueAndValidity();
        startDateControl?.updateValueAndValidity();
        initialOverdueBillDateControl?.updateValueAndValidity();
        agreementObservationsControl?.updateValueAndValidity();
        agreementExpirationDateControl?.updateValueAndValidity();
    }

    updateTotalValue(): number {
        if ((this.capitalValueNumber != 0 && this.capitalValueNumber != undefined && this.capitalValueNumber != null) && (this.interestValueNumber != 0 && this.interestValueNumber != undefined && this.interestValueNumber != null)) {
            const totalValue = this.capitalValueNumber + this.interestValueNumber;
            return totalValue;
        } 
        return 0; 
    }
    
    updateMinStartDate(event: MatDatepickerInputEvent<Date>) {
        const selectedAgreementDate: Date | null = event.value;

        if (selectedAgreementDate) {
            this.minStartDate = selectedAgreementDate;
            this.renterForm.get('start_date')?.updateValueAndValidity();
        } else {
            this.renterForm.get('start_date')?.updateValueAndValidity();
        }
    }

    fakeLoading() {
        this.loading = true;
        setTimeout(() => {
            this.router.navigate(['central-abastos']);
            this._snackbarService.snackbarMessage("Arrendatario actualizado exitosamente", "bottom", "green-snackbar");
        }, 1300);
    }
}