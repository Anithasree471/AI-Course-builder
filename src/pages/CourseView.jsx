import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

function CourseView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) return

    const storedCourses =
      JSON.parse(localStorage.getItem(currentUser + "_courses")) || []

    const selectedCourse = storedCourses.find(
      (c) => c.id.toString() === id
    )

    if (selectedCourse) {
      // ✅ If notes not present, auto-create them
      if (!selectedCourse.notes) {
        selectedCourse.notes = [
          `Introduction to ${selectedCourse.title}`,
          `${selectedCourse.title} Core Concepts`,
          `Intermediate ${selectedCourse.title}`,
          `Advanced ${selectedCourse.title}`,
          `${selectedCourse.title} Real World Project`
        ]
      }
    }

    setCourse(selectedCourse)
  }, [id])

  if (!course)
    return (
      <p className="text-center mt-5 text-light">
        Course not found
      </p>
    )

  return (
    <div className="container mt-5 text-white">

      <button
        className="btn btn-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h2 className="mb-4 fw-bold text-center">
        📘 {course.title}
      </h2>

      {course.notes.map((note, index) => (
        <div
          key={index}
          className="card bg-dark text-white p-4 mb-4 shadow"
        >
          <h5>📖 Module {index + 1}</h5>
          <p>{note}</p>
        </div>
      ))}

    </div>
  )
}

export default CourseView