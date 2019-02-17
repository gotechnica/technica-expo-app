## Notes
- Modified some prize entries in sample-devpost-submissions-export.csv to be consistent with the others

## Scripts
- seed_db.py
	- contains two seeding methods: seed_hackers() and fancy_seed_hackers(), choose one 
	- after running, you'll see that it asks you to manually handle some cases
	- it currently checks if the project is already in the database, but that can be removed by commenting out line 95
- manually_assign.py
	- manually add a single project, just follow the prompts
- get_all_projects.py
	- Just prints out all project names and total number of projects
- clear_db.py
	- Contains two methods: delete_all_projects() and delete_project()
	 	- delete_all_projects() requires password
	 	- delete_project() requires password and project name
	- Specify in main() which one you want to use
- helper_methods.py
	- Just some helpful print methods