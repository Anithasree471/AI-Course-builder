import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import Footer from "./Footer"

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
    setShowMenu(false)
  }, [location])

  const handleLogout = () => {
  localStorage.removeItem("isLoggedIn")
  localStorage.removeItem("currentUser")
  localStorage.removeItem("user_id")
  setIsLoggedIn(false)
  setCurrentUser(null)
  navigate("/")
}

  const handleNavClick = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/")
      setTimeout(() => {
        const section = document.getElementById(sectionId)
        if (section) {
          section.scrollIntoView({ behavior: "smooth" })
        }
      }, 150)
      return
    }

    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  const showFooter =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password"

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #020617 0%, #030712 45%, #000000 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <nav
        className="navbar navbar-expand-lg px-4 px-md-5 py-3"
        style={{
          background: "rgba(2, 6, 23, 0.9)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "sticky",
          top: 0,
          zIndex: 1000
        }}
      >
        <div className="container-fluid p-0 d-flex align-items-center justify-content-between">
          <div
            className="fw-bold"
            style={{
              color: "#ff4d5a",
              cursor: "pointer",
              fontSize: "1.8rem",
              letterSpacing: "0.4px"
            }}
            onClick={() => navigate("/")}
          >
            AI Course Builder
          </div>

          <div className="d-none d-md-flex align-items-center gap-4"
          style={{ marginLeft: "220px" }}
          >
            <span
              style={{ cursor: "pointer", color: "rgba(255,255,255,0.75)" }}
              onClick={() => navigate("/")}
            >
              Home
            </span>

            <span
              style={{ cursor: "pointer", color: "rgba(255,255,255,0.75)" }}
              onClick={() => handleNavClick("about")}
            >
              About
            </span>

            <span
              style={{ cursor: "pointer", color: "rgba(255,255,255,0.75)" }}
              onClick={() => handleNavClick("courses")}
            >
              Courses
            </span>

            <span
              style={{ cursor: "pointer", color: "rgba(255,255,255,0.75)" }}
              onClick={() => handleNavClick("contact")}
            >
              Contact
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            {!isLoggedIn ? (
              <>
                <button
                  className="btn btn-outline-light px-4"
                  style={{ borderRadius: "999px" }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>

                <button
                  className="btn btn-danger px-4"
                  style={{ borderRadius: "999px" }}
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-outline-light"
                  style={{ borderRadius: "999px" }}
                  onClick={() => navigate("/profile")}
                >
                  My Courses
                </button>

                <div className="position-relative">
                  <div
                    onClick={() => setShowMenu(!showMenu)}
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      boxShadow: "0 10px 25px rgba(220,53,69,0.25)"
                    }}
                  >
                    {currentUser?.charAt(0).toUpperCase()}
                  </div>

                  {showMenu && (
                    <div
                      className="position-absolute end-0 mt-3 p-3 shadow"
                      style={{
                        width: "220px",
                        borderRadius: "18px",
                        background: "rgba(15, 23, 42, 0.98)",
                        border: "1px solid rgba(255,255,255,0.08)"
                      }}
                    >
                      <p
                        className="mb-3 small text-light"
                        style={{ opacity: 0.85, wordBreak: "break-word" }}
                      >
                        {currentUser}
                      </p>

                      <button
                        className="btn btn-danger w-100"
                        style={{ borderRadius: "12px" }}
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      <main style={{ flex: 1 }}>{children}</main>

      {showFooter && <Footer />}
    </div>
  )
}

export default Layout