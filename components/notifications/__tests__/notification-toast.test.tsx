import { render, screen } from "@testing-library/react"
import { NotificationToast } from "../notification-toast"

describe("NotificationToast", () => {
  it("renders the notification with title and description", () => {
    render(
      <NotificationToast
        notification={{
          id: "1",
          title: "Test Title",
          description: "Test Description",
          type: "info",
        }}
      />,
    )

    expect(screen.getByText("Test Title")).toBeInTheDocument()
    expect(screen.getByText("Test Description")).toBeInTheDocument()
  })

  it("applies the correct CSS class based on notification type", () => {
    const { container } = render(
      <NotificationToast
        notification={{
          id: "1",
          title: "Success",
          description: "Operation successful",
          type: "success",
        }}
      />,
    )

    // Check for success class (this will depend on your actual implementation)
    expect(container.querySelector(".bg-green-50")).toBeInTheDocument()
  })
})
