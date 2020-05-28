<template>
  <q-page class="row justify-center content-center">
    <!-- Login -->
    <q-card class="col-xs-11 col-sm-8 col-md-6 col-lg-4">
      <q-card-section
        class="q-mt-xs-sm q-mt-sm-lg text-center"
      >
        <div class="row justify-center q-mb-lg">
          <q-img
            contain
            src="statics/images/conv-logo.png"
            style="max-width: 150px"
          />
        </div>
        <div class="text-h4 text-weight-light text-uppercase">
          <span class="text-grey-8">Portal do </span>
          <span class="text-grey-8 text-weight-regular">Cartório</span>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form
          @submit="onLogin"
          class="q-mx-xs-sm q-mx-md-xl"
        >
          <q-input
            class="q-mt-xs-sm q-mt-sm-lg"
            filled
            v-model="email"
            label="E-mail de Usuário"
            lazy-rules
            :rules="[required, verifyEmail]"
            debounce="1000"
          />

          <q-input
            class="q-mt-md"
            type="password"
            filled
            v-model="password"
            label="Senha de Acesso"
            lazy-rules
            :rules="[required]"
            debounce="1000"
          />

          <div class="flex justify-center q-mt-md">
            <q-btn
              size="lg"
              label="Entrar"
              type="submit"
              color="primary"
              style="width: 100%; max-width: 490px"
            />
          </div>

          <div class="flex justify-center q-mt-md">
            <q-btn
              size="lg"
              outline
              label="Acessar com certificado"
              type="button"
              color="primary"
              style="width: 100%; max-width: 490px"
            />
          </div>

          <div class="flex justify-center q-mt-md">
            <q-btn
              flat
              class="text-grey-6 text-subtitle1"
              label="Esqueci minha senha"
              type="button"
              no-caps
              @click="showRetriveDialog"
            />
          </div>

          <div v-show="!showFab" class="flex justify-center q-mt-md">
            <q-btn
              size="lg"
              label="Pesquisar Certidão"
              type="button"
              color="primary"
              style="width: 100%; max-width: 490px"
              :to="{ name: 'searchCertified' }"
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

    <!-- Recuperar Senha -->
    <q-dialog v-model="retriveDialog">
      <q-card>
        <q-toolbar>
          <q-toolbar-title class="text-h5">
            Recuperar Senha
          </q-toolbar-title>

          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup
          />
        </q-toolbar>

        <q-card-section class="text-body2">
          Informe o email cadastrado, que enviaremos um email para que troque sua senha.
        </q-card-section>

        <q-card-section>
          <q-form
            @submit="onRetrive"
            class="q-gutter-md"
          >
            <q-input
              v-model="email"
              label="E-mail"
              lazy-rules
              :rules="[required, verifyEmail]"
              debounce="1000"
            >
              <template v-slot:before>
                <q-icon name="fas fa-fw fa-user" size="sm" />
              </template>
            </q-input>

            <div class="row flex justify-end">
              <q-btn
                label="Recuperar"
                type="submit"
                color="primary"
                icon="send"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Pesquisar Certidão -->
    <q-page-sticky
      v-show="showFab"
      position="top-right"
      :offset="[18, 18]"
    >
      <q-btn
        size="lg"
        no-caps
        :to="{ name: 'searchCertified' }"
        color="primary"
        label="Pesquisar Certidão"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { required, verifyEmail } from '../../validations';

export default {
  name: 'Login',
  data() {
    return {
      email: null,
      password: null,
      retriveDialog: false,
    };
  },
  methods: {
    required,
    verifyEmail,
    onLogin() {
      const { email, password } = this;
      console.log(email, password);
      // await this.$store.dispatch('MainStore/loginUser', res.data);
      this.$router.push({ name: 'dashboard' });
    },
    onRetrive() {
      const { email } = this;
      console.log(email);
    },
    showRetriveDialog() {
      this.retriveDialog = true;
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
.responsive {
  max-height: 80vh;
}
</style>
