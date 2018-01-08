angular.module('app').controller('mvPollCtrl', function($scope,$http,mvNotifier,$location, $routeParams,$route) {
    console.log("IN Poll CONTROLLER");
    var param1 = $routeParams.param1;
    console.log("param1 is   "+param1)
   
    $http.get('/api/poll/'+param1).then(function(response){
      console.log("load everytime page reload");
      if(response.data.success){
          console.log("Response   "+response.data.poll.options)
        $scope.poll=response.data.poll;  
        $scope.options =response.data.poll.options;
        $scope.owner = response.data.user.username;  

       var data= $scope.options; 
       var margin = {top:10, right:10, bottom:90, left:10};
        
        var width = 500 - margin.left - margin.right;
        
        var height = 300 - margin.top - margin.bottom;
        
        
        
        var yScale = d3.scale.linear()
              .range([height, 0]);
        
        var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .03)
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");
              
              
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");
        
        var svgContainer = d3.select("#chart").append("svg")
            .attr("width", width+margin.left + margin.right)
            .attr("height",height+margin.top + margin.bottom)
            .append("g").attr("class", "container")
            .attr("transform", "translate("+ margin.left +","+ margin.top +")");
        
        xScale.domain(data.map(function(d) { return d.name; }));
        yScale.domain([0, d3.max(data, function(d) { return d.voted; })]);
        
        
        //xAxis. To put on the top, swap "(height)" with "-5" in the translate() statement. Then you'll have to change the margins above and the x,y attributes in the svgContainer.select('.x.axis') statement inside resize() below.
        var xAxis_g = svgContainer.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height) + ")")
            .call(xAxis)
            .selectAll("text");
              
        // Uncomment this block if you want the y axis
        // var yAxis_g = svgContainer.append("g")
        //     .attr("class", "y axis")
        //     .call(yAxis)
        //     .append("text")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", 6).attr("dy", ".71em")
        //     //.style("text-anchor", "end").text("Number of Applicatons"); 
        
        
        
          svgContainer.selectAll(".bar")
              .data(data)
              .enter()
              .append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return xScale(d.name); })
              .attr("width", xScale.rangeBand())
              .attr("y", function(d) { return yScale(d.voted); })
              .attr("height", function(d) { return height - yScale(d.voted); });
              svgContainer.selectAll(".text")  		
              .data(data)
              .enter()
              .append("text")
              .attr("class","label")
              .attr("x", (function(d) { return xScale(d.name) + xScale.rangeBand() / 2 ; }  ))
              .attr("y", function(d) { return yScale(d.voted) + 1; })
              .attr("dy", ".75em")
              .text(function(d) { return d.voted; });           
      }
      else {
          mvNotifier.error(response.data.reason)
      }
    })
    
    $scope.vote = function(){
      var Indata = {'product': $scope.poll, 'product2': $scope.selectedName };
      $http.post('/api/updatepoll',Indata).then(function(response){
        if(response.data.success){
           
          $scope.poll=response.data.poll;
          $scope.options =response.data.poll.options;  
          mvNotifier.notify("Voted successfully");
          $location.path('/details/'+param1);
          $route.reload()
         
        }
        else {
            mvNotifier.error(response.data.reason)
        }
      })

    };

  
  });



  