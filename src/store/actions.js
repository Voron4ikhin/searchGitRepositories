import axios from "axios"

export function addRepositories({commit}, [page, query, order, maxElementsOnPage]) {
    let fullQuery = 'https://api.github.com/search/repositories?q=' + query + '&sort=updated&order=' + order + '&per_page=' + maxElementsOnPage + '&page=' + page
    axios(fullQuery).then(response => {
        commit('setPageCount', Math.ceil(response.data.total_count / maxElementsOnPage))
        commit('addRepositories', response.data.items)
    }).catch(error => {
        commit('setError', error)
    })
}

export function changeActivePage({commit}, [page, query, order, maxElementsOnPage]) {
    let fullQuery = 'https://api.github.com/search/repositories?q=' + query + '&sort=updated&order=' + order + '&per_page=' + maxElementsOnPage + '&page=' + page
    axios(fullQuery).then(response => {
        commit('addRepositories', response.data.items)
        commit('changeActivePage', page)
    }).catch(error => {
        commit('setError', error)
    })
}
