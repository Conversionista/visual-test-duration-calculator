//Define starting variables
var scaleSteps = 10;
var scaleStepWidth = 10;
var hasRenderedChart = false;

function calculate(){

    function log(b, n) {
        return Math.log(n) / Math.log(b);
    }

    var store = [];

    function getBase(start, stop){

        var base = 1.5;
        var grades = 14;

        var low = log(base, start);
        var high = log(base, stop);

        var step = (high - low) / grades;

        for (i = low; i <= high; i = i + step){
            var x = Math.pow(base, i);
            store.push(x / 100);
        }

        store.reverse();

    }
    
    getBase(2,130);

    var noVar = $('#noVar').val();
    var CR = $('#conversionRate').val();
    var avgNoVis = $('#dailyVisitors').val();
    var weeklyYes = $('input[name=week]:checked').length;

    var cycle = 1;

    var dataSet95 = [];
    var labels = [];


    //Change steps based on weekly or daily cycles
    if (weeklyYes){
        
        scaleSteps = 14;
        scaleStepWidth = 1;
        cycle = 7;

    } else {
        
        scaleSteps = 10;
        scaleStepWidth = 10;
        cycle = 1;

    }

    //Function to make calculations for given input data
    function doCalc(arr){
        arr.forEach(function(entry) {

            var x = noVar*(26*Math.pow(Math.sqrt(CR*(1-CR))/(CR*entry),2));

            x = x / avgNoVis;
            x = x / cycle;
            x = Math.ceil(x);

            //Reformat Labels to pretty labels
            var string = numeral(entry).format('0%');       
            labels.push('>' + string);

            //Push data to array
            dataSet95.push(x);  

        });
    }

    doCalc(store);

    //Function to make array for the red line
    function calcRedLine(){
        
        var a = [];

        for(i = 1; 2 >= dataSet95[i-1]; i++){

            if (weeklyYes){
                a.push(2);    
            }
            
        }

        return a;    
    }

    data = {
        labels: labels,
        datasets: [
            {
                label: 'Minimal Test Length',
                fillColor: 'rgba(255, 0, 0, 0.5)',
                strokeColor: 'red',
                pointColor: 'red',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'red',
                data: calcRedLine()
            },
            {
                label: '.95 Confidance',
                fillColor: 'rgba(62,167,222,1)',
                strokeColor: 'rgba(31,83,111,1)',
                pointColor: 'rgba(31,83,111,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(220,220,220,1)',
                data: dataSet95
            }
            
        ],

    };

}

//Function to render the chart
function renderChart(){

    //Get width of the a column
	var chartWidth = $('.col-md-12').width();
	
    //Make calculations
	calculate();
	
	//Destroy previous chart if exists else make canvas to paint the new chart on
    if(hasRenderedChart === true){

		myLineChart.destroy();

	} else {

        $('#renderHere').append('<hr /><canvas id="myChart" width="' + chartWidth + '" height="' + chartWidth / 1.6180 + '"></canvas>');

    }

    //Create new chart with new data
    var ctx = document.getElementById('myChart').getContext('2d');
	myLineChart = new Chart(ctx).Line(data, {
		//Boolean - Whether the line is curved between points
		bezierCurve : false,
		//Number - Tension of the bezier curve between points
		// bezierCurveTension : 0.1
        scaleOverride: true,
        scaleSteps: scaleSteps,
        scaleStepWidth: scaleStepWidth,
        scaleStartValue: 0

	});

    //Set variable to 
	hasRenderedChart = true;
}