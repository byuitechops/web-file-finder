/*eslint-env browser*/
/*eslint no-console:0*/
/*global d2lScrape*/

var dropbox = document.getElementById('course-container');
dropbox.addEventListener('dragenter', dragenter, false);
dropbox.addEventListener('dragover', dragover, false);
dropbox.addEventListener('dragleave', leavedrag, false);
dropbox.addEventListener('drop', drop, false);

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
  }

  dropbox.style.borderColor = 'rgb(169, 169, 169)';
}

/* Get User Input OU course values */
function getValues() {
  return dropbox.value.replace(/\s/g, '').split(',');
}

function openURL(url) {
  window.open(url, '_blank');
}

function filterByString(file) {
  return file.title.toLowerCase()
  .includes(document.getElementById('search-filter').value.toLowerCase());
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

function downloadCSV(classList) {
  var formatted = d3.csvFormat(classList);
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
      filteredList = data.topics.filter(filterByString);
      filteredList.forEach((fileObject) => {
        fileObject.course = course;
        fileObject.editLink = `https://byui.` +
        `brightspace.com/d2l/le/content/${course}/contentfile/` +
        `${fileObject.topicId}/EditFile?fm=0`;
      });
      printDisplayList(filteredList);
      callback(null, filteredList);
    });
  }

  async.mapLimit(getValues(), 30, getFiles, (error, results) => {
      if (error) {
        console.log(error);
      }
      var fullArray = results.reduce((total, array) => {
        return total.concat(array);
      }, []);
      console.log(fullArray);
      document.getElementById('download-button').addEventListener('click', function() {
          downloadCSV(fullArray);
        });
      //download(formatted, 'AllHTMLFiles.csv', 'text/csv');
    });
}
