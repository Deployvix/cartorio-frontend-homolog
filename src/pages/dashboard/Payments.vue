<template>
<q-page class="q-pa-md">
  <!-- Filtro -->
  <q-card class="q-mb-md">
    <q-card-section>
      <q-expansion-item
        v-model="expanded"
        expand-separator
        icon="search"
        label="Filtros"
        header-class="text-h6"
      >
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-lg-3 q-px-sm-sm q-pt-sm-lg">
            <q-input
              autofocus
              v-model="search"
              label="Código"
              debounce="1000"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-lg-3 q-px-sm-sm q-pt-sm-lg">
            <q-select
              multiple
              v-model="filter.status"
              :options="statusOptions"
              label="Condição"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-lg-3 q-px-sm-sm q-pt-sm-lg">
            <q-input
              label="Início"
              v-model="filter.start"
              @focus="() => $refs.qstart.show()"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qstart"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="filter.start"
                      mask="DD/MM/YYYY"
                      @input="() => $refs.qstart.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-xs-12 col-sm-6 col-lg-3 q-px-sm-sm q-pt-sm-lg">
            <q-input
              label="Fim"
              v-model="filter.end"
              @focus="() => $refs.qend.show()"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qend"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="filter.end"
                      mask="DD/MM/YYYY"
                      @input="() => $refs.qend.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-xs-12 flex justify-center q-mt-lg">
            <q-btn
              @click="filterEntries"
              label="Filtrar"
              color="primary"
            />
          </div>
        </div>
      </q-expansion-item>
    </q-card-section>
  </q-card>

  <!-- Pagamentos -->
  <Table
    title="Pagamentos"
    :columns="columns"
    :data="data"
    ref="tableRef"
    :filter="search"
  >
    <!-- Status da comunicação -->
    <template v-slot:body-cell-status="props">
      <q-td :props="props">
        <q-badge
          :color="
            props.row.status === 'payed' ?
            'positive' :
            props.row.status === 'pending' ?
            'secondary' :
            props.row.status === 'late' ?
            'warning' :
            'negative'
          "
          class="text-white text-subtitle2"
        >
          {{
            props.row.status === 'payed' ?
            'Pago' :
            props.row.status === 'pending' ?
            'Pendente' :
            props.row.status === 'late' ?
            'Atrasado' :
            'Cancelado'
          }}
        </q-badge>
      </q-td>
    </template>

    <!-- Botão de ações da linha -->
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <div class="flex justify-center">
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>
                <q-icon name="monetization_on" size="sm" color="grey-8"/>
              </q-item-label>
              <q-item-label caption>
                Baixar Boleto
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>
                <q-icon name="receipt" size="sm" color="grey-8"/>
              </q-item-label>
              <q-item-label caption>
                Baixar NFE
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-td>
    </template>
  </Table>

</q-page>
</template>

<script>
import Table from 'components/table';
import {
  required,
  verifyEmail,
  verifyCPF,
  verifyCEP,
  maxLength,
  minLength,
  equalsTo,
} from '../../validations';

export default {
  name: 'NewUser',
  components: {
    Table,
  },
  data() {
    return {
      // Filtros
      expanded: !this.$q.platform.is.mobile,
      search: '',
      statusOptions: [
        { label: 'Todos', value: null },
        { label: 'Pago', value: 'payed' },
        { label: 'Pendente', value: 'pending' },
        { label: 'Atrasado', value: 'late' },
        { label: 'Cancelado', value: 'canceled' },
      ],
      clients: [],
      clientOptions: [],
      filter: {
        start: new Date().toLocaleDateString('pt-br'),
        end: new Date().toLocaleDateString('pt-br'),
        operator: '',
        client: [],
        status: [],
      },

      // Operador Selecionado
      operatorData: {},

      // Tabela
      columns: [
        {
          label: 'Código', name: 'code', field: 'code', align: 'center',
        },
        {
          label: 'Vencimento', name: 'date', field: 'date', align: 'center', sortable: true,
        },
        {
          label: 'Status', name: 'status', field: 'status', align: 'center', sortable: true,
        },
        {
          label: 'Ações', name: 'actions', field: 'actions', align: 'center', sortable: true,
        },
      ],
      data: [
        {
          code: '#0001',
          status: 'payed',
          date: new Date().toLocaleDateString('pt-br'),
        },
        {
          code: '#0002',
          status: 'pending',
          date: new Date().toLocaleDateString('pt-br'),
        },
        {
          code: '#0003',
          status: 'late',
          date: new Date().toLocaleDateString('pt-br'),
        },
        {
          code: '#0004',
          status: 'canceled',
          date: new Date().toLocaleDateString('pt-br'),
        },
        {
          code: '#0005',
          status: 'payed',
          date: new Date().toLocaleDateString('pt-br'),
        },
      ],
      tableRef: null,

      // Dialog
      confirmUserDialog: false,

      // Checkbox
      comunicationTerms: false,
    };
  },
  methods: {
    required,
    verifyEmail,
    verifyCPF,
    verifyCEP,
    maxLength,
    minLength,
    equalsTo,
    filterEntries() {
      console.log('Not implemented');
    },
    filterFn(val, update) {
      // call abort() at any time if you can't retrieve data somehow
      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              this.clientOptions = this.clients;
            } else {
              const needle = val.toLowerCase();
              this.clientOptions = this.clients.filter((v) => v.toLowerCase().indexOf(needle) > -1);
            }
          },

          // next function is available in Quasar v1.7.4+;
          // "ref" is the Vue reference to the QSelect
          (ref) => {
            if (val !== '' && ref.options.length > 0) {
              // reset optionIndex in case there is something selected
              ref.setOptionIndex(-1);
              // focus the first selectable option and do not update the input-value
              ref.moveOptionSelection(1, true);
            }
          },
        );
      }, 300);
    },
    filterFnAutoselect(val, update) {
      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              this.clientOptions = this.clients;
            } else {
              const needle = val.toLowerCase();
              this.clientOptions = this.clients.filter((v) => v.toLowerCase().indexOf(needle) > -1);
            }
          },

          // next function is available in Quasar v1.7.4+;
          // "ref" is the Vue reference to the QSelect
          (ref) => {
            if (val !== '' && ref.options.length > 0 && ref.optionIndex === -1) {
              // focus the first selectable option and do not update the input-value
              ref.moveOptionSelection(1, true);
              // toggle the focused option
              ref.toggleOption(ref.options[ref.optionIndex], true);
            }
          },
        );
      }, 300);
    },
    abortFilterFn() {
      // console.log('delayed filter aborted')
    },
  },
  mounted() {
    const clients = [
      'Cliente 1',
      'Cliente 2',
      'Cliente 3',
      'Cliente 4',
      'Cliente 5',
      'Cliente 6',
      'Cliente 7',
    ];

    this.clients = clients;
  },
};
</script>

<style lang="scss" scoped>

</style>
