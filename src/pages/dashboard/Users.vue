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
    <q-tab name="users" label="Usuários" />
    <q-tab name="newUser" label="Novo Usuário" />
  </q-tabs>
  <q-tab-panels class="bg-transparent" v-model="tab" animated>
    <q-tab-panel name="users">
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
                  placeholder="Nome, cpf, e-mail, telefone..."
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

      <!-- Usuários -->
      <Table
        title="Usuários"
        :columns="columns"
        :data="data"
        ref="tableRef"
        :filter="search"
      >
        <!-- Nova Comunicação -->
        <template v-slot:top-right>
          <q-btn
            color="primary"
            label="Novo Usuário"
            @click="tab = 'newUser'"
          />
        </template>

        <!-- Status da comunicação -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="
                props.row.status.value === 'active' ? 'positive' : 'negative'
              "
              class="text-white text-subtitle2"
            >
              {{ props.row.status.value === 'active' ? 'Ativo' : 'Inativo' }}
            </q-badge>
          </q-td>
        </template>

        <!-- Botão de ações da linha -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="flex justify-center">
              <q-item clickable v-ripple @click="showDeleteDialog(props.row)">
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
    </q-tab-panel>

    <q-tab-panel name="newUser">
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
          title="Dados do Usuário"
          :done="step > 1"
          prefix="1"
        >
          <div class="row">
            <div class="q-px-md q-my-md col-xs-12 col-md-6 col-lg-3">
              <q-select
                v-model="userData.accessLevel"
                :options="accessLevelOptions"
                label="Nível de Acesso*"
                lazy-rules
                debounce="1000"
                :rules="[required]"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-md-6 col-lg-3">
              <q-input
                label="E-mail*"
                v-model="userData.email"
                lazy-rules
                :rules="[required, verifyEmail]"
                debounce="1000"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-lg-3">
              <q-input
                label="Senha*"
                v-model="userData.password"
                lazy-rules
                debounce="1000"
                :rules="[
                  required,
                  (val) => minLength(val, 8),
                  (val) => maxLength(val, 50)
                ]"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-lg-3">
              <q-input
                label="Confirmar Senha*"
                v-model="userData.password_confirm"
                lazy-rules
                debounce="1000"
                :rules="[
                  required,
                  (val) => equalsTo(val, userData.password, 'senha')
                ]"
              />
            </div>
          </div>
        </q-step>

        <q-step
          :name="2"
          title="Dados da Pessoa"
          :done="step > 2"
          prefix="2"
        >
          <div class="row">
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-lg-3">
              <q-input
                label="Nome Completo"
                v-model="userData.name"
                lazy-rules
                debounce="1000"
                :rules="[
                  required,
                  (val) => maxLength(val, 50)
                ]"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-lg-3">
              <q-input
                v-model="userData.cpf"
                label="CPF*"
                lazy-rules
                mask="###.###.###-##"
                debounce="1000"
                :rules="[
                  required,
                  verifyCPF,
                  (val) => maxLength(val, 14)
                ]"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-lg-3">
              <q-input
                v-model="userData.telephone"
                label="Telefone"
                lazy-rules
                debounce="1000"
                mask="(##) #####-####"
                :rules="[
                  (val) => maxLength(val, 16)
                ]"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-lg-3">
              <q-input
                v-model="userData.comercialTelephone"
                label="Telefone Comercial"
                lazy-rules
                debounce="1000"
                mask="(##) ####-####"
                :rules="[
                  (val) => maxLength(val, 15)
                ]"
              />
            </div>
          </div>
        </q-step>

        <q-step
          :name="3"
          title="Endereço"
          :done="step > 3"
          prefix="3"
        >
          <div class="row">
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4">
              <q-input
                v-model="userData.cep"
                label="CEP"
                lazy-rules
                debounce="1000"
                mask="#####-###"
                :rules="[verifyCEP]"
                @change="setCep"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-8">
              <q-input
                v-model="userData.street"
                label="Rua"
                lazy-rules
                debounce="1000"
                :rules="[(val) => maxLength(val, 50)]"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4">
              <q-input
                v-model="userData.number"
                label="Número"
                lazy-rules
                debounce="1000"
                :rules="[(val) => maxLength(val, 50)]"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4">
              <q-input
                v-model="userData.complement"
                label="Complemento"
                lazy-rules
                debounce="1000"
                :rules="[(val) => maxLength(val, 50)]"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4">
              <q-input
                v-model="userData.reference"
                label="Referência"
                lazy-rules
                debounce="1000"
                :rules="[(val) => maxLength(val, 50)]"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4">
              <q-input
                v-model="userData.neighborhood"
                label="Bairro"
                lazy-rules
                debounce="1000"
                :rules="[(val) => maxLength(val, 50)]"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4">
              <q-input
                v-model="userData.city"
                label="Cidade"
                lazy-rules
                debounce="1000"
                :rules="[(val) => maxLength(val, 250)]"
              />
            </div>
            <div class="q-px-md q-my-md col-xs-12 col-sm-6 col-md-4">
              <q-input
                v-model="userData.state"
                label="Estado"
                lazy-rules
                debounce="1000"
                :rules="[(val) => maxLength(val, 50)]"
              />
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
            <q-btn
              v-if="step === 3"
              @click="showConfirmUserDialog()"
              color="primary"
              label="Concluir"
            />
            <q-btn
              v-else
              @click="$refs.stepper.next()"
              color="primary"
              label="Próximo"
            />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </q-tab-panel>
  </q-tab-panels>

  <!-- Confirmar Comunicação-->
  <q-dialog v-model="confirmUserDialog">
    <q-card>
      <q-toolbar>
        <q-toolbar-title class="text-h5 text-grey-8">
          Confirmar criação de usuário?
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
          Dados do Usuário:
        </div>
        <div class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="Permissão"
            :value="userData.accessLevel.label"
            disable
            readonly
          />
        </div>
        <div class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="E-mail"
            :value="userData.email"
            disable
            readonly
          />
        </div>

        <div class="text-h6 text-primary col-12">
          Dados da Pessoa:
        </div>
        <div class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="Nome"
            :value="userData.name"
            disable
            readonly
          />
        </div>
        <div class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="CPF"
            :value="userData.cpf"
            disable
            readonly
          />
        </div>
        <div class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="Telefone"
            :value="userData.telefone"
            disable
            readonly
          />
        </div>
        <div class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="Telefone Comercial"
            :value="userData.comercialTelephone"
            disable
            readonly
          />
        </div>

        <div class="text-h6 text-primary col-12">
          Endereço:
        </div>
        <div class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="CEP"
            :value="userData.cep"
            disable
            readonly
          />
        </div>
        <div class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="Endereço"
            :value="userData.address"
            disable
            readonly
          />
        </div>
        <div class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="Número"
            :value="userData.number"
            disable
            readonly
          />
        </div>
        <div class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="Complemento"
            :value="userData.complement"
            disable
            readonly
          />
        </div>
        <div class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="Ponto de Referência"
            :value="userData.reference"
            disable
            readonly
          />
        </div>
        <div class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="Bairro"
            :value="userData.neighborhood"
            disable
            readonly
          />
        </div>
        <div class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="Cidade"
            :value="userData.city"
            disable
            readonly
          />
        </div>
        <div class="q-px-md q-my-md col-xs-12 col-sm-6">
          <q-input
            label="Estado"
            :value="userData.state"
            disable
            readonly
          />
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row justify-around">
          <q-btn
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

  <!-- Deletar Usuário-->
  <q-dialog v-model="deleteUserDialog">
    <q-card>
      <q-toolbar>
        <q-toolbar-title class="text-h5 text-grey-8">
          Deseja deletar este usuário?
        </q-toolbar-title>

        <q-btn
          flat
          round
          dense
          icon="close"
          v-close-popup
        />
      </q-toolbar>

      <q-card-section class="text-subtitle1 text-grey-8">
        Tem certeza que deseja deletar o usuário de nome,
        {{ selectedUser.name }} e CPF {{ selectedUser.cpf }}?
      </q-card-section>

      <q-card-section>
        <div class="row justify-around">
          <q-btn
            label="Deletar"
            color="negative"
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
import { getCep } from '../../services/getCep.js';
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
        { label: 'Ativo', value: 'active' },
        { label: 'Inativo', value: 'inactive' },
      ],
      filter: {
        start: new Date().toLocaleDateString('pt-br'),
        end: new Date().toLocaleDateString('pt-br'),
        protocol: '',
        carplate: '',
        name: '',
        status: '',
      },

      // Dados do Usuário
      accessLevelOptions: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Usuário', value: 'user' },
      ],

      selectedUser: {},
      userData: {
        name: '',
        accessLevel: { label: 'Usuário', value: 'user' },
        email: '',
        password: '',
        password_confirm: '',
        cpf: '',
        telephone: '',
        comercialTelephone: '',
        cep: '',
        address: '',
        complement: '',
        reference: '',
        neighborhood: '',
        city: '',
        state: '',
      },

      // Tabela
      columns: [
        {
          label: 'Nome', name: 'name', field: 'name', align: 'center',
        },
        {
          label: 'CPF', name: 'cpf', field: 'cpf', align: 'center', sortable: true,
        },
        {
          label: 'Telefone', name: 'telephone', field: 'telephone', align: 'center',
        },
        {
          label: 'Tel. Comercial', name: 'comercialTelephone', field: 'comercialTelephone', align: 'center', sortable: true,
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
          name: 'Adam Doe',
          cpf: '123.456.789-10',
          telephone: '(27) 91234-5678',
          comercialTelephone: '(27) 1234-5678',
          status: { label: 'Activo', value: 'active' },
        },
        {
          name: 'Billy Doe',
          cpf: '123.456.789-11',
          telephone: '(27) 91234-5679',
          comercialTelephone: '(27) 1234-5679',
          status: { label: 'Inativo', value: 'inactive' },
        },
        {
          name: 'Carlos Doe',
          cpf: '123.456.789-12',
          telephone: '(27) 91234-5680',
          comercialTelephone: '(27) 1234-5680',
          status: { label: 'Activo', value: 'active' },
        },
        {
          name: 'Dylan Doe',
          cpf: '123.456.789-13',
          telephone: '(27) 91234-5681',
          comercialTelephone: '(27) 1234-5681',
          status: { label: 'Inativo', value: 'inactive' },
        },
        {
          name: 'Eduard Doe',
          cpf: '123.456.789-14',
          telephone: '(27) 91234-5682',
          comercialTelephone: '(27) 1234-5682',
          status: { label: 'Activo', value: 'active' },
        },
      ],
      tableRef: null,

      // Tabs
      tab: 'users',

      // Stepper
      step: 1,

      // Dialog
      confirmUserDialog: false,
      deleteUserDialog: false,

      // Checkbox
      comunicationTerms: false,
    };
  },
  computed: {
    setVertical() {
      const { width } = this.$q.screen;
      return width < 1350;
    },
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
    showConfirmUserDialog() {
      this.confirmUserDialog = true;
    },
    showDeleteDialog(row) {
      this.selectedUser = row;
      this.deleteUserDialog = true;
    },
    async setCep() {
      if (!this.userData.cep) return;
      const unmaskedCep = this.userData.cep.split('-').join('');
      const cep = await getCep(unmaskedCep);
      if (cep) {
        this.userData.state = cep.uf;
        this.userData.city = cep.localidade;
        this.userData.neighborhood = cep.bairro;
        this.userData.street = cep.logradouro;
        this.userData.complement = cep.complemento;
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
