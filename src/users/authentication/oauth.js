import passport from "passport";
import GoogleStrategy from "passport-google-oauth20"
import userModel from "../schema.js";
import { JWtAuthenticate } from "./tools.js";

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: `${process.env.API_URL}/user/googleRedirect`
}, async (accessToken, refreshToken, googleProfile, next) => {
try {
    const user = await userModel.findOne({googleId: googleProfile.id})
    if(user){
        console.log(user)
     const tokens = await JWtAuthenticate(user) 
     next(null, {tokens})
     console.log("tokens if already exist",tokens)
    } else {
        const newUser = {
         username: googleProfile.name.givenName,
           email: googleProfile.emails[0].value,
           avatar: googleProfile.photos[0].value,
           googleId: googleProfile.id
    }
    const createdUser = new userModel(newUser)
    const savedUser = await createdUser.save()
    const tokens = await JWtAuthenticate(savedUser)
    console.log("tokens",tokens)
    next(null, {tokens})
   }
} catch (error) {
    next(error)
}
})

passport.serializeUser(function(data, next){
    next(null, data)
})

export default googleStrategy