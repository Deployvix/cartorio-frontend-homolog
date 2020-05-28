<template>
  <q-layout view="lHh lpR lFf">

    <q-header reveal bordered class="bg-white text-grey-8">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="drawer = !drawer" />
        <q-toolbar-title>
          {{ pageTitle }}
        </q-toolbar-title>
        <q-space />
        <q-btn-dropdown flat no-caps :label="username">
          <template v-slot:label>
            <div class="row items-center no-wrap">
              <q-avatar right class="q-ml-sm">
                <q-img v-if="user.image" :src="user.image" />
                <q-avatar v-else icon="person" text-color="white" size="md" color="grey-7" />
              </q-avatar>
            </div>
          </template>
          <q-list>
            <q-item
              dense
              clickable
              v-close-popup
              bordered
              :to="{ name: 'myAccount' }"
            >
              <q-item-section avatar>
                <q-avatar icon="fas fa-user-cog" class="q-ml-sm" text-color="grey" size="md"/>
              </q-item-section>
              <q-item-section side>
                <q-item-label>Minha Conta</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item dense clickable v-close-popup bordered @click="logout">
              <q-item-section avatar>
                <q-avatar icon="fas fa-sign-out-alt" class="q-ml-sm" text-color="grey" size="md"/>
              </q-item-section>
              <q-item-section side>
                <q-item-label>Sair</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="drawer"
      side="left"
      :width="300"
      :breakpoint="750"
      bordered
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item
            class="text-center"
          >
            <q-item-section class="q-pa-xs row content-center">
              <q-img
                contain
                src="statics/images/conv-logo.png"
                style="max-width: 125px"
              />
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item
            class="q-mt-lg q-mb-sm row justify-center"
          >
            <q-btn
              size="1.1rem"
              color="primary"
              no-caps
              :to="{ name: 'comunications', params: { tab: 'newComunication' } }"
            >
              <div class="row items-center no-wrap">
                <q-icon size="sm" left name="add_circle" />
                <div class="text-center">
                  Nova Comunicação
                </div>
              </div>
            </q-btn>
          </q-item>
          <DrawerLink
            class="q-my-md"
            v-for="link in drawerLinks"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>

    <q-footer bordered class="bg-white text-grey-8">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-subtitle1 text-lowercase">
            {{ branding }}
          </div>
        </q-toolbar-title>
        <q-space />
        <q-img
          src="statics/images/logo-vix-tec.png"
          spinner-color="white"
          style="max-width: 90px"
        />
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
import { date } from 'quasar';
import DrawerLink from 'components/drawerLink';

export default {
  name: 'DashboardLayout',
  components: {
    DrawerLink,
  },
  data() {
    return {
      projectName: 'Comv',
      drawer: false,
      drawerLinks: [
        {
          title: 'Início',
          icon: 'home',
          to: { name: 'dashboard' },
        },
        {
          title: 'Comunicações',
          icon: 'sync',
          to: { name: 'comunications' },
        },
        {
          title: 'Relatórios',
          icon: 'description',
          to: { name: 'reports' },
        },
        {
          title: 'Pagamentos',
          icon: 'monetization_on',
          to: { name: 'payments' },
        },
        {
          title: 'Usuários',
          icon: 'people',
          to: { name: 'users' },
        },
        {
          title: 'Suporte',
          icon: 'headset_mic',
          to: { name: 'support' },
        },
      ],
    };
  },
  computed: {
    branding() {
      const year = date.formatDate(Date.now(), 'YYYY');
      return `${this.projectName} ©${year}`;
    },
    username() {
      // const user = this.$store.getters['MainStore/getUser'];
      const user = { name: 'João Manoel Macedo' };
      return user.name.split(' ').slice(0, 2).join(' ');
    },
    user() {
      // return this.$store.getters['MainStore/getUser'];
      return { name: 'João Manoel Macedo' };
    },
    pageTitle() {
      return this.$store.getters['MainStore/getScreen'];
    },
  },
  methods: {
    async logout() {
      await this.$store.dispatch['MainStore/logoutUser'];
      this.$router.push({ name: 'login' });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
