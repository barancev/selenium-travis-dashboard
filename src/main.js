import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.config.productionTip = false

import faunadb, { query as q } from 'faunadb'

//const FAUNADB_SECRET = 'fnADEPApZiACBUEMtW3CmT_zSm5cfYPZRz-bDIz7'; // client
const FAUNADB_SECRET = 'fnADEPCDN2ACBQ-VPr30vN1znfF6UN6jq-CoAp74'; // server-readonly
const dbClient = new faunadb.Client({ secret: FAUNADB_SECRET });

const store = new Vuex.Store({
  state: {
    builds: [],
    currentBuild: null,
    currentBuildRef: null,
    currentBuildJobs: [],
    currentJob: null,
    currentJobTests: [],
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
          state.builds = result.data.map(x => x.data)
        }
      )
    },
    setCurrentBuild: (state, id) => {
      state.currentBuild = null
      state.currentBuildRef = null
      state.currentBuildJobs = []
      dbClient.query(
        q.Get(q.Match(q.Index("travis_build_by_id"), Number(id)))
      ).then(
        result => {
          state.currentBuild = result.data
          state.currentBuildRef = result.ref
          dbClient.query(
            q.Map(
              q.Paginate(q.Match(q.Index("travis_jobs_by_build"), state.currentBuildRef)),
              q.Lambda("x", q.Get(q.Var("x")))
            )
          ).then(
            result => {
              state.currentBuildJobs = result.data.map(x => x.data)
            }
          )
        }
      )
    },
    setCurrentJob: (state, id) => {
      state.currentJob = null
      state.currentJobTests = []
      dbClient.query(
        q.Get(q.Match(q.Index("travis_job_by_id"), Number(id)))
      ).then(
        result => {
          state.currentJob = result.data
        }
      )
    },
  }
})

import App from './App.vue'
import Builds from './pages/Builds.vue'
import Build from './pages/Build.vue'
import Job from './pages/Job.vue'

const routes = [
  { path: '/builds', alias: '/', component: Builds },
  { path: '/build/:id', component: Build },
  { path: '/job/:id', component: Job },
]

const router = new VueRouter({
  routes
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
