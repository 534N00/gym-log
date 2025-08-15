Currently working on:
* improving currently clunky text number inputs

Refactoring possibilities:
* Create button component(s) with type (for color) and width props
* Create horizontal rule component with width as prop
* Replace get rid of pastWorkoutStore and switch to using StatelessExerciseTiles unless adding mutability to past workouts

List of nice-to-haves that can be added:
* toast/messages for when users successfully or failingly perform certain actions
* flesh out iOS functionality
* create a nice expo snack to better show off this repository
* when adding new set to exercise, copy over weight and modifiers as the difference between sets is often minimal
* make setting for user to change base and accent colors
* create dark mode/lightmode
* data import
* doing workout tags rather than tag colors (can be tags associated with colors to give abreviated look)

Notes:
* AutocompleteSelect requires that you tap on an option. What you type in will not be submitted and is kept as state internal to the autocompleteselect. This restriction is to make user inputs consistent as I want the user to be able to search by exercise and we can't have them entering in "RDL" and "Romainian Deadlift", or "Lat Raises" and "Lateral Raises."