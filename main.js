import { supabase } from './supabaseClient.js'

// Éléments du DOM
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const signupBtn = document.getElementById('signupBtn')
const loginBtn = document.getElementById('loginBtn')
const logoutBtn = document.getElementById('logoutBtn')
const statusText = document.getElementById('status')
const postSection = document.getElementById('postSection')
const authSection = document.getElementById('authSection')
const contentInput = document.getElementById('content')
const postBtn = document.getElementById('postBtn')
const postsContainer = document.getElementById('posts')
const userEmailSpan = document.getElementById('userEmail')

let currentUser = null

// Vérifier l'état d'authentification au chargement
checkUser()

async function checkUser() {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session?.user) {
    currentUser = session.user
    showApp()
  }
}

// Écouteurs d'événements
signupBtn.addEventListener('click', handleSignUp)
loginBtn.addEventListener('click', handleLogin)
logoutBtn.addEventListener('click', handleLogout)
postBtn.addEventListener('click', handlePost)

// ----- INSCRIPTION -----
async function handleSignUp() {
  const email = emailInput.value
  const password = passwordInput.value
  
  if (!email || !password) {
    statusText.textContent = '❌ Veuillez remplir tous les champs'
    return
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    statusText.textContent = '❌ ' + error.message
  } else {
    statusText.textContent = '✅ Inscription réussie ! Vérifie ton email.'
  }
}

// ----- CONNEXION -----
async function handleLogin() {
  const email = emailInput.value
  const password = passwordInput.value
  
  if (!email || !password) {
    statusText.textContent = '❌ Veuillez remplir tous les champs'
    return
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    statusText.textContent = '❌ ' + error.message
  } else {
    currentUser = data.user
    showApp()
    statusText.textContent = ''
  }
}

// ----- DÉCONNEXION -----
async function handleLogout() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Erreur de déconnexion:', error.message)
  } else {
    currentUser = null
    hideApp()
  }
}

// ----- CREATION DE POST -----
async function handlePost() {
  if (!currentUser) return alert('Connecte-toi pour publier !')

  const content = contentInput.value.trim()
  if (!content) return alert('Le message ne peut pas être vide')

  const { error } = await supabase
    .from('posts')
    .insert([{ 
      user_id: currentUser.id, 
      content: content,
      user_email: currentUser.email
    }])

  if (error) {
    alert('Erreur: ' + error.message)
  } else {
    contentInput.value = ''
    loadPosts()
  }
}

// ----- CHARGER LES POSTS -----
async function loadPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur lors du chargement des posts:', error)
    return
  }

  postsContainer.innerHTML = ''
  
  if (data.length === 0) {
    postsContainer.innerHTML = '<div class="card"><p>Aucun post pour le moment. Soyez le premier à publier !</p></div>'
    return
  }
  
  data.forEach(post => {
    const postElement = createPostElement(post)
    postsContainer.appendChild(postElement)
  })
}

// Créer un élément de post
function createPostElement(post) {
  const div = document.createElement('div')
  div.className = 'card'
  
  // Formater la date
  const postDate = new Date(post.created_at).toLocaleString('fr-FR')
  
  // Créer les initiales de l'utilisateur
  const userInitials = post.user_email ? post.user_email.charAt(0).toUpperCase() : 'U'
  
  div.innerHTML = `
    <div class="post-header">
      <div class="post-avatar">${userInitials}</div>
      <div>
        <strong>${post.user_email || 'Utilisateur inconnu'}</strong>
        <div class="post-date">${postDate}</div>
      </div>
    </div>
    <div class="post-content">
      <p>${post.content}</p>
    </div>
    <div class="post-actions">
      <button>❤️</button>
      <button>🔄</button>
      <button>💬</button>
    </div>
  `
  
  return div
}

// Afficher l'application après connexion
function showApp() {
  authSection.classList.add('hidden')
  postSection.classList.remove('hidden')
  userEmailSpan.textContent = currentUser.email
  loadPosts()
}

// Cacher l'application après déconnexion
function hideApp() {
  authSection.classList.remove('hidden')
  postSection.classList.add('hidden')
  postsContainer.innerHTML = ''
  emailInput.value = ''
  passwordInput.value = ''
}

// Écouter les changements d'authentification
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    currentUser = session.user
    showApp()
  } else if (event === 'SIGNED_OUT') {
    currentUser = null
    hideApp()
  }
})