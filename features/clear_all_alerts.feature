Feature: Clear All Alerts and Frames

  Scenario: Successfully clear all alerts and display success message
    Given the user is on the main page with existing alerts
    When the user clicks the "Clear All Alerts and Frames" button with data-testid "clear-all-button"
    And confirms the action in the prompt
    Then the system makes a POST request to "/clear_all"
    And the alert table is empty
    And a success message "All alerts and frames cleared!" is displayed with data-testid "clear-status"

  Scenario: Handle failed clear operation and show error message
    Given the user is on the main page with existing alerts
    When the user clicks the "Clear All Alerts and Frames" button with data-testid "clear-all-button"
    And confirms the action in the prompt
    But the POST request to "/clear_all" fails
    Then an error message "Failed to clear alerts and frames." is displayed with data-testid "clear-status"
    And the original alerts remain visible in the table
