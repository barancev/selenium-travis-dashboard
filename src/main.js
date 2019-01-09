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
    setBuilds(state, builds) {
      state.builds = builds
    },
    setCurrentBuild(state, build) {
      state.currentBuild = build
    },
    setCurrentBuildJobs(state, jobs) {
      state.currentBuildJobs = jobs
    },
    setCurrentJob(state, job) {
      state.currentJob = job
    },
    setCurrentJobTests(state, tests) {
      state.currentJobTests = tests
    },
  },
  actions: {
    reloadBuilds(context) {
      dbClient.query(
        q.Map(
          q.Paginate(q.Match(q.Index("all_travis_builds"))),
          q.Lambda("x", q.Get(q.Var("x")))
        )
      ).then(
        result => {
          context.commit('setBuilds', result.data.map(x => x.data))
        }
      )
    },
    setCurrentBuild(context, id) {
      context.dispatch('reloadBuilds')
      dbClient.query(
        q.Get(q.Match(q.Index("travis_build_by_id"), Number(id)))
      ).then(
        result => {
          context.commit('setCurrentBuild', result.data)
          dbClient.query(
            q.Map(
              q.Paginate(q.Match(q.Index("travis_jobs_by_build_id"), result.data.id)),
              q.Lambda("x", q.Get(q.Var("x")))
            )
          ).then(
            result => {
              context.commit('setCurrentBuildJobs', result.data.map(x => x.data))
            }
          )
        }
      )
    },
    setCurrentJob(context, id) {
      let job_id = Number(id)
      dbClient.query(
        q.Get(q.Match(q.Index("travis_job_by_id"), job_id))
      ).then(
        result => {
          context.commit('setCurrentJob', result.data)
          context.dispatch('setCurrentBuild', result.data.build)
          dbClient.query(
            q.Map(
              q.Paginate(q.Match(q.Index("test_runs_by_job_id"), job_id)),
              q.Lambda("x", q.Get(q.Var("x")))
            )
          ).then(
            result => {
              context.commit('setCurrentJobTests', result.data.map(x => x.data))
            }
          )
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
