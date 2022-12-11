import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const soldSchema = new Schema({
    _id_project: {
        type: String,
        required: true,
    },
    initial_month: {
        type: String,
        required: true,
    },
    final_month: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    total_valued: {
        type: Number,
        required: true
    },
    total_commercial: {
        type: Number,
        required: true
    },
    planning: [
        {
            month: { type: String, required: true },
            year: { type: String, required: true },
            valued: { type: Number, required: true },
            commercial: { type: Number, required: true }
        }
    ]
});

const SoldSchema = mongoose.model('Sold', soldSchema)

export { SoldSchema }