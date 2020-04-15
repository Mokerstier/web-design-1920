
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Year', 'DigID', 'Belastingdienst'],
    ['2010',  12,      10],
    ['2011',  18,      17],
    ['2012',  33,      24],
    ['2013',  53,      50],
    ['2014',  60,      55],
    ['2015',  74,      69],
    ['2016',  78,      75],
  ]);

  var options = {
    title: 'Toegankelijkheid',
    curveType: 'function',
    legend: { position: 'bottom' }
  };

  var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
  
  function selectHandler() {
    var selectedItem = chart.getSelection()[0];
    if (selectedItem) {
      var dataPoint = data.getValue(selectedItem.row, 0);
      alert('The user selected ' + dataPoint);
    }
  }

  google.visualization.events.addListener(chart, 'select', selectHandler); 
  chart.draw(data, options);
}

const tableHeads = document.querySelectorAll('th')
const tableData = document.querySelectorAll('td')

tableHeads.forEach(element => {
  element.setAttribute('tabindex', 0)
})
tableData.forEach(element => {
  element.setAttribute('tabindex', 0)
})