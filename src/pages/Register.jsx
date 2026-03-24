import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Registration failed")
        return
      }

      alert("Registration Successful!")
      navigate("/login")
    } catch (error) {
      console.error("REGISTER ERROR:", error)
      alert("Server error")
    }
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            required
            value={password}
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