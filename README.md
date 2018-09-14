# Technica Hackathon Expo App

A beautiful and intuitive web app to display hackathon projects for expo attendees, hackers, and sponsors to locate or learn more info about a hack. This web app also provides powerful admin and sponsor features beyond a basic display website, including:
* Admin dashboard
    * Import project data from .csv files (from Devpost)
    * Automatically or manually assign table numbers to projects
    * CRUD project data on the fly
* Sponsor winner selection
    * Access code secure login
    * Sponsors can select projects as winner(s) for their challenges (so the organizing team can have a record of winners)
    * UI warning if a project is winning too many challenges (to avoid one project sweeping all prizes)

## Page URLs

Starting from localhost in a development environment, use the following links to access this application.

- Home /
- Sponsor Login /sponsorLogin
- Sponsor Dashboard /sponsor
- Admin Login /adminLogin
- Admin Dashboard /admin

## Contribution Guidelines

Whenever you make an improvement, please *submit a pull request* (never push to master).

Make sure your commit messages are consistent with these guidelines (from [here](https://chris.beams.io/posts/git-commit/)):
- Separate subject from body with a blank line
- Limit the subject line to 50 characters
- Capitalize the subject line
- Do not end the subject line with a period
- Use the imperative mood in the subject line (e.g. Clean your room, Close the door, Take out the trash)
- Wrap the body at 72 characters
- Use the body to explain what and why vs. how

If you're working on improving the Flask app, please use PEP 8 Python style guide! You can find the linter for Atom [here](https://atom.io/packages/linter-python-pep8).
