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

//localStorage.setItem("controller_ip", "10.1.10.32");
//localStorage.setItem("controller_ip", "192.168.9.155");
//localStorage.setItem("controller_port", "2000");

var chart;
var seriesOptions;
var rffields = ["rfw","rfrb","rfr","rfg","rfb","rfi"];
var rfcolors = ["#FF9900","#0000DD","#DD0000","#006600","#0099FF","#990099"];
var rfmodes = ["Constant","Lagoon","Reef Crest","Short Pulse","Long Pulse","Nutrient Transport","Tidal Swell","Feeding","Feeding","Night","Storm","Custom","Else"];
var rfimages= ["constant.png","lagoon.png","reefcrest.png","shortpulse.png","longpulse.png","ntm.png","tsm.png","feeding.png","feeding.png","night.png","storm.png","custom.png","custom.png"];
var rfmodecolors = ["#00682e","#ffee00","#ffee00","#16365e","#d99593","#eb70ff","#eb70ff","#000000","#000000","#000000","#000000","#000000","#000000"];

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
	for (a=0; a<localStorage.getItem("num_controllers"); a++)
	{
		var selected="";
		if (localStorage.getItem("controller_name_"+a)==localStorage.getItem("controller_name")) selected="selected"
		$("#controller_selection").append("<option value='" + a + "' " + selected + ">" + localStorage.getItem("controller_name_"+a) + "</option>");
	}
	$("#controller_selection").selectmenu('refresh');
	
	$("#controller_selection").on('change', function () {
		localStorage.setItem("controller_name",localStorage.getItem("controller_name_"+$(this).find('option:selected').val()));
		localStorage.setItem("controller_ip",localStorage.getItem("controller_ip_"+$(this).find('option:selected').val()));
		localStorage.setItem("controller_port",localStorage.getItem("controller_port_"+$(this).find('option:selected').val()));
		$('#btn_refresh').click();
		$('#downloadlabels').click();
	});

	$("#pwmdinput").next().children("div").first().css("background-image","-webkit-gradient(linear,left top,left bottom,from(#FF9900),to(#EEEEEE))");
	$("#pwmainput").next().children("div").first().css("background-image","-webkit-gradient(linear,left top,left bottom,from(#0000DD),to(#EEEEEE))");

	$('#btn_refresh').on('vclick', function () {
		if (localStorage.getItem("controller_ip")==null)
		{
			alert("Invalid controller address. Please click the settings button and update your controller address.");
			return;
		}
		$.mobile.loading( 'show', {
			text: 'Connecting to Reef Angel',
			textVisible: true,
			theme: 'b',
			html: ""
		});
		var jqxhr = $.ajax({
			url: controller_command("r99"),
			timeout: 10000,
			success: function(data) {
				$.mobile.loading( "hide" );
				x=data.documentElement;  
				if(x.childNodes.length>0)
				{
					WriteStorage(x);
				}
				else
				{
					alert("No Data Found");
				}
				if ($('#btn_refresh').attr("data-message") == "status")
				{
					$.mobile.loading( 'show', {
						text: 'Please wait',
						textVisible: true,
						theme: 'b',
						html: ""
					});
					window.location.href="status.html";
					return false;
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				$.mobile.loading( "hide" );
				if (ajaxOptions="timeout")
				{
					if ($('#btn_refresh').attr("data-message") == "status")
					{
						alert("Unable to connect to Reef Angel.\nData shown is from last refresh.");
						$.mobile.loading( 'show', {
							text: 'Please wait',
							textVisible: true,
							theme: 'b',
							html: ""
						});
						window.location.href="status.html";
						return false;
					}
					else
					{
						alert("Timeout");
					}
				}
				else
				{
					alert("Error code: " + xhr.status + " - " +thrownError);
				}
			}
		});
	});
	$('#downloadlabels').on('vclick', function () {
		if (localStorage.getItem("forum_username")==null)
		{
			alert("Invalid forum username. Please check your code.");
			return;
		}
		$.mobile.loading( 'show', {
			text: 'Connecting to Portal',
			textVisible: true,
			theme: 'b',
			html: ""
		});
		var jqxhr = $.ajax({
			url: "http://forum.reefangel.com/status/labels.aspx?id=" + localStorage.getItem("forum_username"),
			timeout: 10000,
			success: function(data) {
				$.mobile.loading( "hide" );
				x=data.documentElement;  
				if(x.childNodes.length>0)
				{
					for (a=0; a<x.childNodes.length; a++)
					{
						if (x.childNodes[a].firstChild.data!="null" && x.childNodes[a].firstChild.data!="")
						localStorage.setItem(x.childNodes[a].nodeName.toLowerCase(), x.childNodes[a].firstChild.data);
					}
					UpdateLabels();
				}
				else
				{
					alert("No Labels Found");
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				$.mobile.loading( "hide" );
				if (ajaxOptions="timeout")
				{
					alert("Timeout");
				}
				else
				{
					alert("Error code: " + xhr.status + " - " +thrownError);
				}
			}
		});		
	});
	
	$("#synctime").on('vclick', function () {
		var now = new Date();
		t="d";
		a=now.getHours();
		if (a<10) t+="0";
		t+=a;
		a=now.getMinutes();
		if (a<10) t+="0";
		t+=a;
		t+=",";
		a=now.getMonth()+1;
		if (a<10) t+="0";
		t+=a;
		a=now.getDate();
		if (a<10) t+="0";
		t+=a;
		t+=",";
		a=now.getFullYear();
		if (a>2000) a-=2000;
		t+=a;
		send_command(t);
	});
	
	$("#save_settings").on('vclick', function () {
		if ($("#txt_controller_name").val()!="" && $("#txt_controller_ip").val()!="" && $("#txt_controller_port").val()!="")
		{
			localStorage.setItem("controller_name",$("#txt_controller_name").val());
			localStorage.setItem("controller_ip",$("#txt_controller_ip").val());
			localStorage.setItem("controller_port",$("#txt_controller_port").val());
			if ($("#controller_form").attr("data-message")!=-1)
			{
				localStorage.setItem("controller_name_"+$("#controller_form").attr("data-message"),$("#txt_controller_name").val());
				localStorage.setItem("controller_ip_"+$("#controller_form").attr("data-message"),$("#txt_controller_ip").val());
				localStorage.setItem("controller_port_"+$("#controller_form").attr("data-message"),$("#txt_controller_port").val());
			}
			else
			{
				var num_controllers;
				if (localStorage.getItem("num_controllers")==null)
					num_controller=0;
				else
					num_controller=localStorage.getItem("num_controllers");
				localStorage.setItem("controller_name_"+num_controller,$("#txt_controller_name").val());
				localStorage.setItem("controller_ip_"+num_controller,$("#txt_controller_ip").val());
				localStorage.setItem("controller_port_"+num_controller,$("#txt_controller_port").val());
				localStorage.setItem("num_controllers",parseInt(num_controller)+1);
			}
			$("#controller_form").attr("data-message",-1);
			location.reload();
		}
		else
		{
			alert("All fields are required.");
		}
	});
	
	$("#cancel_settings").on('vclick', function () {
		$("#controller_form").addClass("hiddentab");
		$("#controller_list").removeClass("hiddentab");
	});
	
	$("#add_controller").on('vclick', function () {
		$("#controller_form").removeClass("hiddentab");
		$("#controller_list").addClass("hiddentab");
	});

	$(".controlleritem").on('vclick', function (event) {
		localStorage.setItem("controller_name",localStorage.getItem("controller_name_"+event.target.id.replace("controller_","")));
		localStorage.setItem("controller_ip",localStorage.getItem("controller_ip_"+event.target.id.replace("controller_","")));
		localStorage.setItem("controller_port",localStorage.getItem("controller_port_"+event.target.id.replace("controller_","")));
		$('#btn_refresh').attr("data-message","status");
		$('#btn_refresh').click();
    });
	
	$(document).on('focus', 'input, textarea', function() 
	{
		$.mobile.activePage.find("div[data-role='footer']").hide();
	});
	
	
	$(document).on('blur', 'input, textarea', function() 
	{
		$.mobile.activePage.find("div[data-role='footer']").show();
	});
	
	$("#settings_next").on('vclick', function () {
		window.location.href = 'addfirstcontroller.html';
		return false;
	});	
	
	$(".controllerbutton").on('vclick', function (event) {
		$("#editcontroller").attr("data-message",event.target.id.replace("controller_list_",""));
		$("#deletecontroller").attr("data-message",event.target.id.replace("controller_list_",""));
	});
	
	$("#editcontroller").on('vclick', function () {
		$("#popupMenu").popup("close");
		$("#controller_form").removeClass("hiddentab");
		$("#controller_list").addClass("hiddentab");
		$("#controller_form").attr("data-message",$("#editcontroller").attr("data-message"));
		$("#txt_controller_name").val(localStorage.getItem("controller_name_"+$("#editcontroller").attr("data-message")));
		$("#txt_controller_ip").val(localStorage.getItem("controller_ip_"+$("#editcontroller").attr("data-message")));
		$("#txt_controller_port").val(localStorage.getItem("controller_port_"+$("#editcontroller").attr("data-message")));
		
	});

	$("#deletecontroller").on('vclick', function () {
		$("#popupMenu").attr("data-message",1);
		$("#popupMenu").popup("close");
	});

     $( '#popupMenu' ).on({
        popupafterclose: function() {
			if ($("#popupMenu").attr("data-message")==1)
				setTimeout( function(){ $( '#confirmDelete' ).popup( 'open' ) }, 100 );
			$("#popupMenu").attr("data-message",0);
        }
      });
	
	$("#confirmdeletecontroller").on('vclick', function () {
		for (a=$("#deletecontroller").attr("data-message");a<localStorage.getItem("num_controllers");a++)
		{
			localStorage.setItem("controller_name_"+a,localStorage.getItem("controller_name_"+(parseInt(a)+1)));
			localStorage.setItem("controller_ip_"+a,localStorage.getItem("controller_ip_"+(parseInt(a)+1)));
			localStorage.setItem("controller_port_"+a,localStorage.getItem("controller_port_"+(parseInt(a)+1)));
		}
		localStorage.setItem("num_controllers",parseInt(localStorage.getItem("num_controllers"))-1);
		location.reload();
	});

	$("#expmodtabs").on('vclick', function () {
		if (localStorage.getItem("pwmd")!=null)
		{
			$('#pwmdinput').val(localStorage.getItem("pwmd"));
			$('#pwmdinput').slider('refresh');
			$('#pwmainput').val(localStorage.getItem("pwma"));
			$('#pwmainput').slider('refresh');
		}
		if (localStorage.getItem("pwme0")!=null)
		{
			for (a=0;a<6;a++)
			{
				$('#pwme'+a+'input').val(localStorage.getItem("pwme"+a));
				$('#pwme'+a+'input').next().children("div").first().css("background-image","-webkit-gradient(linear,left top,left bottom,from(#006600),to(#EEEEEE))");
				$('#pwme'+a+'input').slider('refresh');
			}
		}
		if (localStorage.getItem("rfw")!=null)
		{
			for (a=0;a<6;a++)
			{
				$('#'+rffields[a]+'input').val(localStorage.getItem(rffields[a]));
				$('#'+rffields[a]+'input').next().children("div").first().css("background-image","-webkit-gradient(linear,left top,left bottom,from(" + rfcolors[a] + "),to(#EEEEEE))");
				$('#'+rffields[a]+'input').slider('refresh');
			}
		}
		refresh_slider();
	});
	
	$('.customfieldset').find('.ui-btn').on('vclick', function(event){      
		send_command($(this).attr("data-message"));
	});

	$(".footerlink").on('vclick', function () {
		$.mobile.loading( 'show', {
			text: 'Please wait...',
			textVisible: true,
			theme: 'b',
			html: ""
		});
	});

	$("#displaygraph").on('vclick', function () {
		$("#graphparams").addClass("hiddentab");
		CreateChart();
	});
	
	$(window).on('resize', function () {
		$("#container").css("height",($(window).height()-20)+"px");
		DrawChart();
	});	
	
	$('.ui-slider').on('vclick', function (event) {
		$("#popupDialog" ).popup("open");
		$("#overrideslider").val($(this).children("input").first().val());
		$("#overrideslider").next().children("div").first().css("background-image","-webkit-gradient(linear,left top,left bottom,from(" + $(this).children("input").first().attr("data-color") + "),to(#EEEEEE))");
		$("#overrideslider").attr("data-message",$(this).children("input").first().attr("data-message"));
		$("#overrideslider").slider('refresh');
	});
	
	$("#setoverride").on('vclick', function () {
		send_command("po" + $("#overrideslider").attr("data-message") + "," + $("#overrideslider").val());
	});

	$("#clearoverride").on('vclick', function () {
		send_command("po" + $("#overrideslider").attr("data-message") + ",255");
	});

	$("#rfm, #rfmimage").on('vclick', function () {
		$("#popupRFWaveMode").popup("open");
	});
	
	$(".wavemodeitem").on('vclick', function () {
		localStorage.setItem("needrefresh",1);
		send_command($(this).attr("data-message"));
		$("#popupRFWaveMode").popup("close");
	});
	
	$("#dcm, #dcmimage").on('vclick', function () {
		$("#popupDCWaveMode").popup("open");
	});
	
	$(".wavemodeitem").on('vclick', function () {
		localStorage.setItem("needrefresh",1);
		send_command($(this).attr("data-message"));
		$("#popupDCWaveMode").popup("close");
	});
	
	$("#rfs, #rfd, #dcs, #dcd").on('vclick', function (event) {
		$("#popupRFSpeed").popup("open");
		$('#changeknob').trigger('configure',{"fgColor": $(this).attr('data-fgColor')}).css("color",$(this).attr('data-fgColor'));;
		$('#changeknob').val($(this).val()).trigger('change');
		$('#changeknob').attr("data-message",$(this).attr("data-message"));
		$('#changeknobtitle').html($(this).attr("data-title"));
		$('#changeknoblabel').html($(this).attr("data-title"));
	});
	
	$("#setknob").on('vclick', function (event) {
		send_command($('#changeknob').attr("data-message") + "," + $('#changeknob').val());
	});
	

});

