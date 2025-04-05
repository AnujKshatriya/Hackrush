import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import {User} from "../schema/userSchema.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get("/google", (req, res) => {
  const redirect_uri = "http://localhost:3000/api/auth/google/callback";
  const scope = encodeURIComponent("openid profile email");
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  res.redirect(authUrl);
});

router.get("/google/callback", async (req, res) => {
  const { code } = req.query;
  const redirect_uri = "http://localhost:3000/api/auth/google/callback";

  try {
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri,
      grant_type: "authorization_code",
    });

    const { access_token } = tokenRes.data;

    const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { sub, email, name } = userInfo.data;

    if (!email.endsWith("@iitgn.ac.in")) {
      return res.status(403).send("Only IITGN users allowed.");
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        googleId: sub,
        name,
        email,
        role: "Student",
      });
      await user.save();
    }
    console.log('====================================');
    console.log("hi");
    console.log('====================================');
    const token = jwt.sign({ useremail: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log(token)

    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
  } catch (err) {
    console.error("Google Auth Error:", err.response?.data || err.message || err);
    res.status(500).send("Authentication failed");
  }  
});

export default router;
