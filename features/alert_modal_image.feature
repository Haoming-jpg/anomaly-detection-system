Feature: Alert Modal Displays Supporting Frame Image

  Scenario: User views alert details with frame image in modal
    Given the user is on the main page with existing alert rows
    When the user clicks on an alert row in the table
    Then the modal displays a frame image for the selected alert