function WriteStorage (x)
{
	if(x.getElementsByTagName('ID').item(0).hasChildNodes())
		localStorage.setItem("forum_username",x.getElementsByTagName('ID').item(0).firstChild.data);
	localStorage.setItem("em",x.getElementsByTagName('EM').item(0).firstChild.data);
	localStorage.setItem("em1",x.getElementsByTagName('EM1').item(0).firstChild.data);
	localStorage.setItem("rem",x.getElementsByTagName('REM').item(0).firstChild.data);
	localStorage.setItem("sf",x.getElementsByTagName('SF').item(0).firstChild.data);
	localStorage.setItem("af",x.getElementsByTagName('AF').item(0).firstChild.data);
	localStorage.setItem("t1",x.getElementsByTagName('T1').item(0).firstChild.data);
	localStorage.setItem("t2",x.getElementsByTagName('T2').item(0).firstChild.data);
	localStorage.setItem("t3",x.getElementsByTagName('T3').item(0).firstChild.data);
	localStorage.setItem("ph",x.getElementsByTagName('PH').item(0).firstChild.data);
	if(x.getElementsByTagName('SAL').length>0) localStorage.setItem("sal",x.getElementsByTagName('SAL').item(0).firstChild.data);
	if(x.getElementsByTagName('ORP').length>0) localStorage.setItem("orp",x.getElementsByTagName('ORP').item(0).firstChild.data);
	if(x.getElementsByTagName('PHE').length>0) localStorage.setItem("phe",x.getElementsByTagName('PHE').item(0).firstChild.data);
	if(x.getElementsByTagName('HUM').length>0) localStorage.setItem("hum",x.getElementsByTagName('HUM').item(0).firstChild.data);
	if(x.getElementsByTagName('PAR').length>0) localStorage.setItem("par",x.getElementsByTagName('PAR').item(0).firstChild.data);
	if(x.getElementsByTagName('LEAK').length>0) localStorage.setItem("leak",x.getElementsByTagName('LEAK').item(0).firstChild.data);
	if(x.getElementsByTagName('WL').length>0) localStorage.setItem("wl",x.getElementsByTagName('WL').item(0).firstChild.data);
	if(x.getElementsByTagName('WL1').length>0) localStorage.setItem("wl1",x.getElementsByTagName('WL1').item(0).firstChild.data);
	if(x.getElementsByTagName('WL2').length>0) localStorage.setItem("wl2",x.getElementsByTagName('WL2').item(0).firstChild.data);
	if(x.getElementsByTagName('WL3').length>0) localStorage.setItem("wl3",x.getElementsByTagName('WL3').item(0).firstChild.data);
	if(x.getElementsByTagName('WL4').length>0) localStorage.setItem("wl4",x.getElementsByTagName('WL4').item(0).firstChild.data);
	if(x.getElementsByTagName('IO').length>0) localStorage.setItem("io",x.getElementsByTagName('IO').item(0).firstChild.data);
	if(x.getElementsByTagName('C0').length>0)
	{
		localStorage.setItem("c0",x.getElementsByTagName('C0').item(0).firstChild.data);
		localStorage.setItem("c1",x.getElementsByTagName('C1').item(0).firstChild.data);
		localStorage.setItem("c2",x.getElementsByTagName('C2').item(0).firstChild.data);
		localStorage.setItem("c3",x.getElementsByTagName('C3').item(0).firstChild.data);
		localStorage.setItem("c4",x.getElementsByTagName('C4').item(0).firstChild.data);
		localStorage.setItem("c5",x.getElementsByTagName('C5').item(0).firstChild.data);
		localStorage.setItem("c6",x.getElementsByTagName('C6').item(0).firstChild.data);
		localStorage.setItem("c7",x.getElementsByTagName('C7').item(0).firstChild.data);
	}
	localStorage.setItem("atolow",x.getElementsByTagName('ATOLOW').item(0).firstChild.data);
	localStorage.setItem("atohigh",x.getElementsByTagName('ATOHIGH').item(0).firstChild.data);
	localStorage.setItem("pwma",x.getElementsByTagName('PWMA').item(0).firstChild.data);
	localStorage.setItem("pwmd",x.getElementsByTagName('PWMD').item(0).firstChild.data);
	localStorage.setItem("pwmao",x.getElementsByTagName('PWMAO').item(0).firstChild.data);
	localStorage.setItem("pwmdo",x.getElementsByTagName('PWMDO').item(0).firstChild.data);
	if(x.getElementsByTagName('PWME0').length>0)
	{
		for (a=0;a<6;a++)
		{
			localStorage.setItem("pwme"+a,x.getElementsByTagName('PWME'+a).item(0).firstChild.data);
			localStorage.setItem("pwme"+a+"o",x.getElementsByTagName('PWME'+a+'O').item(0).firstChild.data);
		}
	}
	if(x.getElementsByTagName('DCM').length>0) localStorage.setItem("dcm",x.getElementsByTagName('DCM').item(0).firstChild.data);
	if(x.getElementsByTagName('DCS').length>0) localStorage.setItem("dcs",x.getElementsByTagName('DCS').item(0).firstChild.data);
	if(x.getElementsByTagName('DCD').length>0) localStorage.setItem("dcd",x.getElementsByTagName('DCD').item(0).firstChild.data);
	if(x.getElementsByTagName('RFM').length>0) localStorage.setItem("rfm",x.getElementsByTagName('RFM').item(0).firstChild.data);
	if(x.getElementsByTagName('RFS').length>0) localStorage.setItem("rfs",x.getElementsByTagName('RFS').item(0).firstChild.data);
	if(x.getElementsByTagName('RFD').length>0) localStorage.setItem("rfd",x.getElementsByTagName('RFD').item(0).firstChild.data);
	
	if(x.getElementsByTagName('RFW').length>0)
	{
		for (a=0;a<6;a++)
		{
			localStorage.setItem(rffields[a],x.getElementsByTagName(rffields[a].toUpperCase()).item(0).firstChild.data);
			localStorage.setItem(rffields[a]+"o",x.getElementsByTagName(rffields[a].toUpperCase()+'O').item(0).firstChild.data);
		}
	}
	localStorage.setItem("r",x.getElementsByTagName('R').item(0).firstChild.data);
	localStorage.setItem("ron",x.getElementsByTagName('RON').item(0).firstChild.data);
	localStorage.setItem("roff",x.getElementsByTagName('ROFF').item(0).firstChild.data);
	if(localStorage.getItem("rem")>0)
	{
		for (a=1;a<=8;a++)
		{
			localStorage.setItem("r"+a,x.getElementsByTagName('R'+a).item(0).firstChild.data);
			localStorage.setItem("ron"+a,x.getElementsByTagName('RON'+a).item(0).firstChild.data);
			localStorage.setItem("roff"+a,x.getElementsByTagName('ROFF'+a).item(0).firstChild.data);						
		}
	}
	if (localStorage.getItem("lastem")!=localStorage.getItem("em") || localStorage.getItem("lastem1")!=localStorage.getItem("em1"))
	{
		localStorage.setItem("lastem",localStorage.getItem("em"));
		localStorage.setItem("lastem1",localStorage.getItem("em1"));
		location.reload();
	}
	ReadStorage();
}

