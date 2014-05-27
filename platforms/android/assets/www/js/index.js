/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
$(document).ready(function(){
	$( "#btn_refresh" ).click(function() {  
		$("#btn_refresh").attr("src","img/loading.gif");
		var jqxhr = $.ajax({
			url: 'http://forum.reefangel.com/status/params.aspx?id=reefangel',
            cache: false,
			timeout: 3000,
			success: function(data) {
				$("#btn_refresh").attr("src","img/refresh.png");
				x=data.documentElement;  
				if(x.childNodes.length>0)
				{
					var d = new Date(x.getElementsByTagName('LOGDATE').item(0).firstChild.data)
					d.setMinutes(d.getMinutes()-d.getTimezoneOffset()); 
					$('#lastupdate').html(d.toLocaleString());
					$('#t1').html((x.getElementsByTagName('T1').item(0).firstChild.data/10).toString());				
					$('#t2').html((x.getElementsByTagName('T2').item(0).firstChild.data/10).toString());
					$('#t3').html((x.getElementsByTagName('T3').item(0).firstChild.data/10).toString());
					$('#ph').html((x.getElementsByTagName('PH').item(0).firstChild.data/100).toString());					
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				$("#btn_refresh").attr("src","img/refresh.png");
				alert(xhr.status);
				alert(thrownError);
			}
		})
  		.fail( function() {    alert( "error" );  })
  		;
	});
});

