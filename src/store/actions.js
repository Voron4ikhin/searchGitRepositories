import axios from "axios"

export function addRepositories({commit}, [query, chunkSize]){
    axios(query).then(response => {
        if(response.status == 200){
            commit('addRepositories', response.data.items)
            if(response.data.items.length !== 0){
            
            let page = 1
            for(let i = 0; i < response.data.items.length; i += chunkSize){
                let chunck = response.data.items.slice(i, i + chunkSize)
                //Закоментировал т.к github ограничил ко-во запросов (30 запросов на 1 поиск только по языкам)
                // chunck.forEach(element => {
                //     axios('https://api.github.com/repos/' + element.full_name +'/languages').then(resLanguage => {
                //         commit('addRepositoriesLanguage', [element.full_name, resLanguage.data])
                //     })
                // });
                commit('addRepositoriesByPage', [page, chunck])
                page++
            }
        }
        }
    })  
}
