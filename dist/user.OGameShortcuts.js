// ==UserScript==
// @name           OGame Redesign: Keyboard Shortcuts
// @description    Assigns keyboard shortcuts to various game functions | Fixes for v8.7.0
// @namespace      Vesselin | Modified by JBWKZ2099
// @version        3.2
// @date           2012-12-14
// @author         Vesselin Bontchev
// @include        *://*.ogame.gameforge.com/game/index.php?*
// @exclude        *://*.ogame.gameforge.com/game/index.php?page=notices*
// @exclude        *://*.ogame.gameforge.com/game/index.php?page=combatreport*
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
				$ (document).keydown (function (e) {
					if (badTarget (e))
						return;
					switch (e.keyCode) {
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
	else if (theHref.indexOf ("page=phalanx") >= 0)
	{
		$ (document).ready (function ()
		{
			setTimeout (function ()
			{
				$ ("div#phalanxWrap a,close_details").eq (0).focus ();
				$ ("div#phalanxWrap a,close_details").eq (0).blur ();
				$ (document).keydown (function (e) {
					switch (e.keyCode) {
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
		// console.log("%cShortcuts Info: %c"+e.keyCode, "color:lime", "color:white");

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
          $("body").find(".chat_bar_list_item").is(".open") ||
          $("body").find("#communicationTab ul > li:first-child").is(".ui-tabs-active") ||
          $(document).find("#allianceBroadCast > div:first-child").is(":visible") ||
          $(document).find("#allyRanks").is(":visible") ||
          $(document).find("#allyText").is(":visible") ||
          $(document).find("#allySettings").is(":visible") ||
          $(document).find("#allyNameTage").is(":visible") ||
          $(document).find("#allyRanks").is(":visible") ||
          $(document).find("#allyRanks").is(":visible") ||
          $(document).find(".new_msg_textarea.markItUpEditor").is(":focus") ||
          $(document).find("input.textinput").is(":focus") ||
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
				if (e.shiftKey && (theHref.indexOf("/game/index.php?page=ingame&component=fleetdispatch")>-1) ) {
					if( $("#fleet2").is(":visible") )
						simulateMouseClick ($ ("#backToFleet1"));
					return false;
				}
				break;
			case 13:	// Enter
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (theHref.indexOf ("/game/index.php?page=ingame&component=traderOverview") >= 0) {
					if (($ ("#div_traderAuctioneer").length > 0) && ($ ("#div_traderAuctioneer").css ("display") != "none")) {
						simulateMouseClick ($ ("#div_traderAuctioneer .pay"));
						return false;
					}
					else if (($ ("#div_traderImportExport").length > 0) && ($ ("#div_traderImportExport").css ("display") != "none")) {
						if ($ ("#div_traderImportExport div.bargain_overlay").css ("display") != "none")
							simulateMouseClick ($ ("#div_traderImportExport .take"));
						else
							simulateMouseClick ($ ("#div_traderImportExport .pay"));
						return false;
					}
				} else if( theHref.indexOf("page=ingame&component=fleetdispatch") ) {
					if( $("#fleet2").is(":visible") ) {
						simulateMouseClick( $("#sendFleet") );
					}
				}
				break;
			case 27:	// Esc
				if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)
					break;

				if( $(".overlayDiv #jumpgate").length>0 ) {
					simulateMouseClick( $(".overlayDiv a.close_details") );
					var sl = window.parent.document.documentElement.scrollLeft;
					var st = window.parent.document.documentElement.scrollTop;
					$ ("a:visible:first", window.parent.document).focus ();
					window.parent.scrollTo (sl, st);
					return false;
				} else {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") >= 0) {
						if( $("#zeuch666").is(":visible") ) {
							simulateMouseClick( $("#ui-dialog-titlebar > button.ui-dialog-titlebar-close") );
							return false;
						} else if ($ ("a.close_details").length > 0) {
							simulateMouseClick ($ ("a.close_details"));
							var sl = window.parent.document.documentElement.scrollLeft;
							var st = window.parent.document.documentElement.scrollTop;
							$ ("a:visible:first", window.parent.document).focus ();
							window.parent.scrollTo (sl, st);
							return false;
						}
					} else if ($ ("span.ui-icon-closethick").length > 0) {
						var element = topWindow ();
						if (element) {
							simulateMouseClick (element.find ("span.ui-icon-closethick"));
							return false;
						}
					}
				}
				break;
			case 33:	// PgUp
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey && (theHref.indexOf ("/game/index.php?page=messages") > -1)) {
					if ($ ("img[src*='" + rewind + "']").length)
						simulateMouseClick ($ ("img[src*='" + rewind + "']").parent ());
					else
						simulateMouseClick ($ ("span.icon_rewind").parent ());
					return false;
				}
				break;
			case 34:	// PgDown
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey && (theHref.indexOf ("/game/index.php?page=messages") > -1)) {
					if ($ ("img[src*='" + fastforward + "']").length)
						simulateMouseClick ($ ("img[src*='" + fastforward + "']").parent ());
					else
						simulateMouseClick ($ ("span.icon_fastforward").parent ());
					return false;
				}
				break;
			case 35:	// End
				if (e.altKey)
					break;
				if (e.shiftKey) {
					var planetLinks = $ (".planetlink,.moonlink");
					window.location = planetLinks [planetLinks.length - 1].href;
					return false;
				}
				if (e.ctrlKey && (theHref.indexOf ("/game/index.php?page=messages") > -1)) {
					if ($ ("img[src*='" + skip + "']").length)
						simulateMouseClick ($ ("img[src*='" + skip + "']").parent ());
					else
						simulateMouseClick ($ ("span.icon_skip").parent ());
					return false;
				}
				break;
			case 36:	// Home
				if (e.altKey)
					break;
				if (e.shiftKey) {
					window.location = $ (".planetlink,.moonlink").eq (0).attr ("href");
					return false;
				}
				if (e.ctrlKey && (theHref.indexOf ("/game/index.php?page=messages") > -1)) {
					if ($ ("img[src*='" + skipback + "']").length)
						simulateMouseClick ($ ("img[src*='" + skipback + "']").parent ());
					else
						simulateMouseClick ($ ("span.icon_skip_back").parent ());
					return false;
				}
				break;

			case 38:	// UpArrow
			case 40:	// DownArrow
				if (e.ctrlKey) {
					var activeMoon = -1;
					$ (".moonlink").each (function (index) {
						if ($ (this).attr ("class").indexOf ("active") >= 0)
						{
							activeMoon = index;
							return false;
						}
					});
					if (activeMoon >= 0) {
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
				} else if (e.shiftKey) {
					var leftMenu = $ ("#menuTable li a.menubutton");
					var numButtons = leftMenu.length;
					var activeButton = leftMenu.index ($ (".selected"));
					if (activeButton >= 0) {
						window.location = leftMenu [((e.keyCode == 38) ? (activeButton + numButtons - 1) : (activeButton + 1)) % numButtons].href;
						return false;
					}
				}
				break;
			case 37:	// "<-"
			case 39:	// "->"
				if (e.altKey || (badTarget (e) && (theHref.indexOf ("page=fleet3") >= 0)))
					break;
				if (e.shiftKey) {
					var planetLinks = $ (".planetlink,.moonlink");
					var numPlanets = planetLinks.length;
					if (numPlanets < 2)
						break;
					var activePlanet = planetLinks.index ($ ("#planetList .active"));
					if (activePlanet >= 0) {
						window.location = planetLinks [((e.keyCode == 37) ? (activePlanet + numPlanets - 1) : (activePlanet + 1)) % numPlanets].href;
						return false;
					}
				} else if (e.ctrlKey) {
					$ (".planetlink,.moonlink").each (function () {
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
					if (theHref.indexOf ("/game/index.php?page=statistics") >= 0) {
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
					else if (theHref.indexOf ("/game/index.php?page=highscore") >= 0) {
						if (e.keyCode == 37)
							simulateMouseClick ($ ("span.activePager").prev ());
						else
							simulateMouseClick ($ ("span.activePager").next ());
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=messages") >= 0) {
						var element = topWindow ();
						if (element == null)
							return false;
						element = element.find ((e.keyCode == 39) ? "span.icon_fastforward" : "span.icon_rewind");
						if (element.length > 0)
						{
							simulateMouseClick (element.parent ());
							return false;
						}
					}
				}
				break;
			case 46:	// Del
				if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (theHref.indexOf ("/game/index.php?page=messages") > -1) {
					simulateMouseClick( $(".trash_action") ); /*modificada por ivan*/
				}
				break;
			case 65:	// "a"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") )
							simulateMouseClick ($ ("#missionButton1"));
						return false;
					}
				}
				else {
					if( $(".overlayDiv #jumpgate").length>0 ) {
						simulateMouseClick( $(".overlayDiv #sendall") );
						return false;
					} else if( $("#sendall").is(":visible") ) {
						if( !$("#fleet2").is(":visible") )
							simulateMouseClick ($ ("#sendall"));
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							simulateMouseClick ($ ("#allresources"));
						}
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=messages") > -1) {
						if ($ ("#checkAll").length > 0)
							$ (".checker").attr ("checked", true);
						return false;
					}
				}
				break;
			case 66:	// "b"
				if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)
					break;

				// simulateMouseClick ($ ("div#bar a[href*='page=ingame&component=buddies']"));
				lang_server = `https://${theHref.split(".ogame")[0].split("https://")[1]}`;
				buddies_href = `${lang_server}.ogame${theHref.split(".ogame")[1].split("/index.php")[0]}/index.php?page=ingame&component=buddies`;
				location.href = buddies_href;
				return false;

				break;
			case 67:	// "c"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if ($ ("a[href*='openJumpgate=1']").length > 0)
						window.location = $ ("a[href*='openJumpgate=1']").attr ("href");
					else if ($ ("a[href*='openJumpgate']").length > 0)
						unsafe.openJumpgate ();
				}
				else
				{
					if ($ ("a[href*='openJumpgate=1']").length > 0)
						window.location = $ ("a[href*='page=ingame&component=facilities']").eq (1).attr ("href");
					else
						window.location = $ ("a[href*='page=ingame&component=facilities']").eq (0).attr ("href");
				}
				return false;
				break;
			case 68:	// "d"
				if (e.ctrlKey || e.metaKey)
					break;

				if( e.altKey ) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						simulateMouseClick ($ ("#dbutton"))
						return false;
					}
				} else if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") >= 0) {
						if( $("#fleet2").is(":visible") ) {
							if ($ ("#deuterium").val () == 0)
								simulateMouseClick ($ ("a.max").eq (2));
							else
								simulateMouseClick ($ ("a.min").eq (2));
							return false;
						}
					}
					else if (theHref.indexOf ("/game/index.php?page=ingame&component=traderOverview") > -1) {
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
					window.location = $ ("a[href*='page=ingame&component=defenses'].menubutton").attr ("href");
					return false;
				}
				break;
			case 69:	// "e"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;

				if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							$ ("#position").val (16).keyup ();
							simulateMouseClick ($ ("#pbutton"));
							simulateMouseClick ($ ("#missionButton15"));
							return false;
						}
					}
				}
				else {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( !$("#fleet2").is(":visible") ) {
							simulateMouseClick ($ ("#ago_routine_7"));
							return false;
						}
					} else {
						window.location = $ ("a[href*='page=ingame&component=research'].menubutton").attr ("href");
						return false;
					}
				}
				break;
			case 70:	// "f"
				if (e.ctrlKey || e.metaKey)
					break;

				if( e.altKey ) {
					simulateMouseClick( $("#combatunits") );
					return false;
				} else if (e.shiftKey)
					window.location = $ ("a[href*='page=ingame&component=movement']").attr ("href");
				else {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( !$("#fleet2").is(":visible") ) {
							simulateMouseClick ($ ("#ago_routine_6"));
							return false;
						}
					} else {
						window.location = $ ("a[href*='page=ingame&component=fleetdispatch'].menubutton").attr ("href");
						return false;
					}
				}
				break;
			case 71:	// "g"
				if (e.ctrlKey || e.metaKey)
					break;
				if (e.altKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						$ ("#galaxy").focus ();
						return false;
					}
				} else if (e.shiftKey) {
					/*if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						$ ("#galaxy").focus ();
						return false;
					}
					else*/ if (theHref.indexOf ("/game/index.php?page=ingame&component=galaxy") > -1) {
						$ ("#galaxy_input").focus ();
						return false;
					}
				}
				else
				{
					window.location = $ ("a[href*='page=ingame&component=galaxy'].menubutton").attr ("href");
					return false;
				}
				break;
			case 72:	// "h"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							simulateMouseClick ($ ("#missionButton8"));
							return false;
						}
					}
				}
				else
					simulateMouseClick ($ ("a[href*='page=ingame&component=search']"));
				return false;
				break;
			case 73:	// "i"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							simulateMouseClick ($ ("#missionButton6"));
							return false;
						}
					}
				}
				break;
			case 75:	// "k"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") >= 0) {
					if (e.shiftKey) {
						if( $("#fleet2").is(":visible") ) {
							if ($ ("#crystal").val () == 0)
								simulateMouseClick ($ ("a.max").eq (1));
							else
								simulateMouseClick ($ ("a.min").eq (1));
							return false;
						}
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
				} else if ((theHref.indexOf ("/game/index.php?page=ingame&component=traderOverview") >= 0) && e.shiftKey) {
					if (($ ("#div_traderAuctioneer").length > 0) && ($ ("#div_traderAuctioneer").css ("display") != "none")) {
						simulateMouseClick ($ ("#div_traderAuctioneer .js_sliderCrystalMax"));
						return false;
					}
					else if (($ ("#div_traderImportExport").length > 0) && ($ ("#div_traderImportExport").css ("display") != "none")) {
						simulateMouseClick ($ ("#div_traderImportExport .js_sliderCrystalMax"));
						return false;
					}
				} else if ((theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") >= 0) && e.shiftKey) {
					simulateMouseClick ($ (e.target).prev ().children (0));
					var value = $ (e.target).val ();
					value = 100 * Math.floor (value / 100);
					$ (e.target).val (value).keyup ();
					return false;
				} else if (! e.shiftKey) {
					if ($ ("a[href*='page=ingame&component=statistics']").length > 0)
						window.location = $ ("a[href*='page=ingame&component=statistics']").attr ("href");
					else
						window.location = $ ("a[href*='page=highscore']").attr ("href");
					return false;
				}
				break;
			case 76:	// "l"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey)
					window.location = $ ("a[href*='page=ingame&component=alliance&tab=broadcast']").attr ("href");
				else {
					if( theHref.indexOf("/game/index.php?page=ingame&component=fleetdispatch")<=0 )
						window.location = $ ("a[href*='page=ingame&component=alliance'].menubutton").attr ("href");
				}
				return false;
				break;
			case 77:	// "m"
				if (e.ctrlKey || e.metaKey)
					break;
				if( e.altKey ) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						simulateMouseClick ($ ("#mbutton"))
						return false;
					}
				} else if (e.shiftKey) {
					/*if (theHref.indexOf ("/game/index.php?page=fleet2") > -1) {
						simulateMouseClick ($ ("#mbutton"))
						return false;
					}
					else*/ if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							if ($ ("#metal").val () == 0)
								simulateMouseClick ($ ("a.max").eq (0));
							else
								simulateMouseClick ($ ("a.min").eq (0));
							return false;
						}
					}
					else if (theHref.indexOf ("/game/index.php?page=ingame&component=traderOverview") > -1) {
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
					}
				}
				else
				{
					if( $(".comm_menu.messages").length>0 )
						location.href = $(".comm_menu.messages").attr("href");
					return false;
				}
				break;
			case 78:	// "n"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							simulateMouseClick ($ ("#missionButton5"));
							return false;
						}
					}
				}
				else
				{
					//if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1)
					if( $(".overlayDiv #jumpgate").length>0 ) {
						simulateMouseClick( $(".overlayDiv span.send_none a") );
						return false;
					} else if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							simulateMouseClick ($ ("a.min"));
							return false;
						} else {
							if ($ ("span.send_none > a").length > 0) {
								simulateMouseClick ($ ("span.send_none > a"));
								return false;
							}
						}
					}
					else if (theHref.indexOf ("/game/index.php?page=messages") > -1) {
						if ($ ("#checkAll").length > 0)
							$ (".checker").attr ("checked", false);
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=ingame&component=movement") > -1) {
						simulateMouseClick ($ (".reload").children ("a"));
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=ingame&component=traderOverview") >= 0) {
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
				if (e.ctrlKey || e.metaKey)
					break;
				if (e.altKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						$ ("#position").focus ();
						return false;
					}
				} else if (e.shiftKey)
					simulateMouseClick ($ ("#eventboxFilled"));
				else
					window.location = $ ("a[href*='page=ingame&component=overview'].menubutton").attr ("href");
				return false;
				break;
			case 80:	// "p"
				if (e.ctrlKey || e.metaKey)
					break;
				if( e.altKey ) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						simulateMouseClick ($ ("#pbutton"))
						return false;
					}
				} else if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=fleet2") > -1) {
						simulateMouseClick ($ ("#pbutton"));
						return false;
					}
					else if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							simulateMouseClick ($ ("#missionButton4"));
							return false;
						}
					}
				}
				else
				{
					if (theHref.indexOf ("/game/index.php?page=ingame&component=movement") > -1) {
						simulateMouseClick ($ (".closeAll").children ("a"));
						return false;
					}
				}
				break;
			case 82:	// "r"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						window.location = $ ("a[href*='page=ingame&component=supplies'].menubutton").attr ("href");
						return false;
					} else {
						window.location = $ ("a[href*='page=ingame&component=resourceSettings']").attr ("href") ?? $ ("a[href*='page=ingame&component=resourcesettings']").attr ("href");
						return false;
					}
				} else {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( !$("#fleet2").is(":visible") ) {
							simulateMouseClick ($ ("#ago_routine_4"));
							return false;
						}
					} else
						window.location = $ ("a[href*='page=ingame&component=supplies'].menubutton").attr ("href");
						return false;
				}
				break;
			case 83:	// "s"
				if (e.ctrlKey || e.metaKey)
					break;
				if( e.altKey ) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						window.location = $ ("a[href*='page=ingame&component=shipyard'].menubutton").attr ("href");
						return false;
					}
				} else if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1)
					{
						if( $("#fleet2").is(":visible") ) {
							simulateMouseClick ($ ("#missionButton2"));
							return false;
						}
					}
					/*else if (theHref.indexOf ("/game/index.php?page=fleet2") > -1)
					{
						$ ("#system").focus ();
						return false;
					}*/
					else if (theHref.indexOf ("/game/index.php?page=ingame&component=galaxy") > -1)
					{
						$ ("#system_input").focus ();
						return false;
					}
				}
				else {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( !$("#fleet2").is(":visible") ) {
							simulateMouseClick ($ ("#ago_routine_5"));
							return false;
						}
					} else {
						window.location = $ ("a[href*='page=ingame&component=shipyard'].menubutton").attr ("href");
						return false;
					}
				}
				break;
			case 84:	// "t"
				if (e.ctrlKey || e.metaKey)
					break;
				if (e.altKey) {
					window.location = $ ("a[href*='page=ingame&component=traderOverview'].menubutton").attr ("href") + "#page=traderImportExport";
				} else if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							simulateMouseClick ($ ("#missionButton3"));
							return false;
						}
					}
				}
				else {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( !$("#fleet2").is(":visible") ) {
							simulateMouseClick ($ ("#ago_routine_2"));
							return false;
						}
					} else
						window.location = $ ("a[href*='page=ingame&component=traderOverview'].menubutton").attr ("href") + "#page=traderImportExport";
				}
				return false;
				break;
			case 85:  // "u"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
					if( !$("#fleet2").is(":visible") ) {
						simulateMouseClick ($ ("#ago_routine_10"));
						return false;
					}
				}
				break;
			case 86:	// "v"
				if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
					if( $("#fleet2").is(":visible") ) {
						simulateMouseClick ($ ("a.min"));
						simulateMouseClick ($ ("a.max").eq (2));
						simulateMouseClick ($ ("a.max").eq (1));
						simulateMouseClick ($ ("a.max").eq (0));
						return false;
					}
				} else if (theHref.indexOf ("/game/index.php?page=messages") > -1) {
					$ ("td .checker").each (function () {
						$ (this).attr ("checked", ! $ (this).attr ("checked"));
					});
					return false;
				}
				break;
			case 87:  // "w"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
					if( !$("#fleet2").is(":visible") ) {
						simulateMouseClick ($ ("#ago_routine_3"));
						return false;
					}
				}
				break;
			case 89:	// "y"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							simulateMouseClick ($ ("#missionButton9"));
							return false;
						}
					}
				}
				break;
			case 90:	// "z"
				if (e.ctrlKey || e.altKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							simulateMouseClick ($ ("#missionButton7"));
							return false;
						}
					}
				}
				break;
			case 49:	// "1"
				if (e.ctrlKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							$("#speedPercentage div.step").removeClass("selected");
							simulateMouseClick( $("#speedPercentage div.step[data-step='1']") );
							$("#speedPercentage div.step[data-step='1']").addClass("selected");
							$("#speedPercentage .bar").width(60);
							$ ("#speed").val ("1").change ();
							$ ("span.speed a").attr ("data-value", "1").text ("10");
							return false;
						}
					}
					if( theHref.indexOf("game/index.php?page=messages") ) {
						if( $("#tabs-nfFleets").hasClass("ui-tabs-active") ) { /* Fleets | Flotas */
							simulateMouseClick( $("#subtabs-nfFleet20 > a") ); /* Spionage | Espionaje */
							return false;
						}
						if( $("#tabs-nfCommunication").hasClass("ui-tabs-active") ) { /* Communication | Comunicación */
							simulateMouseClick( $("#subtabs-nfCommunication10 > a") ); /* Messages | Comunicados */
							return false;
						}
					}
				} else if( e.altKey ) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1 ) {
						if( $("#fleet2").is(":visible") && (!$("#galaxy").is(":focus") || !$("#system").is(":focus") || !$("#position").is(":focus")) ) {
							if( $("#missionButton15").hasClass("selected") ) {
								$ ("#expeditiontimeline select").val ("1").change ();
								$ ("#expeditiontimeline a").attr ("data-value", "1").text ("1");
								return false;
							}
							else if( $("#missionButton5").hasClass("selected") ) {
								$ ("#holdtimeline select").val ("0").change ();
								$ ("#holdtimeline a").attr ("data-value", "0").text ("0");
								return false;
							}
						}
					}
				} else {
					if( theHref.indexOf("/game/index.php?page=messages") > -1 ) {
						simulateMouseClick( $(".tb_fleets") );
						return false;
					}
				}
				break;
			case 50:	// "2"
				if (e.ctrlKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							$("#speedPercentage div.step").removeClass("selected");
							simulateMouseClick( $("#speedPercentage div.step[data-step='2']") );
							$("#speedPercentage div.step[data-step='2']").addClass("selected");
							$("#speedPercentage .bar").width(120);
							$ ("#speed").val ("2").change ();
							$ ("span.speed a").attr ("data-value", "2").text ("20");
							return false;
						}
					}
					if( theHref.indexOf("game/index.php?page=messages") ) {
						if( $("#tabs-nfFleets").hasClass("ui-tabs-active") ) { /* Fleets | Flotas */
							simulateMouseClick( $("#subtabs-nfFleet21 > a") ); /* Combat Reports | Informes de batalla */
							return false;
						}
						if( $("#tabs-nfCommunication").hasClass("ui-tabs-active") ) { /* Communication | Comunicación */
							simulateMouseClick( $("#subtabs-nfCommunication14 > a") ); /* Information | Información */
							return false;
						}
					}
				} else if( e.altKey ) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1 ) {
						if( $("#fleet2").is(":visible") && (!$("#galaxy").is(":focus") || !$("#system").is(":focus") || !$("#position").is(":focus")) ) {
							if( $("#missionButton15").hasClass("selected") ) {
								$ ("#expeditiontimeline select").val ("2").change ();
								$ ("#expeditiontimeline a").attr ("data-value", "2").text ("2");
								return false;
							}
							else if( $("#missionButton5").hasClass("selected") ) {
								$ ("#holdtimeline select").val ("1").change ();
								$ ("#holdtimeline a").attr ("data-value", "1").text ("1");
								return false;
							}
						}
					}
				} else {
					if( theHref.indexOf("/game/index.php?page=messages") > -1 ) {
						simulateMouseClick( $(".tb_communication") );
						return false;
					}
				}
				break;
			case 51:	// "3"
				if (e.ctrlKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							$("#speedPercentage div.step").removeClass("selected");
							simulateMouseClick( $("#speedPercentage div.step[data-step='3']") );
							$("#speedPercentage div.step[data-step='3']").addClass("selected");
							$("#speedPercentage .bar").width(180);
							$ ("#speed").val ("3").change ();
							$ ("span.speed a").attr ("data-value", "3").text ("30");
							return false;
						}
					}
					if( theHref.indexOf("game/index.php?page=messages") ) {
						if( $("#tabs-nfFleets").hasClass("ui-tabs-active") ) { /* Fleets | Flotas */
							simulateMouseClick( $("#subtabs-nfFleet22 > a") ); /* Expeditions | Expediciones */
							return false;
						}
						if( $("#tabs-nfCommunication").hasClass("ui-tabs-active") ) { /* Communication | Comunicación */
							simulateMouseClick( $("#subtabs-nfCommunication12 > a") ); /* Shared Combat Reports | Inf. Batalla Compartidos */
							return false;
						}
					}
				} else if( e.altKey ) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1 ) {
						if( $("#fleet2").is(":visible") && (!$("#galaxy").is(":focus") || !$("#system").is(":focus") || !$("#position").is(":focus")) ) {
							if( $("#missionButton15").hasClass("selected") ) {
								$ ("#expeditiontimeline select").val ("3").change ();
								$ ("#expeditiontimeline a").attr ("data-value", "3").text ("3");
								return false;
							}
							else if( $("#missionButton5").hasClass("selected") ) {
								$ ("#holdtimeline select").val ("2").change ();
								$ ("#holdtimeline a").attr ("data-value", "2").text ("2");
								return false;
							}
						}
					}
				} else {
					if( theHref.indexOf("/game/index.php?page=messages") > -1 ) {
						simulateMouseClick( $(".tb_economy") );
						return false;
					}
				}
				break;
			case 52:	// "4"
				if (e.ctrlKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							$("#speedPercentage div.step").removeClass("selected");
							simulateMouseClick( $("#speedPercentage div.step[data-step='4']") );
							$("#speedPercentage div.step[data-step='4']").addClass("selected");
							$("#speedPercentage .bar").width(240);
							$ ("#speed").val ("4").change ();
							$ ("span.speed a").attr ("data-value", "4").text ("40");
							return false;
						}
					}
					if( theHref.indexOf("game/index.php?page=messages") ) {
						if( $("#tabs-nfFleets").hasClass("ui-tabs-active") ) { /* Fleets | Flotas */
							simulateMouseClick( $("#subtabs-nfFleet23 > a") ); /* Transports | Transporte / Uniones */
							return false;
						}
						if( $("#tabs-nfCommunication").hasClass("ui-tabs-active") ) { /* Communication | Comunicación */
							simulateMouseClick( $("#subtabs-nfCommunication11 > a") ); /* Shared Espionage Reports | Inf. Espionaje Compartidos */
							return false;
						}
					}
				} else if( e.altKey ) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1 ) {
						if( $("#fleet2").is(":visible") && (!$("#galaxy").is(":focus") || !$("#system").is(":focus") || !$("#position").is(":focus")) ) {
							if( $("#missionButton15").hasClass("selected") ) {
								$ ("#expeditiontimeline select").val ("4").change ();
								$ ("#expeditiontimeline a").attr ("data-value", "4").text ("4");
								return false;
							}
							else if( $("#missionButton5").hasClass("selected") ) {
								$ ("#holdtimeline select").val ("4").change ();
								$ ("#holdtimeline a").attr ("data-value", "4").text ("4");
								return false;
							}
						}
					}
				} else {
					if( theHref.indexOf("/game/index.php?page=messages") > -1 ) {
						simulateMouseClick( $(".tb_universe") );
						return false;
					}
				}
				break;
			case 53:	// "5"
				if (e.ctrlKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							$("#speedPercentage div.step").removeClass("selected");
							simulateMouseClick( $("#speedPercentage div.step[data-step='5']") );
							$("#speedPercentage div.step[data-step='5']").addClass("selected");
							$("#speedPercentage .bar").width(300);
							$ ("#speed").val ("5").change ();
							$ ("span.speed a").attr ("data-value", "5").text ("50");
							return false;
						}
					}
					if( theHref.indexOf("game/index.php?page=messages") ) {
						if( $("#tabs-nfFleets").hasClass("ui-tabs-active") ) { /* Fleets | Flotas */
							simulateMouseClick( $("#subtabs-nfFleet24 > a") ); /* Others | Otro */
							return false;
						}
						if( $("#tabs-nfCommunication").hasClass("ui-tabs-active") ) { /* Communication | Comunicación */
							simulateMouseClick( $("#subtabs-nfCommunication13 > a") ); /* Expeditions | Expediciones */
							return false;
						}
					}
				} else if( e.altKey ) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1 ) {
						if( $("#fleet2").is(":visible") && (!$("#galaxy").is(":focus") || !$("#system").is(":focus") || !$("#position").is(":focus")) ) {
							if( $("#missionButton15").hasClass("selected") ) {
								$ ("#expeditiontimeline select").val ("5").change ();
								$ ("#expeditiontimeline a").attr ("data-value", "5").text ("5");
								return false;
							}
							else if( $("#missionButton5").hasClass("selected") ) {
								$ ("#holdtimeline select").val ("8").change ();
								$ ("#holdtimeline a").attr ("data-value", "8").text ("8");
								return false;
							}
						}
					}
				} else {
					if( theHref.indexOf("/game/index.php?page=messages") > -1 ) {
						simulateMouseClick( $(".tb_system") );
						return false;
					}
				}
				break;
			case 54:	// "6"
				if (e.ctrlKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							$("#speedPercentage div.step").removeClass("selected");
							simulateMouseClick( $("#speedPercentage div.step[data-step='6']") );
							$("#speedPercentage div.step[data-step='6']").addClass("selected");
							$("#speedPercentage .bar").width(360);
							$ ("#speed").val ("6").change ();
							$ ("span.speed a").attr ("data-value", "6").text ("60");
							return false;
						}
					}
				} else if( e.altKey ) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1 ) {
						if( $("#fleet2").is(":visible") && (!$("#galaxy").is(":focus") || !$("#system").is(":focus") || !$("#position").is(":focus")) ) {
							if( $("#missionButton15").hasClass("selected") ) {
								$ ("#expeditiontimeline select").val ("6").change ();
								$ ("#expeditiontimeline a").attr ("data-value", "6").text ("6");
								return false;
							}
							else if( $("#missionButton5").hasClass("selected") ) {
								$ ("#holdtimeline select").val ("16").change ();
								$ ("#holdtimeline a").attr ("data-value", "16").text ("16");
								return false;
							}
						}
					}
				} else {
					if( theHref.indexOf("/game/index.php?page=messages") > -1 ) {
						simulateMouseClick( $(".tb_favorites") );
						return false;
					}
				}
				break;
			case 55:	// "7"
				if (e.ctrlKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							$("#speedPercentage div.step").removeClass("selected");
							simulateMouseClick( $("#speedPercentage div.step[data-step='7']") );
							$("#speedPercentage div.step[data-step='7']").addClass("selected");
							$("#speedPercentage .bar").width(420);
							$ ("#speed").val ("7").change ();
							$ ("span.speed a").attr ("data-value", "7").text ("70");
							return false;
						}
					}
				} else if( e.altKey ) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1 ) {
						if( $("#fleet2").is(":visible") && (!$("#galaxy").is(":focus") || !$("#system").is(":focus") || !$("#position").is(":focus")) ) {
							if( $("#missionButton15").hasClass("selected") ) {
								$ ("#expeditiontimeline select").val ("7").change ();
								$ ("#expeditiontimeline a").attr ("data-value", "7").text ("7");
								return false;
							}
							else if( $("#missionButton5").hasClass("selected") ) {
								$ ("#holdtimeline select").val ("32").change ();
								$ ("#holdtimeline a").attr ("data-value", "32").text ("32");
								return false;
							}
						}
					}
				}
				break;
			case 56:	// "8"
				if (e.ctrlKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							$("#speedPercentage div.step").removeClass("selected");
							simulateMouseClick( $("#speedPercentage div.step[data-step='8']") );
							$("#speedPercentage div.step[data-step='8']").addClass("selected");
							$("#speedPercentage .bar").width(480);
							$ ("#speed").val ("8").change ();
							$ ("span.speed a").attr ("data-value", "8").text ("80");
							return false;
						}
					}
				} else if( e.altKey ) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1 ) {
						if( $("#fleet2").is(":visible") && (!$("#galaxy").is(":focus") || !$("#system").is(":focus") || !$("#position").is(":focus")) ) {
							if( $("#missionButton15").hasClass("selected") ) {
								$ ("#expeditiontimeline select").val ("8").change ();
								$ ("#expeditiontimeline a").attr ("data-value", "8").text ("8");
								return false;
							}
						}
					}
				}
				break;
			case 57:	// "9"
				if (e.ctrlKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							$("#speedPercentage div.step").removeClass("selected");
							simulateMouseClick( $("#speedPercentage div.step[data-step='9']") );
							$("#speedPercentage div.step[data-step='9']").addClass("selected");
							$("#speedPercentage .bar").width(540);
							$ ("#speed").val ("9").change ();
							$ ("span.speed a").attr ("data-value", "9").text ("90");
							return false;
						}
					}
				} else if( e.altKey ) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1 ) {
						if( $("#fleet2").is(":visible") && (!$("#galaxy").is(":focus") || !$("#system").is(":focus") || !$("#position").is(":focus")) ) {
							if( $("#missionButton15").hasClass("selected") ) {
								$ ("#expeditiontimeline select").val ("9").change ();
								$ ("#expeditiontimeline a").attr ("data-value", "9").text ("9");
								return false;
							}
						}
					}
				}
				break;
			case 48:	// "0"
				if (e.ctrlKey || e.metaKey)
					break;
				if (e.shiftKey) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1) {
						if( $("#fleet2").is(":visible") ) {
							$("#speedPercentage div.step").removeClass("selected");
							simulateMouseClick( $("#speedPercentage div.step[data-step='10']") );
							$("#speedPercentage div.step[data-step='10']").addClass("selected");
							$("#speedPercentage .bar").width(600);
							$ ("#speed").val ("10").change ();
							$ ("span.speed a").attr ("data-value", "10").text ("100");
							return false;
						}
					}
				} else if( e.altKey ) {
					if (theHref.indexOf ("/game/index.php?page=ingame&component=fleetdispatch") > -1 ) {
						if( $("#fleet2").is(":visible") && (!$("#galaxy").is(":focus") || !$("#system").is(":focus") || !$("#position").is(":focus")) ) {
							if( $("#missionButton15").hasClass("selected") ) {
								$ ("#expeditiontimeline select").val ("10").change ();
								$ ("#expeditiontimeline a").attr ("data-value", "10").text ("10");
								return false;
							}
						}
					}
				}
				break;
		}
		return true;
	});
}) ();
