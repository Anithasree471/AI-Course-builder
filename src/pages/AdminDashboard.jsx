import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const currentUser = localStorage.getItem("currentUser")
  const role = localStorage.getItem("role")

  useEffect(() => {
    if (!currentUser || role !== "admin") {
      navigate("/login")
      return
    }

    fetchDashboard()
  }, [currentUser, role, navigate])

  const fetchDashboard = async () => {
    try {
      setLoading(true)

      const res = await fetch(
        `https://ai-course-builder-backend-new.onrender.com/admin/dashboard?email=${currentUser}`
      )

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed to load admin dashboard")
        return
      }

      setDashboardData(data.dashboard || [])
    } catch (error) {
      console.error("ADMIN DASHBOARD ERROR:", error)
      alert("Error loading admin dashboard")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-5 text-light">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2 className="mb-0">Admin Dashboard</h2>

        <button
          className="btn text-light"
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "1rem",
            fontWeight: "500"
          }}
        >
          ← Back
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading dashboard...</p>
      ) : dashboardData.length === 0 ? (
        <p className="text-center">No user records found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-bordered table-hover align-middle">
            <thead>
              <tr>
                <th>S.No</th>
                <th>User Name</th>
                <th>Email</th>
                <th>Course Title</th>
                <th>Progress</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.course_title}</td>
                  <td>{item.progress_percent}%</td>
                  <td>{item.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard