import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Home() {
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const currentUser = localStorage.getItem("currentUser")
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

  const popularCourses = [
    { id: 1, title: "Python" },
    { id: 2, title: "Java" },
    { id: 3, title: "React" },
  ]

  const saveCourseAndOpen = (courseData, fallbackTitle) => {
    const newCourse = {
      id: Date.now(),
      title: courseData.title || fallbackTitle,
      modules: courseData.modules || [],
      mcq: courseData.mcq || [],
      assignment: courseData.assignment || {},
      youtube: courseData.youtube || [],
      articles: courseData.articles || [],
      progress: {
        notesCompleted: false,
        videosCompleted: false,
        assessmentCompleted: false,
        codingCompleted: false,
        articlesCompleted: false,
        assessmentScore: 0,
        codingScore: 0
      }
    }

    const userCourses =
      JSON.parse(localStorage.getItem(currentUser + "_courses")) || []

    const updatedCourses = [...userCourses, newCourse]

    localStorage.setItem(
      currentUser + "_courses",
      JSON.stringify(updatedCourses)
    )

    navigate(`/course/${newCourse.id}`)
  }

  const handleGenerate = async (selectedTopic = topic) => {
    if (!isLoggedIn) {
      alert("Please login to generate course")
      navigate("/login")
      return
    }

    if (!selectedTopic.trim()) {
      alert("Enter a topic")
      return
    }

    try {
      setLoading(true)

      const res = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ topic: selectedTopic })
      })

      const data = await res.json()
      console.log("API RESPONSE:", data)

      if (data.error) {
        alert("Backend error generating course")
        return
      }

      const courseData = data.course
      saveCourseAndOpen(courseData, selectedTopic)
      setTopic("")
    } catch (error) {
      console.error("API ERROR:", error)
      alert("Error creating course")
    } finally {
      setLoading(false)
    }
  }

  const handlePopularClick = (title) => {
    handleGenerate(title)
  }

  return (
    <div className="container text-center mt-5 text-light">
      <h1 className="display-4 fw-bold mb-3">
        AI-Powered Adaptive Course Builder
      </h1>

      <p className="lead mb-4">
        Generate complete learning paths instantly using AI
      </p>

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
          onClick={() => handleGenerate(topic)}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Course"}
        </button>
      </div>

      <h3 className="mb-4 text-danger">Popular Courses</h3>

      <div className="row justify-content-center">
        {popularCourses.map((course) => (
          <div key={course.id} className="col-md-3 mb-3">
            <div
              className="card bg-dark text-light p-3 shadow"
              style={{ cursor: "pointer", borderRadius: "16px" }}
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