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
	});

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
					if(x.getElementsByTagName('ID').item(0).hasChildNodes())
						localStorage.setItem("forum_username",x.getElementsByTagName('ID').item(0).firstChild.data);
					localStorage.setItem("em",x.getElementsByTagName('EM').item(0).firstChild.data);
					localStorage.setItem("em1",x.getElementsByTagName('EM1').item(0).firstChild.data);
					localStorage.setItem("rem",x.getElementsByTagName('REM').item(0).firstChild.data);
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

	$(".footerlink").on('vclick', function () {
		$.mobile.loading( 'show', {
			text: 'Please wait...',
			textVisible: true,
			theme: 'b',
			html: ""
		});
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

});

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
	
	lastEM=localStorage.getItem("em");
	lastEM1=localStorage.getItem("em1");
}

function UpdateLabels()
{
	var labels = ["t1n","t2n","t3n","phn","saln ","orpn","phen","humn","parn","c0n","c1n","c2n","c3n","c4n","c5n","c6n","c7n","atolown","atohighn","leakn","r1n","r2n","r3n","r4n","r5n","r6n","r7n","r8n","r11n","r12n","r13n","r14n","r15n","r16n","r17n","r18n","r21n","r22n","r23n","r24n","r25n","r26n","r27n","r28n","r31n","r32n","r33n","r34n","r35n","r36n","r37n","r38n","r41n","r42n","r43n","r44n","r45n","r46n","r47n","r48n","r51n","r52n","r53n","r54n","r55n","r56n","r57n","r58n","r61n","r62n","r63n","r64n","r65n","r66n","r67n","r68n","r71n","r72n","r73n","r74n","r75n","r76n","r77n","r78n","r81n","r82n","r83n","r84n","r85n","r86n","r87n","r88n"];
	var defaultlabels = ["Temp 1","Temp 2","Temp 3","pH","Salinity","ORP","pH Expansion","Humidity","PAR","Custom Var 0","Custom Var 1","Custom Var 2","Custom Var 3","Custom Var 4","Custom Var 5","Custom Var 6","Custom Var 7","ATO Low","ATO High","Leak Detector","Port 1","Port 2","Port 3","Port 4","Port 5","Port 6","Port 7","Port 8","Port 11","Port 12","Port 13","Port 14","Port 15","Port 16","Port 17","Port 18","Port 21","Port 22","Port 23","Port 24","Port 25","Port 26","Port 27","Port 28","Port 31","Port 32","Port 33","Port 34","Port 35","Port 36","Port 37","Port 38","Port 41","Port 42","Port 43","Port 44","Port 45","Port 46","Port 47","Port 48","Port 51","Port 52","Port 53","Port 54","Port 55","Port 56","Port 57","Port 58","Port 61","Port 62","Port 63","Port 64","Port 65","Port 66","Port 67","Port 68","Port 71","Port 72","Port 73","Port 74","Port 75","Port 76","Port 77","Port 78","Port 81","Port 82","Port 83","Port 84","Port 85","Port 86","Port 87","Port 88"];
	
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

	if ((EM & 1<<1) != 0)
	{
		$("#expmodtabs").append("<li class=mintab><a href='#rftab' data-ajax='false' data-theme='a'>RF</a></li>");
		$("#rftab").removeClass("hiddentab");
		$("#rftab").addClass("ui-content");
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
	}
	if ((EM & 1<<4) != 0)
	{
		$("#paramslist").append("<div><div class=paramslabel id=orpn>ORP</div><div class=paramsvalue id=orp></div></div>");
		$("#CalibrateParams").append("<li><a href='javascript:send_command(\"cal2\")' data-rel='close'>ORP</a></li>");
	}
	if ((EM & 1<<6) != 0)
	{
		$("#paramslist").append("<div><div class=paramslabel id=phen>pH Expansion</div><div class=paramsvalue id=phe></div></div>");
		$("#CalibrateParams").append("<li><a href='javascript:send_command(\"cal3\")' data-rel='close'>pH Expansion</a></li>");
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
				$("#expbox" + a + "").addClass("ui-content");
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
			$.mobile.loading( "hide" );
			x=data.documentElement;  
			if(x.childNodes.length>0)
				if (x.firstChild.data!="OK")
					alert(x.firstChild.data);
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