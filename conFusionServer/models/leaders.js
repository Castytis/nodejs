const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var leadersSchema = new Schema({
    name:  {
        type: String,
        required: true
    },
    image:  {
        type: String,
        required: true
    },
    designation: {
        type: String,
        default: ''
    },
    abbr: {
        type: String,
        required: true,
    },
    description:  {
        type: String,
        required: true
    },
    featured:  {
        type: Boolean,
        required: false
    }
});

var Leaders = mongoose.model('Leaders', leadersSchema);

module.exports = Leaders;