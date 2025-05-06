Feature: Modal Closure After Viewing Alert Details

  Scenario: User closes the alert detail modal
    Given the user is on the main page with existing alert rows
    When the user clicks on an alert row in the table
    And the user clicks the close button in the modal
    Then the modal is no longer visible on the page