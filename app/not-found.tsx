export default function NotFound() {
  return (
    <html>
      <head>
        <title>Page Not Found</title>
      </head>
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h1 style={{ fontSize: "4rem", margin: "0 0 1rem 0" }}>404</h1>
          <h2 style={{ fontSize: "1.5rem", margin: "0 0 1rem 0" }}>Page Not Found</h2>
          <p style={{ margin: "0 0 2rem 0" }}>The page you are looking for doesn't exist or has been moved.</p>
          <a
            href="/"
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "0.25rem",
              textDecoration: "none",
            }}
          >
            Go Home
          </a>
        </div>
      </body>
    </html>
  )
}
