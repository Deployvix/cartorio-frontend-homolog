<template>
  <q-page class="row justify-center content-center">
    <!-- Pesquisar Certidão -->
    <q-card class="col-xs-11 col-sm-8 col-md-6 col-lg-4">
      <q-card-section
        class="q-mt-lg text-center"
      >
        <div class="row justify-center q-mb-lg">
          <q-img
            contain
            src="statics/images/conv-logo.png"
            style="max-width: 150px"
          />
        </div>
        <div class="text-h4 text-weight-light text-uppercase text-center">
          <div>
            <span class="text-grey-8">Pesquisar</span>
          </div>
          <div>
            <span class="text-grey-8 text-weight-regular">certidão </span>
            <span class="text-grey-8">de venda</span>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form
          @submit="onLogin"
          class="q-mx-xs-sm q-mx-md-xl"
        >
          <q-input
            class="q-mt-lg"
            filled
            v-model="certificate"
            label="Digite o Protocolo"
            lazy-rules
            :rules="[required]"
            debounce="1000"
          />

          <div class="flex justify-center q-mt-md">
            <q-btn
              size="lg"
              label="Pesquisar"
              type="submit"
              color="primary"
              style="width: 100%; max-width: 490px"
            />
          </div>

          <div v-show="!showFab" class="flex justify-center q-mt-md">
            <q-btn
              size="lg"
              label="Acesso Cartórios"
              type="button"
              color="secondary"
              style="width: 100%; max-width: 490px"
              :to="{ name: 'login' }"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="flex justify-center q-mb-sm">
        <q-img
          src="statics/images/logo-vix-tec.png"
          spinner-color="white"
          style="max-width: 125px"
        />
      </q-card-section>
    </q-card>

    <!-- Acesso Cartórios -->
    <q-page-sticky
      v-show="showFab"
      position="top-right"
      :offset="[18, 18]"
    >
      <q-btn
        size="lg"
        no-caps
        :to="{ name: 'login' }"
        color="primary"
        label="Acesso Cartórios"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { required } from '../../validations';

export default {
  name: 'Search',
  data() {
    return {
      certificate: null,
      retriveDialog: false,
    };
  },
  methods: {
    required,
    onLogin() {
      const { email, password } = this;
      console.log(email, password);
      // await this.$store.dispatch('MainStore/loginUser', res.data);
      this.$router.push({ name: 'dashboard' });
    },
  },
  computed: {
    showFab() {
      const { height } = this.$q.screen;
      const { mobile } = this.$q.platform.is;
      return (!mobile && height > 750);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
