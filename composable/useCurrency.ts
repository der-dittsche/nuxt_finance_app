export const useCurrency = (amount: number, currencyCode: 'USD' | 'EUR' | 'GBP') => {
    const currency = computed(() => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode }).format(amount);
    });
    return {
        currency
    }
}