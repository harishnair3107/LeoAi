import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const registerUser = async (req, res) => {
try {
const { name, email, password } = req.body;


const exists = await User.findOne({ email });
if (exists) return res.status(400).json({ msg: "User already exists" });


const hashed = await bcrypt.hash(password, 10);


const user = await User.create({ name, email, password: hashed });


res.json({ msg: "Registered Successfully" });
} catch (err) {
res.status(500).json({ msg: "Error", err });
}
};


export const loginUser = async (req, res) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });


if (!user) return res.status(400).json({ msg: "Invalid Credentials" });


const match = await bcrypt.compare(password, user.password);
if (!match) return res.status(400).json({ msg: "Invalid Credentials" });


const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
expiresIn: "7d",
});


res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
} catch (err) {
res.status(500).json({ msg: "Error", err });
}
};