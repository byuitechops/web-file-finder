/*eslint-env browser*/
/*eslint no-console:0*/
/*global d2lScrape*/

var correctOUs = [108133,
62923,
56994,
280338,
112570,
108142,
167893,
56875,
108135,
56481,
108136,
171662,
118475,
19337,
108599,
81187,
108114,
234433,
234434,
280023,
168354,
168750,
56869,
281987,
282206,
285935,
63425,
63447,
275148,
16221,
24645,
55186,
16186,
19325,
57723,
57754,
19548,
19555,
17612,
282453,
18776,
18777,
18783,
18784,
16215,
99483,
17575,
106288,
106289,
50283,
16098,
101929,
73749,
18812,
17904,
17905,
18232,
18818,
50284,
99408,
63710,
101643,
16156,
16155,
68324,
16150,
16170,
16163,
16177,
31319,
16184,
101156,
16178,
21582,
16185,
16197,
106952,
16202,
16192,
16204,
16198,
100941,
16152,
16205,
16191,
23800,
16154,
16211,
23801,
17593,
53091,
68914,
67128,
17594,
118405,
58371,
118406,
58369,
99484,
106291,
106292,
69035,
17595,
16212,
288150,
81222,
16199,
61380,
61381,
171066,
63194,
32206,
61928,
67134,
63195,
111890,
106277,
117812,
28798,
17756,
106278,
285213,
106279,
111785,
112004,
111793,
106280,
64185,
17602,
225324,
99481,
106281,
59656,
106282,
58372,
52555,
106283,
67140,
67126,
17603,
99489,
106284,
110408,
62951,
55063,
232099,
19191,
19192,
18505,
19198,
19199,
106991,
19217,
232617,
112145,
19236,
18506,
17605,
19237,
32043,
16214,
105848,
100811,
50279,
50278,
61910,
19310,
18727,
106303,
287196,
109633,
99487,
106989,
106300,
106301,
111794,
16213,
16218,
40664,
63921,
16200,
16164,
16180,
16165,
16187,
107960,
16173,
16193,
117813,
223408,
97834,
118474,
19311,
28754,
59659,
19492,
50276,
16203,
24811,
16208,
28228,
57167,
235151,
18550,
18563,
55104,
30469,
19493,
17609,
18564,
18565,
19497,
19503,
19509,
50281,
50289,
61374,
61911,
50274,
50275,
164701,
16216,
16176,
16179,
16181,
16207,
16182,
16183,
16189,
16196,
16175,
16194,
16201,
16161,
16188,
16233,
68061,
19510,
19547,
81704,
59658,
50282,
59655,
61376,
50290,
63196,
67136,
171073,
106294,
106295,
17610,
50273,
61920,
67129,
106296,
67130,
67127,
67131,
111790,
118298,
61373,
19564,
17611,
171290,
53768,
62216,
62217,
62218,
67619,
16167,
117924,
17617,
19575,
33274,
18575,
69258,
32027,
19690,
61375,
17618,
111791,
111796,
49459,
57714,
99482,
61908,
63419,
67132,
67133,
232618,
67139,
99488,
106285,
106286,
106293,
111787,
61929,
106290,
62159,
111788,
19704,
19722,
19721,
17619,
61382,
229421,
111789,
17620,
111786,
109641,
105615,
117840,
117847,
117854,
117831,
117895,
61378,
166176,
166177,
117006,
117007,
166178,
166179,
166180,
16162,
16158,
16209,
67135,
61065,
19308,
17606,
17607,
111792,
108137,
99485,
16190,
16195,
16160,
111795,
31320,
282454,
67138,
61377,
99530,
106287,
111797,
167864,
152731,
274892,
237899,
264893,
17583,
17584,
117483,
280986,
276690,
263055,
17757,
30428,
31331,
17604,
115799,
24644,
232098,
282612,
60004,
182472,
223437,
170928,
162915,
164702,
237928,
170957,
56896,
237072,
277036,
109669,
166125,
112003,
277409,
235512,
235513,
235514,
235515,
276504,
276561,
235511,
56772,
19549,
105706,
99486,
106297,
106298,
19574];

var dropbox = document.getElementById('course-container');
dropbox.addEventListener('dragenter', dragenter, false);
dropbox.addEventListener('dragover', dragover, false);
dropbox.addEventListener('dragleave', leavedrag, false);
dropbox.addEventListener('drop', drop, false);

var fr = new FileReader();

var fileList = [];
window.onload = () => {
  document.getElementById('download-button')
  .addEventListener('click', downloadCSV);
};

/* Drag and Drop functions */
function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
  dropbox.style.borderColor = '#0076C6';
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
  dropbox.style.borderColor = '#0076C6';
}

