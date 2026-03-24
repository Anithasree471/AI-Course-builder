import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
  e.preventDefault()

  try {
    const res = await fetch("https://ai-course-builder-backend-new.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error || "Login failed")
      return
    }

    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("currentUser", data.user.email)
    localStorage.setItem("user_id", data.user.id)

    console.log("Login successful")
    console.log("currentUser:", localStorage.getItem("currentUser"))
    console.log("isLoggedIn:", localStorage.getItem("isLoggedIn"))
    console.log("user_id:", localStorage.getItem("user_id"))

    alert("Login Successful!")
    navigate("/")
  } catch (error) {
    console.error("LOGIN ERROR:", error)
    alert("Server error")
  }
}

  return (
    <div className="container mt-5">
      <div
        className="card card-custom p-4 mx-auto bg-dark text-light shadow"
        style={{ width: "400px", borderRadius: "16px" }}
      >
        <h3 className="text-center mb-3">Login</h3>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-danger w-100">Login</button>
        </form>

        <p className="text-center mt-3 mb-1">
          Don’t have an account?{" "}
          <Link to="/register" className="text-danger text-decoration-none">
            Sign Up
          </Link>
        </p>

        <p className="text-center mb-0">
          <Link to="/forgot-password" className="text-light text-decoration-none">
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login