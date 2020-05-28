<template>
  <q-field
    v-model="inputVal"
    :label="label"
    :hint="hint"
    @input="$emit('input', $event)"
    :rules="rules"
    lazy-rules
    :dense="dense"
    :disable="disable"
    :readonly="readonly"
    :outlined="outlined"
    :autofocus="autofocus"
  >
    <template v-slot:control="{ id, floatingLabel, value, emitValue }">
      <Money
        :id="id"
        class="q-field__input"
        :value="value"
        @input="emitValue"
        v-bind="moneyFormatForComponent"
        v-show="floatingLabel"
      />
    </template>
  </q-field>
</template>

<script>
// Steps to use this component:
//  Bind with props on parent component e.g: v-model="parentVdata"
// Specify validations: validations="['NGT', 'NLT']".
// NotgreaterThan and notLesserThan are always active.
import { Money } from 'v-money';

export default {
  components: {
    Money,
  },
  props: {
    value: {
      type: Number,
      default: 0,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: String,
      required: false,
      default: '',
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    rules: {
      type: Array,
      default: () => [],
    },
    max: {
      type: Number,
      default: 20000000,
    },
    min: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      moneyFormatForComponent: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        suffix: '',
        precision: 2,
        masked: false, /* doesn't work with directive */
      },
    };
  },
  computed: {
    inputVal: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.q-field--with-bottom{
    padding-bottom: 0px;
}
</style>
