const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RenterSchema = Schema({
    name: {
        type: String,
        require: true
    },
    document: {
        type: String,
        unique: true
    },
    type_person: {
        type: String,
        require: true
    },
    nit: {
        type: String,
        unique: true
    },
    locations: {
        type: String,
        require: true
    },
    internal_external: {
        type: String,
        require: true
    },
    activity: {
        type: String,
        require: true
    },
    financial_information: {
        initial_wallet_balance: {
            type: Number,
            require: true
        },
        actual_wallet_balance: {
            type: Number,
            require: true
        },
        normal_monthly_billing : {
            type: Number,
            require: true
        },
        overdue_months: {
            type: Number,
            require: true
        }
    },
    payment_agreement_rights: {
        status: {
            type: String,
            require: false,
            default: "POR DEFINIR"
        },
        payment_agreement: {
            type: String,
            require: false,
            default: "SIN REALIZAR"
        },
        agreement_date: {
            type: Date,
            require: false
        },
        capital_value: {
            type: Number,
            require: false,
            default: 0
        },
        interest_value: {
            type: Number,
            require: false,
            default: 0
        },
        total_value: {
            type: Number,
            require: false,
            default: 0
        },
        agreed_value: {
            type: Number,
            require: false,
            default: 0
        },
        quota_value: {
            type: Number,
            require: false,
            default: 0
        },
        quotas_number: {
            type: Number,
            require: false,
            default: 0
        },
        periodicity: {
            type: Number,
            require: false,
            default: 0,
            enum: {
                values: [0, 15, 30],
                message: "Valor no valido"
            }
        },
        start_date: {
            type: Date,
            require: false
        },
        initial_overdue_bill_date: {
            type: Date,
            require: false
        },
        expired_days: {
            type: Number,
            require: false
        },
        agreement_observations: {
            type: String,
            require: false,
            default: "SIN OBSERVACIÓN DEL ACUERDO"
        },
    },
    tracking_payment_receipts: {
        agreement_expiration_date: {
            type: Date,
            require: false,
        },
        agreement_fulfillment: {
            type: String,
            require: false,
        },
    },
    capital_payments: {
        january: {
            bill: {
                type: Number,
                require: false,
                default: 0
            },
            payment_detail: {
                type: String,
                require: false
            },
            capital_payment: {
                type: Number,
                require: false,
                default: 0
            },
            payment_type: {
                type: String,
                require: false
            }
        },
        february: {
            bill: {
                type: Number,
                require: false,
                default: 0
            },
            payment_detail: {
                type: String,
                require: false
            },
            capital_payment: {
                type: Number,
                require: false,
                default: 0
            },
            payment_type: {
                type: String,
                require: false
            }
        },
        march: {
            bill: {
                type: Number,
                require: false,
                default: 0
            },
            payment_detail: {
                type: String,
                require: false
            },
            capital_payment: {
                type: Number,
                require: false,
                default: 0
            },
            payment_type: {
                type: String,
                require: false
            }
        },
        april: {
            bill: {
                type: Number,
                require: false,
                default: 0
            },
            payment_detail: {
                type: String,
                require: false
            },
            capital_payment: {
                type: Number,
                require: false,
                default: 0
            },
            payment_type: {
                type: String,
                require: false
            }
        },
        may: {
            bill: {
                type: Number,
                require: false,
                default: 0
            },
            payment_detail: {
                type: String,
                require: false
            },
            capital_payment: {
                type: Number,
                require: false,
                default: 0
            },
            payment_type: {
                type: String,
                require: false
            }
        },
        june: {
            bill: {
                type: Number,
                require: false,
                default: 0
            },
            payment_detail: {
                type: String,
                require: false
            },
            capital_payment: {
                type: Number,
                require: false,
                default: 0
            },
            payment_type: {
                type: String,
                require: false
            }
        },
        july: {
            bill: {
                type: Number,
                require: false,
                default: 0
            },
            payment_detail: {
                type: String,
                require: false
            },
            capital_payment: {
                type: Number,
                require: false,
                default: 0
            },
            payment_type: {
                type: String,
                require: false
            }
        },
        august: {
            bill: {
                type: Number,
                require: false,
                default: 0
            },
            payment_detail: {
                type: String,
                require: false
            },
            capital_payment: {
                type: Number,
                require: false,
                default: 0
            },
            payment_type: {
                type: String,
                require: false
            }
        },
        september: {
            bill: {
                type: Number,
                require: false,
                default: 0
            },
            payment_detail: {
                type: String,
                require: false
            },
            capital_payment: {
                type: Number,
                require: false,
                default: 0
            },
            payment_type: {
                type: String,
                require: false
            }
        },
        october: {
            bill: {
                type: Number,
                require: false,
                default: 0
            },
            payment_detail: {
                type: String,
                require: false
            },
            capital_payment: {
                type: Number,
                require: false,
                default: 0
            },
            payment_type: {
                type: String,
                require: false
            }
        },
        november: {
            bill: {
                type: Number,
                require: false,
                default: 0
            },
            payment_detail: {
                type: String,
                require: false
            },
            capital_payment: {
                type: Number,
                require: false,
                default: 0
            },
            payment_type: {
                type: String,
                require: false
            }
        },
        december: {
            bill: {
                type: Number,
                require: false,
                default: 0
            },
            payment_detail: {
                type: String,
                require: false
            },
            capital_payment: {
                type: Number,
                require: false,
                default: 0
            },
            payment_type: {
                type: String,
                require: false
            }
        }
    },
    bad_debts: {
        type: Number,
        require: false,
        default: 0
    },
    total_balance: {
        type: Number,
        require: false,
        default: 0
    },
    remaining_agreement_payment: {
        type: Number,
        require: false,
        default: 0
    },
    payment_agreement_status: {
        type: String,
        require: false
    }
});

module.exports = mongoose.model("Renter", RenterSchema);