/// claim variables of URL and DOM element
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users'
const userList = document.querySelector('#user-list')
const searchForm = document.querySelector('#search-user')
const searchInput = document.querySelector('#search-input')
const languageList = document.querySelector('#language-list')
const modal = document.querySelector('#description-modal')
const paginator = document.querySelector('#user-paginator')
const userPerPage = 24

let user = []
let userOfPage = []
let filteredUsers = []


// request user data
axios.get(INDEX_URL).then((response) => {
  user.push(...response.data.results)
  showUserList(getUserByPage(1))
  renderPaginator(user)
}).catch((error) => {
  console.log(error)
})

// render user list
function showUserList(data) {
  let rawHTML = ''
  data.forEach((person) => {
    rawHTML += `<div class="col-sm-4 col-md-3 col-lg-2 mb-3">
        <div class="card shadow">
          <a href="#description-modal" data-toggle="modal"><img src="${person.avatar}" class="card-img-top" alt="user-avatar" data-id="${person.id}"></a>
          <div class="card-body" style="padding: 0px; text-align: center;">
            <p class="card-text" style="font-size:14px;">${person.name + person.surname}</p>
            <i class="far fa-heart"></i>
          </div>
        </div>
      </div>`
  })
  // change innerHTML of user list
  userList.innerHTML = rawHTML
}

// display modal
function showModal(data) {
  let rawHTML = `<div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${data.name + data.surname}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body row align-items-center">
          <div class= "modal-avatar col-4">
            <img src="${data.avatar}" alt="modal-avatar">
          </div>
          <div class="modal-description col-8">
            <p>E-mail: ${data.email}</p>
            <p>age : ${data.age}</p>
            <p>region: ${data.region}</p>
            <p>birthday: ${data.birthday}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>`

  modal.innerHTML = rawHTML
}

// find user by keyword
function getUserByKeyWord(word) {
  if (word.length === 0) {
    filteredUsers = user
  }
  // find user list by keyword
  filteredUsers = user.filter((person) => person.name.includes(word) || person.surname.includes(word))
  return filteredUsers
}

// find user list by language
function geyUserByLanguage(id) {
  if (id === 'language-all') {
    filteredUsers = user
  } else if (id === 'language-deutsch') {
    filteredUsers = user.filter((person) => person.region === 'DE' || person.region === 'CH')
  } else if (id === 'language-english') {
    filteredUsers = user.filter((person) => person.region === 'CA' || person.region === 'US' || person.region === 'AU' || person.region === 'DK')
  } else if (id === 'language-others') {
    filteredUsers = user.filter((person) => person.region !== 'CA' && person.region !== 'US' && person.region !== 'AU' && person.region !== 'DK' && person.region !== 'DE' && person.region !== 'CH')
  }
  return filteredUsers
}

// function for render pagination
function renderPaginator(user) {
  const pages = Math.ceil((user.length / userPerPage))
  let rawHTML = ''
  for (let i = 1; i <= pages; i++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// get user by page 
function getUserByPage(page) {
  const data = filteredUsers.length? filteredUsers : user
  userOfPage = data.slice(userPerPage * (page - 1), (userPerPage * page))
  return userOfPage
}

// add search function event listener
searchForm.addEventListener('submit', function onSumbitClicked(event) {
  event.preventDefault()
  const keyWord = searchInput.value.trim().toLowerCase()
  let data = getUserByKeyWord(keyWord)
  if (data.length === 0) {
    return alert(`您輸入的關鍵字 ${keyWord} 沒有符合的搜尋結果！`)
  }
  showUserList(getUserByPage(1))
  renderPaginator(data)
})

// add modal render function event listener
userList.addEventListener('click', function onImgClicked(event) {
  const id = Number(event.target.dataset.id)
  let data
  user.forEach((person) => {
    if (person.id === id)
      data = person
  })
  showModal(data)
})

// add event listener to search user by speaking language
languageList.addEventListener('click', function onButtonClicked(event) {
  const language = event.target.id
  const data = geyUserByLanguage(language)
  renderPaginator(data)
  showUserList(getUserByPage(1))
})

// add event listener to change page
paginator.addEventListener('click', function onPaginatorClicked(event) {
  const page = event.target.dataset.page
  showUserList(getUserByPage(page))
})