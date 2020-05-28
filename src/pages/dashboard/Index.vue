<template>
  <q-page>
    <div class="row q-ma-sm">
      <!-- Cards -->
      <div class="col-12">
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-lg-3 q-pa-sm">
            <CardBadge
              title="Comunicações do Dia"
              icon="fas fa-user"
            >
              <div class="text-h5 text-grey-8">
                43
              </div>
            </CardBadge>
          </div>

          <div class="col-xs-12 col-sm-6 col-lg-3 q-pa-sm">
            <CardBadge
              title="Comunicações do Mês"
              icon="fas fa-user"
            >
              <div class="text-h5 text-grey-8">
                6300
              </div>
            </CardBadge>
          </div>

          <div class="col-xs-12 col-sm-6 col-lg-3 q-pa-sm">
            <CardBadge
              title="Cadastros"
              icon="fas fa-user"
            >
              <div class="text-h5 text-grey-8">
                22
              </div>
            </CardBadge>
          </div>

          <div class="col-xs-12 col-sm-6 col-lg-3 q-pa-sm">
            <CardBadge
              title="Usuários"
              icon="fas fa-user"
            >
              <div class="text-h5 text-grey-8">
                11
              </div>
            </CardBadge>
          </div>
        </div>
      </div>

      <!-- Graphs -->
      <div class="col-12 q-pa-sm">
        <q-card
          style="border-left: .25rem solid #009245 !important"
        >
          <q-card-section>
            <BarChart
              :chartData="barChartData"
              :options="options"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import CardBadge from 'components/cardBadge';
import BarChart from 'components/charts/barChart';
// import PieChart from 'components/charts/pieChart';
// import LineChart from 'components/charts/lineChart';

export default {
  name: 'Dashboard',
  components: {
    CardBadge,
    BarChart,
  },
  data() {
    return {
      // Gráficos
      lineChartData: {
        datasets: [
          {
            data: [1, 2, 3],
            label: 'a',
            backgroundColor: '#3FA9F5',
          },
        ],
        labels: [0, 1, 2],
      },
      pieChartData: {
        datasets: [{
          data: [0.2, 0.5, 0.3],
          backgroundColor: ['#3FA9F5', '#FF931E', 'grey'],
        }],
        labels: ['Comunicações', 'Boletos', 'Cadastros'],
      },
      barChartData: {
        datasets: [
          {
            data: [1, 0.2, 0.5, 0.3, 0.6, 0.8, 0.1, 0.5, 0.9, 0.2, 0.4, 0.7],
            label: 'Comunicações',
            backgroundColor: '#009245',
          },
          {
            data: [0.7, 0.9, 0.6, 0.3, 0.6, 0.1, 0.5, 0.3, 0.2, 0.4, 0.9, 0.3],
            label: 'Boletos',
            backgroundColor: '#21BA45',
          },
          {
            data: [0.5, 0.3, 0.4, 0.3, 0.6, 0.8, 0.1, 0.5, 1, 0.2, 0.2, 0.9],
            label: 'Cadastros',
            backgroundColor: '#41DA45',
          },
        ],
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