function leavedrag(e) {
  dropbox.style.borderColor = 'rgb(169, 169, 169)';
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  var dt = e.dataTransfer;
  var files = dt.files;

  var split = files[0].name.split('.');
  if (split[split.length - 1] != 'csv' &&
    split[split.length - 1] != 'txt') {
    document.getElementById('course-container').placeholder =
    'Please provide a ".csv" or ".txt" file';
    document.getElementById('course-container').value = '';
  } else {
    fr.readAsText(files[0]);
  }
  dropbox.style.borderColor = 'rgb(169, 169, 169)';
}

fr.onloadend = function(evt) {
  var courseString = '';
  fr.result.split('\n').forEach(function(course) {
    courseString += course.replace('\r', ', ');
  });

  if (courseString[courseString.length - 2] === ',') {
    courseString = courseString.substring(0, courseString.length - 2);
  }

  document.getElementById('course-container').value = courseString;
};

/* Get User Input OU course values */
function getValues() {
  return dropbox.value.replace(/\s/g, '').split(',');
}

/* Open new window with given page */
function openURL(url) {
  window.open(url, '_blank');
}

function filterByString(file) {
  if (document.getElementById('search-filter').value.toLowerCase() != '') {
    return file.title.toLowerCase()
    .includes(document.getElementById('search-filter').value.toLowerCase());
  }
  return true;
}

function filterByType(file) {
  return file.type.toLowerCase() === 'file';
}

function printDisplayList(displayList, course) {
  var container = document.getElementById('results-container');
  container.innerHTML += '<h4>' + course + '</h4>';
  displayList.forEach((file) => {
    container.innerHTML +=
    `<div class="course-container">
          <div onclick="openURL('https://byui.brightspace.com/d2l/le/` +
          `content/${course}/viewContent/${file.topicId}/View')" class="link">
              ${file.title}
          </div>
          <span class="fill-auto"></span>
          <div class="small-btn-container">
              <button class="btn-small red" onclick="openURL('https://byui.` +
              `brightspace.com/d2l/le/content/${course}/contentfile/` +
              `${file.topicId}/EditFile?fm=0')">Edit</button>
              <!--<button class="btn-small" onclick="openURL('https://byui.` +
              `brightspace.com/d2l/le/content/${course}/contentfile/` +
              `${file.topicId}/EditFile?fm=0')">Download</button>-->
          </div>
      </div>`;
  });
}

function downloadCSV() {
  var formatted = d3.csvFormat(fileList);
  download(formatted, 'AllHTMLFiles.csv', 'text/csv');
}

/* Our main function */
function main() {
  'use strict';
  document.getElementById('results-container').innerHTML = '';
  var displayList = [];
  var printList = [];
  var filteredList = [];

  function getFiles(course, callback) {
    d2lScrape.getTopicsWithUrlFromToc(course, function(error, data) {
      if (error) {callback(error);}
      if (!data) {
        console.log('ERROR ' + course);
      }
      filteredList = data.topics.filter(filterByString);
      filteredList = filteredList.filter(filterByType);
      filteredList.forEach((fileObject) => {
        fileObject.course = course;
        fileObject.editLink = `https://byui.` +
        `brightspace.com/d2l/le/content/${course}/contentfile/` +
        `${fileObject.topicId}/EditFile?fm=0`;
      });
      //printDisplayList(filteredList, course);
      callback(null, filteredList);
    });
  }

  function enableButton() {
    document.getElementById('download-button').disabled = false;
    document.getElementById('download-button').classList.remove('disabled');
  }

  function divideAndConquer() {
    // Divide the numbers into more manageable chunks
    var divisionAmount = 25; // CHANGE THIS NUMBER TO ESTABLISH DIVISION AMOUNT
    var slicedOuNumbers = correctOUs
    .reduce(function(accum, ouNumber, index) {
      if (index % divisionAmount === 0) {
        accum.push([]);
      }
      accum[accum.length - 1].push(ouNumber);
      return accum;
    }, []);
    return slicedOuNumbers;
  }

  function mapper(array, callback) {
    async.mapLimit(array, 25, getFiles, (error, results) => {
        console.log(array, results);
        if (error) {
          callback(error);
        }
        var fullArray = results.reduce((total, array) => {
          return total.concat(array);
        }, []);
        enableButton();
        callback(null, results);
      });
  }

  async.mapSeries(divideAndConquer(), mapper, function(error, data) {
    console.log(data);
    // Callback will go
    // Reduce

    var courseList = data.reduce((flat, course) => {
      return flat.concat(course);
    }, []);

    fileList = courseList.reduce((flat, file) => {
      return flat.concat(file);
    }, []);

    console.log(fileList);
  });
}
