Feature: postcard gallery

    Background:
        Given I am logged in
        # And I received 30 postcards

    Scenario: view my postcards
        When I visit my gallery
        Then I see the gallery
        And with 30 figures
