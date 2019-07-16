import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  team: {
    type: String,
    required: true,
    enum: [
      'QA',
      'UI',
      'DESIGN',
      'ADMIN',
    ],
  }
});

export default mongoose.model('Project', ProjectSchema, 'projects');