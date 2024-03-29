// ==UserScript==
// @name           OGame Redesign: Keyboard Shortcuts
// @description    Assigns keyboard shortcuts to various game functions
// @namespace      Vesselin
// @version        3.0
// @date           2012-12-14
// @author         Vesselin Bontchev
// @include        http://*.ogame.*/game/index.php?*
// @exclude        http://*.ogame.*/game/index.php?page=notices*
// @exclude        http://*.ogame.*/game/index.php?page=combatreport*
// @exclude        http://*.ogame.*/game/index.php?page=chat
// @exclude        http://*.ogame.*/game/index.php?page=messages
// @include        https://*.ogame.*/game/index.php?*
// @exclude        https://*.ogame.*/game/index.php?page=notices*
// @exclude        https://*.ogame.*/game/index.php?page=combatreport*
// ==/UserScript==

(function ()
{
	var theHref = document.location.href;
	// The following "if" is not really necessary but with it this script will work for Opera too
	if ((theHref.indexOf ("/game/index.php?")                  <  0) ||
	    (theHref.indexOf ("/game/index.php?page=notices")      > -1) ||
	    (theHref.indexOf ("/game/index.php?page=combatreport") > -1))
		return;
	var unsafe = window;
	try
	{
		unsafe = unsafeWindow;
	}
	catch (e)
	{
	}
	var $ = unsafe.$;
	if (! $)
		return;
	function badTarget (e)
	{
		var targ;
		if (! e)
			var e = window.event;
		if (e.target)
			targ = e.target;
		else if (e.srcElement)
			targ = e.srcElement;
		if (targ.nodeType == 3) // defeat Safari bug
			targ = targ.parentNode;
		if ((targ.nodeName == "INPUT") || (targ.nodeName == "TEXTAREA"))
			return true;
		return false;
	}
	function addID(){		
		$("#speedLinks a").each(function(index){ //Recorremos el div y por cada elemento que tenga etiqueta <a></a>, se agregar� un id, en este caso ser� "speed_button_0" ... "speed_button_9"							
			$(this).attr("id","speed_button_"+index);
		});
	}
	
	function simulateMouseClick (selector)
	{
		function eventFire (el, etype)
		{
			if (el.fireEvent)
			{
				el.fireEvent ('on' + etype);
				el [etype] ();
			}
			else
			{
				var evObj = document.createEvent ('Events');
				evObj.initEvent (etype, true, false);
				el.dispatchEvent (evObj);
			}
		}
		for (var i = 0; i < selector.length; i++)
			eventFire (selector [i], "click");
	}
	function topWindow ()
	{
		var windowIndex = -1;
		var maxZIndex = 0;
		$ ("div.ui-dialog").each (function (index)
		{
			var zIndex = parseInt ($ (this).css ("z-index"));
			if (zIndex > maxZIndex)
			{
				maxZIndex = zIndex;
				windowIndex = index;
			}
		});
		return (windowIndex < 0) ? null : $ ("div.ui-dialog").eq (windowIndex);
	}
	var oldVersion = false;
	var oVersion = document.getElementsByName ("ogame-version");
	if (oVersion && (oVersion.length > 0))
	{
		var versionParts = oVersion [0].content.split (".");
		if (parseInt (versionParts [0]) < 2)
			oldVersion = true;
		else if ((parseInt (versionParts [0]) == 2) && (parseInt (versionParts [1]) < 3))
			oldVersion = true;
	}
	else
		oldVersion = true;
	if (oldVersion)
	{
		rewind      = "rewind.gif";
		fastforward = "fastforward.gif";
		skip        = "skip.gif";
		skipback    = "skip-back.gif";
	}
	else
	{
		rewind      = "3488b556496631d9eec3ce15b768f9.gif";
		fastforward = "dcebd689a4e760f779a1a1b1ab0584.gif";
		skip        = "a6c5c6838009102254ec50807be663.gif";
		skipback    = "c1246af2584e9696edd7111a0d9418.gif";
	}
	if (theHref.indexOf ("/game/index.php?page=showmessage") >= 0)
	{
		$ (document).ready (function ()
		{
			setTimeout (function ()
			{
				$ ("#2,#4").focus ();
				$ ("#2,#4").blur ();
				$ (document).keydown (function (e)
				{
					if (badTarget (e))
						return;
					switch (e.keyCode)
					{
						case 27:	// Esc
							simulateMouseClick ($ (".closeTB"));
							var sl = window.parent.document.documentElement.scrollLeft;
							var st = window.parent.document.documentElement.scrollTop;
							$ ("a:visible:first", window.parent.document).focus ();
							window.parent.scrollTo (sl, st);
							return false;
							break;
						case 37:	// <-
							if ($ ("#contentPageNavi").find ("img").eq (1).attr ("src").indexOf (rewind) > -1)
								window.location = $ ("#contentPageNavi").find ("a:nth-child(2)").attr ("href");
							return false;
							break;
						case 39:	// ->
							if ($ ("#contentPageNavi").find ("img").eq (2).attr ("src").indexOf (fastforward) > -1)
								window.location = $ ("#contentPageNavi").find ("a:nth-child(5)").attr ("href");
							return false;
							break;
						case 46:	// Del
							if ($ ("#2").length > 0)
								simulateMouseClick ($ ("#2"));
							else
								simulateMouseClick ($ ("#4"));
							return false;
							break;
					}
				});
			}, 200);
		});
		return;
	}
	else if (theHref.indexOf ("page=jumpgatelayer") > -1)
	{
		$ (document).ready (function ()
		{
			setTimeout (function ()
			{
				$ ("div#jumpgate a").eq (0).focus ();
				$ ("div#jumpgate a").eq (0).blur ();
				$ (document).keydown (function (e)
				{
					switch (e.keyCode)
					{
						
						case 65:	// "a"
							if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)
								break;
							simulateMouseClick ($ ("#sendall"));
							return false;
							break;
						case 78:	// "n"
							if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)
								break;
							simulateMouseClick ($ ("span.send_none a"));
							return false;
							break;
						case 27:	// Esc
							simulateMouseClick ($ ("a.close_details"));
							var sl = window.parent.document.documentElement.scrollLeft;
							var st = window.parent.document.documentElement.scrollTop;
							$ ("a:visible:first", window.parent.document).focus ();
							window.parent.scrollTo (sl, st);
							return false;
							break;
					}
				});
			}, 200);
		});
		return;
	}
	else if (theHref.indexOf ("page=phalanx") >= 0)
	{
		$ (document).ready (function ()
		{
			setTimeout (function ()
			{
				$ ("div#phalanxWrap a,close_details").eq (0).focus ();
				$ ("div#phalanxWrap a,close_details").eq (0).blur ();
				$ (document).keydown (function (e)
				{
					switch (e.keyCode)
					{
						case 27:	// Esc
							simulateMouseClick ($ ("a.close_details"));
							var sl = window.parent.document.documentElement.scrollLeft;
							var st = window.parent.document.documentElement.scrollTop;
							$ ("a:visible:first", window.parent.document).focus ();
							window.parent.scrollTo (sl, st);
							return false;
							break;
					}
				});
			}, 200);
		});
		return;
	}
	$ (document).keydown (function (e)
	{
		if (($ ("div").is ("#anti_options_window")) ||
		    (($ ("div").is ("#TB_window") ||
		      $ ("div").is ("#mo_inputs") ||
		      $ ("div").is (".answerForm") ||
		      $ ("form").is ("#searchForm") ||
		      $ ("form").is ("#planetMaintenance") ||
		      $ ("div").is ("#buddyRequest") ||
		      $ ("div").is (".buddyRequest") ||
		      $ ("body").is ("#writemessage") ||
		      $ ("div").is (".note") ||
		      $ ("div").is (".col") ||
		      $ ("table").is (".createnote") ||
		      $ ("body").is ("#search") ||
		      $ ("body").is ("#showmessage") ||
					$ ("textarea").is (".new_msg_textarea") || /*Agregada por Ivan para que los accesos directos no funcionen en los campos de texto en la p�gina de chat, comunicaci�n de la alianza*/
					$ ("textarea").is (".chat_box_textarea") || /*Agregada por Ivan para que los accesos directos no funcionen en las peque�as ventanas de chat (cuando se tiene la barra de chat activa)*/
					$ ("input").is ("#uv_q_input") || /*Agregada por Ivan para que los accesos directos no funcionen en el campo de busqueda del Universe View*/
					$ ("input").is ("#ago_menu_D62") || /*Agregada por Ivan para que los accesos directos no funcionen en el campo de nombre de respaldo de las opciones de AntiGame*/
		      ($ ("div").is ("#VLN_addevent") && ($ ("#VLN_addevent").css ("display") != "none")) ||
		      ($ ("#anti_win").css ("display") == "block") ||
		      (theHref.indexOf ("/game/index.php?page=alliance") >= 0) ||
		      (theHref.indexOf ("/game/index.php?page=networkkommunikation") >= 0) ||
		      (theHref.indexOf ("/game/index.php?page=preferences") >= 0)) && badTarget (e)))
			return;
		switch (e.keyCode)
		{
			case 8:		// Backspace
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey &&
				    ((theHref.indexOf ("/game/index.php?page=fleet2") > -1) ||
				     (theHref.indexOf ("/game/index.php?page=fleet3") > -1)))
				{
					simulateMouseClick ($ ("#back"));
					return false;
				}
				break;
			case 13:	// Enter
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (theHref.indexOf ("/game/index.php?page=traderOverview") >= 0)
				{
					if (($ ("#div_traderAuctioneer").length > 0) && ($ ("#div_traderAuctioneer").css ("display") != "none"))
					{
						simulateMouseClick ($ ("#div_traderAuctioneer .pay"));
						return false;
					}
					else if (($ ("#div_traderImportExport").length > 0) && ($ ("#div_traderImportExport").css ("display") != "none"))
					{
						if ($ ("#div_traderImportExport div.bargain_overlay").css ("display") != "none")
							simulateMouseClick ($ ("#div_traderImportExport .take"));
						else
							simulateMouseClick ($ ("#div_traderImportExport .pay"));
						return false;
					}
				}
				break;
			case 27:	// Esc
				if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (theHref.indexOf ("/game/index.php?page=fleet1") >= 0)
				{
					if ($ ("a.close_details").length > 0)
					{
						simulateMouseClick ($ ("a.close_details"));
						var sl = window.parent.document.documentElement.scrollLeft;
						var st = window.parent.document.documentElement.scrollTop;
						$ ("a:visible:first", window.parent.document).focus ();
						window.parent.scrollTo (sl, st);
						return false;
					}
				}
				else if ($ ("span.ui-icon-closethick").length > 0)
				{
					var element = topWindow ();
					if (element)
					{
						simulateMouseClick (element.find ("span.ui-icon-closethick"));
						return false;
					}
				} else if(theHref.indexOf("/game/index.php?page=fleet2") >= 0){ /*Abrir lista de eventos en Page Dispatch II*/
					simulateMouseClick ($ ("#eventboxFilled"));
				} else {
					simulateMouseClick ( $(".icon_close") ); /*Cierra ventanas de chat (cuando barra de chat est� activada)*/
				}
				break;
			case 33:	// PgUp
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey && (theHref.indexOf ("/game/index.php?page=messages") > -1))
				{
					/*Doesn't work in v6.0.0 | No funciona en v6.0.0*/
				}
				break;
			case 34:	// PgDown
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey && (theHref.indexOf ("/game/index.php?page=messages") > -1))
				{
					/*Doesn't work in v6.0.0 | No funciona en v6.0.0*/
				}
				break;
			case 35:	// End
				if (e.altKey)
					break;
				if (e.shiftKey)
				{
					var planetLinks = $ (".planetlink,.moonlink");
					window.location = planetLinks [planetLinks.length - 1].href;
					return false;
				}
				if (e.ctrlKey && (theHref.indexOf ("/game/index.php?page=messages") > -1))
				{
					/*Doesn't work in v6.0.0 | No funciona en v6.0.0*/
				}
				break;
			case 36:	// Home
				if (e.altKey)
					break;
				if (e.shiftKey)
				{
					window.location = $ (".planetlink,.moonlink").eq (0).attr ("href");
					return false;
				}
				if (e.ctrlKey && (theHref.indexOf ("/game/index.php?page=messages") > -1))
				{
					/*Doesn't work in v6.0.0 | No funciona en v6.0.0*/
				}
				break;
				
			case 38:	// UpArrow
			case 40:	// DownArrow
				if (e.ctrlKey)
				{
					var activeMoon = -1;
					$ (".moonlink").each (function (index)
					{
						if ($ (this).attr ("class").indexOf ("active") >= 0)
						{
							activeMoon = index;
							return false;
						}
					});
					if (activeMoon >= 0)
					{
						var moonLinks = $ (".moonlink");
						var numMoons = moonLinks.length;
						if (numMoons < 2)
							break;
						window.location = moonLinks [((e.keyCode == 38) ? (activeMoon + numMoons - 1) : (activeMoon + 1)) % numMoons].href;
						return false;
					}
					else
					{
						var planetLinks = $ (".planetlink");
						var numPlanets = planetLinks.length;
						if (numPlanets < 2)
							break;
						var activePlanet = planetLinks.index ($ (".planetlink.active"));
						if (activePlanet >= 0)
						{
							window.location = planetLinks [((e.keyCode == 38) ? (activePlanet + numPlanets - 1) : (activePlanet + 1)) % numPlanets].href;
							return false;
						}
					}
				}
				else if (e.shiftKey)
				{
					var leftMenu = $ ("#menuTable li a.menubutton");
					var numButtons = leftMenu.length;
					var activeButton = leftMenu.index ($ (".selected"));
					if (activeButton >= 0)
					{
						window.location = leftMenu [((e.keyCode == 38) ? (activeButton + numButtons - 1) : (activeButton + 1)) % numButtons].href;
						return false;
					}
				}
				break;
			case 37:	// "<-"
			case 39:	// "->"
				if (e.altKey || (badTarget (e) && (theHref.indexOf ("page=fleet3") >= 0)))
					break;
				if (e.shiftKey)
				{
					var planetLinks = $ (".planetlink,.moonlink");
					var numPlanets = planetLinks.length;
					if (numPlanets < 2)
						break;
					var activePlanet = planetLinks.index ($ ("#planetList .active"));
					if (activePlanet >= 0)
					{
						window.location = planetLinks [((e.keyCode == 37) ? (activePlanet + numPlanets - 1) : (activePlanet + 1)) % numPlanets].href;
						return false;
					}
				}
				else if (e.ctrlKey)
				{
					$ (".planetlink,.moonlink").each (function ()
					{
						if ($ (this).hasClass ("active"))
						{
							if ($ (this).hasClass ("moonlink"))
								window.location = $ ("#planetList .active").prev ().attr ("href");
							else
							{
								if ($ (this).next ().hasClass ("moonlink"))
									window.location = $ (this).next ().attr ("href");
							}
							return false;
						}
					});
					return false;
				}
				else
				{
					if (theHref.indexOf ("/game/index.php?page=statistics") >= 0)
					{
						var myDiv = $ ("div#paging").eq (0);
						var myA = myDiv.find ("a");
						if (myA.length == 2)
							simulateMouseClick (myA.eq ((e.keyCode == 37) ? 0 : 1));
						else
						{
							if (myDiv.get (0).children [0].tagName.toLowerCase () == "span")
							{
								if (e.keyCode == 39)
									simulateMouseClick (myA);
							}
							else
							{
								if (e.keyCode == 37)
									simulateMouseClick (myA);
							}
						}
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=highscore") >= 0)
					{
						if (e.keyCode == 37)
							simulateMouseClick ($ ("span.activePager").prev ());
						else
							simulateMouseClick ($ ("span.activePager").next ());
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=messages") >= 0)
					{
						/*Doesn't work in v6.0.0 | No funciona en v6.0.0*/
					}
				}
				break;
			case 46:	// Del
				if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (theHref.indexOf ("/game/index.php?page=messages") > -1)
				{
					simulateMouseClick( $(".trash_action") ); /*modificada por ivan*/
				}
				break;
			case 65:	// "a"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						simulateMouseClick ($ ("#missionButton1"));
						return false;
					}
				}
				else
				{
					if ($ ("#sendall").length)
					{
						simulateMouseClick ($ ("#sendall"));
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						simulateMouseClick ($ ("#allresources"));
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=messages") > -1)
					{
						/*Doesn't work in v6.0.0 | No funciona en v6.0.0*/
					}
				}
				break;
			case 66:	// "b"
				if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)
					break;
				//simulateMouseClick ($ ("div#bar a[href*='page=buddies']"));
				window.location = $ ("a[href*='page=buddies']").attr ("href");
				return false;
				break;
			case 67:	// "c"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if ($ ("a[href*='openJumpgate=1']").length > 0)
						window.location = $ ("a[href*='openJumpgate=1']").attr ("href");
					else if ($ ("a[href*='openJumpgate']").length > 0)
						unsafe.openJumpgate ();
				}
				else
				{					
					if ($ ("a[href*='openJumpgate=1']").length > 0)
						window.location = $ ("a[href*='page=station']").eq (1).attr ("href");
					else
						window.location = $ ("a[href*='page=station']").eq (0).attr ("href");
					
				}
				return false;
				break;
			case 68:	// "d"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet2") >= 0)
					{
						simulateMouseClick ($ ("#dbutton"));
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=fleet3") >= 0)
					{
						if ($ ("#deuterium").val () == 0)
							simulateMouseClick ($ ("a.max").eq (2));
						else
							simulateMouseClick ($ ("a.min").eq (2));
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=traderOverview") > -1)
					{
						if (($ ("#div_traderAuctioneer").length > 0) && ($ ("#div_traderAuctioneer").css ("display") != "none"))
						{
							simulateMouseClick ($ ("#div_traderAuctioneer .js_sliderDeuteriumMax"));
							return false;
						}
						else if (($ ("#div_traderImportExport").length > 0) && ($ ("#div_traderImportExport").css ("display") != "none"))
						{
							simulateMouseClick ($ ("#div_traderImportExport .js_sliderDeuteriumMax"));
							return false;
						}
					}
				}
				else
				{
					window.location = $ ("a[href*='page=defense'].menubutton").attr ("href");
					return false;
				}
				break;
			case 69:	// "e"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet2") >= 0)
					{
						$ ("#position").val (16).keyup ();
						simulateMouseClick ($ ("#pbutton"));
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						simulateMouseClick ($ ("#missionButton15"));
						return false;
					}
					else if( theHref.indexOf("/game/index.php?page=fleet1") > -1 ) {
						window.location = $ ("a[href*='page=research'].menubutton").attr ("href");
					}
				} else if( theHref.indexOf("/game/index.php?page=fleet1") > -1 ) {
					/* Deactivate shortucut when you are in fleet1 | Desactiva atajo en pagina de fleet1*/
				}
				else
				{
					window.location = $ ("a[href*='page=research'].menubutton").attr ("href");
					return false;
				}
				break;
			case 70:	// "f"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
					window.location = $ ("a[href*='page=movement']").attr ("href");
				else {
					if (theHref.indexOf ("/game/index.php?page=fleet1") > -1){
					/*Para que el atajo se desactive en el menu de la flota*/
					} else 
						window.location = $ ("a[href*='page=fleet1'].menubutton").attr ("href");
				}
				return false;
				break;
			case 71:	// "g"
				if (e.ctrlKey || e.metaKey)
					break;
				if (e.altKey) /* Open Antigame Options*/
				{
					simulateMouseClick ( $("#ago_menubutton") );
					return false;
				}
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet2") > -1)
					{
						$ ("#galaxy").focus ();
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=galaxy") > -1)
					{
						$ ("#galaxy_input").focus ();
						return false;
					}
				}
				else
				{
					window.location = $ ("a[href*='page=galaxy'].menubutton").attr ("href");
					return false;
				}
				break;
			case 72:	// "h"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						simulateMouseClick ($ ("#missionButton8"));
						return false;
					}
				}
				else
					simulateMouseClick ($ ("a[href*='page=search']"));
				return false;
				break;
			case 73:	// "i"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						simulateMouseClick ($ ("#missionButton6"));
						return false;
					}
				} else {
					window.location = "http://s110-mx.ogame.gameforge.com/game/index.php?page=overview&infocompte=scriptOptions";
					return false;
				}
				break;
			case 75:	// "k"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (theHref.indexOf ("/game/index.php?page=fleet3") >= 0)
				{
					if (e.shiftKey)
					{
						if ($ ("#crystal").val () == 0)
							simulateMouseClick ($ ("a.max").eq (1));
						else
							simulateMouseClick ($ ("a.min").eq (1));
						return false;
					}
					if (theHref.indexOf ("/game/index.php?page=fleet1") > -1) { /* Select Attack Mision Routine (AntiGame) | Selecciona Mision Atacar (con Antigame)*/
						simulateMouseClick	( $("#ago_routine_3") );
						return false;
					}
					else
					{
						var value = parseInt ($ ("input#metal").val ().replace (/\D/g, ""));
						value = 10000 * Math.floor (value / 10000);
						$ ("input#metal").val (value).keyup ();
						value = parseInt ($ ("input#crystal").val ().replace (/\D/g, ""));
						value = 10000 * Math.floor (value / 10000);
						$ ("input#crystal").val (value).keyup ();
						simulateMouseClick ($ ("a.max").eq (2));
						value = parseInt ($ ("input#deuterium").val ().replace (/\D/g, ""));
						if (value > 20000)
							value -= 20000;
						value = 10000 * Math.floor (value / 10000);
						$ ("input#deuterium").val (value).keyup ();
						return false;
					}
				}
				else if ((theHref.indexOf ("/game/index.php?page=traderOverview") >= 0) && e.shiftKey)
				{
					if (($ ("#div_traderAuctioneer").length > 0) && ($ ("#div_traderAuctioneer").css ("display") != "none"))
					{
						simulateMouseClick ($ ("#div_traderAuctioneer .js_sliderCrystalMax"));
						return false;
					}
					else if (($ ("#div_traderImportExport").length > 0) && ($ ("#div_traderImportExport").css ("display") != "none"))
					{
						simulateMouseClick ($ ("#div_traderImportExport .js_sliderCrystalMax"));
						return false;
					}
				}
				else if ((theHref.indexOf ("/game/index.php?page=fleet1") >= 0) && e.shiftKey)
				{
					simulateMouseClick ($ (e.target).prev ().children (0));
					var value = $ (e.target).val ();
					value = 100 * Math.floor (value / 100);
					$ (e.target).val (value).keyup ();
					return false;
				}
				else if (! e.shiftKey)
				{
					if ($ ("a[href*='page=statistics']").length > 0)
						window.location = $ ("a[href*='page=statistics']").attr ("href");
					else
						window.location = $ ("a[href*='page=highscore']").attr ("href");
					return false;
				}
				break;
			case 76:	// "l"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
					window.location = $ ("a[href*='page=alliance&tab=broadcast']").attr ("href");
				else
					window.location = $ ("a[href*='page=alliance'].menubutton").attr ("href");
				return false;
				break;
			case 77:	// "m"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet2") > -1)
					{
						simulateMouseClick ($ ("#mbutton"))
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						if ($ ("#metal").val () == 0)
							simulateMouseClick ($ ("a.max").eq (0));
						else
							simulateMouseClick ($ ("a.min").eq (0));
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=traderOverview") > -1)
					{
						if (($ ("#div_traderAuctioneer").length > 0) && ($ ("#div_traderAuctioneer").css ("display") != "none"))
						{
							simulateMouseClick ($ ("#div_traderAuctioneer .js_sliderMetalMax"));
							return false;
						}
						else if (($ ("#div_traderImportExport").length > 0) && ($ ("#div_traderImportExport").css ("display") != "none"))
						{
							simulateMouseClick ($ ("#div_traderImportExport .js_sliderMetalMax"));
							return false;
						}
					} else
						window.location = $ (".comm_menu.chat").attr ("href");
				}
				else
				{
					/*if ($ ("#message_alert_box_default").length > 0)
						window.location = $ ("#message_alert_box_default").attr ("href");
					else
						window.location = $ ("#message_alert_box").attr ("href");*/
						window.location = $ (".comm_menu").attr ("href");
					return false;
				}
				break;
			case 78:	// "n"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						simulateMouseClick ($ ("#missionButton5"));
						return false;
					}
				}
				else
				{
					//if (theHref.indexOf ("/game/index.php?page=fleet1") > -1)
					if ($ ("span.send_none > a").length > 0)
					{
						simulateMouseClick ($ ("span.send_none > a"));
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						simulateMouseClick ($ ("a.min"));
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=messages") > -1)
					{
						if ($ ("#checkAll").length > 0)
							$ (".checker").attr ("checked", false);
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=movement") > -1)
					{
						simulateMouseClick ($ (".reload").children ("a"));
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=traderOverview") >= 0)
					{
						if ($ ("#div_traderAuctioneer").css ("display") != "none")
						{
							unsafe.traderObj.resetValues ("#div_traderAuctioneer");
							return false;
						}
						else if ($ ("#div_traderImportExport").css ("display") != "none")
						{
							unsafe.traderObj.resetValues ("#div_traderImportExport");
							return false;
						}
					}
				}
				break;
			case 79:	// "o"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=fleet2") > -1) {
						$("#position").focus();
						return false;
					} else
						simulateMouseClick ($ ("#eventboxFilled"));
				} else
					window.location = $ ("a[href*='page=overview'].menubutton").attr ("href");
				return false;
				break;
			case 80:	// "p"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet2") > -1)
					{
						simulateMouseClick ($ ("#pbutton"));
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						simulateMouseClick ($ ("#missionButton4"));
						return false;
					}
				}
				else
				{
					if (theHref.indexOf ("/game/index.php?page=movement") > -1)
					{
						simulateMouseClick ($ (".closeAll").children ("a"));
						return false;
					}
				}
				break;
			case 82:	// "r"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if( theHref.indexOf("/game/index.php?page=fleet1") > -1 ) {
					 	window.location = $ ("a[href*='page=resources'].menubutton").attr ("href");
					} else
					    window.location = $ ("a[href*='page=resourceSettings']").attr ("href");
				} else {					
				  if (theHref.indexOf ("/game/index.php?page=fleet1") > -1){
					/*Para que el atajo se desactive en el menu de la flota*/
					} else 
						window.location = $ ("a[href*='page=resources'].menubutton").attr ("href");
				}
				return false;
				break;
			case 83:	// "s"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						simulateMouseClick ($ ("#missionButton2"));
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=fleet2") > -1)
					{
						$ ("#system").focus ();
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=galaxy") > -1)
					{
						$ ("#system_input").focus ();
						return false;
					}
					else if( theHref.indexOf ("/game/index.php?page=fleet1") > -1 ) {
						window.location = $ ("a[href*='page=shipyard'].menubutton").attr ("href");
					}
				} else if( theHref.indexOf ("/game/index.php?page=fleet1") > -1 ) {
					/* Deactivate shortucut when you are in fleet1 | Desactiva atajo en pagina de fleet1*/
				}
				else
					window.location = $ ("a[href*='page=shipyard'].menubutton").attr ("href");
				return false;
				break;
			case 84:	// "t"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						simulateMouseClick ($ ("#missionButton3"));
						return false;				
					} else if (theHref.indexOf ("/game/index.php?page=fleet1") > -1)
							window.location = $ ("a[href*='page=traderOverview'].menubutton").attr ("href") + "#page=traderImportExport";
					else
						window.location = $ ("a[href*='page=traderOverview'].menubutton").attr ("href") + "#page=traderAuctioneer";
				} else if (theHref.indexOf ("/game/index.php?page=fleet1") > -1){
					/* Deactivate shortucut when you are in fleet1 | Desactiva atajo en pagina de fleet1*/
				}	else
					window.location = $ ("a[href*='page=traderOverview'].menubutton").attr ("href") + "#page=traderImportExport";
				return false;
				break;
			case 85: // "u"
				if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)
					break;
				simulateMouseClick( $("#ago_routine_10") );
				break;
			case 86:	// "v"
				if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
				{
					simulateMouseClick ($ ("a.min"));
					simulateMouseClick ($ ("a.max").eq (2));
					simulateMouseClick ($ ("a.max").eq (1));
					simulateMouseClick ($ ("a.max").eq (0));
					return false;
				}
				else if (theHref.indexOf ("/game/index.php?page=messages") > -1)
				{
					$ ("td .checker").each (function ()
					{
						$ (this).attr ("checked", ! $ (this).attr ("checked"));
					});
					return false;
				}
				break;
			case 87: // "w"
				if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)
					break;
				if ( theHref.indexOf ("/game/index.php?page=fleet1") > -1 ) {
						simulateMouseClick( $("#ago_routine_3") );
						return false;
				}
				break;
			case 89:	// "y"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						simulateMouseClick ($ ("#missionButton9"));
						return false;
					}
				}
				break;
			case 90:	// "z"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						simulateMouseClick ($ ("#missionButton7"));
						return false;
					}
				}
				break;
			case 49:	// "1"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet2") > -1)
					{					
						addID();
						simulateMouseClick( $("#speed_button_0") );
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						if ($ ("input[name=mission]").val () == "15")
						{
							$ ("#expeditiontimeline select").val ("1").change ();
							$ ("#expeditiontimeline a").attr ("data-value", "1").text ("1");
							return false;
						}
						else if ($ ("input[name=mission]").val () == "5")
						{
							$ ("#holdtimeline select").val ("1").change ();
							$ ("#holdtimeline a").attr ("data-value", "1").text ("1");
							return false;
						}
					} 
					if( theHref.indexOf("game/index.php?page=messages&tab=2&ajax=1") ) { /* Fleets | Flotas */
						simulateMouseClick( $("#ui-id-41") ); /* Spionage | Espionaje */
					} 
					if( theHref.indexOf("game/index.php?page=messages&tab=1&ajax=1") ) { /* Communication | Comunicaci�n */
						simulateMouseClick( $("#ui-id-53") ); /* Messages | Comunicados */
					}
				} else { /*Lines added by Ivan |A partir de aqu�, lineas agregadas por Ivan*/
					if ( theHref.indexOf("/game/index.php?page=messages") > -1 ){
						simulateMouseClick( $(".tb_fleets") );
					}
				}
				break;
			case 50:	// "2"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet2") > -1)
					{
						addID();						
						simulateMouseClick( $("#speed_button_1") );
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						if ($ ("input[name=mission]").val () == "15")
						{
							$ ("#expeditiontimeline select").val ("2").change ();
							$ ("#expeditiontimeline a").attr ("data-value", "2").text ("2");
							return false;
						}
						else if ($ ("input[name=mission]").val () == "5")
						{
							$ ("#holdtimeline select").val ("2").change ();
							$ ("#holdtimeline a").attr ("data-value", "2").text ("2");
							return false;
						}
					} 
					if( theHref.indexOf("game/index.php?page=messages&tab=2&ajax=1") ) { /* Fleets | Flotas */
						simulateMouseClick( $("#ui-id-43") ); /* Combat Reports | Informes de batalla */
					} 
					if( theHref.indexOf("game/index.php?page=messages&tab=1&ajax=1") ) { /* Communication | Comunicaci�n */
						simulateMouseClick( $("#ui-id-55") ); /* Information | Informaci�n */
					}
				} else { /*Lines added by Ivan |A partir de aqu�, lineas agregadas por Ivan*/
					if ( theHref.indexOf("/game/index.php?page=messages") > -1 ){
						simulateMouseClick( $(".tb_communication") );
					}
				}
				break;
			case 51:	// "3"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet2") > -1)
					{			
						addID();
						
						simulateMouseClick( $("#speed_button_2") );
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						if ($ ("input[name=mission]").val () == "15")
						{
							$ ("#expeditiontimeline select").val ("3").change ();
							$ ("#expeditiontimeline a").attr ("data-value", "3").text ("3");
							return false;
						}
						else if ($ ("input[name=mission]").val () == "5")
						{
							$ ("#holdtimeline select").val ("4").change ();
							$ ("#holdtimeline a").attr ("data-value", "4").text ("4");
							return false;
						}
					} 
					if( theHref.indexOf("game/index.php?page=messages&tab=2&ajax=1") ) { /* Fleets | Flotas */
						simulateMouseClick( $("#ui-id-45") ); /* Expeditions | Expediciones */
					} 
					if( theHref.indexOf("game/index.php?page=messages&tab=1&ajax=1") ) { /* Communication | Comunicaci�n */
						simulateMouseClick( $("#ui-id-57") ); /* Shared Combat Reports | Inf. batalla compartidos */
					}
				} else { /*Lines added by Ivan |A partir de aqu�, lineas agregadas por Ivan*/
					if ( theHref.indexOf("/game/index.php?page=messages") > -1 ){
						simulateMouseClick( $(".tb_economy") );
					}
				}
				break;
			case 52:	// "4"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet2") > -1)
					{			
						addID();
						
						simulateMouseClick( $("#speed_button_3") );
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						if ($ ("input[name=mission]").val () == "15")
						{
							$ ("#expeditiontimeline select").val ("4").change ();
							$ ("#expeditiontimeline a").attr ("data-value", "4").text ("4");
							return false;
						}
						else if ($ ("input[name=mission]").val () == "5")
						{
							$ ("#holdtimeline select").val ("8").change ();
							$ ("#holdtimeline a").attr ("data-value", "8").text ("8");
							return false;
						}
					} 
					if( theHref.indexOf("game/index.php?page=messages&tab=2&ajax=1") ) { /* Fleets | Flotas */
						simulateMouseClick( $("#ui-id-47") ); /* Unions | Confederaciones */
					} 
					if( theHref.indexOf("game/index.php?page=messages&tab=1&ajax=1") ) { /* Communication | Comunicaci�n */
						simulateMouseClick( $("#ui-id-59") ); /* Shared Sionage Reports | Inf. espionaje compartidos */
					}
				} else { /*Lines added by Ivan |A partir de aqu�, lineas agregadas por Ivan*/
					if ( theHref.indexOf("/game/index.php?page=messages") > -1 ){
						simulateMouseClick( $(".tb_universe") );
					}
				}
				break;
			case 53:	// "5"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet2") > -1)
					{			
						addID();
						
						simulateMouseClick( $("#speed_button_4") );
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						if ($ ("input[name=mission]").val () == "15")
						{
							$ ("#expeditiontimeline select").val ("5").change ();
							$ ("#expeditiontimeline a").attr ("data-value", "5").text ("5");
							return false;
						}
						else if ($ ("input[name=mission]").val () == "5")
						{
							$ ("#holdtimeline select").val ("16").change ();
							$ ("#holdtimeline a").attr ("data-value", "16").text ("16");
							return false;
						}
					} 
					if( theHref.indexOf("game/index.php?page=messages&tab=2&ajax=1") ) { /* Fleets | Flotas */
						simulateMouseClick( $("#ui-id-49") ); /* Other | Otros */
					}
					if( theHref.indexOf("game/index.php?page=messages&tab=1&ajax=1") ) { /* Communication | Comunicaci�n */
						simulateMouseClick( $("#ui-id-61") ); /* Expeditions | Expediciones */
					}
				} else { /*Lines added by Ivan |A partir de aqu�, lineas agregadas por Ivan*/
					if ( theHref.indexOf("/game/index.php?page=messages") > -1 ){
						simulateMouseClick( $(".tb_system") );
					}
				}
				break;
			case 54:	// "6"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet2") > -1)
					{			
						addID();
						
						simulateMouseClick( $("#speed_button_5") );
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						if ($ ("input[name=mission]").val () == "15")
						{
							$ ("#expeditiontimeline select").val ("6").change ();
							$ ("#expeditiontimeline a").attr ("data-value", "6").text ("6");
							return false;
						}
						else if ($ ("input[name=mission]").val () == "5")
						{
							$ ("#holdtimeline select").val ("32").change ();
							$ ("#holdtimeline a").attr ("data-value", "32").text ("32");
							return false;
						}
					}
				} else { /*Lines added by Ivan |A partir de aqu�, lineas agregadas por Ivan*/
					if ( theHref.indexOf("/game/index.php?page=messages") > -1 ){
						simulateMouseClick( $(".tb_favorites") );
					}
				}
				break;
			case 55:	// "7"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet2") > -1)
					{			
						addID();
						
						simulateMouseClick( $("#speed_button_6") );
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						if ($ ("input[name=mission]").val () == "15")
						{
							$ ("#expeditiontimeline select").val ("7").change ();
							$ ("#expeditiontimeline a").attr ("data-value", "7").text ("7");
							return false;
						}
					}
				}
				break;
			case 56:	// "8"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet2") > -1)
					{
						addID();
						
						simulateMouseClick( $("#speed_button_7") );
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						if ($ ("input[name=mission]").val () == "15")
						{
							$ ("#expeditiontimeline select").val ("8").change ();
							$ ("#expeditiontimeline a").attr ("data-value", "8").text ("8");
							return false;
						}
					}
				}
				break;
			case 57:	// "9"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet2") > -1)
					{
						addID();
						
						simulateMouseClick( $("#speed_button_8") );
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						if ($ ("input[name=mission]").val () == "15")
						{
							$ ("#expeditiontimeline select").val ("9").change ();
							$ ("#expeditiontimeline a").attr ("data-value", "9").text ("9");
							return false;
						}
					}
				}
				break;
			case 48:	// "0"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
				{
					if (theHref.indexOf ("/game/index.php?page=fleet2") > -1)
					{
						addID();
						
						simulateMouseClick( $("#speed_button_9") );
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=fleet3") > -1)
					{
						if ($ ("input[name=mission]").val () == "15")
						{
							$ ("#expeditiontimeline select").val ("10").change ();
							$ ("#expeditiontimeline a").attr ("data-value", "10").text ("10");
							return false;
						}
						else if ($ ("input[name=mission]").val () == "5")
						{
							$ ("#holdtimeline select").val ("0").change ();
							$ ("#holdtimeline a").attr ("data-value", "0").text ("0");
							return false;
						}
					}
				}
				break;
		}
		return true;
	});
}) ();
