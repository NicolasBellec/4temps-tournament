# Important

* Deal with conflicting use between two SET_NOTES redux:
  * src/app/components/Judge/NoteTaker/SeparateNoteTaker/index.js
  * src/app/components/Judge/NoteTaker/PairNoteTaker/index.js


* Deal with conflicting use between two GET_LEADERBOARD redux:
  * src/app/components/Leaderboard/index.js
  * src/app/api/realtime.js


* Tests the action creators now that they are all in one place (kind of)


* Turn on flow for all files (remaining : only tests)


* Remove linting errors for all files (long run)

# Tests

* src/components/NavigationBar
  - Check logic when rendering tablet
