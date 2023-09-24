export function addRepositoriesByPage(state, [page, result]){
    state.repositoriesByPage[page] = result
}

export function addRepositories(state, result){
    state.repositories = result
}

export function setInput(state, value){
    state.inputSearch = value
}

export function changeActivePage(state, page){
    state.activePage = page
}

export function changeSortType(state, index){
    state.order = index
}

export function addRepositoriesLanguage(state, [key, value]){
    state.language[key] = value
}