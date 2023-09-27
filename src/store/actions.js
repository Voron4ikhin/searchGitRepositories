import axios from "axios"

const AxiosInstance = axios.create({
    baseURL: 'https://api.github.com'
})

export async function sendRequest(state, page) {
    let query = state.inputSearch
    let order = state.order
    let maxElementsOnPage = state.maxElementsOnPage
    return await AxiosInstance.get('/search/repositories', {
        params: {
            q: query,
            sort: 'updated',
            order: order,
            per_page: maxElementsOnPage,
            page: page
        }
    })
}

export async function addRepositories({commit, state}, page) {
    let response = ''
    let maxElementsOnPage = state.maxElementsOnPage
    try {
        response = await sendRequest(state, page)
        commit('changeActivePage', page)
        commit('setPageCount', Math.ceil(response.data.total_count / maxElementsOnPage))
        commit('addRepositories', response.data.items)
        commit('setError', '')
    } catch (error) {
        commit('setError', error.response.data.message)
    }

}

export async function changeActivePage({commit, state}, page) {
    let response = ''
    try {
        response = await sendRequest(state, page)
        commit('changeActivePage', page)
        commit('addRepositories', response.data.items)
        commit('setError', '')
    } catch (error) {
        commit('setError', error.response.data.message)
    }

}
