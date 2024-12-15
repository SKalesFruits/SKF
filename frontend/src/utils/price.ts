export const calculateDiscountedPrice = (originalPrice: number): number => {
  const discountPercentage = 5;
  const discountedPrice = originalPrice * (1 - discountPercentage / 100);
  return Number(discountedPrice.toFixed(2));
};