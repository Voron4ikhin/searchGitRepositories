import axios from "axios"

const AxiosInstance = axios.create({
    baseURL: 'https://api.github.com'
})

export async function getRepositoriesGitHubAPI(state, page) {
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