import { supabase } from './supabaseClient.js'

const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const signupBtn = document.getElementById('signupBtn')
const loginBtn = document.getElementById('loginBtn')
const statusText = document.getElementById('status')
const postSection = document.getElementById('postSection')
const contentInput = document.getElementById('content')
const postBtn = document.getElementById('postBtn')
const postsContainer = document.getElementById('posts')

let currentUser = null

// ----- INSCRIPTION -----
signupBtn.addEventListener('click', async () => {
  const { data, error } = await supabase.auth.signUp({
    email: emailInput.value,
    password: passwordInput.value
  })

  if (error) statusText.textContent = '❌ ' + error.message
  else statusText.textContent = '✅ Inscription réussie ! Vérifie ton email.'
})

// ----- CONNEXION -----
loginBtn.addEventListener('click', async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value
  })

  if (error) statusText.textContent = '❌ ' + error.message
  else {
    currentUser = data.user
    statusText.textContent = '✅ Connecté en tant que ' + currentUser.email
    postSection.style.display = 'block'
    loadPosts()
  }
})

// ----- CREATION DE POST -----
postBtn.addEventListener('click', async () => {
  if (!currentUser) return alert('Connecte-toi pour publier !')

  const { data, error } = await supabase
    .from('posts')
    .insert([{ user_id: currentUser.id, content: contentInput.value }])

  if (error) alert(error.message)
  else {
    contentInput.value = ''
    loadPosts()
  }
})

// ----- CHARGER LES POSTS -----
async function loadPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return console.error(error)

  postsContainer.innerHTML = ''
  data.forEach(post => {
    const div = document.createElement('div')
    div.className = 'card'
    div.innerHTML = `<p>${post.content}</p><small>${post.created_at}</small>`
    postsContainer.appendChild(div)
  })
}
