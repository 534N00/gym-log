Currently working on:
* settings screen styling

List of things I need to do:
* paginate the user's calendar pulls or just load all of them (could be in hundreds)
* add haptics to pressables
* add some settings with MMKV (user name)

List of features to add:
* get app icon and open screen to work

Refactoring possibilities:
* Create button component(s) with type (for color) and width props
* Create horizontal rule component with width as prop

List of nice-to-haves to add:
* when adding new set to exercise, copy over weight and modifiers (unilat, etc.)
* make setting for user to change base and accent colors
* create dark mode/lightmode
* data import
* doing workout tags rather than tag colors (can be tags associated with colors to give abreviated look)

Notes:
* AutocompleteSelect requires that you tap on an option. What you type in will not be submitted and is kept as state internal to the autocompleteselect. This restriction is to make user inputs consistent as I want the user to be able to search by exercise and we can't have them entering in "RDL" and "Romainian Deadlift", or "Lat Raises" and "Lateral Raises."