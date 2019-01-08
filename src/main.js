import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.config.productionTip = false

import faunadb, { query as q } from 'faunadb'

//const FAUNADB_SECRET = 'fnADEPApZiACBUEMtW3CmT_zSm5cfYPZRz-bDIz7';
const FAUNADB_SECRET = 'fnADEPCDN2ACBQ-VPr30vN1znfF6UN6jq-CoAp74';
const dbClient = new faunadb.Client({ secret: FAUNADB_SECRET });

import App from './App.vue'
import Builds from './pages/Builds.vue'

const store = new Vuex.Store({
  state: {
    builds: []
  },
  mutations: {
    reloadBuilds: state => {
      dbClient.query(
        q.Map(
          q.Paginate(q.Match(q.Index("all_travis_builds"))),
          q.Lambda("x", q.Get(q.Var("x")))
        )
      ).then(
        result => {
          state.builds = result.data.map(x => x.data);
        }
      )
    }
  }
})

const routes = [
  { path: '/builds', alias: '/', component: Builds },
]

const router = new VueRouter({
  routes
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

store.commit('reloadBuilds')
