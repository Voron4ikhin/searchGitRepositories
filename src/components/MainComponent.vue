<template>
  <div class="wr-result-table container">
    <h1>Поиск репозиториев на Github</h1>

    <div class="wr-search">
      <input class="search-input" type="search" placeholder="Find repository" v-model="searchInput"/>
      <button @click="findResults()">Найти</button>
    </div>

    <div v-if="getError" class="wr-error">
      <span>Возникла ошибка - {{ getError }}</span>
    </div>

    <div class="wr-sort">
      <div class="order-selected" @click="openSelect()">
        <div class="sort-name">
          {{ getOrderTypes[getOrderSelected] }}
          <img v-if="getOrderSelected === 'asc'" src="../assets/sort-asc.svg" :alt="`icon-${getOrderSelected}`"/>
          <img v-if="getOrderSelected === 'desc'" src="../assets/sort-desc.svg" :alt="`icon-${getOrderSelected}`"/>
        </div>
        <img v-if="openSelectFlag" src="../assets/chevron-opened.svg" alt="chevron-opened">
        <img v-else src="../assets/chevron.svg" alt="chevron-closed">
      </div>
      <div class="wr-order-to-select" :class="{'active': openSelectFlag }">
        <div class="order-to-select" v-for="(order, index) in getOrderTypes" :key="order" @click="setSort(index)">
          {{ order }}
          <img v-if="index === 'asc'" src="../assets/sort-asc.svg" :alt="`icon-${index}`"/>
          <img v-if="index === 'desc'" src="../assets/sort-desc.svg" :alt="`icon-${index}`"/>
        </div>
      </div>
    </div>

    <div v-if="getRepositoriesArraySize > 0">
      <table class="wr-table">
        <thead>
        <tr>
          <td class="name">Repository</td>
          <td class="description">Description</td>
          <td class="language">Language</td>
          <td class="stars">Stars</td>
          <td class="commit">Last commit</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in getRepositoriesOnActivePage" :key="item">
          <td class="name"><a :href="item.html_url">{{ item.full_name }}</a></td>
          <td class="description">{{ item.description }}</td>
          <td class="language">{{ item.language }}</td>
          <td class="stars">{{ item.stargazers_count }}</td>
          <td class="commit">{{ getCleanDate(item.updated_at) }}</td>
        </tr>
        </tbody>
      </table>

      <PaginationComponent/>

    </div>

    <div v-else>
      <div v-if="sendRequest">
        <span>По ключевому слову "{{
            searchInput
          }}" к сожалению ничего не найдено, попробуйте ввести другое слово</span>
      </div>
      <div v-else>
        <span>Введите ключевые слова чтобы мы могли показать вам результат! Пока ничего не найдено!</span>
      </div>
    </div>
  </div>
</template>
<script>

import {ref, computed} from 'vue'
import {useStore} from 'vuex'
import PaginationComponent from './PaginationComponent.vue'

export default {
  components: {
    PaginationComponent
  },
  setup() {
    //флаг для открытия сортировочного поля (по возрастанию/по убыванию)
    let openSelectFlag = ref(false)

    //флаг проверка на отправленный запрос
    let sendRequest = ref(false)

    //store
    const store = useStore()

    function findResults() {
      let page = 1
      sendRequest.value = true
      store.dispatch('addRepositories', page)
    }

    //функция преобразования даты
    function getCleanDate(date) {
      return new Date(date).toLocaleString()
    }

    //функция для смены соритровки
    function setSort(index) {
      store.commit('changeSortType', index)
      openSelectFlag.value = false
    }

    //функция открытия окна сортировки
    function openSelect() {
      openSelectFlag.value = !openSelectFlag.value
    }

    //v-model для input search
    const searchInput = computed({
      get() {
        return store.state.inputSearch
      },
      set(input) {
        store.commit('setInput', input)
      }
    })

    //получение размера массива репозиториев
    const getRepositoriesArraySize = computed(() => store.state.repositories.length)

    //получение активной страницы
    const getActivePage = computed(() => store.state.activePage)

    //получение репозиториев на текущей странице
    const getRepositoriesOnActivePage = computed(() => store.state.repositories)

    //получение кол-ва страниц
    const getCountPages = computed(() => store.state.pageCount)

    //получение типов сортировок(по возрастанию и по убыванию лежит в сторе)
    const getOrderTypes = computed(() => store.state.orders)

    //выбранная сортировка
    const getOrderSelected = computed(() => store.state.order)

    //получение ошибки с сервера
    const getError = computed(() => store.state.error)


    return {
      openSelectFlag,
      sendRequest,
      getCleanDate,
      setSort,
      openSelect,
      findResults,
      getRepositoriesArraySize,
      getActivePage,
      getRepositoriesOnActivePage,
      getCountPages,
      getOrderTypes,
      getOrderSelected,
      searchInput,
      getError,
    }
  },

}

