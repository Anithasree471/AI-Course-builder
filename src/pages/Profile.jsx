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

  return (
    <div className="container mt-5 text-light">
      <h2 className="text-center mb-4">My Courses</h2>

      {courses.length === 0 ? (
        <p className="text-center">No courses generated yet.</p>
      ) : (
        <div className="row">
          {courses.map((course) => (
            <div key={course.id} className="col-md-6 mb-3">
              <div className="card bg-dark text-light p-3 shadow d-flex flex-row justify-content-between align-items-center">

                {/* Click to View */}
                <h5
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(`/course/${course.id}`)
                  }
                >
                  📘 {course.title}
                </h5>

                {/* DELETE BUTTON */}
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
          ))}
        </div>
      )}
    </div>
  )
}

export default Profile