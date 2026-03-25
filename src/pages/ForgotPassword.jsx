import { useState } from "react"

function ForgotPassword() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Password reset link sent to " + email)
  }

  return (
    <div className="container mt-5">
      <div className="card card-custom p-4 mx-auto" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Forgot Password</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter your email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="btn btn-primary w-100">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword