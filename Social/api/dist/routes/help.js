"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = void 0;
const nodemailer_1 = require("nodemailer");
require("dotenv/config");
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const emailVerification_1 = __importDefault(require("../db/models/emailVerification"));
const { AUTH_EMAIL, AUTH_PASSWORD, APP_URL } = process.env;
let transporter = (0, nodemailer_1.createTransport)({
    host: "smtp.gmail.com",
    secure: true,
    auth: {
        user: AUTH_EMAIL,
        pass: AUTH_PASSWORD
    }
});
const sendVerificationEmail = (user, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, email, lastName } = user;
    const token = _id + (0, uuid_1.v4)();
    const link = `${APP_URL}usrs/verify/R${_id}/${token}`;
    const mailObject = {
        to: email,
        subject: "Email Verification",
        html: `<div
                    style='font-family: Arial, sans-serif; font-size: 20px; color: #333; background-color: #f7f7f7; padding: 20px; border-radius: 5px;'>
                    <h3 style="color: rgb(8, 56, 188)">Please verify your email address</h3>
                    <hr>
                    <h4>Hi ${lastName},</h4>
                    <p>
                        Please verify your email address so we can know that it's really you.
                        <br>
                    <p>This link <b>expires in 1 hour</b></p>
                    <br>
                    <a href=${link}
                        style="color: #fff; padding: 14px; text-decoration: none; background-color: #000;  border-radius: 8px; font-size: 18px;">Verify
                        Email Address</a>
                    </p>
                    <div style="margin-top: 20px;">
                        <h5>Best Regards</h5>
                        <h5>Connect Team</h5>
                    </div>
                </div>`
    };
    try {
        const hasedToken = yield (0, bcrypt_1.hash)(token, 10);
        const newVerifiedEmail = yield emailVerification_1.default.create({
            userId: _id,
            token: hasedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });
        if (newVerifiedEmail) {
            transporter
                .sendMail(mailObject)
                .then(() => {
                res.status(201).send({
                    success: "PENDING",
                    message: "Verification email has deen sent to your account. Check your email for further instructions."
                });
            })
                .catch((err) => {
                console.log(err);
                res.status(404).json({ messaage: "Somthing went wrong" });
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ messaage: "Somthing went wrong" });
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
