import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(__dirname, "../../.env") });

export const API_KEY = process.env.API_KEY;
export const ENCRYPTION_SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;
export const SERVER_URL = process.env.SERVER_URL;
export const SERVER_PATH = process.env.SERVER_PATH;
export const PORT = process.env.PORT || 3000;

export const CLIENT_REDIRECT_URL = process.env.CLIENT_REDIRECT_URL;
