Feature: Alert Table Display and Pagination

  Scenario: Table displays alerts after video processing
    Given the user is on the main page
    When the user uploads a valid video file and processing completes
    Then the alert table displays rows with columns "ID", "Timestamp", "Type", and "Message"

  Scenario: Pagination controls navigate between pages correctly
    Given the user is on the main page with more than 50 alerts
    When the user clicks the "Next" pagination control
    Then the table updates to show the next page of alerts
    And the current page number increments by 1