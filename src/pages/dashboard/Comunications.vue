<template>
<q-page>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey bg-white shadow-1"
    active-color="primary"
    indicator-color="primary"
    align="justify"
  >
    <q-tab name="comunications" label="Comunicações" />
    <q-tab name="newComunication" label="Nova Comunicação" />
  </q-tabs>
  <q-tab-panels class="bg-transparent" v-model="tab" animated>
    <q-tab-panel name="comunications">
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
                  label="Por palavra"
                  placeholder="Protocolo, placa, vendedor, comprador..."
                  debounce="1000"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-lg-3 q-px-sm-sm q-pt-sm-lg">
                <q-select
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

      <!-- Comunicações -->
      <Table
        title="Comunicações"
        :columns="columns"
        :data="data"
        ref="tableRef"
        :filter="search"
      >
        <!-- Nova Comunicação -->
        <template v-slot:top-right>
          <q-btn
            color="primary"
            label="Nova Comunicação"
            @click="tab = 'newComunication'"
          />
        </template>

        <!-- Status da comunicação -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="
                props.row.status.value === 'registered' ?
                'secondary' :
                props.row.status.value === 'success' ?
                'positive' :
                'negative'
              "
              class="text-white text-subtitle2"
            >
              {{ props.row.status.label }}
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
                    <q-icon name="email" size="sm" color="grey-8"/>
                  </q-item-label>
                  <q-item-label caption>
                    Enviar Comunicado
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>
                    <q-icon name="description" size="sm" color="grey-8"/>
                  </q-item-label>
                  <q-item-label caption>
                    Gerar Certidão
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </q-td>
        </template>
      </Table>
    </q-tab-panel>

    <q-tab-panel name="newComunication">
      <q-stepper
        v-model="step"
        ref="stepper"
        color="primary"
        :vertical="setVertical"
        header-nav
        keep-alive
        animated
      >
        <q-step
          :name="1"
          title="Dados do Veículo"
          :done="step > 1"
          prefix="1"
        >
          <div class="row">
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input
                label="UF Veículo"
                v-model="vehicleData.state"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input
                label="Número CRV"
                v-model="vehicleData.crv"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input
                label="Código de Segurança"
                v-model="vehicleData.securityCode"
              />
            </div>

            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input
                label="Número via CRV"
                v-model="vehicleData.numberByCrv"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input
                label="Renavam"
                v-model="vehicleData.renavam"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input
                label="Marca"
                v-model="vehicleData.brand"
              />
            </div>

            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input
                label="Modelo"
                v-model="vehicleData.model"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input
                label="Detalhe"
                v-model="vehicleData.details"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input
                label="Placa"
                v-model="vehicleData.carplate"
                lazy-rules
                debounce="1000"
                mask="AAA-#X##"
                :rules="[verifyCarplate]"
              />
            </div>

            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input
                label="Ano de Fabricação"
                v-model="vehicleData.fabricationYear"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input
                label="Ano Modelo"
                v-model="vehicleData.modelYear"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-input
                label="Data Emissão CRV"
                v-model="vehicleData.crvEmitionDate"
                @focus="() => $refs.qDateCrvEmition.show()"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateCrvEmition"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="vehicleData.crvEmitionDate"
                        mask="DD/MM/YYYY"
                        @input="() => $refs.qDateCrvEmition.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </q-step>

        <q-step
          :name="2"
          title="Dados do Vendedor"
          :done="step > 2"
          prefix="2"
        >
          <div class="row">
            <div class="q-px-md q-my-md col-xs-12 col-md-6">
              <q-input
                label="Nome Completo"
                v-model="sellerData.name"
              >
                <template v-slot:append>
                  <q-icon name="help">
                    <q-tooltip anchor="top middle" self="bottom right">
                      Aviso: digitar o nome do proprietário exatamente como
                      está escrito no CRV desta Comunicação de venda
                    </q-tooltip>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-3">
              <q-select
                v-model="sellerDocumentType"
                label="Tipo de Documento"
                :options="documentOptions"
                behavior="menu"
              />
            </div>
            <div
              v-if="sellerDocumentType.value === 'cnpj'"
              class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-3"
            >
              <q-input
                label="CNPJ"
                v-model="sellerData.cnpj"
                lazy-rules
                debounce="1000"
                mask="##.###.###/####-##"
                :rules="[verifyCNPJ]"
              />
            </div>
            <div v-else class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-3">
              <q-input
                label="CPF"
                v-model="sellerData.cpf"
                lazy-rules
                debounce="1000"
                mask="###.###.###-##"
                :rules="[verifyCPF]"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6">
              <q-input
                label="UF"
                v-model="sellerData.state"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-6">
              <q-input
                label="Cidade"
                v-model="sellerData.city"
              />
            </div>
          </div>
        </q-step>

        <q-step
          :name="3"
          title="Dados do Comprador"
          :done="step > 3"
          prefix="3"
        >
          <div class="row">
            <div class="q-px-md q-my-md col-xs-12 col-md-6">
              <q-input
                label="Nome Completo"
                v-model="buyerData.name"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-3">
              <q-select
                v-model="buyerDocumentType"
                label="Tipo de Documento"
                :options="documentOptions"
                behavior="menu"
              />
            </div>
            <div
              v-if="buyerDocumentType.value === 'cnpj'"
              class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-3"
            >
              <q-input
                label="CNPJ"
                v-model="buyerData.cnpj"
                lazy-rules
                debounce="1000"
                mask="##.###.###/####-##"
                :rules="[verifyCNPJ]"
              />
            </div>
            <div v-else class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-3">
              <q-input
                label="CPF"
                v-model="buyerData.cpf"
                lazy-rules
                debounce="1000"
                mask="###.###.###-##"
                :rules="[verifyCPF]"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4">
              <q-input
                label="CEP"
                v-model="buyerData.cep"
                lazy-rules
                debounce="1000"
                mask="#####-###"
                :rules="[verifyCEP]"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-8">
              <q-input
                label="Endereço"
                v-model="buyerData.address"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4">
              <q-input
                label="Número"
                v-model="buyerData.number"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-8">
              <q-input
                label="Complemento"
                v-model="buyerData.complement"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4">
              <q-input
                label="Bairro"
                v-model="buyerData.neighborhood"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4">
              <q-input
                label="Cidade"
                v-model="buyerData.city"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-12 col-md-4">
              <q-input
                label="Estado"
                v-model="buyerData.state"
              />
            </div>
          </div>
        </q-step>

        <q-step
          :name="4"
          title="Dados da Comunicação"
          :done="step > 4"
          prefix="4"
        >
          <div class="row">
            <div class="q-px-md q-my-md col-xs-12 col-sm-6">
              <Money
                label="Valor da Comunicação"
                v-model="transactionData.value"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6">
              <q-input
                label="Data de Venda do Veículo"
                v-model="transactionData.vehicleSaleDate"
                @focus="() => $refs.qDateVehicleSale.show()"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateVehicleSale"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="transactionData.vehicleSaleDate"
                        mask="DD/MM/YYYY"
                        @input="() => $refs.qDateVehicleSale.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
                <template v-slot:prepend>
                  <q-icon name="help">
                    <q-tooltip anchor="top middle" self="bottom left">
                      Aviso: Constante no CRV. A data de venda, que é solicitada neste campo,
                      é sempre a data de fechamento do DUT
                    </q-tooltip>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation class="row justify-around">
            <q-btn
              v-if="step > 1"
              flat
              color="grey-6"
              @click="$refs.stepper.previous()"
              label="Voltar"
              class="q-ml-sm"
            />
            <div v-if="step === 4">
              <q-btn
                label="Enviar Comunicação"
                color="primary"
                @click="showConfirmComunicationDialog"
                v-close-popup
              />
              <q-btn
                class="q-ml-sm"
                outline
                label="Salvar"
                color="grey-8"
                v-close-popup
              />
            </div>
            <q-btn v-else
              @click="$refs.stepper.next()"
              color="primary"
              :label="'Próximo'"
            />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </q-tab-panel>
  </q-tab-panels>

  <!-- Confirmar Comunicação-->
  <q-dialog v-model="confirmComunicationDialog">
    <q-card>
      <q-toolbar>
        <q-toolbar-title class="text-h5 text-grey-8">
          Confirmar comunicação de venda?
        </q-toolbar-title>

        <q-btn
          flat
          round
          dense
          icon="close"
          v-close-popup
        />
      </q-toolbar>

      <q-card-section class="row">
        <div class="text-h6 text-primary col-12">
          Veículo:
        </div>
        <div class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="Placa"
            :value="vehicleData.carplate"
            disable
            readonly
          />
        </div>
        <div class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="Renvam"
            :value="vehicleData.renavam"
            disable
            readonly
          />
        </div>

        <div class="text-h6 text-primary col-12">
          Proprietário:
        </div>
        <div v-if="sellerDocumentType.value === 'cpf'" class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="CPF"
            :value="sellerData.cpf"
            disable
            readonly
          />
        </div>
        <div v-else class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="CNPJ"
            :value="sellerData.cnpj"
            disable
            readonly
          />
        </div>
        <div class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="Nome"
            :value="sellerData.name"
            disable
            readonly
          />
        </div>

        <div class="text-h6 text-primary col-12">
          Destinatário:
        </div>
        <div v-if="buyerDocumentType.value === 'cpf'" class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="CPF"
            :value="buyerData.cpf"
            disable
            readonly
          />
        </div>
        <div v-else class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="CNPJ"
            :value="buyerData.cnpj"
            disable
            readonly
          />
        </div>
        <div class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="Nome"
            :value="buyerData.name"
            disable
            readonly
          />
        </div>

        <div class="col-12">
          <q-item tag="label" v-ripple>
            <q-item-section avatar top>
              <q-checkbox v-model="comunicationTerms" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Termos de Compromisso</q-item-label>
              <q-item-label caption>
                Eu, {{ employeeData.name }}, devidamente autorizado e credenciado pela
                empresa {{ employeeData.companyName }} e {{ employeeData.cnpj }}, declaro,
                sob as penas da lei, que a referida empresa possui procuração, outorgada
                pelo proprietário do veículo, {{ sellerData.name }} de
                {{
                  sellerDocumentType.value === 'cpf' ?
                  `CPF ${sellerData.cpf}` : `CNPJ ${sellerData.cnpj}`
                }}
                , com poderes para efetivar a comunicação de venda do veículo placa
                {{ vehicleData.carplate }}, conforme artigo 134 do código de trânsito
                brasileiro.
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row justify-around">
          <q-btn
            :disable="!comunicationTerms"
            label="Confirmar"
            color="primary"
            v-close-popup
          />
          <q-btn
            outline
            label="Cancelar"
            color="grey-8"
            v-close-popup
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

