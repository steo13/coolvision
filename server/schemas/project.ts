import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    jira: {
        type: String,
        required: true,
    },
    sold: [
        {
            month: { type: String, required: true },
            assignments: [
                {
                    _id_user: { type: String, required: true },
                    assigned: { type: Number, required: true }
                }
            ]
        }
    ]
});

const ProjectSchema = mongoose.model('Project', projectSchema)

export { ProjectSchema }