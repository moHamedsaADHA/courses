import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(v) {
          // التحقق من وجود كلمتين على الأقل
          if (!v || typeof v !== 'string') return false;
          const words = v.trim().split(/\s+/);
          return words.length >= 2;
        },
        message: 'يجب أن يحتوي الاسم على كلمتين على الأقل'
      }
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["instructor","student", "admin"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    grade: {
      type: String,
      required: true,
      enum: [
      
       "الصف الأول الثانوي",
      "الصف الثاني الثانوي علمي",
      "الصف الثاني الثانوي ادبي",
      "الصف الثالث الثانوي علمي",
      "الصف الثالث الثانوي ادبي",
       
      ]
    },
    phone: {
      type: String,
    },
    code: {
      type: String,
      trim: true,
      required: function() {
        return this.role === 'admin' || this.role === 'instructor';
      }
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    courseId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = mongoose.model("User", UserSchema);
