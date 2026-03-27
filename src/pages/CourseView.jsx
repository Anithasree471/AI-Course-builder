import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

function CourseView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [activeTab, setActiveTab] = useState("notes")
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [score, setScore] = useState(null)
  const [codeAnswer, setCodeAnswer] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourse()
  }, [id])

  const fetchCourse = async () => {
    try {
      setLoading(true)

      const res = await fetch(`https://ai-course-builder-backend-new.onrender.com/course/${id}`)
      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed to fetch course")
        setCourse(null)
        return
      }

      setCourse(data.course)
    } catch (error) {
      console.error("FETCH COURSE ERROR:", error)
      alert("Error loading course")
    } finally {
      setLoading(false)
    }
  }

  const saveProgress = async (updatedProgress) => {
    if (!course) return

    try {
      const res = await fetch(`https://ai-course-builder-backend-new.onrender.com/course/${id}/progress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          progress: updatedProgress
        })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed to update progress")
        return
      }

      setCourse({
        ...course,
        progress: updatedProgress
      })
    } catch (error) {
      console.error("UPDATE PROGRESS ERROR:", error)
      alert("Error updating progress")
    }
  }

  const markComplete = (field) => {
    if (!course) return

    const updatedProgress = {
      ...course.progress,
      [field]: true
    }

    saveProgress(updatedProgress)
  }

  const isProgramming = course?.isProgramming === true

  const goNext = () => {
    const order = isProgramming
      ? ["notes", "videos", "assessment", "coding", "articles", "dashboard"]
      : ["notes", "videos", "assessment", "articles", "dashboard"]

    const currentIndex = order.indexOf(activeTab)
    if (currentIndex < order.length - 1) {
      setActiveTab(order[currentIndex + 1])
    }
  }

  const handleOptionChange = (questionIndex, option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: option
    })
  }

  const handleSubmitAssessment = () => {
    if (!course?.mcq) return

    let marks = 0

    course.mcq.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        marks++
      }
    })

    const percent = Math.round((marks / course.mcq.length) * 100)

    const updatedProgress = {
      ...course.progress,
      assessmentCompleted: true,
      assessmentScore: percent
    }

    saveProgress(updatedProgress)
    setScore(`${marks} / ${course.mcq.length}`)
  }

  const handleSubmitCode = () => {
    if (!codeAnswer.trim()) {
      alert("Please write your code first")
      return
    }

    let codingScore = 0
    if (codeAnswer.length > 30) codingScore += 5
    if (
      codeAnswer.includes("if") ||
      codeAnswer.includes("for") ||
      codeAnswer.includes("while") ||
      codeAnswer.includes("print") ||
      codeAnswer.includes("return")
    ) {
      codingScore += 10
    }
    if (codeAnswer.length > 100) codingScore += 5

    const updatedProgress = {
      ...course.progress,
      codingCompleted: true,
      codingScore
    }

    saveProgress(updatedProgress)
    alert("Code submitted successfully")
  }

  const tabStyle = (tabName) => ({
    cursor: "pointer",
    padding: "10px 18px",
    borderRadius: "8px",
    color: activeTab === tabName ? "#ffffff" : "#cbd5e1",
    backgroundColor: activeTab === tabName ? "#dc3545" : "transparent",
    fontWeight: activeTab === tabName ? "600" : "400"
  })

  const cleanText = (text, moduleTitle) => {
    if (!text) return ""

    let cleaned = text

    cleaned = cleaned.replace(/\*\*/g, "")
    cleaned = cleaned.replace(/^#{1,6}\s*/gm, "")
    cleaned = cleaned.replace(/```[a-zA-Z]*\n?/g, "```")

    const lines = cleaned.split("\n").filter((line) => line.trim() !== "")

    if (
      lines.length > 0 &&
      lines[0].trim().toLowerCase() === moduleTitle.trim().toLowerCase()
    ) {
      lines.shift()
    }

    return lines.join("\n")
  }

  const renderContentWithCode = (content, moduleTitle) => {
    const cleaned = cleanText(content, moduleTitle)
    const parts = cleaned.split("```")

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <pre
            key={index}
            style={{
              backgroundColor: "#0f172a",
              color: "#f8fafc",
              padding: "16px",
              borderRadius: "12px",
              overflowX: "auto",
              border: "1px solid #334155",
              marginTop: "16px",
              marginBottom: "16px"
            }}
          >
            <code>{part.trim()}</code>
          </pre>
        )
      }

      return (
        <div
          key={index}
          style={{
            whiteSpace: "pre-line",
            lineHeight: "1.9",
            fontSize: "17px"
          }}
        >
          {part.trim()}
        </div>
      )
    })
  }

  if (loading) {
    return (
      <p className="text-center mt-5 text-light">
        Loading course...
      </p>
    )
  }

  if (!course) {
    return (
      <p className="text-center mt-5 text-light">
        Course not found
      </p>
    )
  }

  const progress = course.progress || {}

  const checklistItems = [
    { label: "Notes", completed: progress.notesCompleted },
    { label: "Videos", completed: progress.videosCompleted },
    { label: "Assessment", completed: progress.assessmentCompleted },
    ...(isProgramming
      ? [{ label: "Coding", completed: progress.codingCompleted }]
      : []),
    { label: "Articles", completed: progress.articlesCompleted }
  ]

  const completedCount = checklistItems.filter((item) => item.completed).length
  const progressPercent = Math.round((completedCount / checklistItems.length) * 100)

  const notesScore = isProgramming
    ? (progress.notesCompleted ? 20 : 0)
    : (progress.notesCompleted ? 25 : 0)

  const videosScore = isProgramming
    ? (progress.videosCompleted ? 20 : 0)
    : (progress.videosCompleted ? 25 : 0)

  const assessmentScore = isProgramming
    ? Math.round(((progress.assessmentScore || 0) / 100) * 20)
    : Math.round(((progress.assessmentScore || 0) / 100) * 25)

  const codingScore = isProgramming ? (progress.codingScore || 0) : 0

  const articlesScore = isProgramming
    ? (progress.articlesCompleted ? 20 : 0)
    : (progress.articlesCompleted ? 25 : 0)

  const overallScore =
    notesScore + videosScore + assessmentScore + codingScore + articlesScore

  const getGrade = (score) => {
    if (score >= 90) return "A+"
    if (score >= 80) return "A"
    if (score >= 70) return "B"
    if (score >= 60) return "C"
    if (score >= 50) return "D"
    return "F"
  }

  return (
    <div className="container mt-5 text-white">
      <div
        onClick={() => navigate(-1)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          cursor: "pointer",
          marginBottom: "20px",
          color: "rgba(255,255,255,0.7)",
          fontSize: "0.95rem",
          transition: "0.3s"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#ffffff"
          e.currentTarget.style.transform = "translateX(-3px)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.7)"
          e.currentTarget.style.transform = "translateX(0)"
        }}
      >
        <span style={{ fontSize: "1.2rem" }}>←</span>
        <span>Back</span>
      </div>

      <div className="text-center mb-4">
        <h2 className="fw-bold mb-2">{course.title}</h2>
        <p style={{ color: "rgba(255,255,255,0.65)" }}>
          Personalized AI-generated course content
        </p>
      </div>

      <div className="d-flex flex-wrap gap-3 justify-content-center mb-4">
        <span style={tabStyle("notes")} onClick={() => setActiveTab("notes")}>Notes</span>
        <span style={tabStyle("videos")} onClick={() => setActiveTab("videos")}>Videos</span>
        <span style={tabStyle("assessment")} onClick={() => setActiveTab("assessment")}>Assessment</span>

        {isProgramming && (
          <span style={tabStyle("coding")} onClick={() => setActiveTab("coding")}>
            Coding
          </span>
        )}

        <span style={tabStyle("articles")} onClick={() => setActiveTab("articles")}>Articles</span>
        <span style={tabStyle("dashboard")} onClick={() => setActiveTab("dashboard")}>Dashboard</span>
      </div>

      {activeTab === "notes" && (
        <div>
          {course.modules && course.modules.length > 0 ? (
            course.modules.map((module, index) => (
              <div
                key={index}
                className="card bg-dark text-white p-4 mb-4 shadow"
                style={{ borderRadius: "16px" }}
              >
                <h4 className="text-danger mb-3">
                  Module {index + 1}: {module.title}
                </h4>

                {renderContentWithCode(module.content, module.title)}
              </div>
            ))
          ) : (
            <p>No notes available.</p>
          )}

          <div className="d-flex gap-3 mt-3">
            <button
              className={`btn ${progress.notesCompleted ? "btn-success" : "btn-danger"}`}
              onClick={() => markComplete("notesCompleted")}
              disabled={progress.notesCompleted}
            >
              {progress.notesCompleted ? "Completed " : "Mark as Complete"}
            </button>
            <button className="btn btn-outline-light" onClick={goNext}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {activeTab === "videos" && (
        <div>
          {course.youtube && course.youtube.length > 0 ? (
            course.youtube.map((video, index) => (
              <div
                className="card bg-dark p-4 mb-4 shadow text-white"
                style={{ borderRadius: "16px" }}
                key={index}
              >
                <h5 className="mb-3 text-danger">{video.title}</h5>

                {video.videoId ? (
                  <iframe
                    width="100%"
                    height="350"
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={`Video ${index + 1}`}
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="mb-3">Video preview unavailable</div>
                )}

                <a
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-light mt-3"
                >
                  ▶ Open in YouTube
                </a>
              </div>
            ))
          ) : (
            <p>No videos available.</p>
          )}

          <div className="d-flex gap-3 mt-3">
            <button
              className={`btn ${progress.videosCompleted ? "btn-success" : "btn-danger"}`}
              onClick={() => markComplete("videosCompleted")}
              disabled={progress.videosCompleted}
            >
              {progress.videosCompleted ? "Completed " : "Mark as Complete"}
            </button>
            <button className="btn btn-outline-light" onClick={goNext}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {activeTab === "assessment" && (
        <div>
          {course.mcq && course.mcq.length > 0 ? (
            <>
              {course.mcq.map((q, index) => (
                <div
                  key={index}
                  className="card bg-dark text-white p-4 mb-4 shadow"
                  style={{ borderRadius: "16px" }}
                >
                  <h5 className="text-danger mb-3">
                    Q{index + 1}. {q.question}
                  </h5>

                  {q.options.map((opt, i) => (
                    <div className="form-check mb-2" key={i}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`question-${index}`}
                        value={opt}
                        onChange={() => handleOptionChange(index, opt)}
                        disabled={progress.assessmentCompleted}
                      />
                      <label className="form-check-label">{opt}</label>
                    </div>
                  ))}
                </div>
              ))}

              <button
                className={`btn ${progress.assessmentCompleted ? "btn-success" : "btn-danger"}`}
                onClick={handleSubmitAssessment}
                disabled={progress.assessmentCompleted}
              >
                {progress.assessmentCompleted ? "Submitted " : "Submit Assessment"}
              </button>

              {(score || progress.assessmentCompleted) && (
                <div className="mt-4 alert alert-success">
                  Your Score: {score || `${Math.round(((progress.assessmentScore || 0) / 100) * (course.mcq?.length || 0))} / ${course.mcq?.length || 0}`}
                </div>
              )}
            </>
          ) : (
            <p>No assessment available.</p>
          )}

          <div className="d-flex gap-3 mt-3">
            <button className="btn btn-outline-light" onClick={goNext}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {isProgramming && activeTab === "coding" && (
        <div className="card bg-dark text-white p-4 shadow" style={{ borderRadius: "16px" }}>
          <h4 className="text-danger mb-3">Programming Assignment</h4>

          <p><strong>Problem Statement:</strong></p>
          <p style={{ whiteSpace: "pre-line" }}>{course.assignment?.problem}</p>

          <p><strong>Sample Input:</strong></p>
          <p>{course.assignment?.input}</p>

          <p><strong>Sample Output:</strong></p>
          <p>{course.assignment?.output}</p>

          <p><strong>Explanation:</strong></p>
          <p style={{ whiteSpace: "pre-line" }}>{course.assignment?.explanation}</p>

          <textarea
            className="form-control mt-3"
            rows="10"
            placeholder="Write your code here..."
            value={codeAnswer}
            onChange={(e) => setCodeAnswer(e.target.value)}
            disabled={progress.codingCompleted}
            style={{
              backgroundColor: "#111827",
              color: "white",
              border: "1px solid #374151"
            }}
          ></textarea>

          <button
            className={`btn mt-3 ${progress.codingCompleted ? "btn-success" : "btn-danger"}`}
            onClick={handleSubmitCode}
            disabled={progress.codingCompleted}
          >
            {progress.codingCompleted ? "Submitted " : "Submit Code"}
          </button>

          <div className="d-flex gap-3 mt-3">
            <button className="btn btn-outline-light" onClick={goNext}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {activeTab === "articles" && (
        <div>
          {course.articles && course.articles.length > 0 ? (
            course.articles.map((article, index) => (
              <div className="col-md-6 mb-3" key={index}>
                <div
                  className="card bg-dark text-white p-4 shadow"
                  style={{ borderRadius: "16px" }}
                >
                  <h5 className="text-danger mb-3">{article.title}</h5>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-light"
                  >
                    📄 Read Article
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>No articles available.</p>
          )}

          <div className="d-flex gap-3 mt-3">
            <button
              className={`btn ${progress.articlesCompleted ? "btn-success" : "btn-danger"}`}
              onClick={() => markComplete("articlesCompleted")}
              disabled={progress.articlesCompleted}
            >
              {progress.articlesCompleted ? "Completed " : "Mark as Complete"}
            </button>
            <button className="btn btn-outline-light" onClick={goNext}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {activeTab === "dashboard" && (
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card bg-dark text-white p-4 shadow text-center" style={{ borderRadius: "16px" }}>
              <h5 className="text-danger">Total Modules</h5>
              <h2>{course.modules ? course.modules.length : 0}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-dark text-white p-4 shadow text-center" style={{ borderRadius: "16px" }}>
              <h5 className="text-danger">MCQ Questions</h5>
              <h2>{course.mcq ? course.mcq.length : 0}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-dark text-white p-4 shadow text-center" style={{ borderRadius: "16px" }}>
              <h5 className="text-danger">Videos</h5>
              <h2>{course.youtube ? course.youtube.length : 0}</h2>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card bg-dark text-white p-4 shadow" style={{ borderRadius: "16px" }}>
              <h5 className="text-danger mb-3">Learning Progress</h5>
              <div className="progress mb-4" style={{ height: "24px" }}>
                <div
                  className="progress-bar bg-danger"
                  style={{ width: `${progressPercent}%` }}
                >
                  {progressPercent}%
                </div>
              </div>

              <div style={{ lineHeight: "2" }}>
                <p>{progress.notesCompleted ? "✅" : "⬜"} Notes</p>
                <p>{progress.videosCompleted ? "✅" : "⬜"} Videos</p>
                <p>{progress.assessmentCompleted ? "✅" : "⬜"} Assessment</p>
                {isProgramming && <p>{progress.codingCompleted ? "✅" : "⬜"} Coding</p>}
                <p>{progress.articlesCompleted ? "✅" : "⬜"} Articles</p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card bg-dark text-white p-4 shadow" style={{ borderRadius: "16px" }}>
              <h5 className="text-danger mb-3">Performance Summary</h5>

              {isProgramming ? (
                <>
                  <p>Notes Score: {notesScore} / 20</p>
                  <p>Videos Score: {videosScore} / 20</p>
                  <p>Assessment Score: {assessmentScore} / 20</p>
                  <p>Coding Score: {codingScore} / 20</p>
                  <p>Articles Score: {articlesScore} / 20</p>
                </>
              ) : (
                <>
                  <p>Notes Score: {notesScore} / 25</p>
                  <p>Videos Score: {videosScore} / 25</p>
                  <p>Assessment Score: {assessmentScore} / 25</p>
                  <p>Articles Score: {articlesScore} / 25</p>
                </>
              )}

              <p><strong>Overall Score: {overallScore} / 100</strong></p>
              <p className="mb-0"><strong>Grade: {getGrade(overallScore)}</strong></p>
            </div>
          </div>

          <div className="col-12 text-center mt-3">
            <button className="btn btn-danger" onClick={() => navigate("/")}>
              Back to Main Page
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseView