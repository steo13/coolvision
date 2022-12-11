import express from 'express'
import passport from 'passport'
import env from './environment'

const CLIENT_URL = `${env.app.scheme}://${env.app.host}:${env.app.port}/projects`;
const router = express.Router()

router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: req.user,
        });
    }
});

router.get("/login/failed", (req, res) => {
    res.status(200).json({
        success: false,
        message: "Login failed",
        user: null
    });
});

router.get("/logout", (req, res) => {
    req.logout((err) => console.log(err));
    res.redirect(CLIENT_URL);
});
  
router.get("/google", passport.authenticate("google", { 
    scope: [
        "profile",
        "https://www.googleapis.com/auth/userinfo.email"
    ] 
}));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: CLIENT_URL,
        failureRedirect: CLIENT_URL,
    })
);

export { router }