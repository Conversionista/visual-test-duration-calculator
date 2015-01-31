function calc() {

    //Define starting variables
    var scaleSteps = 10;
    var scaleStepWidth = 10;
    var hasRenderedChart = false;
    var store = [];
    var vars = $('#noVar').val();
    var cr = $('#conversionRate').val();
    var avgNoVis = $('#dailyVisitors').val();
    var weeklyYes = $('input[name=week]:checked').length;

    var cycle;
    var minCycle;
    var unit;

    var dataSet95 = [];
    var labels = [];

    function getBase(start, stop, arr){
        
        function log(b, n) {
            return Math.log(n) / Math.log(b);
        }

        var base = 1.5;
        var grades = 14;

        var low = log(base, start);
        var high = log(base, stop);

        var step = (high - low) / grades;

        for (i = low; i <= high; i = i + step){
            var x = Math.pow(base, i);
            arr.push(x / 100);
        }

        arr.reverse();

    }

    //Function to make calculations for given input data
    function doCalc(arr, arr2){
        arr.forEach(function(entry) {

            var x = vars*(26*Math.pow(Math.sqrt(cr*(1-cr))/(cr*entry),2));

            x = x / avgNoVis;
            x = x / cycle;
            x = Math.ceil(x);

            //Reformat Labels to pretty labels
            var string = numeral(entry).format('0%');       
            labels.push('>' + string);

            //Push data to array
            arr2.push(x);


        });
    }

    //Function to make array for the red line
    function calcRedLine(arr){
        
        var a = [];

        for(i = 1; 2 >= arr[i-1]; i++){

            if (weeklyYes){
                a.push(2);    
            }
            
        }

        return a;    
    }

    function renderText(st,sc){

        function closest(num, arr) {
            var curr = arr[0];
            var diff = Math.abs (num - curr);
            for (var val = 0; val < arr.length; val++) {
                var newdiff = Math.abs (num - arr[val]);
                if (newdiff < diff) {
                    diff = newdiff;
                    curr = arr[val];
                }
            }
            var x = [];
            x.push(curr);
            x.push(arr.indexOf(curr));

            return x;
        }

        var spanTime = $(st);
        var spanChange = $(sc);

        function getUplift(arr,n){
            var y = arr[n];
            return y;
        }

        var c = closest(minCycle,dataSet95);
        var w = getUplift(labels, c[1]);
        
        $(spanTime).text(c[0] + ' ' + unit);
        $(spanChange).text(numeral(w).format('0%'));

    }


    function calculate(){

        getBase(2,130, store);

        //Change chart scale based on weekly or daily cycles
        if (weeklyYes){
            
            scaleSteps = 14;
            scaleStepWidth = 1;
            cycle = 7;
            minCycle = 2;
            unit = 'weeks';

        } else {
            
            scaleSteps = 10;
            scaleStepWidth = 10;
            cycle = 1;
            minCycle = 14;
            unit = 'days';

        }    

        doCalc(store, dataSet95);

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
                    data: calcRedLine(dataSet95)
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

        renderText('span.time', 'span.change');

    }

    //Function to render the chart
    function renderChart(id){

        //Get width of the a column
        var chartWidth = $('.col-md-12').width();
        
        //Make calculations
        calculate();
        
        //Destroy previous chart if exists else make canvas to paint the new chart on
        if(hasRenderedChart === true){

            myLineChart.destroy();

        } else {

            $('#renderHere').append('<hr /><h3>Detactable effect after number of days</h3><canvas id="myChart" width="' + chartWidth + '" height="' + chartWidth / 1.6180 + '"></canvas>');

        }

        //Create new chart with new data
        var ctx = document.getElementById(id).getContext('2d');
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

    renderChart('myChart');
}