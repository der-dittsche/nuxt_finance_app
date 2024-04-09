import type { Transaction } from "~/types/custom";

export const useFetchTransactions = () => {
    const transactions = ref<Transaction[]>([]);
    const supabase = useSupabaseClient();
    const pending = ref(false);

    const fetchTransactions = async () => {
        pending.value = true;
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select()
                .order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            transactions.value = data ?? [];
        } finally {
            pending.value = false;
        }
    };

    fetchTransactions();

    const income = computed(
        () => transactions.value.filter(t => t.type === 'Income')
    );
    const expense = computed(
        () => transactions.value.filter(t => t.type === 'Expense')
    );
    const incomeCount = computed(() => income.value.length);
    const expenseCount = computed(() => expense.value.length);

    const incomeTotal = computed(
        () => income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
    );
    const expenseTotal = computed(
        () => expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
    );

    const transactionsGroupedByDate = computed(() => {
        let grouped: Record<string, Transaction[]> = {};

        for (const transaction of transactions.value) {
            const date = new Date(transaction.created_at).toDateString().split('T')[0];

            if (!grouped[date]) {
                grouped[date] = [];
            }

            grouped[date].push(transaction);
        }
        return grouped;
    });

    const refresh = async () => {
        await fetchTransactions();
    };

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
    };
};
