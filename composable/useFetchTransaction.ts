import type { Transaction, Period } from "~/types/custom";

export const useFetchTransactions = (period: Ref<Period>) => {
    const supabase = useSupabaseClient()
    const transactions = ref<Transaction[]>([])
    const pending = ref(false)

    const income = computed(
        () => transactions.value.filter(t => t.type === 'Income')
    )
    const expense = computed(
        () => transactions.value.filter(t => t.type === 'Expense')
    )

    const incomeCount = computed(() => income.value.length)
    const expenseCount = computed(() => expense.value.length)

    const incomeTotal = computed(
        () => income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
    )
    const expenseTotal = computed(
        () => expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
    )

    const fetchTransactions = async () => {
        pending.value = true;
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select()
                .gte('created_at', period.value.from.toISOString())
                .lte('created_at', period.value.to.toISOString())
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching transactions:', error);
                return [];
            }

            return data;
        } catch (error) {
            console.error('An error occurred while fetching transactions:', error);
            return [];
        } finally {
            pending.value = false;
        }
    };

    const refresh = async () => {
        try {
            const newTransactions = await fetchTransactions();
            if(Array.isArray(newTransactions)) {
                transactions.value = newTransactions;
            }
            else {
                console.error('Expected an array of transactions, got', newTransactions);
            }
        } catch (error) {
            console.error('An error occurred while refreshing the transactions:', error);
        }
    };

    watch(period, async () => await refresh())

    const transactionsGroupedByDate = computed(() => {
        let grouped: {[key: string]: Transaction[]} = {}

        for (const transaction of transactions.value) {
            const date = new Date(transaction.created_at).toISOString().split('T')[0]

            if (!grouped[date]) {
                grouped[date] = []
            }

            grouped[date].push(transaction)
        }

        return grouped
    })

    return {
        transactions: {
            all: transactions,
            grouped: {
                byDate: transactionsGroupedByDate
            },
            income,
            expense,
            incomeTotal,
            expenseTotal,
            incomeCount,
            expenseCount
        },
        refresh,
        pending
    }
}