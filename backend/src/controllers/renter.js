const Renter = require('../models/renter');
const moment = require('moment');

var renterController = {

    createRenter: function (req, res) {
        const renter = new Renter();

        const params = req.body;
        var current_date = moment();

        // Renter information
        renter.name = params.name;
        renter.document = params.document;
        renter.type_person = params.type_person;
        renter.type_person == "NATURAL" ? renter.nit = params.document : renter.nit = params.nit;
        renter.locations = params.locations;
        renter.internal_external = params.internal_external;
        renter.activity = params.activity;

        // Financial information
        renter.financial_information.initial_wallet_balance = parseFloat(params.initial_wallet_balance);
        renter.financial_information.actual_wallet_balance = parseFloat(params.actual_wallet_balance);
        renter.financial_information.normal_monthly_billing = parseFloat(params.normal_monthly_billing);

        // Payment Agreement Rights
        renter.payment_agreement_rights.status = params.status || "POR DEFINIR";
        renter.payment_agreement_rights.payment_agreement = params.payment_agreement || "SIN REALIZAR";

        if (params.agreement_date == null || params.agreement_date.trim() == '') {
            renter.payment_agreement_rights.agreement_date = null;
        } else {
            renter.payment_agreement_rights.agreement_date = params.agreement_date;
        }

        if (params.capital_value == null || params.capital_value == undefined || isNaN(params.capital_value)) {
            renter.payment_agreement_rights.capital_value = 0;

        } else {
            renter.payment_agreement_rights.capital_value = params.capital_value;
        }

        if (params.interest_value == null || params.interest_value == undefined || isNaN(params.interest_value)) {
            renter.payment_agreement_rights.interest_value = 0;
            renter.payment_agreement_rights.interest_value = 0;
        } else {
            renter.payment_agreement_rights.interest_value = params.interest_value;
        }

        renter.payment_agreement_rights.total_value = parseFloat(renter.payment_agreement_rights.capital_value) + parseFloat(renter.payment_agreement_rights.interest_value);

        if (params.agreed_value == null || params.agreed_value == undefined || isNaN(params.agreed_value)) {
            renter.payment_agreement_rights.agreed_value = 0;
        } else {
            renter.payment_agreement_rights.agreed_value = parseFloat(params.agreed_value);
        }

        if (params.quota_value == null || params.quota_value == undefined || isNaN(params.quota_value)) {
            renter.payment_agreement_rights.quota_value = 0;
        } else {
            renter.payment_agreement_rights.quota_value = params.quota_value;
        }
    
        renter.payment_agreement_rights.quota_value == 0 ? renter.payment_agreement_rights.quotas_number = 0 : renter.payment_agreement_rights.quotas_number = Math.round((parseFloat(params.agreed_value) / parseFloat(params.quota_value)) * 10) / 10;
        renter.payment_agreement_rights.periodicity = params.periodicity || 0;

        if (params.start_date == null || params.start_date.toString().trim() == '') {
            renter.payment_agreement_rights.start_date = null;
        } else {
            renter.payment_agreement_rights.start_date = params.start_date;
        }

        if (params.initial_overdue_bill_date == null || params.initial_overdue_bill_date.trim() == '') {
            renter.payment_agreement_rights.initial_overdue_bill_date = null;
            renter.financial_information.overdue_months = 0;
            renter.payment_agreement_rights.expired_days = 0;
        } else {
            renter.payment_agreement_rights.initial_overdue_bill_date = params.initial_overdue_bill_date;
            var diff_overdue_months = Math.round((current_date.diff(params.initial_overdue_bill_date, 'months', true)) * 100) / 100;
            var diff_expired_days = current_date.diff(params.initial_overdue_bill_date, 'days');

            diff_overdue_months <= 0 ? renter.financial_information.overdue_months = 0 : renter.financial_information.overdue_months = diff_overdue_months;
            diff_expired_days <= 0 ? renter.payment_agreement_rights.expired_days = 0 : renter.payment_agreement_rights.expired_days = diff_expired_days;
        }

        renter.payment_agreement_rights.agreement_observations = params.agreement_observations || "SIN OBSERVACIÓN DEL ACUERDO";

        // Tracking Payment Receipts
        if (params.agreement_expiration_date == null || params.agreement_expiration_date.trim() == '') {
            renter.tracking_payment_receipts.agreement_expiration_date = null;
            renter.tracking_payment_receipts.agreement_fulfillment = "SIN ACUERDO";
        } else {
            renter.tracking_payment_receipts.agreement_expiration_date = params.agreement_expiration_date;
            var agreement_expiration_date_moment = moment(params.agreement_expiration_date);

            if (params.start_date != null && params.start_date.toString().trim() != '') {
                if (current_date <= agreement_expiration_date_moment) {
                    renter.tracking_payment_receipts.agreement_fulfillment = "SI CUMPLE";
                } else {
                    renter.tracking_payment_receipts.agreement_fulfillment = "NO CUMPLE";
                }
            } else {
                renter.tracking_payment_receipts.agreement_fulfillment = "SIN ACUERDO";
            }
        }

        // Capital Payments
        renter.capital_payments.january.bill = params.january_bill || 0;
        renter.capital_payments.january.payment_detail = params.january_payment_detail || "";
        renter.capital_payments.january.capital_payment = parseFloat(params.january_capital_payment || 0);
        renter.capital_payments.january.payment_type = params.january_payment_type || "";

        renter.capital_payments.february.bill = params.february_bill || 0;
        renter.capital_payments.february.payment_detail = params.february_payment_detail || "";
        renter.capital_payments.february.capital_payment = parseFloat(params.february_capital_payment || 0);
        renter.capital_payments.february.payment_type = params.february_payment_type || "";

        renter.capital_payments.march.bill = params.march_bill || 0;
        renter.capital_payments.march.payment_detail = params.march_payment_detail || "";
        renter.capital_payments.march.capital_payment = parseFloat(params.march_capital_payment || 0);
        renter.capital_payments.march.payment_type = params.march_payment_type || "";

        renter.capital_payments.april.bill = params.april_bill || 0;
        renter.capital_payments.april.payment_detail = params.april_payment_detail || "";
        renter.capital_payments.april.capital_payment = parseFloat(params.april_capital_payment || 0);
        renter.capital_payments.april.payment_type = params.april_payment_type || "";

        renter.capital_payments.may.bill = params.may_bill || 0;
        renter.capital_payments.may.payment_detail = params.may_payment_detail || "";
        renter.capital_payments.may.capital_payment = parseFloat(params.may_capital_payment || 0);
        renter.capital_payments.may.payment_type = params.may_payment_type || "";

        renter.capital_payments.june.bill = params.june_bill || 0;
        renter.capital_payments.june.payment_detail = params.june_payment_detail || "";
        renter.capital_payments.june.capital_payment = parseFloat(params.june_capital_payment || 0);
        renter.capital_payments.june.payment_type = params.june_payment_type || "";

        renter.capital_payments.july.bill = params.july_bill || 0;
        renter.capital_payments.july.payment_detail = params.july_payment_detail || "";
        renter.capital_payments.july.capital_payment = parseFloat(params.july_capital_payment || 0);
        renter.capital_payments.july.payment_type = params.july_payment_type || "";

        renter.capital_payments.august.bill = params.august_bill || 0;
        renter.capital_payments.august.payment_detail = params.august_payment_detail || "";
        renter.capital_payments.august.capital_payment = parseFloat(params.august_capital_payment || 0);
        renter.capital_payments.august.payment_type = params.august_payment_type || "";

        renter.capital_payments.september.bill = params.september_bill || 0;
        renter.capital_payments.september.payment_detail = params.september_payment_detail || "";
        renter.capital_payments.september.capital_payment = parseFloat(params.september_capital_payment || 0);
        renter.capital_payments.september.payment_type = params.september_payment_type || "";

        renter.capital_payments.october.bill = params.october_bill || 0;
        renter.capital_payments.october.payment_detail = params.october_payment_detail || "";
        renter.capital_payments.october.capital_payment = parseFloat(params.october_capital_payment || 0);
        renter.capital_payments.october.payment_type = params.october_payment_type || "";

        renter.capital_payments.november.bill = params.november_bill || 0;
        renter.capital_payments.november.payment_detail = params.november_payment_detail || "";
        renter.capital_payments.november.capital_payment = parseFloat(params.november_capital_payment || 0);
        renter.capital_payments.november.payment_type = params.november_payment_type || "";

        renter.capital_payments.december.bill = params.december_bill || 0;
        renter.capital_payments.december.payment_detail = params.december_payment_detail || "";
        renter.capital_payments.december.capital_payment = parseFloat(params.december_capital_payment || 0);
        renter.capital_payments.december.payment_type = params.december_payment_type || "";

        // Bad Debts
        renter.bad_debts = parseFloat(params.bad_debts || 0);

        // Total Balance
        renter.total_balance = renter.financial_information.actual_wallet_balance + renter.bad_debts;

        // Remaining Agreement Payment
        if (params.agreed_value == null || params.agreed_value == undefined || isNaN(params.agreed_value)) {
            renter.remaining_agreement_payment = 0;
        } else {
            renter.remaining_agreement_payment = renter.payment_agreement_rights.agreed_value - renter.capital_payments.january.capital_payment -
            renter.capital_payments.february.capital_payment - renter.capital_payments.march.capital_payment - renter.capital_payments.april.capital_payment -
            renter.capital_payments.may.capital_payment - renter.capital_payments.june.capital_payment - renter.capital_payments.july.capital_payment -
            renter.capital_payments.august.capital_payment - renter.capital_payments.september.capital_payment - renter.capital_payments.october.capital_payment -
            renter.capital_payments.november.capital_payment - renter.capital_payments.december.capital_payment;
        }

        // Payment Agreement Status
        if (renter.remaining_agreement_payment > 0) {
            renter.payment_agreement_status = "SIN COMPLETAR";
        } else {
            if (renter.payment_agreement_rights.payment_agreement == "SIN REALIZAR") {
                renter.payment_agreement_status = "SIN ACUERDO";
            } else {
                renter.payment_agreement_status = "COMPLETADO";
            }
        }


        renter.save().then((createdRenter) => {

            if (!createdRenter) {
                return res.status(404).send({ message: "Error al crear el arrendatario" });
            }

            return res.status(200).send({
                message: "Arrendatario creado exitosamente",
                renter: createdRenter
            });

        }).catch((err) => {
            console.log(err);
            return res.status(500).send({ message: `El arrendatario con documento "${renter.document}" o NIT "${renter.nit}" ya existe`, error: err });
        });
    },


    getRenter: async function (req, res) {
        const renterId = req.params.id

        try {
            const renter = await Renter.findById(renterId);

            if (!renter) {
                return res.status(404).send({ message: "El arrendatario no existe" });
            }

            return res.status(200).send({ renter });

        } catch (err) {
            res.status(500).send({ message: "El arrendatario no existe" })
        }
    },


    getRenters: async function (req, res) {

        try {
            const renters = await Renter.find();

            if (!renters) {
                return res.status(404).send({ message: "No hay arrendatarios por mostrar" });
            }

            return res.status(200).send({ renters });

        } catch (err) {
            return res.status(500).send({ message: "Error al mostrar los arrendatarios" });
        }
    },


    updateRenter: async function (req, res) {

        const renterId = req.params.id;
        const params = req.body;
        var current_date = moment();

        var renter = {
            name: params.name,
            document: params.document,
            type_person: params.type_person,
            nit: params.type_person == "NATURAL" ? nit = params.document : nit = params.nit,
            locations: params.locations,
            internal_external: params.internal_external,
            activity: params.activity,
            financial_information: {
                initial_wallet_balance: parseFloat(params.initial_wallet_balance),
                actual_wallet_balance: parseFloat(params.actual_wallet_balance),
                normal_monthly_billing: parseFloat(params.normal_monthly_billing),
                overdue_months: 0,
            },
            payment_agreement_rights: {
                status: params.status || "POR DEFINIR",
                payment_agreement: params.payment_agreement || "SIN REALIZAR",
                agreement_date: null,
                capital_value: 0,
                interest_value: 0,
                total_value: 0,
                agreed_value: 0,
                quota_value: 0,
                quotas_number: 0,
                periodicity: params.periodicity || 0,
                start_date: null,
                initial_overdue_bill_date: null,
                expired_days: 0,
                agreement_observations: params.agreement_observations || "SIN OBSERVACIÓN DEL ACUERDO"
            },
            tracking_payment_receipts: {
                agreement_expiration_date: null,
                agreement_fulfillment: ""
            },
            capital_payments: {
                january: {
                    bill: params.january_bill || 0,
                    payment_detail: params.january_payment_detail || "",
                    capital_payment: params.january_capital_payment || 0,
                    payment_type: params.january_payment_type || ""
                },
                february: {
                    bill: params.february_bill || 0,
                    payment_detail: params.february_payment_detail || "",
                    capital_payment: params.february_capital_payment || 0,
                    payment_type: params.february_payment_type || ""
                },
                march: {
                    bill: params.march_bill || 0,
                    payment_detail: params.march_payment_detail || "",
                    capital_payment: params.march_capital_payment || 0,
                    payment_type: params.march_payment_type || ""
                },
                april: {
                    bill: params.april_bill || 0,
                    payment_detail: params.april_payment_detail || "",
                    capital_payment: params.april_capital_payment || 0,
                    payment_type: params.april_payment_type || ""
                },
                may: {
                    bill: params.may_bill || 0,
                    payment_detail: params.may_payment_detail || "",
                    capital_payment: params.may_capital_payment || 0,
                    payment_type: params.may_payment_type || ""
                },
                june: {
                    bill: params.june_bill || 0,
                    payment_detail: params.june_payment_detail || "",
                    capital_payment: params.june_capital_payment || 0,
                    payment_type: params.june_payment_type || ""
                },
                july: {
                    bill: params.july_bill || 0,
                    payment_detail: params.july_payment_detail || "",
                    capital_payment: params.july_capital_payment || 0,
                    payment_type: params.july_payment_type || ""
                },
                august: {
                    bill: params.august_bill || 0,
                    payment_detail: params.august_payment_detail || "",
                    capital_payment: params.august_capital_payment || 0,
                    payment_type: params.august_payment_type || ""
                },
                september: {
                    bill: params.september_bill || 0,
                    payment_detail: params.september_payment_detail || "",
                    capital_payment: params.september_capital_payment || 0,
                    payment_type: params.september_payment_type || ""
                },
                october: {
                    bill: params.october_bill || 0,
                    payment_detail: params.october_payment_detail || "",
                    capital_payment: params.october_capital_payment || 0,
                    payment_type: params.october_payment_type || ""
                },
                november: {
                    bill: params.november_bill || 0,
                    payment_detail: params.november_payment_detail || "",
                    capital_payment: params.november_capital_payment || 0,
                    payment_type: params.november_payment_type || ""
                },
                december: {
                    bill: params.december_bill || 0,
                    payment_detail: params.december_payment_detail || "",
                    capital_payment: params.december_capital_payment || 0,
                    payment_type: params.december_payment_type || ""
                }
            },
            bad_debts: parseFloat(params.bad_debts || 0),
            total_balance: 0,
            remaining_agreement_payment: 0,
            payment_agreement_status: ""
        };

        // Payment Agreement Rights
        if (params.agreement_date == null || params.agreement_date.trim() == '') {
            renter.payment_agreement_rights.agreement_date = null;
        } else {
            renter.payment_agreement_rights.agreement_date = params.agreement_date;
        }

        if (params.capital_value == null || params.capital_value == undefined || isNaN(params.capital_value)) {
            renter.payment_agreement_rights.capital_value = 0;

        } else {
            renter.payment_agreement_rights.capital_value = params.capital_value;
        }

        if (params.interest_value == null || params.interest_value == undefined || isNaN(params.interest_value)) {
            renter.payment_agreement_rights.interest_value = 0;
            renter.payment_agreement_rights.interest_value = 0;
        } else {
            renter.payment_agreement_rights.interest_value = params.interest_value;
        }

        renter.payment_agreement_rights.total_value = parseFloat(renter.payment_agreement_rights.capital_value) + parseFloat(renter.payment_agreement_rights.interest_value);

        if (params.agreed_value == null || params.agreed_value == undefined || isNaN(params.agreed_value)) {
            renter.payment_agreement_rights.agreed_value = 0;
        } else {
            renter.payment_agreement_rights.agreed_value = parseFloat(params.agreed_value);
        }

        if (params.quota_value == null || params.quota_value == undefined || isNaN(params.quota_value)) {
            renter.payment_agreement_rights.quota_value = 0;
        } else {
            renter.payment_agreement_rights.quota_value = params.quota_value;
        }

        renter.payment_agreement_rights.quota_value == 0 ? renter.payment_agreement_rights.quotas_number = 0 : renter.payment_agreement_rights.quotas_number = Math.round((parseFloat(params.agreed_value) / parseFloat(params.quota_value)) * 10) / 10;

        if (params.start_date == null || params.start_date.toString().trim() == '') {
            renter.payment_agreement_rights.start_date = null;
        } else {
            renter.payment_agreement_rights.start_date = params.start_date;
        }

        if (params.initial_overdue_bill_date == null || params.initial_overdue_bill_date.trim() == '') {
            renter.payment_agreement_rights.initial_overdue_bill_date = null;
            renter.financial_information.overdue_months = 0;
            renter.payment_agreement_rights.expired_days = 0;
        } else {
            renter.payment_agreement_rights.initial_overdue_bill_date = params.initial_overdue_bill_date;
            var diff_overdue_months = Math.round((current_date.diff(params.initial_overdue_bill_date, 'months', true)) * 100) / 100;
            var diff_expired_days = current_date.diff(params.initial_overdue_bill_date, 'days');

            diff_overdue_months <= 0 ? renter.financial_information.overdue_months = 0 : renter.financial_information.overdue_months = diff_overdue_months;
            diff_expired_days <= 0 ? renter.payment_agreement_rights.expired_days = 0 : renter.payment_agreement_rights.expired_days = diff_expired_days;
        }


        // Tracking Payment Receipts
        if (params.agreement_expiration_date == null || params.agreement_expiration_date.trim() == '') {
            renter.tracking_payment_receipts.agreement_expiration_date = null;
            renter.tracking_payment_receipts.agreement_fulfillment = "SIN ACUERDO";
        } else {
            renter.tracking_payment_receipts.agreement_expiration_date = params.agreement_expiration_date;
            var agreement_expiration_date_moment = moment(params.agreement_expiration_date);

            if (params.start_date != null && params.start_date.toString().trim() != '') {
                if (current_date <= agreement_expiration_date_moment) {
                    renter.tracking_payment_receipts.agreement_fulfillment = "SI CUMPLE";
                } else {
                    renter.tracking_payment_receipts.agreement_fulfillment = "NO CUMPLE";
                }
            } else {
                renter.tracking_payment_receipts.agreement_fulfillment = "SIN ACUERDO";
            }
        }

        // Total Balance
        renter.total_balance = renter.financial_information.actual_wallet_balance + renter.bad_debts;

        // Remaining Agreement Payment
        if (params.agreed_value == null || params.agreed_value == undefined || isNaN(params.agreed_value)) {
            renter.remaining_agreement_payment = 0;
        } else {
            renter.remaining_agreement_payment = renter.payment_agreement_rights.agreed_value - renter.capital_payments.january.capital_payment -
            renter.capital_payments.february.capital_payment - renter.capital_payments.march.capital_payment - renter.capital_payments.april.capital_payment -
            renter.capital_payments.may.capital_payment - renter.capital_payments.june.capital_payment - renter.capital_payments.july.capital_payment -
            renter.capital_payments.august.capital_payment - renter.capital_payments.september.capital_payment - renter.capital_payments.october.capital_payment -
            renter.capital_payments.november.capital_payment - renter.capital_payments.december.capital_payment;
        }

        // Payment Agreement Status
        if (renter.remaining_agreement_payment > 0) {
            renter.payment_agreement_status = "SIN COMPLETAR";
        } else {
            if (renter.payment_agreement_rights.payment_agreement == "SIN REALIZAR") {
                renter.payment_agreement_status = "SIN ACUERDO";
            } else {
                renter.payment_agreement_status = "COMPLETADO";
            }
        }


        try {
            const existingRenterNit = await Renter.findOne({ nit: params.nit, _id: { $ne: renterId } });

            if (existingRenterNit) {
                return res.status(400).send({ message: "El NIT ingresado ya está en uso por otro arrendatario" });
            }

            const updatedRenter = await Renter.findByIdAndUpdate(renterId, renter, { new: true });

            if (!updatedRenter) {
                return res.status(404).send({ message: "El arrendatario a modificar no existe" });
            }

            return res.status(200).send({ message: "Arrendatario actualizado", renter: updatedRenter });

        } catch (err) {
            return res.status(500).send({ message: "Error al actualizar el arrendatario", error: err }); 
        }
    },

    deleteRenter: async function (req, res) {
        const renterId = req.params.id;

        try {
            const renterRemoved = await Renter.findByIdAndRemove(renterId);

            if (!renterRemoved) {
                return res.status(404).send({message: "El arrendatario a eliminar no existe"});
            }

            return res.status(200).send({message: "Arrendatario eliminado", renterRemoved});

        } catch (err) {
            console.log(err);
            return res.status(500).send({message: "Error al eliminar el arrendatario"});
        }
    }

};

module.exports = renterController;