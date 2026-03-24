function Footer() {
  return (
    <footer
      id="contact"
      className="mt-5"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(2, 6, 23, 0.95)"
      }}
    >
      <div className="container py-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-6">
            <h5 className="mb-2" style={{ color: "#ff4d5a" }}>
              AI Course Builder
            </h5>
            <p className="mb-0" style={{ color: "rgba(255,255,255,0.65)" }}>
              Generate adaptive learning paths with AI-powered notes, curated resources,
              assessments, and coding practice.
            </p>
          </div>

          <div className="col-md-6 text-md-end">
            <p className="mb-1" style={{ color: "rgba(255,255,255,0.75)" }}>
              Email: support@aicoursebuilder.com
            </p>
            <p className="mb-0" style={{ color: "rgba(255,255,255,0.55)" }}>
              © 2026 AI Course Builder. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer