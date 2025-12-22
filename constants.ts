
export const COMMISSION_RATE = 0.005; // 0.5%
export const APP_NAME = "GHAR BAZAR";
export const PRIMARY_COLOR = "#4f46e5"; // Indigo 600
export const SECONDARY_COLOR = "#10b981"; // Emerald 500

export const calculateCommission = (price: number) => {
  return price * COMMISSION_RATE;
};
