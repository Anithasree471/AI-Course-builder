import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Home() {
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const popularCourses = [
    { id: 1, title: "Python", desc: "Programming, automation, AI basics" },
    { id: 2, title: "Java", desc: "OOP, backend, interview preparation" },
    { id: 3, title: "React", desc: "Frontend UI, components, routing" }
  ]

  const features = [
    {
      id: 1,
      title: "AI-Generated Notes",
      desc: "Get beginner-friendly explanations, examples, and important concepts for any topic."
    },
    {
      id: 2,
      title: "Curated Learning Resources",
      desc: "Receive helpful videos and articles in one place instead of searching manually."
    },
    {
      id: 3,
      title: "Assessment & Practice",
      desc: "Strengthen understanding with MCQs, tasks, and coding assignments."
    }
  ]

  const steps = [
    {
      id: 1,
      title: "Enter a Topic",
      desc: "Type any subject like Python, Java, DBMS, React, or C Programming."
    },
    {
      id: 2,
      title: "Generate Course",
      desc: "The system builds a structured learning path with notes and resources."
    },
    {
      id: 3,
      title: "Learn & Track Progress",
      desc: "Open the course, study the modules, and continue your learning journey."
    }
  ]

  const handleGenerate = async (selectedTopic = topic) => {
    const currentUser = localStorage.getItem("currentUser")
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    const userId = localStorage.getItem("user_id")

    if (!isLoggedIn || !currentUser || !userId) {
      alert("Please login again")
      navigate("/login")
      return
    }

    if (!selectedTopic.trim()) {
      alert("Enter a topic")
      return
    }

    try {
      setLoading(true)

      const res = await fetch("https://ai-course-builder-backend-new.onrender.com/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topic: selectedTopic,
          user_id: Number(userId)
        })
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        alert(data.error || "Backend error generating course")
        return
      }

      const savedCourseId = data.course.id
      setTopic("")
      navigate(`/course/${savedCourseId}`)
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
    <div className="text-light">
      <section
        className="container py-5"
        style={{ minHeight: "88vh", display: "flex", alignItems: "center" }}
      >
        <div className="row align-items-center w-100 g-5">
          <div className="col-lg-7">
            <span
              className="d-inline-block px-3 py-2 mb-4"
              style={{
                background: "rgba(220, 53, 69, 0.12)",
                color: "#ff6b6b",
                borderRadius: "999px",
                border: "1px solid rgba(220,53,69,0.25)",
                fontSize: "0.9rem"
              }}
            >
              Smart Learning Platform
            </span>

            <h1
              className="fw-bold mb-4"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.7rem)",
                lineHeight: "1.1"
              }}
            >
              AI-Powered <span style={{ color: "#dc3545" }}>Adaptive</span>
              <br />
              Course Builder
            </h1>

            <p
              className="mb-4"
              style={{
                fontSize: "1.15rem",
                color: "rgba(255,255,255,0.75)",
                maxWidth: "680px"
              }}
            >
              Generate complete learning paths instantly with AI-generated
              notes, curated resources, assessments, and coding practice for
              any topic you want to learn.
            </p>

            <div
              className="p-3 p-md-4 mb-4"
              style={{
                background: "rgba(15, 23, 42, 0.72)",
                borderRadius: "22px",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 25px 50px rgba(0,0,0,0.35)"
              }}
            >
              <div className="row g-3 align-items-center">
                <div className="col-md-8">
                  <input
                    type="text"
                    className="form-control form-control-lg custom-topic-input"
                    placeholder="Enter topic like Python, DBMS, React..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    style={{
                      borderRadius: "14px",
                      background: "#0f172a",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.08)",
                      minHeight: "58px"
                    }}
                  />
                </div>

                <div className="col-md-4 d-grid">
                  <button
                    className="btn btn-danger btn-lg"
                    onClick={() => handleGenerate(topic)}
                    disabled={loading}
                    style={{
                      borderRadius: "14px",
                      minHeight: "58px",
                      fontWeight: "600"
                    }}
                  >
                    {loading ? "Generating..." : "Generate Course"}
                  </button>
                </div>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-sm-4">
                <div
                  className="p-3 h-100"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "18px",
                    border: "1px solid rgba(255,255,255,0.06)"
                  }}
                >
                  <h5 className="mb-2 text-danger">Notes</h5>
                  <p className="mb-0 text-light" style={{ opacity: 0.75 }}>
                    Structured explanation with concepts and examples.
                  </p>
                </div>
              </div>

              <div className="col-sm-4">
                <div
                  className="p-3 h-100"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "18px",
                    border: "1px solid rgba(255,255,255,0.06)"
                  }}
                >
                  <h5 className="mb-2 text-danger">Resources</h5>
                  <p className="mb-0 text-light" style={{ opacity: 0.75 }}>
                    Videos and articles collected for the selected topic.
                  </p>
                </div>
              </div>

              <div className="col-sm-4">
                <div
                  className="p-3 h-100"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "18px",
                    border: "1px solid rgba(255,255,255,0.06)"
                  }}
                >
                  <h5 className="mb-2 text-danger">Practice</h5>
                  <p className="mb-0 text-light" style={{ opacity: 0.75 }}>
                    Learn better with MCQs, tasks, and coding activities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div
              className="p-4 p-md-5"
              style={{
                background: "linear-gradient(180deg, rgba(15,23,42,0.95), rgba(2,6,23,0.95))",
                borderRadius: "28px",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 25px 50px rgba(0,0,0,0.4)"
              }}
            >
              <div
                className="mb-4 p-3"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "18px"
                }}
              >
                <p className="mb-2 small text-danger">Generated Flow</p>
                <h4 className="fw-bold">Topic → Notes → Resources → Test</h4>
                <p className="mb-0" style={{ opacity: 0.75 }}>
                  Your platform creates a complete path instead of giving only one resource.
                </p>
              </div>

              <div className="mb-3 p-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <h6 className="text-danger">✔ AI-Generated Modules</h6>
                <p className="mb-0" style={{ opacity: 0.7 }}>
                  Clear learning modules for easier understanding.
                </p>
              </div>

              <div className="mb-3 p-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <h6 className="text-danger">✔ Smart Learning Materials</h6>
                <p className="mb-0" style={{ opacity: 0.7 }}>
                  Helpful video and article suggestions in one place.
                </p>
              </div>

              <div className="p-3">
                <h6 className="text-danger">✔ Practice & Progress</h6>
                <p className="mb-0" style={{ opacity: 0.7 }}>
                  Track your learning using quizzes and assignments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Why Choose This Platform?</h2>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            Everything needed to learn a topic is generated in one place.
          </p>
        </div>

        <div className="row g-4">
          {features.map((feature) => (
            <div key={feature.id} className="col-md-4">
              <div
                className="h-100 p-4"
                style={{
                  background: "rgba(15, 23, 42, 0.68)",
                  borderRadius: "22px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 16px 35px rgba(0,0,0,0.25)"
                }}
              >
                <div
                  className="mb-3 d-inline-flex align-items-center justify-content-center"
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: "rgba(220,53,69,0.14)",
                    color: "#dc3545",
                    fontWeight: "bold",
                    fontSize: "1.2rem"
                  }}
                >
                  {feature.id}
                </div>

                <h4 className="mb-3">{feature.title}</h4>
                <p className="mb-0" style={{ opacity: 0.72 }}>
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">How It Works</h2>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            Simple flow for learners to generate and study any topic.
          </p>
        </div>

        <div className="row g-4">
          {steps.map((step) => (
            <div key={step.id} className="col-md-4">
              <div
                className="h-100 p-4 text-center"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "22px",
                  border: "1px solid rgba(255,255,255,0.06)"
                }}
              >
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "#dc3545",
                    fontSize: "1.2rem",
                    fontWeight: "bold"
                  }}
                >
                  {step.id}
                </div>

                <h4 className="mb-3">{step.title}</h4>
                <p className="mb-0" style={{ opacity: 0.72 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="courses" className="container py-5">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1">Popular Courses</h2>
            <p className="mb-0" style={{ color: "rgba(255,255,255,0.7)" }}>
              Start quickly with commonly learned topics.
            </p>
          </div>
        </div>

        <div className="row g-4">
          {popularCourses.map((course, index) => (
            <div key={course.id} className="col-md-4">
              <div
                className="h-100 position-relative overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, rgba(15,23,42,0.95), rgba(2,6,23,0.95))",
                  borderRadius: "22px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  cursor: "pointer",
                  minHeight: "290px",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.25)"
                }}
                onClick={() => handlePopularClick(course.title)}
              >
                <div
                  style={{
                    height: "105px",
                    background:
                      index === 0
                        ? "linear-gradient(135deg, #0f766e, #14b8a6)"
                        : index === 1
                        ? "linear-gradient(135deg, #64748b, #475569)"
                        : "linear-gradient(135deg, #2563eb, #0f766e)",
                    position: "relative"
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      right: "-16px",
                      top: "-12px",
                      width: "110px",
                      height: "110px",
                      borderRadius: "24px",
                      background: "rgba(255,255,255,0.09)",
                      transform: "rotate(24deg)"
                    }}
                  ></div>

                  <div
                    style={{
                      position: "absolute",
                      right: "28px",
                      top: "14px",
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.12)",
                      transform: "rotate(-18deg)"
                    }}
                  ></div>
                </div>

                <div className="p-4">
                  <div
                    className="mb-3 d-inline-block px-3 py-2"
                    style={{
                      background: "rgba(220,53,69,0.14)",
                      color: "#ff6b6b",
                      borderRadius: "999px",
                      fontSize: "0.85rem"
                    }}
                  >
                    Popular Topic
                  </div>

                  <h3 className="mb-3 fw-bold">{course.title}</h3>

                  <p className="mb-4" style={{ opacity: 0.72 }}>
                    {course.desc}
                  </p>

                  <button
                    className="btn btn-outline-light"
                    style={{ borderRadius: "12px" }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePopularClick(course.title)
                    }}
                  >
                    Generate Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home