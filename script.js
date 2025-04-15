const baseURl = 'https://api.unsplash.com'
const getRandomPhotoURL = '/photos/random'
const searchPhotoURL = '/search/photos'

const searchBtn = document.querySelector('#search-btn')
const randomBtn = document.querySelector('#random-btn')
const input = document.querySelector('.params-input')
const imgContainer = document.querySelector('.content-container')

searchBtn.addEventListener('click', async () => {
  searchBtn.disabled = true
  randomBtn.disabled = true
  searchBtn.innerText = "Поиск ..."
  imgContainer.innerHTML = ""
  await searchPhotos()
  searchBtn.disabled = false
  randomBtn.disabled = false
  searchBtn.innerText = "Поиск"
})

randomBtn.addEventListener('click', async () => {
  randomBtn.disabled = true
  searchBtn.disabled = true
  randomBtn.innerText = "Случайное фото ..."
  imgContainer.innerHTML = ""
  await fetchRandomPhoto()
  randomBtn.disabled = false
  searchBtn.disabled = false
  randomBtn.innerText = "Случайное фото"
})

const fetchRandomPhoto = async () => {
  const response = await fetch(`${baseURl}${getRandomPhotoURL}`, {
    method: 'GET',
    headers: {
      'Authorization': `Client-ID lKqNAmSPYVsegVHIB_RW8FHAEo6_vhdTXlo69zXi9Q8` 
    }
  })
  switch (response.status) {
    case 200:
      const data = await response.json()
      const photoUrl = data.urls.small
      imgContainer.innerHTML = `<img src=${photoUrl}>`
      break
    case 403:
      imgContainer.innerHTML = `<p class="error-message">Доступ к API запрещен</p>`
      break
    case 404:
      imgContainer.innerHTML = `<p class="error-message">Ресурс не найден</p>`
      break
    default:
      imgContainer.innerHTML = `<p class="error-message">Произошла ошибка ${response.status}</p>`
  }
}

const searchPhotos = async () => {
  const query = input.value
  if (!query) {
    imgContainer.innerHTML = `<p class="error-message">Введите что-нибудь</p>`
    return
  }
  const response = await fetch(`${baseURl}${searchPhotoURL}?page=1&per_page=4&query=${query}`, {
    method: 'GET',
    headers: {
      'Authorization': `Client-ID lKqNAmSPYVsegVHIB_RW8FHAEo6_vhdTXlo69zXi9Q8` 
    }
  })
  switch (response.status) {
    case 200:
      const data = await response.json()
      if (data.total === 0) {
        imgContainer.innerHTML = `<p class="error-message">Ресурс не найден</p>`
        return
      }
      const photoUrls = data.results.map(photo => photo.urls.small);
      imgContainer.innerHTML = `
      <div class="content-grid">
        ${photoUrls.map(url => `<img src=${url}></img>`).join('')}
      </div>
      `
      break
    case 403:
      imgContainer.innerHTML = `<p class="error-message">Доступ к API запрещен</p>`
      break
    case 404:
      imgContainer.innerHTML = `<p class="error-message">Ресурс не найден</p>`
      break
    default:
      imgContainer.innerHTML = `<p class="error-message">Произошла ошибка ${response.status}</p>`
  }
}