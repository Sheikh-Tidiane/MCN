import api from './api';

export const PaymentService = {
	createStripeIntent: async ({ amount, currency = 'xof', metadata = {} }) => {
		const { data } = await api.post('/paiement/stripe/intent', { amount, currency, metadata });
		return data.client_secret;
	},
};

export default PaymentService;
