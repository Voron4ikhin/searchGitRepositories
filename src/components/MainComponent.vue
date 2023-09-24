<template>
    <div class="wr-result-table container">
        <h1>Поиск репозиториев на Github</h1>

        <div class="wr-search">
            <input class="search-input" type="search" placeholder="Find repository" v-model="searchInput"/>
            <button @click="$store.dispatch('addRepositories', [setRightQuery(searchInput), getMaxElementsOnPage])">Найти</button>
        </div>
        <div class="wr-sort">
            <div class="order-selceted" @click="openSelect()">
                {{ getOrderTypes[getOrderSelected] }}
                <img src="../assets/chevron.svg">
            </div>
            <div class="wr-order-to-select" :class="{'active': openSelectFlag }">
                <div class="order-to-select" v-for="(order, index) in getOrderTypes" v-bind:key="order" @click="setSort(index)">
                    {{ order }}
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
                    <tr  v-for="item in getRepositoriesOnActivePage" v-bind:key="item">
                        <td class="name"><a :href="item.html_url">{{ item.full_name }}</a></td>
                        <td class="description">{{ item.description }}</td>
                        <td class="language">{{ getLanguage(item.full_name) }}</td>
                        <td class="stars">{{ item.stargazers_count }}</td>
                        <td class="commit">{{ getCleanDate(item.updated_at) }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="wr-pagination">
                <ul>
                    <li v-for="page in getCountPages" v-bind:key="page">
                        <div class="pagination-item" :class="{'active': page===getActivePage}" @click="changeActivePage(page)">{{ page }}</div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else>
            <span>Введите ключевые слова чтобы мы могли показать вам результат! Пока ничего не найдено!</span>
        </div>
    </div>
</template>
<script>

import { ref, computed } from 'vue'
import { useStore } from 'vuex';

export default{
    setup(){
        //флаг для открытия сортировочного поля (по возрастанию по убыванию)
        let openSelectFlag = ref(false)
        //store
        const store = useStore()

        //функция для поиска наиболее встречаемого языка программирования в объекте 
        function getMostCommon(languages){
            return Object.keys(languages).reduce((a, b) => languages[a] > languages[b] ? a : b)
        }

        //функция изменения страницы
        function changeActivePage(page){
            store.commit('changeActivePage', page)
        }

        //фукция преобразования даты
        function getCleanDate(date){
            return new Date(date).toLocaleString()
        }

        //функция для смены соритровки
        function setSort(index){
            store.commit('changeSortType', index)
            openSelectFlag.value = false
        }

        //функция открытия окна сортировки
        function openSelect(){
            openSelectFlag.value = !openSelectFlag.value
        }

        //функция получения запроса
        function setRightQuery(query){
            let order = store.state.order
            return 'https://api.github.com/search/repositories?q=' + query + '&sort=updated&order=' + order
        }

        //закоментировал функцию получения языков программирования тк слишком много запросов отправляется в минуту
        function getLanguage(repositoryName){
            return repositoryName
            // return this.getMostCommon(this.$store.state.language[repositoryName])
        }

        //получение максимального кол-ва элементов на странице
        const getMaxElementsOnPage = computed(()=>{
            return store.state.maxElementsOnPage
        })

        //v-model для input search
        const searchInput = computed({
            get(){
                return store.state.inputSearch
            },
            set(input){
                store.commit('setInput', input)
            }
        })

        //получение размера массива репозиториев
        const getRepositoriesArraySize = computed(() => {
            return store.state.repositories.length
        })

        //получение активной страницы 
        const getActivePage = computed(() => {
            return  store.state.activePage
        })

        //получение репозиториев на текущей странице
        const getRepositoriesOnActivePage = computed(() => {
            let page = store.state.activePage
            return store.state.repositoriesByPage[page]
        })

        //получение кол-ва страниц
        const getCountPages = computed(() => {
            return  store.state.repositoriesByPage.length - 1
        })

        //получение типов сортировок(по возрастанию и по убыванию лежит в сторе)
        const getOrderTypes = computed(() => {
            return store.state.orders
        })

        //выбранная сортировка
        const getOrderSelected = computed(() => {
            return store.state.order
        })

        return {
            openSelectFlag,
            getMostCommon,
            changeActivePage,
            getCleanDate,
            setSort,
            openSelect,
            setRightQuery,
            getLanguage,
            getRepositoriesArraySize,
            getActivePage,
            getRepositoriesOnActivePage,
            getCountPages,
            getOrderTypes,
            getOrderSelected,
            searchInput,
            getMaxElementsOnPage
        }
    },

}


</script>

<style>

.container{
    max-width: 1140px;
    margin: 0 auto;
}

.wr-sort {
    width: 200px;
    cursor: pointer;
    color: #878ECD;
    margin-bottom: 15px;
}

.wr-sort .order-selceted{
    border: 1px solid #878ECD;
    outline: none;
    width: 100%;
    padding: 10px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.wr-sort .order-selceted img{
    width: 15px;
}

.wr-sort .wr-order-to-select{
    display: none;
    border: 1px solid #878ECD;
}

.wr-sort .wr-order-to-select.active{
    display: block;
}

.wr-sort .order-to-select{
    outline: none;
    width: 100%;
    padding: 10px;
    background-color: white;
}

.wr-sort .order-to-select:hover{
    background-color: #B9BBDF;
    color: #DFF4F3;
}

.wr-result-table h1{
    color: #878ECD;
    text-align: center;
    line-height: 30px;
}

.wr-result-table span{
    color: #878ECD;

}

.wr-result-table .wr-search{
    position: relative;
    margin: 0 auto;
    width: 100%;
    display: flex;
    margin-bottom: 15px;
}

.wr-result-table .search-input{
    border: 1px solid #878ECD;
    outline: none;
    height: 42px;
    width: 100%;
    padding-left: 15px;
}

.wr-result-table button{
    height: 42px;
    width: 100px;
    background: #878ECD;
    border: 1px solid #878ECD;
    color: #DFF4F3;
    cursor: pointer;
}

.wr-result-table button:hover{
    background: #DFF4F3;
    color: #878ECD;
}


table, th, td {
  border: 1px solid  #878ECD;
  border-collapse: collapse;
}

.wr-table thead td{
    font-weight: 600;
}

td{
    padding: 10px;    
}

.wr-table-result{
  height: 360px;
  width: 100%;
}


.wr-table{
    width: 100%;
    color: #878ECD;
    margin-bottom: 15px;
    background-color: #DDE7F2;
}

.wr-table a{
    text-decoration: none;
    color: #878ECD;
}

.wr-table a:hover{
    text-decoration: underline;
}

.wr-table tbody tr:hover{
    color: #DFF4F3;
    background-color: #B9BBDF;
}

.wr-pagination ul {
    color: #878ECD;
    justify-content: center;
    align-items: center;
    margin: auto;
    padding: 0;
    list-style: none;
    display: flex;
}

.wr-pagination .pagination-item{
    background-color: #DDE7F2;
    width: 30px;
    height: 30px;
    cursor: pointer;
    border: 1px solid #878ECD;
    justify-content: center;
    align-items: center;
    margin: 2px;
    display: flex;
}

.wr-pagination .pagination-item:hover{
    color: #DFF4F3;
    background-color: #B9BBDF;
}

.wr-pagination .pagination-item.active{
    cursor: default;
    color: #DFF4F3;
    background-color: #B9BBDF;
}

@media (max-width: 400px) {
  .container {
    max-width: 540px;
  }
  .wr-result-table h1{
    font-size: 20px;
  }
}

@media (max-width: 576px) {
  .container {
    max-width: 540px;
  }
  .description{
    display: none;
  }
}

@media (max-width: 650px) {
  .container {
    max-width: 720px;
  }
  .stars{
    display: none;
  }
  .commit{
    display: none;
  }
}

@media (max-width: 768px) {
  .container {
    max-width: 720px;
  }
  .language{
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