import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Profile() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const userId = localStorage.getItem("user_id")

  useEffect(() => {
    if (!userId) {
      navigate("/login")
      return
    }

    fetchCourses()
  }, [userId, navigate])

  const fetchCourses = async () => {
    try {
      setLoading(true)

      const res = await fetch(`https://ai-course-builder-backend-new.onrender.com/courses/${userId}`)
      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed to fetch courses")
        return
      }

      setCourses(data.courses || [])
    } catch (error) {
      console.error("FETCH COURSES ERROR:", error)
      alert("Error loading courses")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://ai-course-builder-backend-new.onrender.com/course/${id}`, {
        method: "DELETE"
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed to delete course")
        return
      }

      setCourses((prev) => prev.filter((course) => course.id !== id))
    } catch (error) {
      console.error("DELETE COURSE ERROR:", error)
      alert("Error deleting course")
    }
  }

  const getProgressPercent = (course) => {
    const progress = course.progress || {}
    const total = course.isProgramming ? 5 : 4

    let completed = 0
    if (progress.notesCompleted) completed++
    if (progress.videosCompleted) completed++
    if (progress.assessmentCompleted) completed++
    if (course.isProgramming && progress.codingCompleted) completed++
    if (progress.articlesCompleted) completed++

    return Math.round((completed / total) * 100)
  }

  return (
    <div className="container mt-5 text-light">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2 className="mb-0">My Courses</h2>

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
        <p className="text-center">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-center">No courses generated yet.</p>
      ) : (
        <div className="row">
          {courses.map((course) => {
            const progressPercent = getProgressPercent(course)

            return (
              <div key={course.id} className="col-md-6 mb-4">
                <div
                  className="card bg-dark text-light shadow p-4"
                  style={{ borderRadius: "16px" }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h4
                        className="fw-bold mb-1"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/course/${course.id}`)}
                      >
                        {course.title}
                      </h4>
                      <p
                        className="mb-0"
                        style={{
                          color: "rgba(255,255,255,0.6)",
                          fontSize: "0.95rem"
                        }}
                      >
                        AI-generated learning path
                      </p>
                    </div>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(course.id)}
                    >
                      Delete
                    </button>
                  </div>

                  <p className="mb-2">
                    Modules: {course.modules ? course.modules.length : 0}
                  </p>

                  <p className="mb-2">
                    MCQs: {course.mcq ? course.mcq.length : 0}
                  </p>

                  <p className="mb-3">
                    Overall Progress: {progressPercent}%
                  </p>

                  <div className="progress mb-3" style={{ height: "22px" }}>
                    <div
                      className="progress-bar bg-danger"
                      style={{ width: `${progressPercent}%` }}
                    >
                      {progressPercent}%
                    </div>
                  </div>

                  <button
                    className="btn btn-danger"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    Open Course
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Profile