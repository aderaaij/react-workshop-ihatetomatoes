import accounting from 'accounting';

export const priceFormat = (price) => {
  return accounting.formatMoney(price, {symbol: '$', precision: 0});
}