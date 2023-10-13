const mongoose = require('mongoose');

const STEMStudySetSchema = new mongoose.Schema({
    variety: { type: String, required: true },
    course: { type: String, required: true },
    unit: { type: String, required: true },
    difficulty: { type: String, required: true },
    type: { type: String, required: true },
    goal: { type: Number, required: true },
    uid: { type: String, required: true, unique: true },

});

const STEMStudySet = mongoose.model('STEMStudySet', STEMStudySetSchema);

module.exports = STEMStudySet;