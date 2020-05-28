<template>
  <q-page class="q-pa-md">
    <!-- Reportar um Bug -->
    <q-card>
      <q-card-section>
        <q-form
          @submit="submitSolicitation"
          class="q-gutter-md"
        >
          <div class="row">
            <div class="col-xs-12 col-sm-4 q-px-sm q-mb-sm-sm">
              <q-select
                v-model="solicitation"
                :options="solicitationOptions"
                label="Tipo de Solicitação *"
                lazy-rules
                :rules="[required]"
                debounce="1000"
              />
            </div>
            <div class="col-xs-12 col-sm-4 q-px-sm q-mb-xs-sm q-mb-sm-sm">
              <q-input
                v-model="title"
                label="Título da Solicitação *"
                lazy-rules
                :rules="[required]"
                debounce="1000"
              />
            </div>
            <div class="col-xs-12 col-sm-4 q-px-sm q-mb-xs-lg q-mb-sm-sm">
              <q-file
                label="Anexar Imagem"
                v-model="image"
                multiple
                accept=".jpg, image/*"
                :max-file-size="5000"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
            <div class="col-xs-12">
              <q-editor
                v-model="description"
                placeholder="Descrição da Solicitação *"
              />
            </div>
            <div v-show="isError" class="col-xs-12 q-mt-lg">
              <q-editor
                v-model="errorReproduction"
                placeholder="Reprodução do Erro *"
              />
            </div>
            <div class="col-xs-12 flex justify-center q-mt-lg">
              <q-btn
                label="Enviar"
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
import { required, verifyEmail } from '../../validations';

export default {
  name: 'Support',
  data() {
    return {
      title: '',
      description: '',
      errorReproduction: '',
      image: null,
      solicitation: null,
      solicitationOptions: ['Ajuda', 'Sugestão', 'Problema'],
    };
  },
  methods: {
    required,
    verifyEmail,
    async submitSolicitation() {
      try {
        let message;
        message = !this.description
          ? 'É necessário inserir uma descrição para a proposta.'
          : '';

        if (this.isError) {
          message = !this.errorReproduction
            ? `É necessário informar os passos para a reprodução do erro. ${message}`
            : message;
        }

        if (!this.description || (!this.errorReproduction && this.isError)) {
          throw new Error(message);
        }

        // this.$axios.post('', data);
      } catch (err) {
        console.log(err);
        const { message } = err;
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message,
        });
      }
    },
  },
  computed: {
    isError() {
      return this.solicitation === 'Problema';
    },
  },
};
</script>

<style lang="sass" scoped>
</style>