function ReadStorage(p)
{
	if (localStorage.getItem("forum_username")!=null)
		$('#myreefangelid').html(localStorage.getItem("forum_username"));
	else
		$('#myreefangelid').html("Not setup");
	$('#t1').html(localStorage.getItem("t1")/10 + " &deg;");
	$('#t2').html(localStorage.getItem("t2")/10 + " &deg;");
	$('#t3').html(localStorage.getItem("t3")/10 + " &deg;");
	$('#ph').html(localStorage.getItem("ph")/100);
	$('#sal').html(localStorage.getItem("sal")/10 + " ppt");
	$('#orp').html(localStorage.getItem("orp") + " mV");
	$('#phe').html(localStorage.getItem("phe")/100);
	$('#hum').html(localStorage.getItem("hum")/10 + " %");
	$('#par').html(localStorage.getItem("par"));
	$('#c0').html(localStorage.getItem("c0"));
	$('#c1').html(localStorage.getItem("c1"));
	$('#c2').html(localStorage.getItem("c2"));
	$('#c3').html(localStorage.getItem("c3"));
	$('#c4').html(localStorage.getItem("c4"));
	$('#c5').html(localStorage.getItem("c5"));
	$('#c6').html(localStorage.getItem("c6"));
	$('#c7').html(localStorage.getItem("c7"));
	$('#wl').html(localStorage.getItem("wl")+" %");
	$('#wl1').html(localStorage.getItem("wl1")+" %");
	$('#wl2').html(localStorage.getItem("wl2")+" %");
	$('#wl3').html(localStorage.getItem("wl3")+" %");
	$('#wl4').html(localStorage.getItem("wl4")+" %");
	$('#wllevel').css("height",parseInt(localStorage.getItem("wl"))+10);
	$('#wl1level').css("height",parseInt(localStorage.getItem("wl1"))+10);
	$('#wl2level').css("height",parseInt(localStorage.getItem("wl2"))+10);
	$('#wl3level').css("height",parseInt(localStorage.getItem("wl3"))+10);
	$('#wl4level').css("height",parseInt(localStorage.getItem("wl4"))+10);
	$('#rfm').html(rfmodes[localStorage.getItem("rfm")]);	
	$('#rfm').css("color",rfmodecolors[localStorage.getItem("rfm")]);
	$('#rfmimage').html("<img src=img/" + rfimages[localStorage.getItem("rfm")] + ">");	
//	$('#rfs').val(localStorage.getItem("rfs"));	
	$('#rfs, #rfd').attr("data-fgColor",rfmodecolors[localStorage.getItem("rfm")]);
//	$('#rfd').val(localStorage.getItem("rfd"));	
//	$('#rfd').attr("data-fgColor",rfmodecolors[localStorage.getItem("rfm")]);
	$('#dcm').html(rfmodes[localStorage.getItem("dcm")]);	
	$('#dcm').css("color",rfmodecolors[localStorage.getItem("dcm")]);
	$('#dcmimage').html("<img src=img/" + rfimages[localStorage.getItem("dcm")] + ">");	
//	$('#dcs').val(localStorage.getItem("dcs"));	
	$('#dcs, #dcd').attr("data-fgColor",rfmodecolors[localStorage.getItem("dcm")]);
//	$('#dcd').val(localStorage.getItem("dcd"));	
//	$('#dcd').attr("data-fgColor",rfmodecolors[localStorage.getItem("dcm")]);

	$('#rfs, #rfd').trigger('configure',{"fgColor": rfmodecolors[localStorage.getItem("rfm")]}).css("color",rfmodecolors[localStorage.getItem("rfm")]);;
	$('#rfs').val(localStorage.getItem("rfs")).trigger('change');
	$('#rfd').val(localStorage.getItem("rfd")).trigger('change');

	$('#dcs, #dcd').trigger('configure',{"fgColor": rfmodecolors[localStorage.getItem("dcm")]}).css("color",rfmodecolors[localStorage.getItem("dcm")]);;
	$('#dcs').val(localStorage.getItem("dcs")).trigger('change');
	$('#dcd').val(localStorage.getItem("dcd")).trigger('change');
	
	if (localStorage.getItem("atolow")==1)
		$('#atolow').html("<svg height='20' width='20'><circle cx='10' cy='10' r='10' fill='green' /></svg>");
	else
		$('#atolow').html("<svg height='20' width='20'><circle cx='10' cy='10' r='10' fill='red' /></svg>");
	if (localStorage.getItem("atohigh")==1)
		$('#atohigh').html("<svg height='20' width='20'><circle cx='10' cy='10' r='10' fill='green' /></svg>");
	else
		$('#atohigh').html("<svg height='20' width='20'><circle cx='10' cy='10' r='10' fill='red' /></svg>");
	if (localStorage.getItem("leak")==1)
		$('#leak').html("<svg height='20' width='20'><circle cx='10' cy='10' r='10' fill='green' /></svg>");
	else
		$('#leak').html("<svg height='20' width='20'><circle cx='10' cy='10' r='10' fill='red' /></svg>");
	for (a=0;a<6;a++)
	{
		if ((localStorage.getItem("io")&(1<<a)) != 0)
			$('#io'+a).html("<svg height='20' width='20'><circle cx='10' cy='10' r='10' fill='red' /></svg>");		
		else
			$('#io'+a).html("<svg height='20' width='20'><circle cx='10' cy='10' r='10' fill='green' /></svg>");
	}
	rs=localStorage.getItem("r");
	rs|=localStorage.getItem("ron");
	rs&=localStorage.getItem("roff");
	for (a=1;a<=8;a++)
	{	
		if ((rs&(1<<(a-1)))!=0)
			$("#r" + a + "status").html("<svg height='20' width='20'><circle cx='10' cy='10' r='10' fill='green' /></svg>");
		else
			$("#r" + a + "status").html("<svg height='20' width='20'><circle cx='10' cy='10' r='10' fill='red' /></svg>");
		if ((localStorage.getItem("ron")&(1<<(a-1)))!=0)
			$("#r" + a + "on").prop( "checked", true );
		if ((localStorage.getItem("roff")&(1<<(a-1)))==0)
			$("#r" + a + "off").prop( "checked", true );
		if ((localStorage.getItem("ron")&(1<<(a-1)))==0 && (localStorage.getItem("roff")&(1<<(a-1)))!=0)
			$("#r" + a + "auto").prop( "checked", true );
	}
	if (localStorage.getItem("rem")>0)
	{
		for (a=1;a<=8;a++)
		{
			if ((localStorage.getItem("rem")&(1<<(a-1)))!=0)
			{
				rs=localStorage.getItem("r"+a);
				rs|=localStorage.getItem("ron"+a);
				rs&=localStorage.getItem("roff"+a);
				for (b=1;b<=8;b++)
				{	
					if ((rs&(1<<(b-1)))!=0)
						$("#r" + a + b + "status").html("<svg height='20' width='20'><circle cx='10' cy='10' r='10' fill='green' /></svg>");
					else
						$("#r" + a + b + "status").html("<svg height='20' width='20'><circle cx='10' cy='10' r='10' fill='red' /></svg>");
					if ((localStorage.getItem("ron"+a)&(1<<(b-1)))!=0)
						$("#r" + a + b + "on").prop( "checked", true );
					if ((localStorage.getItem("roff"+a)&(1<<(b-1)))==0)
						$("#r" + a + b + "off").prop( "checked", true );
					if ((localStorage.getItem("ron"+a)&(1<<(b-1)))==0 && (localStorage.getItem("roff"+a)&(1<<(b-1)))!=0)
						$("#r" + a + b + "auto").prop( "checked", true );
				}
			}
		}
	}
	$("[data-role=controlgroup]").controlgroup();
	$("#flagslist").html("");
	if (localStorage.getItem("af")==0 && localStorage.getItem("sf")==0) $("#flagslist").append("No Alerts");
	if ((localStorage.getItem("af") & 1)!=0) $("#flagslist").append("<div class=flagitem>ATO Timeout<br><img src='img/timeout.png'></div>");
	if ((localStorage.getItem("af") & 2)!=0) $("#flagslist").append("<div class=flagitem>Overheat<br><img src='img/overheat.png'></div>");
	if ((localStorage.getItem("af") & 4)!=0) $("#flagslist").append("<div class=flagitem>Bus Lock<br><img src='img/buslock.png'></div>");
	if ((localStorage.getItem("af") & 8)!=0) $("#flagslist").append("<div class=flagitem>Leak Detected<br><img src='img/leak.png'></div>");
	if ((localStorage.getItem("sf") & 1)!=0) $("#flagslist").append("<div class=flagitem>Lights On Mode<br><img src='img/lightson.png'></div>");
	if ((localStorage.getItem("sf") & 2)!=0) $("#flagslist").append("<div class=flagitem>Feeding Mode<br><img src='img/feedingmode.png'></div>");
	if ((localStorage.getItem("sf") & 4)!=0) $("#flagslist").append("<div class=flagitem>Water Change Mode<br><img src='img/waterchangemode.png'></div>");
	lastEM=localStorage.getItem("em");
	lastEM1=localStorage.getItem("em1");

	$('#pwmd').html(localStorage.getItem("pwmd")/1+"%");
	$('#pwmdinput').val(localStorage.getItem("pwmd"));
	$('#pwma').html(localStorage.getItem("pwma")/1+"%");
	$('#pwmainput').val(localStorage.getItem("pwma"));
	for (a=0;a<6;a++)
	{
		$('#pwme'+a).html(localStorage.getItem("pwme"+a)/1+"%");
		$('#pwme'+a+'input').val(localStorage.getItem("pwme"+a));
	}
	for (a=0;a<6;a++)
	{
		$('#'+rffields[a]).html(localStorage.getItem(rffields[a])/1+"%");
		$('#'+rffields[a]+'input').val(localStorage.getItem(rffields[a]));
	}
	
	refresh_slider();
}

