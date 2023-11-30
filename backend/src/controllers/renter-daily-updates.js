const moment = require('moment');
const Renter = require('../models/renter');

async function updateDailyRentersData() {
    try {
        var current_date = moment();
        const rentersToUpdate = await Renter.find();

        for (const renter of rentersToUpdate) {
            // Payment Agreement Rights
            if (renter.payment_agreement_rights.initial_overdue_bill_date != null && renter.payment_agreement_rights.initial_overdue_bill_date.toString().trim() != '') {
                var diff_overdue_months = Math.round((current_date.diff(renter.payment_agreement_rights.initial_overdue_bill_date, 'months', true)) * 100) / 100;
                var diff_expired_days = current_date.diff(renter.payment_agreement_rights.initial_overdue_bill_date, 'days');

                diff_overdue_months <= 0 ? renter.financial_information.overdue_months = 0 : renter.financial_information.overdue_months = diff_overdue_months;
                diff_expired_days <= 0 ? renter.payment_agreement_rights.expired_days = 0 : renter.payment_agreement_rights.expired_days = diff_expired_days;
            }

            // Tracking Payment Receipts
            if (renter.tracking_payment_receipts.agreement_expiration_date != null && renter.tracking_payment_receipts.agreement_expiration_date != '') {

                var agreement_expiration_date_moment = moment(renter.tracking_payment_receipts.agreement_expiration_date.toISOString().slice(0, 10));

                if (renter.payment_agreement_rights.start_date != null && renter.payment_agreement_rights.start_date.toString().trim() != '') {
                    if (current_date <= agreement_expiration_date_moment) {
                        renter.tracking_payment_receipts.agreement_fulfillment = "SI CUMPLE";
                    } else {
                        renter.tracking_payment_receipts.agreement_fulfillment = "NO CUMPLE";
                    }
                } else {
                    renter.tracking_payment_receipts.agreement_fulfillment = "SIN ACUERDO";
                } 
            }
            
            await renter.save();
        }

        console.log('Actualización diaria de arrendatarios completada con éxito');
    } catch (error) {
        console.error('Error al realizar la actualización diaria de arrendatarios:', error);
    }
}

module.exports = updateDailyRentersData;