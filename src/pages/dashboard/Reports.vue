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
            <q-select
              multiple
              clearable
              use-input
              hide-selected
              fill-input
              use-chips
              input-debounce="0"
              @filter="filterFn"
              @filter-abort="abortFilterFn"
              v-model="filter.client"
              :options="clientOptions"
              label="Cliente"
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

  <!-- Operadores -->
  <Table
    title="Operadores"
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
            props.row.status === 'success' ?
            'positive' :
            props.row.status === 'registered' ?
            'secondary' :
            'negative'
          "
          class="text-white text-subtitle2"
        >
          {{
            props.row.status === 'active' ?
            'Ativo' :
            props.row.status === 'registered' ?
            'Cadastrado' :
            'Erro'
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
                <q-icon name="close" size="sm" color="negative"/>
              </q-item-label>
              <q-item-label caption>
                Deletar
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>
                <q-icon name="visibility" size="sm" color="grey-8"/>
              </q-item-label>
              <q-item-label caption>
                Detalhes
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
        { label: 'Sucesso', value: 'success' },
        { label: 'Erro', value: 'error' },
        { label: 'Cadastrado', value: 'registered' },
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
          label: 'Data', name: 'date', field: 'date', align: 'center',
        },
        {
          label: 'Comunicação', name: 'comunication', field: 'comunication', align: 'center', sortable: true,
        },
        {
          label: 'Vendedor', name: 'seller', field: 'seller', align: 'center',
        },
        {
          label: 'Comprador', name: 'buyer', field: 'buyer', align: 'center', sortable: true,
        },
        {
          label: 'Placa', name: 'carplate', field: 'carplate', align: 'center', sortable: true,
        },
        {
          label: 'Renavam', name: 'renavam', field: 'renavam', align: 'center', sortable: true,
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
          date: new Date().toLocaleDateString('pt-br'),
          comunication: '#000',
          seller: 'Allan Doe',
          buyer: 'Billy Doe',
          carplate: 'ABC-1234',
          renavam: '123456789',
          status: 'success',
        },
        {
          date: new Date().toLocaleDateString('pt-br'),
          comunication: '#001',
          seller: 'Carlos Doe',
          buyer: 'Dylan Doe',
          carplate: 'ABC-1235',
          renavam: '123456790',
          status: 'registered',
        },
        {
          date: new Date().toLocaleDateString('pt-br'),
          comunication: '#002',
          seller: 'Eduard Doe',
          buyer: 'Fabrício Doe',
          carplate: 'ABC-1236',
          renavam: '123456791',
          status: 'error',
        },
        {
          date: new Date().toLocaleDateString('pt-br'),
          comunication: '#003',
          seller: 'Giuliano Doe',
          buyer: 'Hebert Doe',
          carplate: 'ABC-1237',
          renavam: '123456792',
          status: 'success',
        },
        {
          date: new Date().toLocaleDateString('pt-br'),
          comunication: '#004',
          seller: 'Igor Doe',
          buyer: 'João Doe',
          carplate: 'ABC-1238',
          renavam: '123456793',
          status: 'registered',
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
