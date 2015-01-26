var data2 = [];

Chart.defaults.global = {
    // Boolean - Whether to animate the chart
    animation: true,

    // Number - Number of animation steps
    animationSteps: 60,

    // String - Animation easing effect
    animationEasing: "easeOutQuart",

    // Boolean - If we should show the scale at all
    showScale: true,

    // Boolean - If we want to override with a hard coded scale
    scaleOverride: false,

    // ** Required if scaleOverride is true **
    // Number - The number of steps in a hard coded scale
    scaleSteps: null,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: null,
    // Number - The scale starting value
    scaleStartValue: null,

    // String - Colour of the scale line
    scaleLineColor: "rgba(0,0,0,.1)",

    // Number - Pixel width of the scale line
    scaleLineWidth: 1,

    // Boolean - Whether to show labels on the scale
    scaleShowLabels: true,

    // Interpolated JS string - can access value
    scaleLabel: "<%=value%>",

    // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
    scaleIntegersOnly: true,

    // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero: false,

    // String - Scale label font declaration for the scale label
    scaleFontFamily: "'Lato', sans-serif",

    // Number - Scale label font size in pixels
    scaleFontSize: 16,

    // String - Scale label font weight style
    scaleFontStyle: "normal",

    // String - Scale label font colour
    scaleFontColor: "#666",

    // Boolean - whether or not the chart should be responsive and resize when the browser does.
    responsive: true,

    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: true,

    // Boolean - Determines whether to draw tooltips on the canvas or not
    showTooltips: true,

    // Function - Determines whether to execute the customTooltips function instead of drawing the built in tooltips (See [Advanced - External Tooltips](#advanced-usage-custom-tooltips))
    customTooltips: false,

    // Array - Array of string names to attach tooltip events
    tooltipEvents: ["mousemove", "touchstart", "touchmove"],

    // String - Tooltip background colour
    tooltipFillColor: "rgba(0,0,0,0.8)",

    // String - Tooltip label font declaration for the scale label
    tooltipFontFamily: "'Lato', sans-serif",

    // Number - Tooltip label font size in pixels
    tooltipFontSize: 14,

    // String - Tooltip font weight style
    tooltipFontStyle: "normal",

    // String - Tooltip label font colour
    tooltipFontColor: "#fff",

    // String - Tooltip title font declaration for the scale label
    tooltipTitleFontFamily: "'Lato', sans-serif",

    // Number - Tooltip title font size in pixels
    tooltipTitleFontSize: 16,

    // String - Tooltip title font weight style
    tooltipTitleFontStyle: "bold",

    // String - Tooltip title font colour
    tooltipTitleFontColor: "#fff",

    // Number - pixel width of padding around tooltip text
    tooltipYPadding: 6,

    // Number - pixel width of padding around tooltip text
    tooltipXPadding: 6,

    // Number - Size of the caret on the tooltip
    tooltipCaretSize: 8,

    // Number - Pixel radius of the tooltip border
    tooltipCornerRadius: 6,

    // Number - Pixel offset from point x to tooltip edge
    tooltipXOffset: 10,

    // String - Template string for single tooltips
    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

    // String - Template string for single tooltips
    multiTooltipTemplate: "<%= value %>",

    // Function - Will fire on animation progression.
    onAnimationProgress: function(){},

    // Function - Will fire on animation completion.
    onAnimationComplete: function(){},
	
	//String - A legend template
    // legendTemplate : "<%for (var i=0; i<data.length; i++){%><div style=\"background-color:<%if(i==0){%>#F0F0F0<%}else{%>rgba(62,167,222,1)<%}%>;height: 15px;width:15px;float:left;\"></div><span style=\"background-color:#FFF;margin-left:5px;\"><%if(data[i].label){%><%=data[i].label%><%}%></span><div style=\"clear:both;margin-top:2px;\"></div><%}%>"

	scaleOverride: true,
    scaleSteps: 10,
    scaleStepWidth: 10,
    scaleStartValue: 0

}

var data = {};
var hasRenderedChart = false;

function renderChart(){
	var chartWidth = $('.col-md-12').width();
	$('#renderHere').append('<hr /><canvas id="myChart" width="' + chartWidth + '" height="' + chartWidth / 1.6180 + '"></canvas>');
	
	calculate();
	
	var ctx = document.getElementById("myChart").getContext("2d");

	if(hasRenderedChart == true){

		myLineChart.destroy();

	}

	myLineChart = new Chart(ctx).Line(data, {
		//Boolean - Whether the line is curved between points
		bezierCurve : true,
		//Number - Tension of the bezier curve between points
		bezierCurveTension : 0.1

	});

	hasRenderedChart = true;
}

function calculate(){

	var noVar = $('#noVar').val();
	var CR = $('#conversionRate').val();
	var avgNoVis = $('#dailyVisitors').val();

	var cycle = 7;

	var dataSet95 = [];
	var dataSet80 = [];
	var labels = [];

	// var improvment = [0.01, 0.02, 0.04, 0.08, 0.10, 0.20, 0.30, 0.40];
    var improvment = [1, 0.75, 0.50, 0.4, 0.3, 0.2, 0.15, 0.1, 0.08, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01, 0.001];

	improvment.forEach(function(entry) {

	    var x = noVar*(26*Math.pow(Math.sqrt(CR*(1-CR))/(CR*entry),2));
	    x = x / avgNoVis;
	    x = Math.ceil(x / cycle) * cycle;

	    var y = noVar*(16*Math.pow(Math.sqrt(CR*(1-CR))/(CR*entry),2));
	    y = y / avgNoVis;
	    y = Math.ceil(y / cycle) * cycle;


	    var string = numeral(entry).format('0%');

	    

	    labels.push(string);

	    dataSet95.push(Math.round(x));
	    dataSet80.push(Math.round(y));

	    // // var z = [entry, Math.round(x)];
	    // var z = [];

	    // z['Improvment'] = entry;
	    // z['Days'] = Math.round(x);

	    // console.log(z);
	    // data2.push(z);

	});

	console.log(data2);

	data = {
	    labels: labels,
	    datasets: [
	        {
	            label: ".95 Confidance",
	            fillColor: "rgba(62,167,222,0.5)",
	            strokeColor: "#3ea7de",
	            pointColor: "#3ea7de",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(220,220,220,1)",
	            data: dataSet95
	        },
	        {
	            label: ".80 Confidance",
	            fillColor: "rgba(85,98,112,0.1)",
	            strokeColor: "rgba(85,98,112,1)",
	            pointColor: "rgba(85,98,112,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: dataSet80
	        }
	    ]
	};

}