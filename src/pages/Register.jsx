import { useState } from "react"

import { Link } from "react-router-dom"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = (e) => {
  e.preventDefault()

  const newUser = { name, email, password }

  const existingUsers =
    JSON.parse(localStorage.getItem("users")) || []

  // Check if user already exists
  const userExists = existingUsers.find(
    (u) => u.email === email
  )

  if (userExists) {
    alert("User already exists!")
    return
  }

  existingUsers.push(newUser)

  localStorage.setItem(
    "users",
    JSON.stringify(existingUsers)
  )

  alert("Registration Successful!")
  window.location.href = "/login"
}

  return (
    <div className="container mt-5">
      <div className="card card-custom p-4 mx-auto" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Create Account</h3>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Full Name"
            required
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-danger">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
