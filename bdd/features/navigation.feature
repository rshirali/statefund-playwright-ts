Feature: State Fund top navigation

  @smoke @bdd
  Scenario: Navigate to For Brokers from the header
    Given I am on the State Fund home page
    When I click the top navigation link "For Brokers"
    Then the URL should match "/broker"
    And I should see main content with a visible heading
