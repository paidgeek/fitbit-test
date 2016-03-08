var mongoose = require("mongoose");

var User = mongoose.model("User", {
   aboutMe: String,
   age: Number,
   avatar: String,
   aveargeDailySteps: Number,
   dateOfBirth: Date,
   displayName: String,
   fullName: String,
   distanceUnit: String,
   fitbitId: String,
   gender: String,
   glucoseUnit: String,
   height: Number,
   heightUnit: String,
   locale: String,
   weight: Number,
   weightUnit: String,
   timezone: String,
   country: String
});

User.fromFitbitProfile = function(profile) {
   var data = profile._json.user;

   return new User({
      aboutMe: data.aboutMe,
      age: data.age,
      avatar: data.avatar,
      aveargeDailySteps: data.aveargeDailySteps,
      dateOfBirth: data.dateOfBirth,
      displayName: profile.displayName,
      fullName: data.fullName,
      distanceUnit: data.distanceUnit,
      fitbitId: profile.id,
      gender: data.gender,
      glucoseUnit: data.glucoseUnit,
      height: data.height,
      heightUnit: data.heightUnit,
      locale: data.locale,
      weight: data.weight,
      weightUnit: data.weightUnit,
      timezone: data.timezone,
      country: data.country
   });
};

module.exports = {
   User: User
};
