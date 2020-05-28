<template>
  <q-page class="q-ma-sm">
    <!-- Alterar Dados Cadastrais -->
    <q-card>
      <q-card-section>
        <q-form
          @submit="submitUpdate"
          class="q-gutter-md"
        >
          <div class="row">
            <div class="col-xs-12 text-h5 q-mb-md text-primary">
              Dados de Usuário
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-3 q-px-sm q-mb-sm-sm">
              <q-input
                :value="employeeData.email"
                v-model="email"
                label="E-mail"
                lazy-rules
                :rules="[verifyEmail]"
                debounce="1000"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-3 q-px-sm q-mb-xs-lg q-mb-sm-sm">
              <q-file
                label="Imagem de Perfil"
                v-model="image"
                accept=".jpg, image/*"
                :max-file-size="5000"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-3 q-px-sm q-mb-sm-sm">
              <q-input
                type="password"
                v-model="password"
                label="Senha"
                lazy-rules
                debounce="1000"
                :rules="[
                  (val) => minLength(val, 8),
                  (val) => maxLength(val, 250)
                ]"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-3 q-px-sm q-mb-sm-sm">
              <q-input
                type="password"
                v-model="passwordConfirm"
                label="Confirmar Senha"
                lazy-rules
                debounce="1000"
                :rules="[
                  (val) => equalsTo(val, password, 'senha')
                ]"
              />
            </div>
            <div class="col-xs-12 text-h5 q-my-md text-primary">
              Informações Pessoais
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-3 q-px-sm q-mb-xs-sm">
              <q-input
                :value="employeeData.name"
                v-model="name"
                label="Nome Completo"
                lazy-rules
                debounce="1000"
                :rules="[(val) => maxLength(val, 250)]"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-3 q-px-sm q-mb-xs-lg">
              <q-input
                v-model="cpf"
                label="CPF"
                lazy-rules
                debounce="1000"
                mask="###.###.###-##"
                :rules="[verifyCPF]"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-3 q-px-sm q-mb-xs-lg">
              <q-input
                :value="employeeData.phone"
                v-model="phone"
                label="Telefone"
                lazy-rules
                debounce="1000"
                mask="(##) #####-####"
                :rules="[verifyPhone]"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-3 q-px-sm q-mb-xs-lg">
              <q-input
                :value="employeeData.commercialPhone"
                v-model="commercialPhone"
                label="Telefone Comercial"
                lazy-rules
                debounce="1000"
                mask="(##) ####-####"
                :rules="[verifyCommercialPhone]"
              />
            </div>
            <div class="col-xs-12 text-h5 q-my-md text-primary">
              Endereço
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-3 q-px-sm q-mb-xs-sm">
              <q-input
                :value="employeeData.cep"
                v-model="cep"
                label="CEP"
                lazy-rules
                debounce="1000"
                mask="###.###.###-##"
                :rules="[verifyCEP]"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-3 q-px-sm q-mb-xs-lg">
              <q-input
                :value="employeeData.state"
                v-model="state"
                label="Estado"
                lazy-rules
                debounce="1000"
                :rules="[(val) => maxLength(val, 250)]"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-3 q-px-sm q-mb-xs-lg">
              <q-input
                :value="employeeData.city"
                v-model="city"
                label="Cidade"
                lazy-rules
                debounce="1000"
                :rules="[(val) => maxLength(val, 250)]"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-3 q-px-sm q-mb-xs-lg">
              <q-input
                :value="employeeData.neighborhood"
                v-model="neighborhood"
                label="Bairro"
                lazy-rules
                debounce="1000"
                :rules="[(val) => maxLength(val, 250)]"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-3 q-px-sm q-mb-xs-lg">
              <q-input
                :value="employeeData.place"
                v-model="place"
                label="Logradouro"
                lazy-rules
                debounce="1000"
                :rules="[(val) => maxLength(val, 250)]"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-3 q-px-sm q-mb-xs-lg">
              <q-input
                :value="employeeData.number"
                v-model="number"
                label="Número"
                lazy-rules
                debounce="1000"
                :rules="[(val) => maxLength(val, 250)]"
              />
            </div>
            <div class="col-xs-12 col-lg-6 q-px-sm q-mb-xs-lg">
              <q-input
                :value="employeeData.complement"
                v-model="complement"
                label="Complemento"
                lazy-rules
                debounce="1000"
                :rules="[(val) => maxLength(val, 250)]"
              />
            </div>
            <div class="col-xs-12 flex justify-center q-mt-md">
              <q-btn
                label="Salvar"
                type="submit"
                color="primary"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {
  required,
  verifyEmail,
  verifyCPF,
  verifyCEP,
  verifyPhone,
  verifyCommercialPhone,
  maxLength,
  minLength,
  equalsTo,
} from '../../validations';

export default {
  name: 'Support',
  data() {
    return {
      email: '',
      image: null,
      password: '',
      passwordConfirm: '',
      name: '',
      cpf: '',
      phone: '',
      commercialPhone: '',
      cep: '',
      state: '',
      city: '',
      neighborhood: '',
      place: '',
      number: '',
      complement: '',
    };
  },
  methods: {
    required,
    verifyEmail,
    verifyCPF,
    verifyCEP,
    verifyPhone,
    verifyCommercialPhone,
    maxLength,
    minLength,
    equalsTo,
    async submitUpdate() {
      // this.$axios.put()
    },
  },
  computed: {
    employeeData() {
      return this.$store.getters['MainStore/getUser'];
    },
  },
};
</script>

<style lang="sass" scoped>
</style>
