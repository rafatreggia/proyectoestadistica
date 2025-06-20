import mongoose, { Schema } from "mongoose";

const invitationSchema = new mongoose.Schema({
  clubId: { type: Schema.Types.ObjectId, ref: "Club", required: true },
  token: { type: String, required: true },
  userType: { type: String, required: true },
});

const Invitation =
  mongoose.models?.Invitation || mongoose.model("Invitation", invitationSchema);

export default Invitation;
