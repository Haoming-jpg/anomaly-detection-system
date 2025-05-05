Feature: Video Processing Completion Confirmation

  Scenario: User receives confirmation after video processing completes
    Given the user is on the main page
    When the user uploads a valid ".mp4" video file using the upload input
    Then the app displays an alert with the message "Video processing complete."