</script>

<style lang="scss">

.container {
  max-width: 1140px;
  margin: 0 auto;
}

.wr-sort {
  width: 200px;
  cursor: pointer;
  color: #878ECD;
  margin-bottom: 15px;
  position: relative;

  .order-selected {
    border: 1px solid #878ECD;
    outline: none;
    width: 100%;
    padding: 10px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .sort-name {
      display: flex;

      img {
        margin-left: 5px;
        width: 20px;
      }
    }

    img {
      width: 15px;
    }
  }

  .wr-order-to-select {
    display: none;
    border: 1px solid #878ECD;

    &.active {
      display: block;
      position: absolute;
      width: 100%;
    }
  }

  .order-to-select {
    outline: none;
    width: 100%;
    padding: 10px;
    background-color: white;
    display: flex;

    &:hover {
      background-color: #B9BBDF;
      color: #DFF4F3;
    }

    img {
      margin-left: 5px;
      width: 20px;
    }
  }
}

.wr-result-table {
  h1 {
    color: #878ECD;
    text-align: center;
    line-height: 30px;
  }

  span {
    color: #878ECD;
  }

  .wr-search {
    position: relative;
    margin: 0 auto 15px;
    width: 100%;
    display: flex;
  }

  .search-input {
    border: 1px solid #878ECD;
    outline: none;
    height: 42px;
    width: 100%;
    padding-left: 15px;
  }

  button {
    height: 42px;
    width: 100px;
    background: #878ECD;
    border: 1px solid #878ECD;
    color: #DFF4F3;
    cursor: pointer;

    &:hover {
      background: #DFF4F3;
      color: #878ECD;
    }
  }

  .wr-error {
    margin: 15px 0;
    background-color: #ff000033;
    padding: 10px;
    border: thick double #ff000021;
  }
}

table, th, td {
  border: 1px solid #878ECD;
  border-collapse: collapse;
}

.wr-table {
  width: 100%;
  color: #878ECD;
  margin-bottom: 15px;
  background-color: #DDE7F2;

  thead {
    td {
      font-weight: 600;
    }
  }

  a {
    text-decoration: none;
    color: #878ECD;

    &:hover {
      text-decoration: underline;
    }
  }

  tbody {
    tr {
      &:hover {
        color: #DFF4F3;
        background-color: #B9BBDF;
      }
    }
  }
}

td {
  padding: 10px;
}

.wr-table-result {
  height: 360px;
  width: 100%;
}

.wr-pagination {
  ul {
    color: #878ECD;
    justify-content: center;
    align-items: center;
    margin: auto;
    padding: 0;
    list-style: none;
    display: flex;
  }

  .pagination-item {
    background-color: #DDE7F2;
    min-width: 30px;
    height: 30px;
    cursor: pointer;
    border: 1px solid #878ECD;
    justify-content: center;
    align-items: center;
    margin: 2px;
    display: flex;

    &:hover {
      color: #DFF4F3;
      background-color: #B9BBDF;
    }

    &.active {
      cursor: default;
      color: #DFF4F3;
      background-color: #B9BBDF;
    }
  }

  .pagination-item-not-page {
    background-color: #DDE7F2;
    min-width: 30px;
    height: 30px;
    border: 1px solid #878ECD;
    justify-content: center;
    align-items: center;
    margin: 2px;
    display: flex;
  }
}

@media (max-width: 400px) {
  .container {
    max-width: 540px;
  }
  .wr-result-table {
    h1 {
      font-size: 20px;
    }
  }
}

@media (max-width: 576px) {
  .container {
    max-width: 540px;
  }
  .description {
    display: none;
  }
}

@media (max-width: 650px) {
  .container {
    max-width: 720px;
  }
  .stars {
    display: none;
  }
  .commit {
    display: none;
  }
}

@media (max-width: 768px) {
  .container {
    max-width: 720px;
  }
  .language {
    display: none;
  }
}

@media (max-width: 992px) {
  .container {
    max-width: 960px;
  }
}

@media (max-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}

</style>