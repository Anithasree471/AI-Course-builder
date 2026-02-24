import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Home() {
  const [topic, setTopic] = useState("")
  const navigate = useNavigate()

  const currentUser = localStorage.getItem("currentUser")
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

  // 🔥 Fixed Popular Courses
  const popularCourses = [
    { id: 1, title: "Python" },
    { id: 2, title: "Java" },
    { id: 3, title: "React" },
  ]

  // ✅ Generate Custom Course
  const handleGenerate = () => {
    if (!isLoggedIn) {
      alert("Please login to generate course")
      navigate("/login")
      return
    }

    if (!topic.trim()) {
      alert("Enter a topic")
      return
    }

    const newCourse = {
      id: Date.now(),
      title: topic,
      notes: [
        `Introduction to ${topic}`,
        `${topic} Core Concepts`,
        `Intermediate ${topic}`,
        `Advanced ${topic}`,
        `${topic} Real World Project`
      ]
    }

    const userCourses =
      JSON.parse(localStorage.getItem(currentUser + "_courses")) || []

    const updatedUserCourses = [...userCourses, newCourse]

    localStorage.setItem(
      currentUser + "_courses",
      JSON.stringify(updatedUserCourses)
    )

    setTopic("")

    // 🔥 Open course immediately
    navigate(`/course/${newCourse.id}`)
  }

  // ✅ Popular Course Click
  const handlePopularClick = (title) => {
    if (!isLoggedIn) {
      alert("Please login to view course")
      navigate("/login")
      return
    }

    const newCourse = {
      id: Date.now(),
      title: title,
      notes: [
        `Introduction to ${title}`,
        `${title} Core Concepts`,
        `Intermediate ${title}`,
        `Advanced ${title}`,
        `${title} Real World Project`
      ]
    }

    const userCourses =
      JSON.parse(localStorage.getItem(currentUser + "_courses")) || []

    const updatedUserCourses = [...userCourses, newCourse]

    localStorage.setItem(
      currentUser + "_courses",
      JSON.stringify(updatedUserCourses)
    )

    // 🔥 Open the course immediately
    navigate(`/course/${newCourse.id}`)
  }

  return (
    <div className="container text-center mt-5 text-light">
      <h1 className="display-4 fw-bold mb-3">
        AI-Powered Adaptive Course Builder
      </h1>

      <p className="lead mb-4">
        Generate complete learning paths instantly using AI
      </p>

      {/* Generate Section */}
      <div className="d-flex justify-content-center gap-2 mb-5">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Enter topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <button
          className="btn btn-danger"
          onClick={handleGenerate}
        >
          Generate Course
        </button>
      </div>

      {/* 🔥 Fixed Popular Courses */}
      <h3 className="mb-4 text-danger"> Popular Courses</h3>

      <div className="row justify-content-center">
        {popularCourses.map((course) => (
          <div
            key={course.id}
            className="col-md-3 mb-3"
          >
            <div
              className="card bg-dark text-light p-3 shadow"
              style={{ cursor: "pointer" }}
              onClick={() => handlePopularClick(course.title)}
            >
              <h5>📘 {course.title}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home