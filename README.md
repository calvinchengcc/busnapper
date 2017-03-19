# Busnapper
Never worry about falling asleep on the bus and missing your stop again!

## Inspiration

Many UBC students face long commutes each day. Of course, one advantage of a long commute is that one can sleep on the bus while heading to and from school. However, this comes with a distinct risk of missing one's stop—something that has surely happened to every student at one point! Our idea was to develop an app that would help mitigate the anxiety of remembering to wake up for one's stop, and thus allow students to get a more restful nap before their first class in the morning!

## What it does

The app allows a user to specify a location on a map that would be the stop at which the user wishes to be awake for in order to get off. Once the bus stop is specified, a user will be able to take a nap or do whatever he/she wishes. Once the user is within a 1 km radius of their desired location, his/her phone will start to vibrate, hopefully waking up the user in time.

## How I built it

We decided to use React Native for our mobile app. We focussed first on iOS, although we kept device portability in mind as we developed the project, so porting the code to Android would require minimal, if any, changes.

We began by interfacing with the Google Maps API to retrieve map data for the user to view. We then interacted with the TransLink API in order to plot all of the bus routes in the current view of the map.

We then looked into the geolocation API to determine's current location, and to do a reverse lookup of a destination given an address, allowing a user to more quick select a stop.

Our final task was to determine when the user is within the target radius, at which point we would set off the alarm.

## Challenges I ran into

Each step of our project ran into a number of hurdles, but we managed to overcome each of them successfully.
* None of us were familiar with React Native, so we had to do quite a bit of initial learning just to get started.
* Interfacing with the Google Maps API and adding markers was somewhat challenging, given the limited up-to-date documentation available (as React Native is quite new).
* Detecting the distance between two coordinates in the world was a little more challenging than we had expected.

## Accomplishments that I'm proud of

We're definitely quite proud that we completed all that we set out to do, given that all of us had very limited mobile development experience to start. We weren't sure whether our project was too ambitious or too trivial as we scoped out our features—it turns out that our project was just the right size for our team!
