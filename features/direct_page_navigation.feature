Feature: Direct Page Number Navigation

  Scenario: Navigating to a valid page number updates the table and page indicator
    Given the user is on the main page with existing alerts
    When the user enters "2" into the "Go to page" input and clicks "Go"
    Then the alert table displays page 2 of results
    And the current page indicator shows "Page 2"

  Scenario: Entering an invalid page shows an alert with a helpful message
    Given the user is on the main page with 5 total pages of alerts
    When the user enters "0" into the "Go to page" input and clicks "Go"
    Then an alert appears with the message "Invalid page number"