<template>
  <q-card
    class="shadow-8"
    :style="borderColor ? `border-left: .25rem solid ${borderColor} !important;` : ''"
  >
    <q-card-section horizontal class="row">
      <q-card-section
        class="col-xs-9 justify-center"
      >
        <div class="row">
          <!-- Title -->
          <div :class="`col-12 text-subtitle2 text-${color}`">
            {{ title }}
          </div>
          <!-- Value -->
          <div class="col-12">
            <slot />
          </div>
        </div>
      </q-card-section>
      <q-card-section
        class="col-xs-3 flex justify-center content-center text-right"
      >
        <!-- Icon -->
        <q-icon
          :name="icon"
          class="text-blue-grey-2"
          size="lg"
        />
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'CardBadge',
  props: {
    title: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      default: '',
    },

    color: {
      type: String,
      default: 'primary',
    },

    borderColor: {
      type: String,
      default: '#009245',
    },
  },
};
</script>

<style scoped>

</style>
