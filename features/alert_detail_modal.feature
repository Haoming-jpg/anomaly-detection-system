Feature: Alert Detail Modal Display

  Scenario: User views detailed alert information in modal
    Given the user is on the main page with existing alert rows
    When the user clicks on an alert row in the table
    Then the modal displays the alert's ID
    And the modal displays the alert's timestamp
    And the modal displays the alert's type
    And the modal displays the alert's message
    And the modal includes a frame image for the alert