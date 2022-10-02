const api_axios = axios.create({        // Lo uso en saveFavoriteMichi
    baseURL: 'https://api.thecatapi.com/v1'
});
api_axios.defaults.headers.common['X-API-KEY'] = 'c08d415f-dea7-4a38-bb28-7b2188202e46';

//const URL = 'https://api.thecatapi.com/v1/images/search';
const img = document.querySelectorAll('img')
const figure = document.querySelector('figure')
const API_KEY = 'live_TL2hnKoBhKdRacY7lbD1CrghPlzM4U7YYBchb3Bd64Qj3D4mqvtY81u0fik1weIO'

const endpoint = 'images/search'
const query_parameter = '?limit=6'
//const query_parameter = '/limit=3&page=2'

const URL = 'https://api.thecatapi.com/v1/'+endpoint+query_parameter+'&api_key='+API_KEY;
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';
console.log(URL)

const spanError = document.getElementById('error')

async function myCats() {
    const res = await fetch(URL);
    const data = await res.json();

    for (let i = 0; i < data.length; i++) {
        img[i].src = data[i].url
    }

    // Botones pata agregar michis a favoritos
    const buttons = document.querySelectorAll('.imgContainer article button')

    for (let i = 0; i < buttons.length; i++) 
    {
        buttons[i].onclick = () => saveFavoriteMichi(data[i].id)
    }

}

async function loadFavoriteMichis() 
{
    const res = await fetch(API_URL_FAVORITES,{
        method: 'GET',
        headers: {
            'X-API-KEY': 'c08d415f-dea7-4a38-bb28-7b2188202e46'
        }
    });
    const data = await res.json();
    console.log('Favoritos')
    console.log(data)

    if (res.status !== 200) 
    {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    }
    else
    {
        document.querySelector('.container').innerHTML = ''
        data.forEach(michi => {
            const container = document.querySelector('.container')

            const article = document.createElement('article')
            const img = document.createElement('img')
            const button = document.createElement('button')

            img.src = michi.image.url
            button.innerText = 'Sacar al Michi de favoritos'
            button.setAttribute('onclick',`deleteFavoriteMichi(${michi.id})`)
            article.appendChild(img)
            article.appendChild(button)
            container.appendChild(article)
        });
    }
}


async function saveFavoriteMichi(michi_id)
{

    // const res = await fetch(API_URL_FAVORITES,{
    //     method: 'POST',
    //     headers: {
    //         'Content-Type':'application/json',
    //         'X-API-KEY': 'c08d415f-dea7-4a38-bb28-7b2188202e46'
    //     },
    //     body: JSON.stringify({
    //         image_id: michi_id
    //     })
    // })

    // const data = await res.json();

    // >>>>>>>>>>>>>> PROBANDO AXIOS
    const {data,status} = await api_axios.post('/favourites',{
        image_id: michi_id,
    })

    if (status !== 200) 
    {
        spanError.innerHTML = "Hubo un error: " + status + data.message;
    }

    console.log("Michi agregado a favoritos!")
    loadFavoriteMichis();
    

}


async function deleteFavoriteMichi(michi_id)
{
    const API_URL_FAVORITES_DELETE = `https://api.thecatapi.com/v1/favourites/${michi_id}`;

    const res = await fetch(API_URL_FAVORITES_DELETE,{
        method: 'DELETE',
        headers: {
            'X-API-KEY': 'c08d415f-dea7-4a38-bb28-7b2188202e46'
        }
    })

    const data = await res.json();
    if (res.status !== 200) 
    {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    }
    console.log("Michi eliminado de favoritos!")

    loadFavoriteMichis();
}


async function uploadMichi()
{
    const form = document.getElementById('uploadingForm')
    const formData = new FormData(form)

    const res = fetch(API_URL_UPLOAD,{
        method: 'POST',
        headers: {
            //'Content-Type':'multipart/form-data',
            'X-API-KEY': 'c08d415f-dea7-4a38-bb28-7b2188202e46'
        },
        body: formData,
    })

    console.log(res)
    console.log(formData.get('file'))

}

myCats();
loadFavoriteMichis();
