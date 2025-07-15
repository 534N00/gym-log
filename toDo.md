Currently working on:
* settings screen
* CSV DB export (maybe import too?)

List of things I need to do:
* paginate the user's calendar pulls or just load all of them (could be in hundreds)
* add haptics to pressables
* add some settings with MMKV (user name)

List of features to add:
* import CSV
* export to CSV

List of nice-to-haves to add:
* create view when trying to serach for a past exercise instance
* implement "days since last workout" (check most recent workout instance and do date math)
* get app icon and open screen to work
* when adding new set to exercise, copy over weight and modifiers (unilat, etc.)
* make setting for user to change base and accent colors
* create dark mode/lightmode

Notes:
* AutocompleteSelect requires that you tap on an option. What you type in will not be submitted and is kept as state internal to the autocompleteselect. This restriction is to make user inputs consistent as I want the user to be able to search by exercise and we can't have them entering in "RDL" and "Romainian Deadlift", or "Lat Raises" and "Lateral Raises."