function UpdateLabels()
{
	var labels = ["t1n","t2n","t3n","phn","saln ","orpn","phen","humn","parn","c0n","c1n","c2n","c3n","c4n","c5n","c6n","c7n","atolown","atohighn","pwma1n","pwmd1n","leakn","r1n","r2n","r3n","r4n","r5n","r6n","r7n","r8n","r11n","r12n","r13n","r14n","r15n","r16n","r17n","r18n","r21n","r22n","r23n","r24n","r25n","r26n","r27n","r28n","r31n","r32n","r33n","r34n","r35n","r36n","r37n","r38n","r41n","r42n","r43n","r44n","r45n","r46n","r47n","r48n","r51n","r52n","r53n","r54n","r55n","r56n","r57n","r58n","r61n","r62n","r63n","r64n","r65n","r66n","r67n","r68n","r71n","r72n","r73n","r74n","r75n","r76n","r77n","r78n","r81n","r82n","r83n","r84n","r85n","r86n","r87n","r88n","pwme0n","pwme1n","pwme2n","pwme3n","pwme4n","pwme5n","wln","wl1n","wl2n","wl3n","wl4n","rfwn","rfrbn","rfrn","rfgn","rfbn","rfin","io0n","io1n","io2n","io3n","io4n","io5n"];
	var defaultlabels = ["Temp 1","Temp 2","Temp 3","pH","Salinity","ORP","pH Expansion","Humidity","PAR","Custom Var 0","Custom Var 1","Custom Var 2","Custom Var 3","Custom Var 4","Custom Var 5","Custom Var 6","Custom Var 7","ATO Low","ATO High","Actinic","Daylight","Leak Detector","Port 1","Port 2","Port 3","Port 4","Port 5","Port 6","Port 7","Port 8","Port 11","Port 12","Port 13","Port 14","Port 15","Port 16","Port 17","Port 18","Port 21","Port 22","Port 23","Port 24","Port 25","Port 26","Port 27","Port 28","Port 31","Port 32","Port 33","Port 34","Port 35","Port 36","Port 37","Port 38","Port 41","Port 42","Port 43","Port 44","Port 45","Port 46","Port 47","Port 48","Port 51","Port 52","Port 53","Port 54","Port 55","Port 56","Port 57","Port 58","Port 61","Port 62","Port 63","Port 64","Port 65","Port 66","Port 67","Port 68","Port 71","Port 72","Port 73","Port 74","Port 75","Port 76","Port 77","Port 78","Port 81","Port 82","Port 83","Port 84","Port 85","Port 86","Port 87","Port 88","Channel 0","Channel 1","Channel 2","Channel 3","Channel 4","Channel 5","Channel 0","Channel 1","Channel 2","Channel 3","Channel 4","White","Royal Blue","Red","Green","Blue","Intensity","I/O Channel 0","I/O Channel 1","I/O Channel 2","I/O Channel 3","I/O Channel 4","I/O Channel 5"];
	
	for (a=0;a<labels.length;a++)
	{
		if (localStorage.getItem(labels[a])==null) localStorage.setItem(labels[a],defaultlabels[a]);
		$('#'+labels[a]).html(localStorage.getItem(labels[a]));		
	}
}

