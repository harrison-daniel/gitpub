import mongoose, { Schema } from 'mongoose';

const entrySchema = new Schema(
  {
    title: String,
    address: String,
    description: String,
  },
  {
    timestamps: true,
  },
);

const Entry = mongoose.models.Entry || mongoose.model('Entry', entrySchema);

export default Entry;
