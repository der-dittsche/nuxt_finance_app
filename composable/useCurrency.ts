export const useCurrency = (amount: number | Ref<number>, currencyCode: 'USD' | 'EUR' | 'GBP') => {
    const currency = computed(() => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
        }).format(isRef(amount) ? amount.value : amount);
    });

    return {
        currency,
    };
};