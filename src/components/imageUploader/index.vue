<template>
  <div>
    <div class="row q-mb-md">
      <div class="col-12">
        <q-file
          :disable="files.length >= maxFiles"
          v-model="image"
          :label="label"
          :hint="hint"
          :max-file-size="maxFileSize"
          accept="image/png,image/jpg,image/jpeg,image/webp"
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
      </div>
      <div class="col-12 text-caption text-grey-7 q-my-md q-mt-xs-lg">
        {{ files.length }} / {{ maxFiles }} (máx) fotos
      </div>
    </div>
    <div v-show="files.length" class="row justify-center">
      <div class="col-12">
        <q-carousel
          swipeable
          animated
          v-model="slide"
          thumbnails
          infinite
        >
          <q-carousel-slide v-for="(file, key) in files"
            :key="key"
            :name="key"
            :img-src="file.dataURL"
          />
          <template v-slot:control>
            <q-carousel-control
              position="top-right"
              :offset="[18, 18]"
            >
              <q-btn
                @click="deleteImage(slide)"
                push
                text-color="negative"
                color="white"
                round
                icon="close"
              />
            </q-carousel-control>
          </template>
        </q-carousel>
      </div>
    </div>
    <q-dialog v-model="cropperModal" full-width>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Recorte sua imagem</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="row justify-center">
          <clipper-basic
            class="justify-center"
            style="max-width: 1400px; width: 80vw"
            ref="clipper"
            :key="cropperKey"
            :src="imgSrc"
            :ratio="16 / 9"
            :wrapRatio="16 / 9"
            mode="switch"
          />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            flat
            label="Descartar"
            color="negative"
            v-close-popup
            @click="discardImage"
          />
          <q-btn
            class="q-ml-md"
            label="Salvar"
            color="primary"
            v-close-popup
            @click="cropImage"
            :loading="loading"
            :disable="loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css';

export default {
  name: 'ImageUploader',
  data() {
    return {
      // Carousel
      slide: 0,

      // Upload de arquivos
      image: null,
      files: [],

      // CropperJS
      cropperModal: false,
      cropperKey: null,
      imgSrc: null,
      croppedImg: null,
      loading: false,
    };
  },
  props: {
    label: {
      type: String,
      default: 'Clique para adicionar uma foto',
    },
    hint: {
      type: String,
      default: 'Formatos aceitos: JPG,PNG,WEBP até 8 MB em cada imagem',
    },
    maxFileSize: {
      type: Number,
      default: 8192000,
    },
    maxFiles: {
      type: Number,
      default: 5,
    },
  },
  methods: {
    setImage(file) {
      if (!file) return;

      if (file.size > this.maxFileSize) {
        this.$q.notify({
          type: 'negative',
          message: `Imagem muito grande. Tamanho máximo: ${(this.maxFileSize / (10 ** 6)).toFixed()}MB`,
        });
        return;
      }

      if (!file.type.match(/image\/(jpg|jpeg|png|webp)$/i)) {
        this.$q.notify({
          type: 'negative',
          message: 'Formato de imagem inválido. Formatos aceitos: jpg, jpeg, png, webp',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        this.imgSrc = event.target.result;
        this.cropperKey = new Date().getTime();
        this.cropperModal = true;
      };

      reader.readAsDataURL(file);
    },
    async cropImage() {
      if (this.files.length >= this.maxFiles) {
        this.$q.notify({
          type: 'negative',
          message: `Limite de imagens atingido. Máximo de imagens: ${this.maxFiles}`,
        });
        return;
      }

      this.loading = true;
      const dataURL = this.$refs.clipper.clip().toDataURL('image/webp');
      const file = await this.b64toFile(dataURL);

      if (file.size > this.maxFileSize) {
        this.$q.notify({
          type: 'negative',
          message: `Imagem muito grande. Tamanho máximo: ${(this.maxFileSize / (10 ** 6)).toFixed()}MB`,
        });
        return;
      }

      this.files.push({ dataURL, file });
      this.loading = false;
      this.discardImage();
    },
    discardImage() {
      this.image = null;
      this.imgSrc = null;
      this.cropperModal = false;
    },
    deleteImage(id) {
      this.files = this.files.filter((file, fileId) => fileId !== id);
    },
    async b64toFile(base64) {
      return new Promise((resolve, reject) => {
        fetch(base64)
          .then((res) => res.blob())
          .then((res) => new File([res], Date.now()))
          .then((res) => resolve(res))
          .catch(reject);
      });
    },
  },
  watch: {
    image(value) {
      this.setImage(value);
    },
    files(value) {
      this.$emit('update:files', value);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