</q-page>
</template>

<script>
import Table from 'components/table';
import Money from 'components/money';
import {
  verifyCEP,
  verifyCNPJ,
  verifyCPF,
  verifyCarplate,
  required,
} from '../../validations';

export default {
  name: 'Comunications',
  components: {
    Table,
    Money,
  },
  data() {
    return {
      // Filtros
      expanded: !this.$q.platform.is.mobile,
      search: '',
      statusOptions: [
        { label: 'Cadastrada', value: 'registered' },
        { label: 'Sucesso', value: 'success' },
        { label: 'Erro', value: 'error' },
      ],
      filter: {
        start: new Date().toLocaleDateString('pt-br'),
        end: new Date().toLocaleDateString('pt-br'),
        protocol: '',
        carplate: '',
        name: '',
        status: '',
      },

      // Nova Comunicação
      // Tipo de Operação
      operation: '',
      operationTypes: [],

      // Dados do Veículo
      vehicleData: {
        state: '',
        crv: '',
        securityCode: '',
        numberByCrv: '',
        renavam: '',
        brand: '',
        model: '',
        details: '',
        carplate: '',
        fabricationYear: '',
        modelYear: '',
        crvEmitionDate: new Date().toLocaleDateString('pt-br'),
      },

      // Tipos de Documentos
      documentOptions: [
        { value: 'cpf', label: 'CPF' },
        { value: 'cnpj', label: 'CNPJ' },
      ],

      // Dados do Vendedor
      sellerDocumentType: { value: 'cpf', label: 'CPF' },
      sellerData: {
        cpf: '',
        cnpj: '',
        name: '',
        city: '',
        state: '',
      },

      // Dados do Comprador
      buyerDocumentType: { value: 'cpf', label: 'CPF' },
      buyerData: {
        cpf: '',
        cnpj: '',
        name: '',
        cep: '',
        address: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
      },

      // Dados da Comunicação
      transactionData: {
        value: 0,
        vehicleSaleDate: new Date().toLocaleDateString('pt-br'),
      },

      // Tabela
      columns: [
        {
          label: 'Protocolo', name: 'protocol', field: 'protocol', align: 'center',
        },
        {
          label: 'Data e Hora', name: 'dateAndTime', field: 'dateAndTime', align: 'center', sortable: true,
        },
        {
          label: 'Placa', name: 'carplate', field: 'carplate', align: 'center',
        },
        {
          label: 'Vendedor', name: 'seller', field: 'seller', align: 'center', sortable: true,
        },
        {
          label: 'Comprador', name: 'buyer', field: 'buyer', align: 'center', sortable: true,
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
          protocol: '#000',
          dateAndTime: new Date().toLocaleString('pt-br'),
          carplate: 'ABC-1234',
          seller: 'John Doe',
          buyer: 'Allan Doe',
          status: { value: 'success', label: 'Sucesso' },
        },
        {
          protocol: '#001',
          dateAndTime: new Date().toLocaleString('pt-br'),
          carplate: 'ABC-1235',
          seller: 'Brian Doe',
          buyer: 'Charlot Doe',
          status: { value: 'success', label: 'Sucesso' },
        },
        {
          protocol: '#002',
          dateAndTime: new Date().toLocaleString('pt-br'),
          carplate: 'ABC-1236',
          seller: 'Dyllan Doe',
          buyer: 'Eduard Doe',
          status: { value: 'error', label: 'Erro' },
        },
        {
          protocol: '#003',
          dateAndTime: new Date().toLocaleString('pt-br'),
          carplate: 'ABC-1237',
          seller: 'Fabrício Doe',
          buyer: 'Giulliano Doe',
          status: { value: 'registered', label: 'Cadastrada' },
        },
        {
          protocol: '#004',
          dateAndTime: new Date().toLocaleString('pt-br'),
          carplate: 'ABC-1238',
          seller: 'Hebert Doe',
          buyer: 'Iago Doe',
          status: { value: 'success', label: 'Sucesso' },
        },
      ],
      tableRef: null,

      // Tabs
      tab: 'comunications',

      // Stepper
      step: 1,

      // Dialog
      confirmComunicationDialog: false,

      // Checkbox
      comunicationTerms: false,
    };
  },
  computed: {
    setVertical() {
      const { width } = this.$q.screen;
      return width < 1350;
    },
    employeeData() {
      return this.$store.getters['MainStore/getUser'];
    },
  },
  methods: {
    verifyCEP,
    verifyCNPJ,
    verifyCPF,
    verifyCarplate,
    required,
    filterEntries() {
      console.log('Not implemented');
    },
    showConfirmComunicationDialog() {
      this.confirmComunicationDialog = true;
    },
  },
  mounted() {
    const { tab } = this.$route.params;
    if (!tab) return;
    this.tab = tab;
  },
};
</script>

<style lang="scss" scoped>

</style>
