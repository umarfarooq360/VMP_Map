var map; 
markers = {};
markerList = [];
var geocoder; //To use later
lastInfoWindow = new google.maps.InfoWindow; //static infoWindow for all your markers



//Create an instance of the map and initialize
function initialize() {
     geocoder = new google.maps.Geocoder();
    var mapOptions = {
      center: { lat: 37.500, lng: -77.467},
      zoom: 8
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
        
   }

//Loading map when page finishes loading
//google.maps.event.addDomListener(window, 'load', initialize);
initialize();

//First we load the data from the file
var data;

//Call this wherever needed to actually handle the display
function codeAddress(zipCode) {
    
    geocoder.geocode( { 'address': zipCode}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        //Got result, center the map and put it out there
        map.setCenter(results[0].geometry.location);
        map.setZoom(11);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }



Tabletop.init({ key: '1AL2umw6fGHfxgJTaogN7L5MXWXSpqoBG6wbdWFNgPB0',
                   callback: function(results, tabletop) { 
                      
                       
                       data = results;
                       console.log("data size: "+ data.length);
                       //Iterate and plot
                        for(var i=0; i< results.length ;i++){
                            //get the lat lang from data
                            var myLatlng =  new google.maps.LatLng(results[i].LATITUDE,
                                                                    results[i].LONGITUDE);

                           createMarker(i, myLatlng); 
                        }
                                                      
                                                      
                    },
                   simpleSheet: true } );
//https://docs.google.com/spreadsheet/ccc?key=1AL2umw6fGHfxgJTaogN7L5MXWXSpqoBG6wbdWFNgPB0&output=csv



/*

docs.google.com/feeds/download/spreadsheets/Export?key1AL2umw6fGHfxgJTaogN7L5MXWXSpqoBG6wbdWFNgPB0&exportFormat=csv&gid=0
*/

//Importing data form google spreadsheet

/*

function loadData() {
        var url="https://docs.google.com/spreadsheets/d/1AL2umw6fGHfxgJTaogN7L5MXWXSpqoBG6wbdWFNgPB0/pub?gid=0&single=true&output=csv";
        xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
          if(xmlhttp.readyState == 4 && xmlhttp.status==200){
            document.getElementById("display").innerHTML = xmlhttp.responseText;
          }
        };
        xmlhttp.open("GET",url,true);
        xmlhttp.send(null);
      }

*/



function createMarker(i, myLatlng){
    
    //Get the fields from the spreadsheet data
        var Name = data[i].Name;
        var Phone = data[i].Phone;
        var Address = data[i].Address;
        var AdminName = data[i].ProgramAdministratorFirstName+" "+data[i].ProgramAdministratorLastName;
        var AdminEmail = data[i].ProgramAdministratorEmail;
        var MaleMentee = data[i].ProgramAcceptingMaleMentees;
        var FemaleMentee = data[i].ProgramAcceptingFemaleMentees;
        var MaleVolunteer = data[i].ProgramAcceptingMaleVolunteers;
        var FemaleVolunteer = data[i].ProgramAcceptingFemaleVolunteers;

        var contentString = '<div id="content">'+
          '<h1 id="firstHeading" class="firstHeading">'+
                Name
                +'</h1>'+
          '<div id="bodyContent">'+
        "<p><strong>Address:</strong> "+ Address +"</p>"+
          '<p><strong>Website:</strong> '+ data[i].Website + '</p>'+
        '<p><strong>Phone: </strong>'+Phone+ ' </p>'+
        '<p><strong>Administrator Name: </strong>'+AdminName+
        ' </p><p>   <strong>Email: </strong> '+AdminEmail+'</p>'+
        '<p><strong>Accepting Male Mentees: </strong>'+MaleMentee+"</p>"+
        '<p><strong>Accepting Female Mentees: </strong>'+FemaleMentee+"</p>"+
        '<p><strong>Accepting Male Volunteers: </strong>'+MaleVolunteer+"</p>"+
        '<p><strong>Accepting Female Volunteers: </strong>'+FemaleVolunteer+"</p>"+
 
        '<p><strong>Form: </strong> </br> '+
         '<iframe width=\'500px\'  src=\'http://www.tfaforms.com/380245\'> </iframe>'+
          '</div>'+
          '</div>';
     
    //create the marker
    var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: Name
      });
    
    //Adding additional parameters for filtering
    marker.area = data[i].GeographicArea;
    marker.menteeType = data[i].MenteeType;
    marker.mentorType = data[i].TypesofMentoringOpportunitiesOffered;
    
    markerList.push(marker);
       //Create infowindow
            var infowindow = new google.maps.InfoWindow({
                position: myLatlng,
                content: contentString
                //,disableAutoPan : true
            });
    
     //add a listener to popup window
             google.maps.event.addListener(marker, 'click', function() {
                 
                 //Close all the open markers
                  lastInfoWindow.close();
            
                 //open the selected marker
                 infowindow.open(map, marker);
                 infowindow.setPosition(myLatlng);
                 lastInfoWindow = infowindow;
              });

}


/*
Read the data file and log the results
*/
function processData () {
        
        
        
    }

processData();

/* 
    Given the field and the value, filter marker that match 
*/
function filterCtrl( area_value, type_value , mentoring_value){
    
    /*Filter by geographic location and mentee type*/
        tmplist = [];
        //console.log(type_value);
        //iterate over all markers
        $(markerList).each(function(id, marker) {
            
            
            tmplist.push(id);
           
            //console.log(area_value);
            //Filter by  the three categories
            //Check for Any first and then the value
            //Probablt the long way to do this
            if( area_value != 'Any'){
                if(area_value != marker.area ){
                    
                    tmplist.splice(tmplist.indexOf(id),1);    
                }
            }
             if( type_value != 'Any'){
                if(marker.menteeType.indexOf(type_value) < 0 ){ 
                    var index  = tmplist.indexOf(id);
                    if(index>0){
                        
                        tmplist.splice(index,1); 
                    }
                }
            } if( mentoring_value != 'Any'){
                if(marker.mentorType.indexOf(mentoring_value) < 0 ){ 
                    var index  = tmplist.indexOf(id);
                    if(index>0){
                       
                        tmplist.splice(index,1); 
                    }
                }
            }
            
                  
            
        });
        
        
        //show only the ones needed
        $(markerList).each(function(id, marker) {
            marker.setVisible(false);
            if(tmplist.indexOf(id) >=0 ){
                marker.setVisible(true);
            }
        });
}

//Listener for the filter and zipcode search
$(function(){
  
    //Listener for geographic location filter
    $('#program-location').on('change', function(){
        filterCtrl(this.value, $('#program-type').val(), $('#mentoring-type').val());
    });
    
    //Listener for mentee type filter
    $('#program-type').on('change', function(){
        filterCtrl( $('#program-location').val(), this.value, $('#mentoring-type').val());
    });
    
    $('#mentoring-type').on('change', function(){
        filterCtrl( $('#program-location').val(),$('#program-type').val() ,this.value);
    });
    
    $('#zipbut').on('click',function(){
       var zipc =   $('#zipcode').val();
        
        codeAddress(zipc);  
         
    });
    
    
});


