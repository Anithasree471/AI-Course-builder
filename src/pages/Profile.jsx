import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Profile() {
  const [courses, setCourses] = useState([])
  const navigate = useNavigate()

  const currentUser = localStorage.getItem("currentUser")

  useEffect(() => {
    if (!currentUser) {
      navigate("/login")
      return
    }

    const storedCourses =
      JSON.parse(localStorage.getItem(currentUser + "_courses")) || []

    setCourses(storedCourses)
  }, [currentUser, navigate])

  const handleDelete = (id) => {
    const updatedCourses = courses.filter(
      (course) => course.id !== id
    )

    setCourses(updatedCourses)

    localStorage.setItem(
      currentUser + "_courses",
      JSON.stringify(updatedCourses)
    )
  }

  const getProgressPercent = (course) => {
    const progress = course.progress || {}
    const total = 5
    let completed = 0

    if (progress.notesCompleted) completed++
    if (progress.videosCompleted) completed++
    if (progress.assessmentCompleted) completed++
    if (progress.codingCompleted) completed++
    if (progress.articlesCompleted) completed++

    return Math.round((completed / total) * 100)
  }

  return (
    <div className="container mt-5 text-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">My Courses</h2>

        <button
          className="btn btn-outline-light"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </div>

      {courses.length === 0 ? (
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
                    <h4
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/course/${course.id}`)}
                    >
                      📘 {course.title}
                    </h4>

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