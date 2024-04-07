<script setup lang="ts">
import {transactionViewOptions} from "~/constants";
import Transaction from "~/components/transaction.vue";
const selectedView = ref(transactionViewOptions[1])
</script>

<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">
      Summary
    </h1>
    <div>
      <USelectMenu :options="transactionViewOptions" v-model="selectedView" />
    </div>
  </section>

  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
    <Trend color="green" title="Income" :amount="4000" :last-amount="3000" :loading="false" />
    <Trend color="red" title="Expense" :amount="4000" :last-amount="5000" :loading="false" />
    <Trend color="green" title="Investments" :amount="4000" :last-amount="3000" :loading="false"/>
    <Trend color="red" title="Savings" :amount="4000" :last-amount="8000" :loading="true" />
  </section>

  <section>
    <Transaction />
    <Transaction />
    <Transaction />
    <Transaction />
  </section>
</template>

<style scoped>

</style>