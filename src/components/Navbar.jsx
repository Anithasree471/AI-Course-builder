import { Link } from "react-router-dom"

function Navbar() {

  const isLoggedIn = localStorage.getItem("isLoggedIn")

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    window.location.href = "/"
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold text-danger" to="/">
        AI Course Builder
      </Link>

      <div className="ms-auto">
        {isLoggedIn ? (
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline-light me-2">
              Login
            </Link>
            <Link to="/register" className="btn btn-danger">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar