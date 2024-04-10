import { startOfYear, endOfYear, sub, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import type { Period } from "~/types/custom";

export const useSelectedTimePeriod = (period: Ref<string>) => {
    const current = computed<Period | undefined>(() => {
        switch (period.value) {
            case 'Yearly':
                return {
                    from: startOfYear(new Date()),
                    to: endOfYear(new Date())
                }
            case 'Daily':
                return {
                    from: startOfDay(new Date()),
                    to: endOfDay(new Date())
                }
            case 'Monthly':
            default:
                return {
                    from: startOfMonth(new Date()),
                    to: endOfMonth(new Date())
                }

        }
    });

    const previous = computed<Period | undefined>(() => {
        switch (period.value) {
            case 'Yearly':
                return {
                    from: startOfYear(sub(new Date(), {years: 1})),
                    to: endOfYear(sub(new Date(), {years: 1}))
                }
            case 'Daily':
                return {
                    from: startOfDay(sub(new Date(), {days: 1})),
                    to: endOfDay(sub(new Date(), {days: 1}))
                }
            case 'Monthly':
            default:
                return {
                    from: startOfMonth(sub(new Date(), {months: 1})),
                    to: endOfMonth(sub(new Date(), {months: 1}))
                }

        }
    });

    return { current, previous }
}