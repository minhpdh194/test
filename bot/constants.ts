import axios from "axios";

require("dotenv").config();

export const APP_URL = String(process.env.APP_URL);
export const TELEGRAM_TOKEN = String(process.env.TELEGRAM_TOKEN);
const SERVER_URL = String(process.env.SERVER_URL);

export const client = axios.create({
    baseURL: SERVER_URL
});