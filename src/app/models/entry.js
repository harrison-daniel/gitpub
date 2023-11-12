import mongoose, { Schema } from 'mongoose';

const entrySchema = new Schema(
  {
    date: Date,
    title: String,
    cityStateAddress: String,
    streetAddress: String,
    description: String,
    websiteUrl: String,
    // title: { type: String, required: true },
    // streetAddress: { type: String, required: false },
    // cityStateAddress: { type: String, required: false },
    // description: { type: String, required: false },
    // date: { type: Date, required: false },
    // websiteUrl: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

const Entry = mongoose.models.Entry || mongoose.model('Entry', entrySchema);

export default Entry;
