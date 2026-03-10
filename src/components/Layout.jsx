import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  )
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("currentUser")
  )
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true")
    setCurrentUser(localStorage.getItem("currentUser"))
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("currentUser")
    setIsLoggedIn(false)
    setCurrentUser(null)
    navigate("/")
  }

  return (
    <>
      <nav className="d-flex justify-content-between align-items-center p-3 bg-dark">
        <h4
          className="text-danger mb-0"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          AI Course Builder
        </h4>

        {!isLoggedIn ? (
          <div>
            <button
              className="btn btn-outline-light me-2"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="btn btn-danger"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="position-relative">
            <div
              onClick={() => setShowMenu(!showMenu)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#dc3545",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {currentUser?.charAt(0).toUpperCase()}
            </div>

            {showMenu && (
              <div
                className="bg-dark text-light p-3 position-absolute shadow"
                style={{ right: 0, top: "50px", width: "200px", borderRadius: "12px" }}
              >
                <button
                  className="btn btn-sm btn-outline-light w-100 mb-2"
                  onClick={() => navigate("/profile")}
                >
                  My Courses
                </button>

                <button
                  className="btn btn-sm btn-danger w-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {children}
    </>
  )
}

export default Layout