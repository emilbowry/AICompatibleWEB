// server/src/utils/pricing.ts
const BASE_PRICES_CENTS = {
    consulting: 100,
    training: 133,
};
const calculatePrice = (serviceType, participants) => {
    const basePrice = BASE_PRICES_CENTS[serviceType] || 0;
    // 3. Calculate total price.
    return basePrice * participants;
};
const SUCCESS_URL_PATH = "/booking-success";
const CANCEL_URL_PATH = "/booking-cancel";
export { calculatePrice, CANCEL_URL_PATH, SUCCESS_URL_PATH };
