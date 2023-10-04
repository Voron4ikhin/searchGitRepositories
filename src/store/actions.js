import {getRepositoriesGitHubAPI} from "@/api/requests"

export async function fetchAndCommitRepositories({commit, state}, [page, firstRequest = false]) {
    let response = ''
    let maxElementsOnPage = state.maxElementsOnPage
    try {
        response = await getRepositoriesGitHubAPI(state, page)
        commit('changeActivePage', page)
        commit('addRepositories', response.data.items)
        commit('setError', '')
        if (firstRequest) {
            commit('setPageCount', Math.ceil(response.data.total_count / maxElementsOnPage))
            commit('setLastKeyword', state.inputSearch)
        }
    } catch (error) {
        commit('setError', error.response.data.message)
    }

}

