<template>
  <q-page class="q-ma-sm">
    <!-- Exemplo do uso de Tabelas -->
    <Table
      title="teste"
      :columns="columns"
      :data="data"
      ref="tableRef"
      :filter="filter"
    >
      <!-- Exportar para CSV -->
      <template v-slot:top-right>
        <q-btn
          color="primary"
          icon-right="archive"
          label="Exportar para csv"
          no-caps
          @click="exportToCSV"
        />
      </template>

      <!-- Filtro -->
      <template v-slot:top-left>
        <q-input filled dense debounce="300" v-model="filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </Table>
  </q-page>
</template>

<script>
import Table from 'components/table';

export default {
  name: 'Tables',
  components: {
    Table,
  },
  data() {
    return {
      // Dados da Tabela
      columns: [],
      data: [],
      tableRef: null,
      filter: '',
    };
  },
  methods: {
    exportToCSV() {
      this.$nextTick(() => this.$refs.tableRef.exportTable());
    },
  },
};
</script>

<style lang="sass" scoped>
</style>