function CheckExpansion()
{
	var EM=localStorage.getItem("em");
	var EM1=localStorage.getItem("em1");

	if ((EM & 1<<0) != 0)
	{
		for (a=0;a<6;a++)
		{
			$("#dimmingtab").append("<label for='pwme"+a+"input' id='pwme"+a+"n' class='dimminglabel'></label>");
			$("#dimmingtab").append("<div class='dimmingvalue' id='pwme"+a+"'>0%</div>");
			$("#dimmingtab").append("<input id='pwme"+a+"input' name='pwme"+a+"input' value='0' type='range' max='100' min='0' data-highlight='true' disabled='disabled' data-mini='true' data-message='" + (a+2) + "' data-color='#006600'>");
		}
	}
	if ((EM & 1<<1) != 0)
	{
		$("#expmodtabs").append("<li class=mintab><a href='#rftab' data-ajax='false' data-theme='a'>RF</a></li>");
		$("#rftab").removeClass("hiddentab");
		$("#rftab").addClass("ui-content");
		for (a=0;a<6;a++)
		{
			$("#rftab").append("<label for='"+rffields[a]+"input' id='"+rffields[a]+"n' class='dimminglabel'></label>");
			$("#rftab").append("<div class='dimmingvalue' id='"+rffields[a]+"'>0%</div>");
			$("#rftab").append("<input id='"+rffields[a]+"input' name='"+rffields[a]+"input' value='0' type='range' max='100' min='0' data-highlight='true' disabled='disabled' data-mini='true' data-message='" + (a+11) + "' data-color='" + rfcolors[a] + "'>");
		}
		
	}	
	if ((EM & 1<<2) != 0)
	{
		$("#expmodtabs").append("<li class=mintab><a href='#aitab' data-ajax='false' data-theme='a'>AI</a></li>");
		$("#aitab").removeClass("hiddentab");
		$("#aitab").addClass("ui-content");
	}	
	if ((EM & 1<<3) != 0)
	{
		$("#paramslist").append("<div><div class=paramslabel id=saln>Salinity</div><div class=paramsvalue id=sal></div></div>");
		$("#CalibrateParams").append("<li><a href='javascript:send_command(\"cal1\")' data-rel='close'>Salinity</a></li>");
		$("#graph_selection").append("<input id='historysal' type='checkbox'><label for='historysal' id='saln'></label>");

	}
	if ((EM & 1<<4) != 0)
	{
		$("#paramslist").append("<div><div class=paramslabel id=orpn>ORP</div><div class=paramsvalue id=orp></div></div>");
		$("#CalibrateParams").append("<li><a href='javascript:send_command(\"cal2\")' data-rel='close'>ORP</a></li>");
		$("#graph_selection").append("<input id='historyorp' type='checkbox'><label for='historyorp' id='orpn'></label>");
	}
	if ((EM & 1<<5) != 0)
	{
		for (a=0;a<6;a++)
			$("#iolist").append("<div><div class=paramslabel id=io" + a + "n></div><div class=paramsvalue id=io" + a + "></div></div>");
	}
	if ((EM & 1<<6) != 0)
	{
		$("#paramslist").append("<div><div class=paramslabel id=phen>pH Expansion</div><div class=paramsvalue id=phe></div></div>");
		$("#CalibrateParams").append("<li><a href='javascript:send_command(\"cal3\")' data-rel='close'>pH Expansion</a></li>");
		$("#graph_selection").append("<input id='historyphe' type='checkbox'><label for='historyphe' id='phen'></label>");
	}
	if ((EM & 1<<7) != 0)
	{
		$("#expmodtabs").append("<li class=mintab><a href='#waterleveltab' data-ajax='false' data-theme='a'>Water Level</a></li>");
		$("#waterleveltab").removeClass("hiddentab");
		$("#waterleveltab").addClass("ui-content");
		$("#CalibrateParams").append("<li><a href='javascript:send_command(\"cal4\")' data-rel='close'>Water Level</a></li>");
	}

	if ((EM1 & 1<<0) != 0)
	{
		$("#paramslist").append("<div><div class=paramslabel id=humn>Humidity</div><div class=paramsvalue id=hum></div></div>");
		$("#graph_selection").append("<input id='historyhum' type='checkbox'><label for='historyhum' id='humn'></label>");
	}
	if ((EM1 & 1<<1) != 0)
	{
		$("#expmodtabs").append("<li class=mintab><a href='#dcpumptab' data-ajax='false' data-theme='a'>DC Pump</a></li>");
		$("#dcpumptab").removeClass("hiddentab");
		$("#dcpumptab").addClass("ui-content");
	}	
	if ((EM1 & 1<<2) != 0)
	{
		$("#ClearAlert").append("<li><a href='javascript:send_command(\"ml\")' data-rel='close'>Clear Leak</a></li>");
		$("#iolist").append("<div><div class=paramslabel id=leakn></div><div class=paramsvalue id=leak></div></div>");
}
	if ((EM1 & 1<<3) != 0)
	{
		$("#paramslist").append("<div><div class=paramslabel id=parn>PAR</div><div class=paramsvalue id=par></div></div>");
	}
	if (localStorage.getItem("c0")!=null)
	{
		$("#expmodtabs").append("<li class=mintab><a href='#customvartab' data-ajax='false' data-theme='a'>Custom Variables</a></li>");
		$("#customvartab").removeClass("hiddentab");
		$("#customvartab").addClass("ui-content");
	}
	if (localStorage.getItem("rem")>0)
	{
		for (a=1;a<=8;a++)
		{
			if ((localStorage.getItem("rem")&(1<<(a-1)))!=0)
			{
				$("#relaytabs").append("<li class=mintab><a href='#expbox" + a + "' data-ajax='false' data-theme='a'>Exp Box" + a + "</a></li>");
				$("#expbox" + a + "").removeClass("hiddentab");
				//$("#expbox" + a + "").addClass("ui-content");
			}
		}
	}
}

