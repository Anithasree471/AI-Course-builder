import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Dashboard() {
  const [courses, setCourses] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
  const currentUser = localStorage.getItem("currentUser")

  const storedCourses =
    JSON.parse(localStorage.getItem(currentUser + "_courses")) || []

  setCourses(storedCourses)
}, [])

  const handleDelete = (id) => {
  const currentUser = localStorage.getItem("currentUser")

  const updatedCourses = courses.filter(
    (course) => course.id !== id
  )

  setCourses(updatedCourses)

  localStorage.setItem(
    currentUser + "_courses",
    JSON.stringify(updatedCourses)
  )
}

  return (
    <div className="container text-center mt-5">
      <h1 className="display-5 fw-bold mb-4">
        Your Generated Courses
      </h1>

      {courses.length === 0 ? (
        <p className="lead">No courses generated yet.</p>
      ) : (
        <div className="row justify-content-center">
          {courses.map((course) => (
            <div key={course.id} className="col-md-6 mb-3">
              <div className="card shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-center">

                  {/* Course Title Clickable */}
                  <h5
                    className="card-title mb-0"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/course/${course.id}`)
                    }
                  >
                    📘 {course.title}
                  </h5>

                  {/* Delete Button */}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() =>
                      handleDelete(course.id)
                    }
                  >
                    Delete
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard