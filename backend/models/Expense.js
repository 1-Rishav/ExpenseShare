const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        payer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            required: true,
        },
        splitType: {
            type: String,
            enum: ['EQUAL', 'EXACT', 'PERCENTAGE'],
            default: 'EQUAL',
        },
        splits: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                amount: {
                    type: Number, // Calculated or Explicit amount owed
                },
                percentage: {
                    type: Number, // For percentage splits
                },
            },
        ],
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
