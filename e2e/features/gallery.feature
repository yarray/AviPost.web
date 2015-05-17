Feature: postcard gallery

    Background:
        Given server has demo data

    Scenario: view my postcards
        Given I am demo
        When I visit my gallery
        Then I see the gallery
        And with 30 figures
