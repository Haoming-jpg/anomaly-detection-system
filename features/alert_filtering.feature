Feature: Alert Filtering by Type and Message

  Scenario: Search by type filters alerts
    Given the user is on the main page with existing alerts
    When the user enters "Motion" into the search input and clicks "Search by Type"
    Then the alert table displays only alerts with type containing "motion"

  Scenario: Search by message filters alerts
    Given the user is on the main page with existing alerts
    When the user enters "unauthorized" into the search input and clicks "Search by Message"
    Then the alert table displays only alerts with message containing "unauthorized"

  Scenario: Reset button clears active filter
    Given the user is on the main page with an active filter applied
    When the user clicks the "Reset" button
    Then the alert table displays all alerts without filtering