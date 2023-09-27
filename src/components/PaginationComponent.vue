<template>
  <div class="wr-pagination">
    <ul>
      <li v-for="page in getPaginationData" :key="page">
        <div class="pagination-item-not-page" v-if="page === '...'">{{ page }}</div>
        <div class="pagination-item" v-else :class="{ 'active': page === getActivePage }"
             @click="changeActivePage(page)">{{ page }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {computed} from 'vue'
import {useStore} from 'vuex'

export default {
  setup() {
    //store
    const store = useStore()

    //функция изменения страницы
    function changeActivePage(page) {
      store.dispatch('changeActivePage', page)
    }

    //получение активной страницы
    const getActivePage = computed(() => store.state.activePage)

    //массив с пагинацией
    const getPaginationData = computed(() => {
      const page = getActivePage.value
      const maxPage = store.state.pageCount
      const unwantedPages = [0, maxPage + 1]
      let paginationArray = [1, page - 1, page, page + 1, maxPage]
      paginationArray = paginationArray.filter(item => !unwantedPages.includes(item))
      paginationArray = paginationArray.filter((item, index) => {
        return index === paginationArray.indexOf(item)
      })
      if (maxPage < 4) return paginationArray
      switch (paginationArray.length) {
        case 3:
          if (page === 1) {
            paginationArray.splice(2, 0, '...')
          } else {
            paginationArray.splice(-2, 0, '...')
          }
          return paginationArray
        case 4:
          if (maxPage === 4) {
            return paginationArray
          }
          if (page - 1 === 1) {
            paginationArray.splice(-1, 0, '...')
          } else {
            paginationArray.splice(1, 0, '...')
          }
          return paginationArray
        case 5:
          if (maxPage === 5) {
            return paginationArray
          }
          if (page - 2 === 1) {
            paginationArray.splice(-1, 0, '...')
          } else if (page + 2 === maxPage) {
            paginationArray.splice(1, 0, '...')
          } else {
            paginationArray.splice(-1, 0, '...')
            paginationArray.splice(1, 0, '...')
          }
          return paginationArray
        default:
          return paginationArray
      }
    })

    return {
      changeActivePage,
      getPaginationData,
      getActivePage,
    }
  }
}
</script>


<style>
</style>