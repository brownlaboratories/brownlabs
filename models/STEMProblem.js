const mongoose = require('mongoose');

const STEMProblemSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: Array,},
    answer: { type: String, required: true },
    metadata: {
        format: { type: String, required: true },
        difficulty: { type: String, required: true },
        course: { type: String, required: true },
        unit: { type: String, required: true },
        // parentQuestionId: { type: String, required: true },
    }
});

const STEMProblem = mongoose.model('STEMProblem', STEMProblemSchema);
module.exports = STEMProblem;
