"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./app/routes"));
const cors_1 = __importDefault(require("cors"));
const globalError_1 = __importDefault(require("./middleware/globalError"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['https://independent-mart.vercel.app', 'http://localhost:3000', 'https://shop.rodro.online'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.send("server is listenting");
});
app.use(globalError_1.default);
exports.default = app;
