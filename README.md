# Quiz 3.0

## Things to include

Items marked with only a number will be done only if I have time.

-   [x] 1. **NAME**: See the authors of the game (name and UD email) visibly on the screen.

2. **LOGIN**: A screen allowing the user to log in (just email; there's no way I'm doing actual security).

-   [x] 3. **MAIN MENU**: A main menu for doing the other things.

4. **NEW GROUP**: A way to create new groups of sets.
5. **NEW SET**: A way to create new sets.
6. **EDIT GROUP**: A way to add or remove sets from an existing group.
7. **EDIT SET**: A way to add, remove, and edit terms within a set.

-   [ ] 8. **IMPORT GROUP**: A way to import a group from a spreadsheet (really just a name and a list of sets, overwrites an existing group)
-   [x] 9. **IMPORT SET**: A way to import a set from a spreadsheet (adds terms if set already exists, new duplicate terms are resolved by the user).
-   [x] 10. **IMPORT ALL**: A way to import (overwriting groups and sets with the same name) an exported text file of your progress.
-   [x] 11. **EXPORT ALL**: A way to export all of your progress as a text file.
-   [ ] 12. **PRACTICE GROUP**: A way to practice the sets in a group.
-   [x] 13. **PRACTICE SET**: A way to practice only a single set.
-   [x] 14. **QUESTION TYPES**: The following question types will be included:
    -   [x] 1. New Term
    -   [x] 2. Multiple Choice
    -   [x] 3. True/False
    -   [x] 4. Matching
    -   [x] 5. MC character entry
    -   [x] 6. Text entry
-   [x] 15. **PROBABILITIES**: More mastered terms will be less frequent and tend to result in different question types.
-   [x] 16. **MASTERY**: Keep track of how well someone is doing. Tell them when they've mastered a set they're working on.

17. **TERM TYPES**: So different term types aren't compared, giving away the answer.

-   [ ] 18. **GROUP FLASHCARDS**: Practice a group using flashcards (does not affect mastery).
-   [x] 19. **SET FLASHCARDS**: Practice a set using flashcards (does not affect mastery).
-   [ ] 20. **DOCUMENTATION**: Documentation for _everything_.

21. **DELETE GROUP**
22. **DELETE SET**
23. **LOGOUT**
24. **BACKEND** //Firebase? Mongo atlas?

## Milestone 0 (2024-04-21)

-   [x] Item 1 completed
-   [x] Item 3 started
-   [ ] Item 20 started

## Milestone 1 (2024-04-28)

-   [x] Item 3 completed
-   [x] Item 9 completed
-   [x] Item 13 completed
-   [x] Item 14 started
    -   [x] Types 2, 3, and 6 completed
-   [x] Item 15 started
-   [ ] Item 20 started

## Milestone 2 (2024-05-05)

-   [x] Item 16 completed
-   [x] Item 10 completed
-   [x] Item 11 completed
-   [x] Item 14 completed
    -   [x] Types 1, 4, and 5 completed
-   [x] Item 15 completed
-   [ ] Item 20 started

## Milestone 3 (2024-05-12)

-   [x] Item 19 completed
-   [ ] Item 8 completed
-   [ ] Item 12 completed
-   [ ] Item 18 completed
-   [ ] Item 20 completed

## Final Submission (2024-05-19)

By the time that I am done with Milestone 3, everything that I have actually planned to do will be done.

As such, I will be able to work on some of the additional items.

-   Item 2
-   Items 4 - 7
-   Item 17
-   Items 21 - 24
-   Item 20 continued for whatever I do here.

## Known Bugs

-   Importing and loading sets/databases does not behave as expected
    -   [x] When terms should be added, they are not
    -   [x] Terms are not overwritten properly
        -   [x] Remove user confirmation and replace with warning
-   Buttons go to the next line instead of wrapping their text
    -   [x] Text size based on vmin instead of vh
-   SetError doesn't have linebreaks
    -   [ ] Not much of an idea on this one either. Maybe `<br>` or just comma separated
-   Terms with the same name cause issues
    -   [ ] Change how I'm checking if the input was correct
-   Deal with mastery for MatchQ and CharQ and probabilities for MatchQ
    -   [ ] Because I'm using a different structure than v2.0, this needs to be changed
