import mongoose, { AnyExpression, Schema } from "mongoose";

export interface IClub {
  name: string;
  email: string;
  phone: string;
  location?: ILocation;
  subscription?: ISubscription;
  createAt?: any;
  updateAt?: any;
  _id?: string;
}
export interface ILocation {
  city: string;
  country: string;
  address: string;
}

export interface ISubscription {
  isActive: boolean;
  startDate: any;
  endDate: any;
  trial: {
    isTrial: boolean;
    startDate: any;
    endDate: any;
  };
  plan: {
    maxUsers: number;
    enableStats: boolean;
    enableClassProjections: boolean;
  };
  lastPaymentDate: any;
  paymentStatus: "active" | "pending" | "canceled" | "trial";
}

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: {
      city: { type: String },
      country: { type: String },
      address: { type: String },
    },

    subscription: {
      isActive: { type: Boolean, default: false },
      startDate: { type: Date },
      endDate: { type: Date },
      trial: {
        isTrial: { type: Boolean, default: false },
        startDate: { type: Date },
        endDate: { type: Date },
      },
      plan: {
        maxUsers: { type: Number, required: true, default: 2 },
        enableStats: { type: Boolean, default: false },
        enableClassProjections: { type: Boolean, default: false },
      },
      lastPaymentDate: { type: Date },
      paymentStatus: {
        type: String,
        enum: ["active", "pending", "canceled", "trial"],
        default: "pending",
      },
    },
  },
  { timestamps: true }
);

const Club = mongoose.models?.Club || mongoose.model("Club", clubSchema);

export default Club;

// function canAccessFeature(club, feature: "enableStats" | "enableClassProjections") {
//   const now = new Date();

//   const { subscription } = club;

//   const inTrial =
//     subscription.trial?.isTrial &&
//     subscription.trial.startDate &&
//     subscription.trial.endDate &&
//     now >= subscription.trial.startDate &&
//     now <= subscription.trial.endDate;

//   const inActivePlan =
//     subscription.isActive &&
//     subscription.endDate &&
//     now <= subscription.endDate;

//   const hasFeature = subscription.plan?.[feature] === true;

//   return (inTrial || inActivePlan) && hasFeature;
// }