function controller_command(command)
{
	return "http://" + localStorage.getItem("controller_ip") + ":" + localStorage.getItem("controller_port") + "/" + command;
}

function send_command(command)
{
	if (localStorage.getItem("controller_ip")==null)
	{
		alert("Invalid controller address. Please click the settings button and update your controller address.");
		return;
	}
	$.mobile.loading( 'show', {
		text: 'Connecting to Reef Angel',
		textVisible: true,
		theme: 'b',
		html: ""
	});
	var jqxhr = $.ajax({
		url: controller_command(command),
		timeout: 10000,
		success: function(data) {
			x=data.documentElement;  
			if(x.childNodes.length==1)
				if (x.firstChild.data!="OK")
					alert(x.firstChild.data);
				else
					setTimeout(function() {
						$.mobile.loading( "hide" );
						$('#btn_refresh').click();
					}, 1000);
			if(x.childNodes.length>1)
				if(x.nodeName=="RA")
				{
					WriteStorage(x);
				}
					
		},
		error: function (xhr, ajaxOptions, thrownError) {
			$.mobile.loading( "hide" );
			if (ajaxOptions="timeout")
			{
				alert("Timeout");
			}
			else
			{
				alert("Error code: " + xhr.status + " - " +thrownError);
			}
		}
	});	
}

