import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

function Layout({ children }) {
  const navigate = useNavigate()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState("")
  const [showMenu, setShowMenu] = useState(false)

  // Check login status whenever component loads
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true"
    const user = localStorage.getItem("currentUser")

    setIsLoggedIn(loginStatus)
    setCurrentUser(user)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("currentUser")

    setIsLoggedIn(false)
    setCurrentUser("")
    setShowMenu(false)

    navigate("/") // go to home
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

        {/* RIGHT SIDE */}
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
            {/* Profile Circle */}
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

            {/* Dropdown Menu */}
            {showMenu && (
              <div
                className="bg-dark text-light p-3 position-absolute rounded shadow"
                style={{ right: 0, top: "50px", width: "200px", zIndex: 1000 }}
              >
                <button
                  className="btn btn-sm btn-outline-light w-100 mb-2"
                  onClick={() => {
                    navigate("/profile")
                    setShowMenu(false)
                  }}
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