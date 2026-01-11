// Authentication helper functions using localStorage
// This provides basic authentication for the expense tracker

const AUTH_KEY = "spendSenseUsers"
const SESSION_KEY = "spendSenseSession"

// Initialize users in localStorage if not exists
function initializeUsers() {
  if (!localStorage.getItem(AUTH_KEY)) {
    localStorage.setItem(AUTH_KEY, JSON.stringify([]))
  }
}

// Get all users from localStorage
function getAllUsers() {
  initializeUsers()
  return JSON.parse(localStorage.getItem(AUTH_KEY)) || []
}

// Save users to localStorage
function saveUsers(users) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(users))
}

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem(SESSION_KEY) !== null
}

// Get current logged in user
function getCurrentUser() {
  return localStorage.getItem(SESSION_KEY)
}

function getUserName() {
  const users = getAllUsers()
  const email = getCurrentUser()
  const user = users.find(u => u.email === email)
  return user?.name || ""
}


// Handle login form submission
function handleLogin(event) {
  event.preventDefault()

  const email = document.getElementById("email").value.trim()
  const password = document.getElementById("password").value
  const errorMessage = document.getElementById("errorMessage")

  // Validate inputs
  if (!email || !password) {
    showError("Please fill in all fields", errorMessage)
    return
  }

  // Find user
  const users = getAllUsers()
  const user = users.find((u) => u.email === email)

  if (!user) {
    showError("Invalid credentials", errorMessage)
    return
  }

  // Check password
  if (user.password !== password) {
    showError("Invalid credentials", errorMessage)
    return
  }

  // Set session
  localStorage.setItem(SESSION_KEY, email)

  // Redirect to dashboard
  window.location.href = "index.html"
}

// Handle signup form submission
function handleSignup(event) {
  event.preventDefault()

  const name = document.getElementById("name").value.trim()
  const email = document.getElementById("email").value.trim()
  const password = document.getElementById("password").value
  const confirmPassword = document.getElementById("confirmPassword").value
  const errorMessage = document.getElementById("errorMessage")

  // Validate inputs
  if (!name || !email || !password || !confirmPassword) {
    showError("Please fill in all fields", errorMessage)
    return
  }

  // Validate password length
  if (password.length < 6) {
    showError("Password should be at least 6 characters", errorMessage)
    return
  }

  // Validate password match
  if (password !== confirmPassword) {
    showError("Passwords do not match", errorMessage)
    return
  }

  // Check if email already exists
  const users = getAllUsers()
  if (users.some((u) => u.email === email)) {
    showError("Email already exists", errorMessage)
    return
  }

  // Create new user
  const newUser = {
    name: name,
    email: email,
    password: password,
  }

  // Save user
  users.push(newUser)
  saveUsers(users)

  // Set session
  localStorage.setItem(SESSION_KEY, email)
  localStorage.setItem(
    `expenseTrackerState_${email}`,
    JSON.stringify({
        expenses: [],
        income: 0,
        goals: [],
        aiInsights: null
    })
);


  // Redirect to dashboard
  window.location.href = "index.html"
}

// Show error message
function showError(message, errorElement) {
  errorElement.textContent = message
  errorElement.classList.add("show")

  // Auto hide after 5 seconds
  setTimeout(() => {
    errorElement.classList.remove("show")
  }, 5000)
}

// Logout function
function logout() {
  localStorage.removeItem(SESSION_KEY)
  window.location.href = "login.html"
}

// Check authentication on page load
function checkAuthentication() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html"

  // Allow login and signup pages without authentication
  if (currentPage === "login.html" || currentPage === "signup.html") {
    // If already logged in, redirect to dashboard
    if (isLoggedIn()) {
      window.location.href = "index.html"
    }
    return
  }

  // For index.html, require authentication
  if (currentPage === "index.html" || currentPage === "") {
    if (!isLoggedIn()) {
      window.location.href = "login.html"
    }
  }
}

// Run check on page load
document.addEventListener("DOMContentLoaded", checkAuthentication)