function refresh_slider()
{
	if(localStorage.getItem("pwmdo")!=null)
	{
		if (localStorage.getItem("pwmdo")<100)
		{
			$('#pwmd1n').html(localStorage.getItem("pwmd1n")+" - Overriden");
			if ($('#pwmdinput').hasClass("ui-mini"))
			{
				$('#pwmdinput').next().children("a").first().css("background","red");
				$('#pwmdinput').slider('refresh');
			}
		}
		else
		{
			$('#pwmd1n').html(localStorage.getItem("pwmd1n"));
			if ($('#pwmdinput').hasClass("ui-mini"))
			{
				$('#pwmdinput').next().children("a").first().css("background","#f6f6f6");
				$('#pwmdinput').slider('refresh');
			}
		}
		if (localStorage.getItem("pwmao")<100)
		{
			$('#pwma1n').html(localStorage.getItem("pwma1n")+" - Overriden");
			if ($('#pwmainput').hasClass("ui-mini"))
			{
				$('#pwmainput').next().children("a").first().css("background","red");
				$('#pwmainput').slider('refresh');
			}
		}
		else
		{
			$('#pwma1n').html(localStorage.getItem("pwma1n"));
			if ($('#pwmainput').hasClass("ui-mini"))
			{
				$('#pwmainput').next().children("a").first().css("background","#f6f6f6");
				$('#pwmainput').slider('refresh');
			}
		}	
	}
	for (a=0;a<6;a++)
	{
		if(localStorage.getItem("pwme"+a+"o")!=null)
		{
			if (localStorage.getItem("pwme"+a+"o")<100)
			{
				$('#pwme'+a+'n').html(localStorage.getItem("pwme"+a+"n")+" - Overriden");
				if ($('#pwme'+a+'input').hasClass("ui-mini"))
				{
					$('#pwme'+a+'input').next().children("a").first().css("background","red");
					$('#pwme'+a+'input').slider('refresh');
				}
			}
			else
			{
				$('#pwme'+a+'n').html(localStorage.getItem("pwme"+a+"n"));
				if ($('#pwme'+a+'input').hasClass("ui-mini"))
				{
					$('#pwme'+a+'input').next().children("a").first().css("background","#f6f6f6");
					$('#pwme'+a+'input').slider('refresh');
				}
			}
		}
	}
	for (a=0;a<6;a++)
	{
		if(localStorage.getItem(rffields[a]+"o")!=null)
		{
			if (localStorage.getItem(rffields[a]+"o")<100)
			{
				$('#'+rffields[a]+'n').html(localStorage.getItem(rffields[a]+"n")+" - Overriden");
				if ($('#'+rffields[a]+'input').hasClass("ui-mini"))
				{
					$('#'+rffields[a]+'input').next().children("a").first().css("background","red");
					$('#'+rffields[a]+'input').slider('refresh');
				}
			}
			else
			{
				$('#'+rffields[a]+'n').html(localStorage.getItem(rffields[a]+"n"));
				if ($('#'+rffields[a]+'input').hasClass("ui-mini"))
				{
					$('#'+rffields[a]+'input').next().children("a").first().css("background","#f6f6f6");
					$('#'+rffields[a]+'input').slider('refresh');
				}
			}
		}
	}	
}

