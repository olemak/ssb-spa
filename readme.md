### SSB SPA

This is a flat-file, single page application that presents data from Norwegian Statistic (SSB: Statistisk Sentralbyrå).

SSB has a very cool and completely open API for their data at:

https://www.ssb.no/en/omssb/tjenester-og-verktoy/api

Check it out! The API is bi-lingual, by the way.

The API uses the JSON-stat format, so this SPA thingie uses JSONstat.js (JJT) and JSONstat.utils.js to parse the data.
Check out JJT here:
https://json-stat.com/
https://github.com/badosa/JSON-stat

## Unique Selling Points:
__SSB SPA is sortable!__ Click the table headers to sort by column. And its __bi-lingual__ (English and Norwegian).

## Usage
Click the big, black header thingie up top to check out what datasets SSB has on tap. Select one.
Click "NO" or "EN" to change language: *EN* for English, *NO* for Norwegian (default).
Click a table header to sort the tables ascending by that column.'
Click again to sort descending.
Click a row to highlight it.
Click "Show settings" to, uh, show settings, which lets you change the table setup to your heart's desire. 

## Installation
Thee's no installation really; it's all just flat files.
It's database free, so just put it on a host and open index.html in a browser.
Or put it on a server or map up localhost, it's entirely up to you.

## Dependencies
Uses jQuery3 (from a CDN) as well as JSONstat.js and the JSONstat utilities suite.

## Future
This was done for a very specific demo/challenge, so it's unlikely to be expanded much on, at least by me myself and I. But feel free to jump in an branch!
Some thoughts for possible future endeavours are:
* It should be pretty straight-forward to hook this up with chart.js (or any other charting library) to make some awesome charts!
* It's not really very mobile friendly, but... these are basically huge tables full of big data. That's not really all that swipeable.
* Design is fairly basic.
