import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  clicks: { type: Number, default: 0 }
});

const Url = mongoose.model("Url", urlSchema);
export default Url;
