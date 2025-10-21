import express from 'express'
import { PaymentControllerSSL } from './payment.controller'

const router=express.Router()

router.post('/init-payment',PaymentControllerSSL.initPayment)



router.post('/validate-payment',PaymentControllerSSL.validatePayment)
router.post('/ipn', PaymentControllerSSL.handleIPN);
router.post('/success/:tran_id', PaymentControllerSSL.handleSuccess);

export const PaymentRoutesSsl=router