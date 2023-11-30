export interface Renter {
    _id?: string,
    name: string,
    document: string,
    type_person: string,
    nit: string,
    locations: string,
    internal_external: string,
    activity: string,
    financial_information: {
        initial_wallet_balance: number,
        actual_wallet_balance: number,
        normal_monthly_billing: number,
        overdue_months: number
    },
    payment_agreement_rights: {
        status: string,
        payment_agreement: string,
        agreement_date: Date,
        capital_value: number,
        interest_value: number,
        total_value: number,
        agreed_value: number,
        quota_value: number,
        quotas_number: number,
        periodicity: number,
        start_date: Date,
        initial_overdue_bill_date: Date,
        expired_days: number,
        agreement_observations: string
    },
    tracking_payment_receipts: {
        agreement_expiration_date: Date,
        agreement_fulfillment: string
    },
    capital_payments: {
        january: {
            bill: number,
            payment_detail: string,
            capital_payment: number,
            payment_type: string
        },
        february: {
            bill: number,
            payment_detail: string,
            capital_payment: number,
            payment_type: string
        },
        march: {
            bill: number,
            payment_detail: string,
            capital_payment: number,
            payment_type: string
        },
        april: {
            bill: number,
            payment_detail: string,
            capital_payment: number,
            payment_type: string
        },
        may: {
            bill: number,
            payment_detail: string,
            capital_payment: number,
            payment_type: string
        },
        june: {
            bill: number,
            payment_detail: string,
            capital_payment: number,
            payment_type: string
        },
        july: {
            bill: number,
            payment_detail: string,
            capital_payment: number,
            payment_type: string
        },
        august: {
            bill: number,
            payment_detail: string,
            capital_payment: number,
            payment_type: string
        },
        september: {
            bill: number,
            payment_detail: string,
            capital_payment: number,
            payment_type: string
        },
        october: {
            bill: number,
            payment_detail: string,
            capital_payment: number,
            payment_type: string
        },
        november: {
            bill: number,
            payment_detail: string,
            capital_payment: number,
            payment_type: string
        },
        december: {
            bill: number,
            payment_detail: string,
            capital_payment: number,
            payment_type: string
        }
    },
    bad_debts: number,
    total_balance: number,
    remaining_agreement_payment: number,
    payment_agreement_status: string
}