function CreateChart()
{
	names = [];
	if ($("#historyt1").prop("checked")==true) names.push("T1");
	if ($("#historyt2").prop("checked")==true) names.push("T2");
	if ($("#historyt3").prop("checked")==true) names.push("T3");
	if ($("#historyph").prop("checked")==true) names.push("PH");
	if ($("#historysal").prop("checked")==true) names.push("SAL");
	if ($("#historyorp").prop("checked")==true) names.push("ORP");
	if ($("#historyphe").prop("checked")==true) names.push("PHE");
	if ($("#historyhum").prop("checked")==true) names.push("HUM");
	if (names.length==0)
	{
		alert("At least on parameter needs to be checked.");
		return false;
	}
	$.mobile.loading( 'show', {
		text: 'Connecting to Portal...\nThis process can take several minutes to complete',
		textVisible: true,
		theme: 'b',
		html: ""
	});
	$("#container").html("");
	$("#container").css("height",($(window).height()-80)+"px");
	$("#container").css("margin-top","-100px");
	Highcharts.setOptions({
		global: {
			useUTC: false
		}
	});
	seriesOptions = [],
	seriesCounter = 0,
	seriesID = 0;

	$.each(names, function (i, name) {
		$.getJSON('http://forum.reefangel.com/status/jsonp.aspx?id=reefangel&filter=' + name.toLowerCase() + '&callback=?', function (data) {
			var pcolor;
			var tname;
			var ydec;
			var yunit;
			if (name == "PH") {
				pcolor = '#669900'
				tname = localStorage.getItem("phn")
				ydec = 2
				yunit = 'pH'
			}
			else if (name == "PHE") {
				pcolor = '#447700'
				tname = localStorage.getItem("phen")
				ydec = 2
				yunit = 'pH'
			}
			else if (name == "SAL") {
				pcolor = '#000066'
				tname = localStorage.getItem("saln")
				ydec = 1
				yunit = 'ppt'
			}
			else if (name == "ORP") {
				pcolor = '#330000'
				tname = localStorage.getItem("orpn")
				ydec = 0
				yunit = 'mV'
			}
			else if (name == "T1") {
				pcolor = '#FF0000'
				tname = localStorage.getItem("t1n")
				ydec = 1
				yunit = '°'
			}
			else if (name == "T2") {
				pcolor = '#FF8800'
				tname = localStorage.getItem("t2n")
				ydec = 1
				yunit = '°'
			}
			else if (name == "T3") {
				pcolor = '#9900CC'
				tname = localStorage.getItem("t3n")
				ydec = 1
				yunit = '°'
			}
			else {
				pcolor = '#FF0000'
				tname = ''
				ydec = 0
				yunit = ''
			}
			if (data.length) {
				seriesOptions[seriesID] = {
					dataGrouping: {
						smoothed: true
					},
					name: tname,
					color: pcolor,
					tooltip: {
						yDecimals: ydec,
						ySuffix: yunit
					},
					data: data
				};
				seriesID++;
			}
			// As we're loading the data asynchronously, we don't know what order it will arrive. So
			// we keep a counter and create the chart when all the data is loaded.
			seriesCounter++;

			if(data.length==0) 
			{
				$('#container').html("No data to display");
				$.mobile.loading( "hide" );							
			}
			else
				if (seriesCounter == names.length) {
					DrawChart();
					$.mobile.loading( "hide" );							
			}
		});
	});
}

// create the chart when all data is loaded
function DrawChart() {

	chart = new Highcharts.StockChart({
		chart: {
			renderTo: 'container',
			type: 'spline'
		},
		credits: {
			enabled: false
		},

		legend: {
			enabled: true,
			//align: 'right',
			//backgroundColor: '#FCFFC5',
			borderColor: 'black',
			borderWidth: 2,
			//layout: 'vertical',
			verticalAlign: 'top',
			y: 100,
			shadow: true
		},


		rangeSelector: {
			buttons: [{
				type: 'minute',
				count: 60,
				text: '1h'
			}, {
				type: 'minute',
				count: 720,
				text: '12h'
			}, {
				type: 'day',
				count: 1,
				text: '1d'
			}, {
				type: 'day',
				count: 3,
				text: '3d'
			}, {
				type: 'all',
				text: '7d'
			}],
			selected: 2,
			inputEnabled: false
		},

		navigator: {
			xAxis: {
				type: 'datetime',
				maxZoom: 3600000, // 1 hour
				dateTimeLabelFormats: { // don't display the dummy year
					second: '%I:%M:%S %p',
					minute: '%I:%M %p',
					hour: '%b/%e',
					day: '%b/%e',
					week: '%b/%e'
				}
			}

		},
		xAxis: {
			type: 'datetime',
			maxZoom: 3600000, // 1 hour
			dateTimeLabelFormats: { // don't display the dummy year
				second: '%I:%M:%S %p',
				minute: '%I:%M %p',
				hour: '%I:%M %p',
				day: '%b/%e',
				week: '%b/%e'
			}
		},

		yAxis: {

			plotLines: [{
				value: 0,
				width: 1,
				color: 'silver'
			}]
		},

		tooltip: {
			borderColor: 'silver',
			xDateFormat: '%A, %b %e, %l:%M %p',
			pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>'
		},

		series: seriesOptions
	});
}	
