"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutesSsl = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const router = express_1.default.Router();
router.post('/init-payment', payment_controller_1.PaymentControllerSSL.initPayment);
// router.get('/validate-payment',PaymentControllerSSL.validatePayment)
router.post('/ipn', payment_controller_1.PaymentControllerSSL.handleIPN);
// router.post('/success/', PaymentControllerSSL.handleSuccess);
exports.PaymentRoutesSsl = router;
