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

- Home `/`
- Sponsor Login `/sponsorLogin`
- Sponsor Dashboard `/sponsor`
- Admin Login `/adminLogin`
- Admin Dashboard `/admin`

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

## How to Use

### Admin Instructions

1. Create your Devpost and add your sponsor's challenges (or your own!) - make sure to follow the Devpost Guidelines outlined below!
2. Log in as `admin` and add sponsors and assign unique access codes.
3. Add the challenges to each sponsor (*important:* when naming the challenge, make sure it is exactly the same string as you created in Devpost, but remove the ` - company_name` portion (e.g. if you have a challenge in Devpost that says `Best Hack to Transform Transportation - Lyft`, you should add a challenge of the name `Best Hack to Transform Transportation` in the admin console))

### Sponsor Instructions

TODO

## Devpost Guidelines

v1 of this expo app makes a few assumptions about how Devpost is set up. Not following these requirements may lead to unexpected behavior in your deployment.

- Challenge names should be formatted as `challenge_name - company_name` (e.g. `Best Hack to Transform Transportation - Lyft` or `Funniest Hack - Technica`). This is a temporary workaround that will be resolved in a future release.
- The challenge name portion (not including company name) should not be a substring of another challenge (e.g. `Funniest Hack I - Technica` and `Funniest Hack II - Technica` is not valid since `Funniest Hack I` is a substring of `Funniest Hack II`). This is a temporary workaround that will be  resolved in a future release.
- A custom field for hacks that need to stay at their current table must be created and should be labeled exactly as the following: `Does your hack need to stay at your current table? (i.e. hardware, VR/AR hacks). If so, what table number are you at?`. A future release will expose an environment/config variable that will be more easily modified.
