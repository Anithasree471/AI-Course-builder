import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = (e) => {
  e.preventDefault()

  const storedUsers =
    JSON.parse(localStorage.getItem("users")) || []

  const user = storedUsers.find(
    (u) => u.email === email && u.password === password
  )

  if (!user) {
    alert("Invalid credentials")
    return
  }

  // ✅ STEP 1 GOES HERE
  localStorage.setItem("currentUser", email)
  localStorage.setItem("isLoggedIn", "true")

  alert("Login Successful!")

  navigate("/")   // go to Netflix home
}

  return (
    <div className="container mt-5">
      <div className="card card-custom p-4 mx-auto" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Login</h3>
        <form onSubmit={handleLogin}>
          <input
            className="form-control mb-3"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login
