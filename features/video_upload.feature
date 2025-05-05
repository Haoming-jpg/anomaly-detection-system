Feature: Video Upload and Preview

  Scenario: User uploads a valid video file and sees a preview
    Given the user is on the main page
    When the user selects a valid ".mp4" video file using the upload input
    Then the app displays a video preview element on the page