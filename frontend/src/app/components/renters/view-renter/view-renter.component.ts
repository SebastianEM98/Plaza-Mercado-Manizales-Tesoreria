import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Renter } from 'src/app/interfaces/renter';
import { RenterService } from 'src/app/services/renter.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { RenterFormService } from 'src/app/services/renter-form.service';

@Component({
    selector: 'app-view-renter',
    templateUrl: './view-renter.component.html',
    styleUrls: ['./view-renter.component.css']
})
export class ViewRenterComponent implements OnInit {

    renter!: Renter;
    renterId: string = '';
    typePersonValues = [{ value: 'NATURAL' }, { value: 'JURÍDICA' }];
    internalExternalValues = [{ value: 'INTERNO' }, { value: 'EXTERNO' }];
    statusValues = [{ value: 'POR DEFINIR' }, { value: 'CON ACUERDO DE PAGO' }, { value: 'JURÍDICO' }, { value: 'JURÍDICO CON ACUERDO DE PAGO' }];
    periodicityValues = [{ value: 15, viewValue: 'QUINCENAL (15)'}, { value: 30, viewValue: 'MENSUAL (30)'}];
    paymentTypeValues = [{ value: 'ABONA' }, { value: 'ACUERDO' }];
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
        this.renterForm = this.fb.group({
            name: [''],
            document: [null],
            type_person: [null],
            nit: [null],
            locations: [null],
            internal_external: [null],
            activity: [''],
            initial_wallet_balance: [null],
            actual_wallet_balance: [null],
            normal_monthly_billing: [null],
            overdue_months: [null],
            status: [''],
            payment_agreement: [''],
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
            expired_days: [null],
            agreement_observations: [''],
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
            total_balance: [null],
            remaining_agreement_payment: [null],
            payment_agreement_status: [null]
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
                this.disableFormFields();
            }
        });
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

    setRenterDataToInputs() {
        this.renterForm.setValue({
            name: this.renter.name,
            document: this.renter.document,
            type_person: this.renter.type_person,
            nit: this.renter.nit,
            locations: this.renter.locations,
            internal_external: this.renter.internal_external,
            activity: this.renter.activity,
            initial_wallet_balance: this.renter.financial_information.initial_wallet_balance,
            actual_wallet_balance: this.renter.financial_information.actual_wallet_balance,
            normal_monthly_billing: this.renter.financial_information.normal_monthly_billing,
            overdue_months: this.renter.financial_information.overdue_months,
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
            expired_days: this.renter.payment_agreement_rights.expired_days,
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
            total_balance: this.renter.total_balance,
            remaining_agreement_payment: this.renter.remaining_agreement_payment,
            payment_agreement_status: this.renter.payment_agreement_status
        });

        this.formatMoneyFields();
        this.formatDateFields();
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
            'bad_debts', 'total_balance', 'remaining_agreement_payment'
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

    disableFormFields() {
        const formFields = [
            'name', 'document', 'type_person', 'nit', 'locations', 'internal_external', 'activity',
            'initial_wallet_balance', 'actual_wallet_balance', 'normal_monthly_billing', 'overdue_months',
            'status', 'payment_agreement', 'agreement_date', 'capital_value', 'interest_value', 'total_value', 
            'agreed_value', 'quota_value', 'quotas_number','periodicity', 'start_date', 'initial_overdue_bill_date', 
            'expired_days', 'agreement_observations', 'agreement_expiration_date', 'agreement_fulfillment',
            'january_bill', 'january_payment_detail', 'january_capital_payment', 'january_payment_type',
            'february_bill', 'february_payment_detail', 'february_capital_payment', 'february_payment_type',
            'march_bill', 'march_payment_detail', 'march_capital_payment', 'march_payment_type',
            'april_bill', 'april_payment_detail', 'april_capital_payment', 'april_payment_type',
            'may_bill', 'may_payment_detail', 'may_capital_payment', 'may_payment_type',
            'june_bill', 'june_payment_detail', 'june_capital_payment', 'june_payment_type',
            'july_bill', 'july_payment_detail', 'july_capital_payment', 'july_payment_type',
            'august_bill', 'august_payment_detail', 'august_capital_payment', 'august_payment_type',
            'september_bill', 'september_payment_detail', 'september_capital_payment', 'september_payment_type',
            'october_bill', 'october_payment_detail', 'october_capital_payment', 'october_payment_type',
            'november_bill', 'november_payment_detail', 'november_capital_payment', 'november_payment_type',
            'december_bill', 'december_payment_detail', 'december_capital_payment', 'december_payment_type',
            'bad_debts', 'total_balance', 'remaining_agreement_payment', 'payment_agreement_status'
        ];
    
        formFields.forEach(fieldName => {
            const control = this.renterForm.get(fieldName);
            control?.disable();
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

    updateTotalValue(): number {
        if ((this.capitalValueNumber != 0 && this.capitalValueNumber != undefined && this.capitalValueNumber != null) && (this.interestValueNumber != 0 && this.interestValueNumber != undefined && this.interestValueNumber != null)) {
            const totalValue = this.capitalValueNumber + this.interestValueNumber;
            return totalValue;
        } 
        return 0; 
    }
}