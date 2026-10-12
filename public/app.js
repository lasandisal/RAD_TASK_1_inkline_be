const modal = document.querySelector("#auth-modal")
const form = document.querySelector("#auth-form")
const message = document.querySelector("#form-message")
const nameField = document.querySelector("#name-field")
const modeSwitch = document.querySelector("#mode-switch")
const authMode = document.querySelector("#auth-mode")
const authTitle = document.querySelector("#auth-title")
const authSubtitle = document.querySelector("#auth-subtitle")
const submitAuth = document.querySelector("#submit-auth")
const toast = document.querySelector("#toast")
let isRegistering = false

const showModal = () => {
  modal.hidden = false
  document.querySelector("#email").focus()
}

const setMode = (registering) => {
  isRegistering = registering
  nameField.hidden = !registering
  authMode.textContent = registering ? "Join the community" : "Welcome back"
  authTitle.textContent = registering ? "Create your inkline" : "Sign in to inkline"
  authSubtitle.textContent = registering ? "A thoughtful space for thoughtful people." : "Keep your reading space close."
  submitAuth.innerHTML = registering ? "Create account <span aria-hidden=\"true\">→</span>" : "Sign in <span aria-hidden=\"true\">→</span>"
  modeSwitch.textContent = registering ? "Already have an account? Sign in" : "New here? Create an account"
  form.reset()
  message.textContent = ""
}

const notify = (text) => {
  toast.textContent = text
  toast.classList.add("show")
  window.setTimeout(() => toast.classList.remove("show"), 3200)
}

document.querySelector("#nav-auth").addEventListener("click", () => {
  if (localStorage.getItem("inkline_access_token")) loadProfile()
  else showModal()
})
document.querySelector("#hero-auth").addEventListener("click", showModal)
document.querySelector("#close-modal").addEventListener("click", () => { modal.hidden = true })
modal.addEventListener("click", (event) => { if (event.target === modal) modal.hidden = true })
modeSwitch.addEventListener("click", () => setMode(!isRegistering))

form.addEventListener("submit", async (event) => {
  event.preventDefault()
  const data = Object.fromEntries(new FormData(form))
  const endpoint = isRegistering ? "/api/v1/auth/register" : "/api/v1/auth/login"
  submitAuth.disabled = true
  message.textContent = "One moment..."

  try {
    const response = await fetch(endpoint, {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      method: "POST"
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.message || "Something went wrong")

    if (isRegistering) {
      setMode(false)
      message.textContent = "Account created. You can sign in now."
    } else {
      localStorage.setItem("inkline_access_token", result.data.access_token)
      localStorage.setItem("inkline_refresh_token", result.data.refresh_token)
      modal.hidden = true
      notify(`Welcome back, ${result.data.email}`)
      document.querySelector("#nav-auth").textContent = "My profile"
      document.querySelector("#hero-auth").textContent = "View my profile →"
      document.querySelector("#hero-auth").onclick = loadProfile
    }
  } catch (error) {
    message.textContent = error.message
  } finally {
    submitAuth.disabled = false
  }
})

async function loadProfile() {
  const token = localStorage.getItem("inkline_access_token")
  if (!token) return showModal()
  const response = await fetch("/api/v1/auth/me", { headers: { Authorization: `Bearer ${token}` } })
  if (response.ok) {
    const result = await response.json()
    notify(`Signed in as ${result.data.email}`)
  } else {
    localStorage.removeItem("inkline_access_token")
    showModal()
  }
}
