<template>
  <q-item
    @mouseover="highlight = true"
    @mouseleave="highlight = false"
    clickable
    :to="to"
    :class="this.active || this.highlight ?
      'text-grey-8 highlight text-weight-bold':
      'text-grey-6'
    "
  >
    <q-item-section avatar>
      <q-icon
        :name="icon"
        size="sm"
        :class="this.active || this.highlight ? 'text-active' : 'text-grey-6'"
      />
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-left">
        <span>{{ title }}</span>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'EssentialLink',
  data() {
    return {
      highlight: false,
    };
  },
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: '',
    },

    group: {
      type: String,
      default: '',
    },

    to: {
      type: [Object, String],
      default: '#',
    },

    icon: {
      type: String,
      default: '',
    },
  },
  computed: {
    active() {
      const { to, $route } = this;
      if (to && to.name === $route.name) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="sass" scoped>
  .text-active
    color: #009245

  .highlight
    border-left: .35rem solid #009245 !important
    background-color: #ffffff22
</style>
