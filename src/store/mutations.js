export function addRepositoriesByPage(state, [page, result]) {
    state.repositoriesByPage[page] = result
}

export function addRepositories(state, result) {
    state.repositories = result
}

export function setInput(state, value) {
    state.inputSearch = value
}

export function changeActivePage(state, page) {
    state.activePage = page
}

export function changeSortType(state, index) {
    state.order = index
}

export function addRepositoriesLanguage(state, [key, value]) {
    state.language[key] = value
}

export function setPageCount(state, pageCount) {
    //добавил условие, потому что больше 100ой страницы нельзя указывать в запросе так как api возвращает  "message": "Only the first 1000 search results are available",
    if (pageCount > 100) {
        pageCount = 100
    }
    state.pageCount = pageCount
}

export function setError(state, error) {
    state.error = error
}
