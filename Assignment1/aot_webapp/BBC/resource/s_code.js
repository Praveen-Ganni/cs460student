/* SiteCatalyst code version: H.22.1.
Copyright 1996-2010 Adobe, Inc. All Rights Reserved
More info available at http://www.omniture.com */

/*
 * Version: 1.7.7
 */
//var s_account = "bbcwglobaldev"
if("undefined" == typeof(s_account)) {
    var s_account = "bbcwglobalprod";
}
var scw=s_gi(s_account);

/************************** CONFIG SECTION **************************/
/* You may add or alter any code config here. */
scw.charSet="ISO-8859-1";
/* Conversion Config */
scw.currencyCode="USD";
/* Link Tracking Config */
scw.trackDownloadLinks=true;
scw.trackExternalLinks=true;
scw.trackInlineStats=true;
scw.linkDownloadFileTypes="exe,zip,wav,mp3,mov,mpg,avi,wmv,doc,pdf,xls";
scw.linkInternalFilters="javascript:,bbc.com,bbc.co.uk";
scw.linkLeaveQueryString=false;
scw.linkTrackVars="None";
scw.linkTrackEvents="None";

scw.setYear = function() {
    var now = new Date(),
        year = now.getYear();
    return (year < 1900) ? year + 1900 : year;
}

/* Time Parting Config */
scw.dstStart = "3/28/2010";
scw.dstEnd = "10/31/2010";
scw.currentYear = scw.setYear();

/* Channel Manager Configuration */
scw._extraSearchEngines="";
scw._channelDomain = "Facebook|facebook.com>Twitter|twitter.com>YouTube|youtube.com>LinkedIn|linkedin.com>MySpace|myspace.com>Other Social Media|digg.com,flickr.com,stumbleupon.com,del.icio.us,reddit.com,metacafe.com,technorati.com";
scw._channelParameter = "";
scw._channelPattern = "";

/* Hierarchy Section Rules */
/*
 * DO NOT USE ANYMORE VAR BELOW
 * define any page specific var in scw.page
 */
var h1 = "";
var h2 = "";
var h3 = "";
var h4 = "";
var url = "";
var hArray;
var hLength;
var newUrl = "";
var contentIdMatch;
//string sequence starting with a - or _, followed by 7 - 8 digits, followed by a non digit or EOL
var reStandardContentId = new RegExp("([0-9]{7,8})([^0-9]|$)");
var reNewsContentId = new RegExp("(-)([0-9]{7,8})([^0-9]|$)");

/*
 * USE THIS to define any page specific vars
 */
scw.page  = {
    domain: ('undefined' != typeof(document.domain)) ? document.domain : '',
    title: ('undefined' != typeof(document.title)) ? document.title : '',
    url: ('undefined' != typeof(document.URL)) ? document.URL : 'http://www.bbc.com/'
}

var videoOnPage = false;
gloader.load(["glow","1","glow.dom"],{
    onLoad: function(glow){
        slot = glow.dom.get('.emp');
        if(0 < slot.length) {
            videoOnPage = true;
        }
    }
});

var dmn = document.domain;
var search = /\./g;
for(var xyz=0; search.exec(dmn); ++xyz);
scw.cookieDomainPeriods=xyz;
scw.fpCookieDomainPeriods=scw.cookieDomainPeriods;

/* Custom Page Views event */
scw.events = "event2";

scw.usePlugins = true
function s_doPlugins(scw) {
    /* Add calls to plugins here */

    /* Hierarchy Section Rules */
    scw.evaluateUrl(scw.page.url);
    scw.channel = scw.prop6;

    /* Meta tag capture */
    if (document.getElementsByName) {

        //Page Name variable
        //Strip the dynamic nature of travel and search plus pagename - BBCCOM-688
        scw.pageName = scw.page.title;
        if (0 == scw.page.title.indexOf('BBC iPlayer (Global)')) {
            scw.pageName = scw.page.title.replace('BBC iPlayer (Global) - ', 'bbc gip | ');
            scw.channel = 'gip';
        } else if (0 == scw.page.title.indexOf('BBC - Travel - Search')) {
            scw.pageName = 'BBC - Travel - Search';
            scw.events = scw.apl(scw.events, "event1", ",", 1);
            scw.prop1 = scw.page.title.split('BBC - Travel - Search : ')[1];
            scw.eVar1 = scw.prop1;
        } else if (0 == scw.page.title.indexOf('BBC - Search results for ')) {
            scw.pageName = 'BBC - Search';
            scw.events = scw.apl(scw.events, "event1", ",", 1);
            scw.prop1 = scw.page.title.split('BBC - Search results for ')[1];
            scw.eVar1 = scw.prop1;
        } else if (0 == scw.page.title.indexOf('BBC - Homepage')){
            var bodyClass = document.getElementsByTagName('body')[0].className;
            if(-1 != bodyClass.indexOf('nofeeds')){
                scw.pageName = scw.page.title = '- nofeeds';
            }
            else if(-1 != bodyClass.indexOf('obituary')){
                scw.pageName = scw.page.title + ' - obituary';
            }
            else if(-1 != bodyClass.indexOf('publicservice')){
                scw.pageName = scw.page.title = ' - public service';
            }
        } else if (scw.pageIsOlderThan365Days()) {
             scw.pageName = 'BBC ' + scw.channel + ' - Archive';
        }
        scw.pageName = scw.pageName.replace(/ - /g, ' | ').toLowerCase();
        scw.eVar2 = scw.pageName;

        scw.hier1 = scw.page.title.replace(/ - /g, '|').toLowerCase();
        if ("undefined" != typeof BBC && "undefined" != typeof BBC.adverts && "undefined" != typeof BBC.adverts.getSectionPath) {
            var sectionPath = BBC.adverts.getSectionPath().replace(/\//g, '|');
            if(1 === sectionPath.indexOf('future')) {
                scw.hier2 = sectionPath.replace(/sections|/, '');
            } else {
                scw.hier2 = sectionPath;
            }
        } else {
            scw.sectionPath = window.location.pathname.replace('2/hi', 'news'); // Flip news
            scw.sectionPath = scw.sectionPath.replace('sport2/hi', 'sport'); // Flip sport
            scw.sectionPath = scw.sectionPath.replace('sport/0', 'sport'); // Flip new sport refresh
            scw.sectionPath = scw.sectionPath.replace(/\/+[0-9]*.([a-z])*$/g, ''); // Remove / from the end of the link
            scw.hier2 = scw.sectionPath.substring(1).replace(/\//g, '|');
        }

        /* Hier3
         * Cookie will be in the following format
         * elsewhere|news|business|/news/13505966|story|Living in... Croatia|hero|content|/travel/feature/20110
         */
        scw.bbcwObjectID = scw.getCookie('BBCW-OBJECTID');
        if(scw.bbcwObjectID) {
            scw.hier3 = scw.bbcwObjectID;
        }

        //prop3
        var metaArray = document.getElementsByName('Headline');
        for (var i = 0; i < metaArray.length; i++) {
            scw.prop3 = metaArray[i].content;
            scw.eVar3 = scw.prop3;
        }

        //prop4
        var metaArray = document.getElementsByName('CPS_ID');
        for (var i = 0; i < metaArray.length; i++) {
            scw.prop4 = metaArray[i].content;
            scw.eVar4 = scw.prop4;
        }

        //prop5
        scw.prop5 = 'NOT AVAILABLE';
        if ("undefined" != typeof bbc &&
            "undefined" != typeof bbc.fmtj &&
            "undefined" != typeof bbc.fmtj.page &&
            "undefined" != typeof bbc.fmtj.page.assetType &&
            "media_asset" == bbc.fmtj.page.assetType ) {
            scw.prop5 = 'VIDEO';
        } else if(videoOnPage) {
            scw.prop5 = 'STORY-VIDEO';
        } else {
            var metaArray = document.getElementsByName('contentFlavor');
            for (var i = 0; i < metaArray.length; i++) {
                if('' != metaArray[i].content) {
                scw.prop5 = metaArray[i].content.toUpperCase();
            } else {
                scw.prop5 = 'EMPTY';
            }
            }
        }
        scw.eVar5 = scw.prop5;

        //prop10
        var createdDate = document.getElementsByName('OriginalPublicationDate');
        if(0 === createdDate.length) {
            createdDate = document.getElementsByName('DCTERMS.created');
        }
        for (var i = 0; i < createdDate.length; i++) {
            scw.prop10 = createdDate[i].content.replace('T', ' ').replace(/\+00:00$/, '');
            scw.eVar10 = scw.prop10;
        }

        //prop15
        scw.prop15 = window.location.pathname;
        scw.eVar15 = scw.prop15;
        var metaArray = document.getElementsByName('IFS_URL');
        for (var i = 0; i < metaArray.length; i++) {
            scw.prop15 = metaArray[i].content;
            scw.eVar15 = scw.prop15;
        }
    }

    if ("undefined" != typeof bbc &&
        "undefined" != typeof bbc.fmtj &&
        "undefined" != typeof bbc.fmtj.page ) {
        scw.prop32 = bbc.fmtj.page.adKeyword;
        scw.eVar32 = scw.prop32;
    }

    if ("undefined" != typeof bbcdotcom &&
        "undefined" != typeof bbcdotcom.stats ) {

        if ('yes' == bbcdotcom.stats.adEnabled) {
            scw.prop57 = "yes";
            scw.eVar57 = scw.prop57;
        } else {
            scw.prop57 = "no";
            scw.eVar57 = scw.prop57;
        }

        scw.prop14 = bbcdotcom.stats.audience;
        scw.eVar14 = scw.prop14;

        scw.prop31 = bbcdotcom.stats.contentType;
        scw.eVar31 = scw.prop31;
    }

    /* Visitor Information */
    //Visitor Number
    scw.prop12 = scw.getVisitNum();

    //Days Since Last Visit
    scw.prop13 = scw.getDaysSinceLastVisit();
    scw.eVar13 = scw.prop13;

    //Page Refresh Variable
    scw.prop17 = scw.trackRefresh(scw.pageName, 'tr_pr1');

    //Track New and Repeat Visitors
    scw.prop18 = scw.getNewRepeat();
    if (scw.pageName && scw.prop18 == 'New') scw.prop19 = scw.pageName;
    if (scw.pageName && scw.prop18 == 'Repeat') scw.prop20 = scw.pageName;

    //Set Time Parting Variables
    s_hour = scw.getTimeParting('h', '0');
    s_day = scw.getTimeParting('d', '0');
    s_timepart = s_day + "|" + s_hour;
    scw.prop11 = s_timepart.toLowerCase();
    if (scw.visEvent) scw.eVar11 = scw.prop11;

    /* Campaign Config */
    //The Campaign variable
    //scw.campaign = scw.getQueryParam('cmpid');
    //scw.eVar1 = scw.crossVisitParticipation(scw.campaign, 's_cpm', '90', '5', '>', 'purchase');

    scw.campaign = scw.getQueryParam('ocid');
    scw.campaign = scw.getValOnce(scw.campaign,'s_campaign',0);

    /* Plugin: channelManager v2.2    */
    scw.channelManager('cmp,cmpid,cid,rss,ocid,OCID', ':', 's_cm', '0');

    if (scw._channel == "Natural Search") {
        scw._channel = "Organic";
        scw._campaign = scw._partner + "-" + scw._channel + "-" + scw._keywords.toLowerCase();
    }
    if (scw._channel == "Referrers") {
        scw._channel = "Other Referrers";
        scw._campaign = scw._channel + "-" + scw._referringDomain;
    }

    scw.prop43 = scw._referrer;
    scw.eVar43 = scw.prop43;

    scw.prop44 = scw._referringDomain;
    scw.eVar44 = scw.prop44;

    scw.eVar45 = scw._keywords;
    scw.prop48 = scw.eVar45;

    scw.prop46 = scw._partner;
    scw.eVar46 = scw.prop46;

    scw.prop47 = scw._channel;
    scw.eVar47 = scw.prop47;

    //Referrer - Search Term Stacking
    scw.eVar48 = scw.crossVisitParticipation(scw._keywords, 's_ev48', '30', '5', '>', 'event2', 1);

    //Referrer - Channel Stacking
    scw.eVar49 = scw.crossVisitParticipation(scw._channel, 's_ev49', '30', '5', '>');

    scw.prop53 = scw.page.domain;
    scw.eVar53 = "D=c53";

    scw.prop54 = scw.page.url;
    scw.eVar54 = "D=c54";

    scw.prop55 = scw.eVar55 = "bbc.com";
    scw.prop56 = scw.eVar56 = scw.pageName;

    if ("undefined" != typeof BBC && "undefined" != typeof BBC.adverts && "undefined" != typeof BBC.adverts.getAdOids) {
        scw.prop62 = BBC.adverts.getAdOids();
        scw.eVar62 = "D=c62";
    }

    if ("undefined" != typeof bbcdotcom && "undefined" != typeof bbcdotcom.stats && "undefined" != typeof bbcdotcom.stats.allSections) {
        scw.prop63 = bbcdotcom.stats.allSections;
        scw.eVar63 = "D=c63";
    }

    if ("undefined" != typeof bbcdotcom && "undefined" != typeof bbcdotcom.stats && "undefined" != typeof bbcdotcom.stats.allTopics) {
        scw.prop64 = bbcdotcom.stats.allTopics;
        scw.eVar64 = "D=c64";
    }

    if ("undefined" != typeof bbcdotcom && "undefined" != typeof bbcdotcom.stats && "undefined" != typeof bbcdotcom.stats.column) {
        scw.prop65 = bbcdotcom.stats.column;
        scw.eVar65 = "D=c65";
    }


}
scw.doPlugins = s_doPlugins;

scw.y2k = function(number) {return (number < 1000) ? number + 1900 : number;}

/*
 * Archive pages older than 365days
 */
scw.pageIsOlderThan365Days = function() {
    var metaArray = document.getElementsByName('OriginalPublicationDate');
    if("undefined" != typeof metaArray[0]) {
        var pubDate = metaArray[0].getAttribute('content').split(' ')[0];
        var today = new Date();
        var difference =
            Date.UTC(scw.y2k(today.getYear()),today.getMonth()+1,today.getDate(),0,0,0)
          - Date.UTC(scw.y2k(pubDate.split('/')[0]),pubDate.split('/')[1],pubDate.split('/')[2],0,0,0);
        return (365 < difference/1000/60/60/24) ? true : false;
    }
    return false;
}


/*
 *
 * PAGE INTERACTIONS AND LINK TRACKING
 *
 */

/*
 * TrackLinks immediately before they leave the page
 */
scw.trackExternalLinks = function(linkObj) {
    if(linkObj[0].rev) {
        revValues = linkObj[0].rev.split('|');
        scw.events = "event21";
        scw.prop40 = revValues[0];
        scw.eVar40 = scw.prop40;
        scw.pev2="bbc: " + revValues[1];
        scw.t();
    }
}

/*
 * TrackLinks immediately before they leave the page
 */
scw.trackSiteLinks = function(linkObj, glow) {

    var text = '';
    if ("undefined" != typeof linkObj[0].text ) {
            text = linkObj[0].text;
    } else if ("undefined" != typeof linkObj[0].innerText ) {
            text = linkObj[0].innerText;
    }

    scw.pageReferrer = window.location.pathname.replace(/^http[s]?:\/\/?([^:\/]+)/, "");
    scw.contentType = 'story';

    // Remove white space(IE needs \xA0) and any arrows
    scw.contentID = text.replace(/ (»|\u00BB|&raquo;)/, '').replace(/^[\s\xA0]*/, '').replace(/[\s\xA0]*$/, '');
    scw.linkDestination = linkObj[0].href.replace(/^http[s]?:\/\/?([^:\/]+)/, "");

    var trackLinks = false;

    // Tracking homepage clicks
    if('homepage' == scw.channel && linkObj[0].rev && -1 != linkObj[0].rev.indexOf('|r|t|i|') ) {
        // Below is for full cookie implementation
        // scw.bbcwObjectID = linkObj[0].rev;

        // TODO - Replace with above when cookie solution implemented
        scw.bbcwObjectID = linkObj[0].rev;

        trackLinks = true;

    // Tracking elsewhere module clicks
    } else if('news' == scw.channel && linkObj.isWithin(glow.dom.get("#promotional-content"))) {
        // Below is for full cookie implementation
        var section = ('front-page' == bbc.fmtj.page.section) ? 'news' : bbc.fmtj.page.section;
        scw.bbcwObjectID = 'elsewhere|news|' + section + '|r|t|i|hero|content';

        trackLinks = true;

    }

    if(trackLinks) {

        // Below is for full cookie implementation
        //scw.bbcwObjectID = scw.bbcwObjectID.replace('|r|', '|' + scw.pageReferrer + '|');
        //scw.bbcwObjectID = scw.bbcwObjectID.replace('|t|', '|' + scw.contentType + '|');

        scw.bbcwObjectID = scw.bbcwObjectID.replace('|r|', '|');
        scw.bbcwObjectID = scw.bbcwObjectID.replace('|t|', '|');

        scw.bbcwObjectID = scw.bbcwObjectID.replace('|i|', '|' + scw.contentID + '|');
        scw.bbcwObjectID = scw.bbcwObjectID + '|' + scw.linkDestination.replace(/.*-(\d{7,8})$/, "$1");

        s_objectID = scw.bbcwObjectID;

        /*
         * {Promo-Name}|{Channel-Location}|{Section-Location}|{Content-ID}|{Link-Type}|{Link-Location}|{Link-Destination}
         * spotlight|homepage||Twenty years since the Soviet coup|hero|content|14569375
         * elsewhere|news|front-page|Broken record|hero|content|14560051
         */

        /*
         * Full set for use with a cookie
         * {Promo-Name}|{Channel-Location}|{Section-Location}|{Page-Location}|{Content-Type}|{Content-ID}|{Link-Type}|{Link-Location}|{Link-Destination}
         * elsewhere|news|business|/news/13505966|story|Living in... Croatia|hero|content|/travel/feature/20110
         */

        scw.tl(linkObj[0],'o', scw.bbcwObjectID);

        //Removed until cross domain cookie is worked out
        //scw.setCookie('BBCW-OBJECTID', scw.bbcwObjectID, 0.001); // 1 Minute
    }
}

/*
 *  USAGE:  Pass data object to the following method
 *          linkTrackingName is the only REQUIRED value as follows
 *
 *  Minimum requirement
 *  data = {
 *      linkTrackingName: 'pageInteraction'
 *  }
 *
 *  Full data set
 *  data = {
 *      events:'event22',
 *      vars: {
 *         prop52: 'future:: interaction:: pagination',
 *         eVar52: { variable: 'prop52' }
 *      },
 *      linkTrackingName: { variable: 'prop52' }
 *  }
 */
scw.trackPageInteraction = function(data) {
        var scw = s_gi(s_account);
            scw.linkTrackVars = '';

        var setVariable = function(key, value) {
            if ('object' != typeof value) {
                scw[key] = value;
            } else if('undefined' != typeof value.variable) {
                scw[key] = scw[value.variable];
            }
        }

        if('undefined' != data.events) {
            scw.linkTrackVars += 'events,';
            scw.linkTrackEvents = data.events;
            scw.events = scw.linkTrackEvents;
        }
        for(var key in data.vars) {
            setVariable(key, data.vars[key]);
            scw.linkTrackVars += key + ','
        }
        if('undefined' != data.linkTrackingName) {
            setVariable('linkTrackingName', data.linkTrackingName);
        } else {
            return false;
        }
        scw.tl(this,'o', scw.linkTrackingName);
}

scw.trackFutureSeeMoreArticles = function() {
    scw.trackPageInteraction(data = {
        events: "event22",
        vars: {
            prop52: 'future:: interaction:: pagination',
            eVar52: { variable: 'prop52' }
        },
        linkTrackingName: { variable: 'prop52' }
    });
}

scw.trackSportFootballDrownDowns = function(linkObjParent) {

    var getDropDownValues = function(dropDowns) {
        var dropDownVars = '';
        for (var i = 0, len = dropDowns.length; i < len; i++) {
            dropDownVars += '|' + dropDowns[i].options[dropDowns[i].selectedIndex].label;
        }
        return dropDownVars;
    }

    var getParentHeading = function(node) {
        var i = 0;
        var h1 = node.get('H1');
        var h2 = node.get('H2');
        if(1 == h1.length) {
            return h1.text();
        } else if(1 == h2.length && 'main' != node.attr('role')) {
            return h2.text();
        } else {
            if(10 > i) {
                i++;
                return getParentHeading(node.parent());
            }
        }
        return '';
    }

    var url = scw.page.url.split('/');
    var pageType = url[url.length - 1].toLowerCase();
    var allowedPageTypes = {"tables": 1,"live-scores": 1,"fixtures": 1,"results": 1}
    var dropDowns = linkObjParent.get('select');
    if (1 <= dropDowns.length && 1 === allowedPageTypes[pageType]) {
        var tableTitle = getParentHeading(linkObjParent).toLowerCase().replace(/^[\s\xA0]*/, '').replace(/[\s\xA0]*$/, '');
        var dropDownVars = getDropDownValues(dropDowns).toLowerCase().replace(/^[\s\xA0]*/, '').replace(/[\s\xA0]*$/, '');
        scw.trackPageInteraction(data = {
            events: "event22",
            vars: {
                prop52: 'drop-downs|sport|football|' + pageType + '|' + tableTitle + dropDownVars,
                eVar52: { variable: 'prop52' }
            },
            linkTrackingName: { variable: 'prop52' }
        });
    }

}

/*
 * TrackLinks with next bbc page request
 */
scw.trackLinks = function() {
    gloader.load(["glow","1","glow.dom","glow.events"],{
        onLoad: function(glow){
            if('undefined' !== typeof(scw.linkEvent)) {
                glow.events.removeListener(scw.linkEvent);
            }
            scw.linkEvent = glow.events.addListener('body',  'click', function (e) {
                // Fixing BBCCOM-1399, this will fix the travel drop down for now
                // however we should find the real issue here or when we do the real
                // site tracking it will not work here.  We should also look at
                // moving site catalyst object to a better namespace.
                if("undefined" != typeof scw &&
                   "undefined" != typeof scw.trackSiteLinks &&
                   "undefined" != typeof scw.trackExternalLinks) {
                    var linkObj = glow.dom.get(e.source);
                    var linkObjParent = linkObj.parent();
                    if ( linkObj.is('img') || linkObj.is('span') ) {
                        linkObj = linkObjParent;
                    }
                    if (linkObj.is('a')) {
                        if ('undefined' != typeof document.getElementById("future") && -1 !== linkObjParent[0].className.indexOf('see-more-articles')) {
                            scw.trackFutureSeeMoreArticles();
                        } else if (-1 === linkObj[0].className.indexOf('external-link')) {
                            scw.trackSiteLinks(linkObj, glow);
                        } else {
                            scw.trackExternalLinks(linkObj);
                        }
                    } else if(linkObj.is('input')) {
                        // Removing id check for the moment may need to check an array of them
                        // if (-1 != e.attachedTo.className.indexOf('sport') && 'filter-nav-submit' === linkObj[0].id) {
                        if (-1 != e.attachedTo.className.indexOf('sport')) {
                            scw.trackSportFootballDrownDowns(linkObjParent);
                        }
                    }
                }
            });
        }
    })
}
scw.trackLinks();

/*
 * Cookie functions
 */
scw.setCookie = function(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/; domain=bbc.co.uk";
}

scw.getCookie = function(name) {
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++)
    {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==name)
        {
            return unescape(y);
        }
    }
    return false;
}

scw.deleteCookie = function(name) {
    scw.setCookie(name,"",-1);
}

/*********************** PLUGINS SECTION ****************************/

scw.evaluateUrl = function(siteUrl) {

    h1 = "";
    h2 = "";
    h3 = "";
    h4 = "";
    url = "";
    hArray = null;
    hLength = null;
    newUrl = "";
    contentIdMatch  = null;

    url = siteUrl;

    url = url.toLowerCase();
    url = url.replace(/^\s*(.*?)\s*$/,"$1");

    //if last character is / then remove
    url = url.replace(/\/$/g,'');

    //remove protocol in url
    newUrl = url.replace(/^(http|https):\/\//g,"");

    //remove uk- in url if there is another section
    //i.e. http://www.bbc.co.uk/news/uk-politics-11754656
    if(3 <= newUrl.split('-').length) {
        newUrl = newUrl.replace(/uk-/,"");
    }

    //replace a number document with article, mainly for v3 stories
    newUrl = newUrl.replace('/2/hi', '/news').replace(/\/[0-9]{7}.stm/,"/articles");

    //switch out sport url rules
    newUrl = newUrl.replace(/sport2/g,'sport').replace('sport/0', 'sport');

    // strip default.stm
    newUrl = newUrl.replace(/\/default.stm/g,'');

    //strip the query string for matching
    newUrl = newUrl.replace(/(\?.*)/, '');

    //if last character is / then remove
    newUrl = newUrl.replace(/\/$/, '');

    //split the url
    hArray = newUrl.split("\/");
    hLength = hArray.length;

    if (hLength >= 2) {

        siteSection = hArray[1];

        switch(siteSection){
            case 'news':
                scw.newsUrl();
                break;
            case 'sport':
            case 'sport2':
                scw.sportUrl();
                break;
            case 'weather':
                scw.weatherUrl();
                break;
            case 'travel':
                scw.travelUrl();
            case 'future':
                scw.futureUrl();
                break;
            case 'blogs':
                scw.blogsUrl();
                break;
            case 'radio':
                scw.radioUrl();
                break;
            case 'tv':
                scw.tvUrl();
                break;
        }
    }

    //Handle home page
    if (hLength == 1) {
        h1 = 'homepage';
    }

    // Override with data set by application on bbcdotcom module
    if ("undefined" != typeof bbcdotcom &&
        "undefined" != typeof bbcdotcom.stats &&
        "undefined" != typeof bbcdotcom.stats.section) {
        sectionArray = bbcdotcom.stats.section.split('>');
        sectionLength = sectionArray.length;
        scw.prop6 = sectionArray[0];
        scw.eVar6 = scw.prop6;
        scw.channel = scw.prop6;
        if (sectionLength >= 2) {
            scw.prop7 = sectionArray[0] + ">" + sectionArray[1];
            scw.eVar7 = scw.prop7;
            if (sectionLength >= 3) {
                scw.prop8 = sectionArray[0] + ">" + sectionArray[1] + ">" + sectionArray[2];
                scw.eVar8 = scw.prop8;
            }
        }
    // Use the url to derive the section path
    } else {
        if ("undefined" != typeof h1 && '' != h1) {
            scw.prop6 = h1;
            scw.eVar6 = scw.prop6;
            scw.channel = scw.prop6;
        }
        if ("undefined" != typeof h2 && '' != h2) {
            scw.prop7 = h2;
            scw.eVar7 = scw.prop7;
        }
        if ("undefined" != typeof h3 && '' != h3) {
            scw.prop8 = h3;
            scw.eVar8 = scw.prop8;
        }
        if ("undefined" != typeof h4 && '' != h4) {
            scw.prop9 = h4;
            scw.eVar9 = scw.prop9;
        }
    }
    //***
    //END of Main section
    //***
}

scw.tvUrl = function(){
    h1 = hArray[1];
}

scw.newsUrl = function(){
    h1 = hArray[1];

    contentIdMatch = reNewsContentId.test(newUrl)
    // if its not the a V6(refresh) story
    if (!contentIdMatch) {
        if (hLength >= 3) {
            h2 = h1 + ">" + hArray[2];
            if (hLength >= 4) {
                h3 = h2 + ">" + hArray[3].replace(/_/,'-');
            }
        }
    }
    else {
        if (hLength >= 2) {

            //change all \d{7} and \d{8} to 'articles'
            var lastFwdSlash = newUrl.lastIndexOf("/");
            var lastValue = newUrl.substr(lastFwdSlash + 1);

            // Removed and move to below with h3 - BBCCOM-685 and BBCCOM-686
            //lastValue = lastValue.replace(/(-[0-9]{8})/,">articles");
            //lastValue = lastValue.replace(/(-[0-9]{7})/,">articles");

            var firstDash = lastValue.indexOf("-");

            if (firstDash > 0){

                // We want to strip the world value from the sections
                if('world' == lastValue.substring(0,firstDash)) {
                    h2 = h1 + ">" + lastValue.substr(firstDash + 1).replace(/_/,'-').replace(/(-[0-9]{8})/,"").replace(/(-[0-9]{7})/,"");
                    h3 = h2 + ">" + lastValue.substr(firstDash + 1).replace(/_/,'-').replace(/.+(-[0-9]{8})/,"articles").replace(/.+(-[0-9]{7})/,"articles");
                } else {
                    h2 = h1 + ">" + lastValue.substring(0,firstDash).replace(/_/,'-');
                    h3 = h2 + ">" + lastValue.substr(firstDash + 1).replace(/_/,'-').replace(/([0-9]{8})/,"articles").replace(/([0-9]{7})/,"articles");
                }

            } else {

                h2 = h1 + ">" + lastValue.replace(/_/,'-');

            }

        }

    }
}

scw.sportUrl = function() {

    var newUrlSport = "";

    h1 = hArray[1];

    contentIdMatch = reStandardContentId.test(newUrl);

    if (!contentIdMatch) {
        newUrlSport = newUrl.replace(/\/hi\//g,'\/');
        hArray = newUrlSport.split("\/");
        hLength = hArray.length;

        if (hLength >= 3) {

        //Use the new value of h1 eg sport not sport2
        h2 = hArray[1] + ">" + hArray[2];
            if (hLength >= 4) {
                h3 = h2 + ">" + hArray[3];

                newUrlSport = newUrlSport.replace(/\/m\//g,'\/');
                hArray = newUrlSport.split("\/");
                hLength = hArray.length;

                if (hLength >= 5) {
                    h4 = h3 + ">" +  hArray[4];
                }
            }
        }

    } else {

		var posHi = 1;
		if( -1 != newUrl.indexOf('hi') ) {
			posHi = 2;
		}

        if (posHi > 0 && (hLength >=  (posHi + 1) )) {
            h2 = h1 + ">" + hArray[posHi + 1];
        }
        if (posHi > 0 && (hLength >=  (posHi + 2) )) {
            h3 = h2 + ">" + hArray[posHi + 2];
        }
        var posM = newUrl.indexOf('m');
        if (posM > 0 && (hLength >=  (posM + 1) )) {
            h4 = h3 + ">" + hArray[posM + 1];
        }
    }
}

scw.weatherUrl = function() {

    h1 = hArray[1];

    newUrl = newUrl.replace(/\/hi\//g,'\/');
    hArray = newUrl.split("\/");
    hLength = hArray.length;

    if (hLength >= 3) {
        h2 = h1 + ">" + hArray[2];
        contentIdMatch = reStandardContentId.test(newUrl);
        if (!contentIdMatch) {
            if (hLength >= 4) {
                h3 = h2 + ">" + hArray[3];
            }
        } else {
            h3 = h2 + ">" + 'articles';
        }
    }
}

scw.travelUrl = function() {
    h1 = hArray[1];
    if (hLength >= 3) {
        h2 = h1 + ">" + hArray[2];
        contentIdMatch = reStandardContentId.test(newUrl);
        if (!contentIdMatch) {
            if (hLength >= 4) {
                h3 = h2 + ">" + hArray[3];
            }
        }
        else {
            h3 = h2 + ">" + 'articles';
        }
    }
}

scw.futureUrl = function() {
    h1 = hArray[1];

    newUrl = newUrl.replace(/\/sections\//g,'\/');
    hArray = newUrl.split("\/");
    hLength = hArray.length;

    if (hLength >= 3) {
        h2 = h1 + ">" + hArray[2];
        contentIdMatch = reStandardContentId.test(newUrl);
        if (!contentIdMatch) {
            if (hLength >= 4) {
                h3 = h2 + ">" + hArray[3];
            }
        }
        else {
            h3 = h2 + ">" + 'articles';
        }
    }
}

scw.blogsUrl = function() {

    newUrl = newUrl.replace(/\.shtml/g,'\/');
    hArray = newUrl.split("\/");
    hLength = hArray.length;

    h1 = hArray[1];

    if (hLength >= 3) {
        h2 = h1 + ">" + hArray[2];
        if (hLength >= 4) {
            h3 = h2 + ">" + hArray[3];
            if (hLength >= 5) {
                h4 = h3 + ">" + hArray[4];
            }
        }
    }
}

scw.radioUrl = function() {
    h1 = hArray[1];
}

/*********************************************************************
* Function p_fo(x,y): Ensures the plugin code is fired only on the
*      first call of do_plugins
* Returns:
*     - 1 if first instance on firing
*     - 0 if not first instance on firing
*********************************************************************/
scw.p_fo = new Function("n", ""
+ "var s=this;if(!s.__fo){s.__fo=new Object;}if(!s.__fo[n]){s.__fo[n]="
+ "new Object;return 1;}else {return 0;}");

/*
* Plugin: getValOnce 0.2 - get a value once per session or number of days
*/
scw.getValOnce = new Function("v", "c", "e", ""
+ "var s=this,k=s.c_r(c),a=new Date;e=e?e:0;if(v){a.setTime(a.getTime("
+ ")+e*86400000);s.c_w(c,v,e?a:0);}return v==k?'':v");

/*
* Plugin Utility: apl v1.1
*/
scw.apl = new Function("l", "v", "d", "u", ""
+ "var s=this,m=0;if(!l)l='';if(u){var i,n,a=s.split(l,d);for(i=0;i<a."
+ "length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCas"
+ "e()));}}if(!m)l=l?l+d+v:v;return l");

/*
* Utility Function: split v1.5 - split a string (JS 1.0 compatible)
*/
scw.split = new Function("l", "d", ""
+ "var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x"
+ "++]=l.substring(0,i);l=l.substring(i+d.length);}return a");

/* Utility Function: p_c */
scw.p_c = new Function("v", "c", ""
+ "var x=v.indexOf('=');return c.toLowerCase()==v.substring(0,x<0?v.le"
+ "ngth:x).toLowerCase()?v:0");

/*
* s.join: 1.0 - s.join(v,p)
*
*  v - Array (may also be array of array)
*  p - formatting parameters (front, back, delim, wrap)
*
*/
scw.join = new Function("v", "p", ""
+ "var s = this;var f,b,d,w;if(p){f=p.front?p.front:'';b=p.back?p.back"
+ ":'';d=p.delim?p.delim:'';w=p.wrap?p.wrap:'';}var str='';for(var x=0"
+ ";x<v.length;x++){if(typeof(v[x])=='object' )str+=s.join( v[x],p);el"
+ "se str+=w+v[x]+w;if(x<v.length-1)str+=d;}return f+str+b;");

/*
* Plugin Utility: Replace v1.0
*/
scw.repl = new Function("x", "o", "n", ""
+ "var i=x.indexOf(o),l=n.length;while(x&&i>=0){x=x.substring(0,i)+n+x."
+ "substring(i+o.length);i=x.indexOf(o,i+l)}return x");

/*
* Plugin - trackRefresh v1.1 (requires split utility function)
*/
scw.trackRefresh = new Function("v", "c", ""
+ "var s=this,a,t=new Date,x;t.setTime(t.getTime()+1800000);if(!s.c_r("
+ "c)){s.c_w(c,v,t);return v}else{x=unescape(s.c_r(c));if(x==v){x+='~["
+ "1]';s.c_w(c,x,0);return x}else{a=s.split(x,'~[');if(a[0]==v){i=pars"
+ "eInt(a[1])+1;x=a[0]+'~['+i+']';s.c_w(c,x,0);return x}else{s.c_w(c,v"
+ ",0);return v}}}");

/*
* Plugin: Visit Number By Month 2.0 - Return the user visit number
*/
scw.getVisitNum = new Function(""
+ "var s=this,e=new Date(),cval,cvisit,ct=e.getTime(),c='s_vnum',c2='s"
+ "_invisit';e.setTime(ct+30*24*60*60*1000);cval=s.c_r(c);if(cval){var"
+ " i=cval.indexOf('&vn='),str=cval.substring(i+4,cval.length),k;}cvis"
+ "it=s.c_r(c2);if(cvisit){if(str){e.setTime(ct+30*60*1000);s.c_w(c2,'"
+ "true',e);return str;}else return 'unknown visit number';}else{if(st"
+ "r){str++;k=cval.substring(0,i);e.setTime(k);s.c_w(c,k+'&vn='+str,e)"
+ ";e.setTime(ct+30*60*1000);s.c_w(c2,'true',e);return str;}else{s.c_w"
+ "(c,ct+30*24*60*60*1000+'&vn=1',e);e.setTime(ct+30*60*1000);s.c_w(c2"
+ ",'true',e);return 1;}}"
);

/*
* Plugin: getTimeToComplete 0.4 - return the time from start to stop
*/
scw.getTimeToComplete = new Function("v", "cn", "e", ""
+ "var s=this,d=new Date,x=d,k;if(!s.ttcr){e=e?e:0;if(v=='start'||v=='"
+ "stop')s.ttcr=1;x.setTime(x.getTime()+e*86400000);if(v=='start'){s.c"
+ "_w(cn,d.getTime(),e?x:0);return '';}if(v=='stop'){k=s.c_r(cn);if(!s"
+ ".c_w(cn,'',d)||!k)return '';v=(d.getTime()-k)/1000;var td=86400,th="
+ "3600,tm=60,r=5,u,un;if(v>td){u=td;un='days';}else if(v>th){u=th;un="
+ "'hours';}else if(v>tm){r=2;u=tm;un='minutes';}else{r=.2;u=1;un='sec"
+ "onds';}v=v*r/u;return (Math.round(v)/r)+' '+un;}}return '';");

/*
* Plugin: Days since last Visit 1.1.H - capture time from last visit
*/
scw.getDaysSinceLastVisit = new Function("c", ""
+ "var s=this,e=new Date(),es=new Date(),cval,cval_s,cval_ss,ct=e.getT"
+ "ime(),day=24*60*60*1000,f1,f2,f3,f4,f5;e.setTime(ct+3*365*day);es.s"
+ "etTime(ct+30*60*1000);f0='Cookies Not Supported';f1='First Visit';f"
+ "2='More than 30 days';f3='More than 7 days';f4='Less than 7 days';f"
+ "5='Less than 1 day';cval=s.c_r(c);if(cval.length==0){s.c_w(c,ct,e);"
+ "s.c_w(c+'_s',f1,es);}else{var d=ct-cval;if(d>30*60*1000){if(d>30*da"
+ "y){s.c_w(c,ct,e);s.c_w(c+'_s',f2,es);}else if(d<30*day+1 && d>7*day"
+ "){s.c_w(c,ct,e);s.c_w(c+'_s',f3,es);}else if(d<7*day+1 && d>day){s."
+ "c_w(c,ct,e);s.c_w(c+'_s',f4,es);}else if(d<day+1){s.c_w(c,ct,e);s.c"
+ "_w(c+'_s',f5,es);}}else{s.c_w(c,ct,e);cval_ss=s.c_r(c+'_s');s.c_w(c"
+ "+'_s',cval_ss,es);}}cval_s=s.c_r(c+'_s');if(cval_s.length==0) retur"
+ "n f0;else if(cval_s!=f1&&cval_s!=f2&&cval_s!=f3&&cval_s!=f4&&cval_s"
+ "!=f5) return '';else return cval_s;");

/*
* Plugin: getNewRepeat 1.0 - Return whether user is new or repeat
*/
scw.getNewRepeat = new Function(""
+ "var s=this,e=new Date(),cval,ct=e.getTime(),y=e.getYear();e.setTime"
+ "(ct+30*24*60*60*1000);cval=s.c_r('s_nr');if(cval.length==0){s.c_w("
+ "'s_nr',ct,e);return 'New';}if(cval.length!=0&&ct-cval<30*60*1000){s"
+ ".c_w('s_nr',ct,e);return 'New';}if(cval<1123916400001){e.setTime(cv"
+ "al+30*24*60*60*1000);s.c_w('s_nr',ct,e);return 'Repeat';}else retur"
+ "n 'Repeat';");

/*
* Plugin: getTimeParting 2.0 - Set timeparting values based on time zone
*/
scw.getTimeParting = new Function("t", "z", ""
+ "var s=this,cy;dc=new Date('1/1/2000');"
+ "if(dc.getDay()!=6||dc.getMonth()!=0){return'Data Not Available'}"
+ "else{;z=parseFloat(z);var dsts=new Date(s.dstStart);"
+ "var dste=new Date(s.dstEnd);fl=dste;cd=new Date();if(cd>dsts&&cd<fl)"
+ "{z=z+1}else{z=z};utc=cd.getTime()+(cd.getTimezoneOffset()*60000);"
+ "tz=new Date(utc + (3600000*z));thisy=tz.getFullYear();"
+ "var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday',"
+ "'Saturday'];if(thisy!=s.currentYear){return'Data Not Available'}else{;"
+ "thish=tz.getHours();thismin=tz.getMinutes();thisd=tz.getDay();"
+ "var dow=days[thisd];var ap='AM';var dt='Weekday';var mint='00';"
+ "if(thismin>30){mint='30'}if(thish>=12){ap='PM';thish=thish-12};"
+ "if (thish==0){thish=12};if(thisd==6||thisd==0){dt='Weekend'};"
+ "var timestring=thish+':'+mint+ap;if(t=='h'){return timestring}"
+ "if(t=='d'){return dow};if(t=='w'){return dt}}};");

/*
* Plugin: getQueryParam 2.3
*/
scw.getQueryParam = new Function("p", "d", "u", ""
+ "var s=this,v='',i,t;d=d?d:'';u=u?u:(s.pageURL?s.pageURL:s.wd.locati"
+ "on);if(u=='f')u=s.gtfs().location;while(p){i=p.indexOf(',');i=i<0?p"
+ ".length:i;t=s.p_gpv(p.substring(0,i),u+'');if(t){t=t.indexOf('#')>-"
+ "1?t.substring(0,t.indexOf('#')):t;}if(t)v+=v?d+t:t;p=p.substring(i="
+ "=p.length?i:i+1)}return v");
scw.p_gpv = new Function("k", "u", ""
+ "var s=this,v='',i=u.indexOf('?'),q;if(k&&i>-1){q=u.substring(i+1);v"
+ "=s.pt(q,'&','p_gvf',k)}return v");
scw.p_gvf = new Function("t", "k", ""
+ "if(t){var s=this,i=t.indexOf('='),p=i<0?t:t.substring(0,i),v=i<0?'T"
+ "rue':t.substring(i+1);if(p.toLowerCase()==k.toLowerCase())return s."
+ "epa(v)}return ''");

/*
* channelManager v2.2 - Tracking External Traffic
*/
scw.channelManager = new Function("a", "b", "c", "V", ""
+ "var s=this,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,t,u,v,w,x,y,z,A,B,C,D,E,F,"
+ "G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,W,X,Y;g=s.referrer?s.referrer:documen"
+ "t.referrer;g=g.toLowerCase();if(!g){h='1'}i=g.indexOf('?')>-1?g.ind"
+ "exOf('?'):g.length;j=g.substring(0,i);k=s.linkInternalFilters.toLow"
+ "erCase();k=s.split(k,',');l=k.length;for(m=0;m<l;m++){n=j.indexOf(k"
+ "[m])==-1?'':g;if(n)o=n}if(!o&&!h){p=g;q=g.indexOf('//')>-1?g.indexO"
+ "f('//')+2:0;r=g.indexOf('/',q)>-1?g.indexOf('/',q):i;t=g.substring("
+ "q,r);t=t.toLowerCase();u=t;P='Referrers';v=s.seList+'>'+s._extraSea"
+ "rchEngines;if(V=='1'){j=s.repl(j,'oogle','%');j=s.repl(j,'ahoo','^'"
+ ");g=s.repl(g,'as_q','*');}A=s.split(v,'>');B=A.length;for(C=0;C<B;C"
+ "++){D=A[C];D=s.split(D,'|');E=s.split(D[0],',');F=E.length;for(G=0;"
+ "G<F;G++){H=j.indexOf(E[G]);if(H>-1){I=s.split(D[1],',');J=I.length;"
+ "for(K=0;K<J;K++){L=s.getQueryParam(I[K],'',g);if(L){L=L.toLowerCase"
+ "();M=L;if(D[2]){u=D[2];N=D[2]}else{N=t}if(V=='1'){N=s.repl(N,'#',' "
+ "- ');g=s.repl(g,'*','as_q');N=s.repl(N,'^','ahoo');N=s.repl(N,'%','"
+ "oogle');}}}}}}}O=s.getQueryParam(a,b);if(O){u=O;if(M){P='Paid Searc"
+ "h'}else{P='Paid Non-Search';}}if(!O&&M){u=N;P='Natural Search'}f=s."
+ "_channelDomain;if(f){k=s.split(f,'>');l=k.length;for(m=0;m<l;m++){Q"
+ "=s.split(k[m],'|');R=s.split(Q[1],',');S=R.length;for(T=0;T<S;T++){"
+ "W=j.indexOf(R[T]);if(W>-1)P=Q[0]}}}d=s._channelParameter;if(d){k=s."
+ "split(d,'>');l=k.length;for(m=0;m<l;m++){Q=s.split(k[m],'|');R=s.sp"
+ "lit(Q[1],',');S=R.length;for(T=0;T<S;T++){U=s.getQueryParam(R[T]);i"
+ "f(U)P=Q[0]}}}e=s._channelPattern;if(e){k=s.split(e,'>');l=k.length;"
+ "for(m=0;m<l;m++){Q=s.split(k[m],'|');R=s.split(Q[1],',');S=R.length"
+ ";for(T=0;T<S;T++){X=O.indexOf(R[T]);if(X==0)P=Q[0]}}}if(h=='1'&&!O)"
+ "{u=P=t=p='Direct Load'}T=M+u+t;U=c?'c':'c_m';if(c!='0'){T=s.getValO"
+ "nce(T,U,0);}if(T)M=M?M:'n/a';s._referrer=T&&p?p:'';s._referringDoma"
+ "in=T&&t?t:'';s._partner=T&&N?N:'';s._campaignID=T&&O?O:'';s._campai"
+ "gn=T&&u?u:'';s._keywords=T&&M?M:'';s._channel=T&&P?P:'';");
/* Top 130 - Grouped
s.seList="altavista.co,altavista.de|q,r|AltaVista>.aol.,suche.aolsvc"
+".de|q,query|AOL>ask.jp,ask.co|q,ask|Ask>www.baidu.com|wd|Baidu>daum"
+".net,search.daum.net|q|Daum>google.,googlesyndication.com|q,as_q|Go"
+"ogle>icqit.com|q|icq>bing.com|q|Microsoft Bing>myway.com|searchfor|"
+"MyWay.com>naver.com,search.naver.com|query|Naver>netscape.com|query"
+",search|Netscape Search>reference.com|q|Reference.com>seznam|w|Sezn"
+"am.cz>abcsok.no|q|Startsiden>tiscali.it,www.tiscali.co.uk|key,query"
+"|Tiscali>virgilio.it|qs|Virgilio>yahoo.com,yahoo.co.jp|p,va|Yahoo!>"
+"yandex|text|Yandex.ru>search.cnn.com|query|CNN Web Search>search.ea"
+"rthlink.net|q|Earthlink Search>search.comcast.net|q|Comcast Search>"
+"search.rr.com|qs|RoadRunner Search>optimum.net|q|Optimum Search";*/
/* Top 130 */
scw.seList = "altavista.co|q,r|AltaVista>aol.co.uk,search.aol.co.uk|query"
+ "|AOL - United Kingdom>search.aol.com,search.aol.ca|query,q|AOL.com "
+ "Search>ask.com,ask.co.uk|ask,q|Ask Jeeves>www.baidu.com|wd|Baidu>da"
+ "um.net,search.daum.net|q|Daum>google.co,googlesyndication.com|q,as_"
+ "q|Google>google.com.ar|q,as_q|Google - Argentina>google.com.au|q,as"
+ "_q|Google - Australia>google.at|q,as_q|Google - Austria>google.com."
+ "bh|q,as_q|Google - Bahrain>google.com.bd|q,as_q|Google - Bangladesh"
+ ">google.be|q,as_q|Google - Belgium>google.com.bo|q,as_q|Google - Bo"
+ "livia>google.ba|q,as_q|Google - Bosnia-Hercegovina>google.com.br|q,"
+ "as_q|Google - Brasil>google.bg|q,as_q|Google - Bulgaria>google.ca|q"
+ ",as_q|Google - Canada>google.cl|q,as_q|Google - Chile>google.cn|q,a"
+ "s_q|Google - China>google.com.co|q,as_q|Google - Colombia>google.co"
+ ".cr|q,as_q|Google - Costa Rica>google.hr|q,as_q|Google - Croatia>go"
+ "ogle.cz|q,as_q|Google - Czech Republic>google.dk|q,as_q|Google - De"
+ "nmark>google.com.do|q,as_q|Google - Dominican Republic>google.com.e"
+ "c|q,as_q|Google - Ecuador>google.com.eg|q,as_q|Google - Egypt>googl"
+ "e.com.sv|q,as_q|Google - El Salvador>google.ee|q,as_q|Google - Esto"
+ "nia>google.fi|q,as_q|Google - Finland>google.fr|q,as_q|Google - Fra"
+ "nce>google.de|q,as_q|Google - Germany>google.gr|q,as_q|Google - Gre"
+ "ece>google.com.gt|q,as_q|Google - Guatemala>google.hn|q,as_q|Google"
+ " - Honduras>google.com.hk|q,as_q|Google - Hong Kong>google.hu|q,as_"
+ "q|Google - Hungary>google.co.in|q,as_q|Google - India>google.co.id|"
+ "q,as_q|Google - Indonesia>google.ie|q,as_q|Google - Ireland>google."
+ "is|q,as_q|Google - Island>google.co.il|q,as_q|Google - Israel>googl"
+ "e.it|q,as_q|Google - Italy>google.com.jm|q,as_q|Google - Jamaica>go"
+ "ogle.co.jp|q,as_q|Google - Japan>google.jo|q,as_q|Google - Jordan>g"
+ "oogle.co.ke|q,as_q|Google - Kenya>google.co.kr|q,as_q|Google - Kore"
+ "a>google.lv|q,as_q|Google - Latvia>google.lt|q,as_q|Google - Lithua"
+ "nia>google.com.my|q,as_q|Google - Malaysia>google.com.mt|q,as_q|Goo"
+ "gle - Malta>google.mu|q,as_q|Google - Mauritius>google.com.mx|q,as_"
+ "q|Google - Mexico>google.co.ma|q,as_q|Google - Morocco>google.nl|q,"
+ "as_q|Google - Netherlands>google.co.nz|q,as_q|Google - New Zealand>"
+ "google.com.ni|q,as_q|Google - Nicaragua>google.com.ng|q,as_q|Google"
+ " - Nigeria>google.no|q,as_q|Google - Norway>google.com.pk|q,as_q|Go"
+ "ogle - Pakistan>google.com.py|q,as_q|Google - Paraguay>google.com.p"
+ "e|q,as_q|Google - Peru>google.com.ph|q,as_q|Google - Philippines>go"
+ "ogle.pl|q,as_q|Google - Poland>google.pt|q,as_q|Google - Portugal>g"
+ "oogle.com.pr|q,as_q|Google - Puerto Rico>google.com.qa|q,as_q|Googl"
+ "e - Qatar>google.ro|q,as_q|Google - Romania>google.ru|q,as_q|Google"
+ " - Russia>google.st|q,as_q|Google - Sao Tome and Principe>google.co"
+ "m.sa|q,as_q|Google - Saudi Arabia>google.com.sg|q,as_q|Google - Sin"
+ "gapore>google.sk|q,as_q|Google - Slovakia>google.si|q,as_q|Google -"
+ " Slovenia>google.co.za|q,as_q|Google - South Africa>google.es|q,as_"
+ "q|Google - Spain>google.lk|q,as_q|Google - Sri Lanka>google.se|q,as"
+ "_q|Google - Sweden>google.ch|q,as_q|Google - Switzerland>google.com"
+ ".tw|q,as_q|Google - Taiwan>google.co.th|q,as_q|Google - Thailand>go"
+ "ogle.bs|q,as_q|Google - The Bahamas>google.tt|q,as_q|Google - Trini"
+ "dad and Tobago>google.com.tr|q,as_q|Google - Turkey>google.com.ua|q"
+ ",as_q|Google - Ukraine>google.ae|q,as_q|Google - United Arab Emirat"
+ "es>google.co.uk|q,as_q|Google - United Kingdom>google.com.uy|q,as_q"
+ "|Google - Uruguay>google.co.ve|q,as_q|Google - Venezuela>google.com"
+ ".vn|q,as_q|Google - Viet Nam>google.co.vi|q,as_q|Google - Virgin Is"
+ "lands>icqit.com|q|icq>bing.com|q|Microsoft Bing>myway.com|searchfor"
+ "|MyWay.com>naver.com,search.naver.com|query|Naver>netscape.com|quer"
+ "y,search|Netscape Search>reference.com|q|Reference.com>seznam|w|Sez"
+ "nam.cz>abcsok.no|q|Startsiden>tiscali.it|key|Tiscali>virgilio.it|qs"
+ "|Virgilio>yahoo.com,search.yahoo.com|p|Yahoo!>ar.yahoo.com,ar.searc"
+ "h.yahoo.com|p|Yahoo! - Argentina>au.yahoo.com,au.search.yahoo.com|p"
+ "|Yahoo! - Australia>ca.yahoo.com,ca.search.yahoo.com|p|Yahoo! - Can"
+ "ada>fr.yahoo.com,fr.search.yahoo.com|p|Yahoo! - France>de.yahoo.com"
+ ",de.search.yahoo.com|p|Yahoo! - Germany>hk.yahoo.com,hk.search.yaho"
+ "o.com|p|Yahoo! - Hong Kong>in.yahoo.com,in.search.yahoo.com|p|Yahoo"
+ "! - India>yahoo.co.jp,search.yahoo.co.jp|p,va|Yahoo! - Japan>kr.yah"
+ "oo.com,kr.search.yahoo.com|p|Yahoo! - Korea>mx.yahoo.com,mx.search."
+ "yahoo.com|p|Yahoo! - Mexico>ph.yahoo.com,ph.search.yahoo.com|p|Yaho"
+ "o! - Philippines>sg.yahoo.com,sg.search.yahoo.com|p|Yahoo! - Singap"
+ "ore>es.yahoo.com,es.search.yahoo.com|p|Yahoo! - Spain>telemundo.yah"
+ "oo.com,espanol.search.yahoo.com|p|Yahoo! - Spanish (US : Telemundo)"
+ ">tw.yahoo.com,tw.search.yahoo.com|p|Yahoo! - Taiwan>uk.yahoo.com,uk"
+ ".search.yahoo.com|p|Yahoo! - UK and Ireland>yandex|text|Yandex.ru>s"
+ "earch.cnn.com|query|CNN Web Search>search.earthlink.net|q|Earthlink"
+ " Search>search.comcast.net|q|Comcast Search>search.rr.com|qs|RoadRu"
+ "nner Search>optimum.net|q|Optimum Search";

/*
*    Plug-in: crossVisitParticipation v1.6 - stacks values from
*    specified variable in cookie and returns value
*/
scw.crossVisitParticipation = new Function("v", "cn", "ex", "ct", "dl", "ev", "dv", ""
+ "var s=this,ce;if(typeof(dv)==='undefined')dv=0;if(s.events&&ev){var"
+ " ay=s.split(ev,',');var ea=s.split(s.events,',');for(var u=0;u<ay.l"
+ "ength;u++){for(var x=0;x<ea.length;x++){if(ay[u]==ea[x]){ce=1;}}}}i"
+ "f(!v||v==''){if(ce){s.c_w(cn,'');return'';}else return'';}v=escape("
+ "v);var arry=new Array(),a=new Array(),c=s.c_r(cn),g=0,h=new Array()"
+ ";if(c&&c!='')arry=eval(c);var e=new Date();e.setFullYear(e.getFullY"
+ "ear()+5);if(dv==0&&arry.length>0&&arry[arry.length-1][0]==v)arry[ar"
+ "ry.length-1]=[v,new Date().getTime()];else arry[arry.length]=[v,new"
+ " Date().getTime()];var start=arry.length-ct<0?0:arry.length-ct;var "
+ "td=new Date();for(var x=start;x<arry.length;x++){var diff=Math.roun"
+ "d((td.getTime()-arry[x][1])/86400000);if(diff<ex){h[g]=unescape(arr"
+ "y[x][0]);a[g]=[arry[x][0],arry[x][1]];g++;}}var data=s.join(a,{deli"
+ "m:',',front:'[',back:']',wrap:\"'\"});s.c_w(cn,data,e);var r=s.join"
+ "(h,{delim:dl});if(ce)s.c_w(cn,'');return r;");


/* Configure Modules and Plugins */

scw.loadModule("Survey")
var s_sv_dynamic_root = "survey.112.2o7.net/survey/dynamic"
var s_sv_gather_root = "survey.112.2o7.net/survey/gather"

scw.loadModule("Media")
scw.Media.autoTrack = false
scw.Media.playerName = "EMP"
scw.Media.trackVars = "eVar21,events,eVar22,eVar23,eVar24";

scw.Media.trackWhilePlaying=true;
scw.Media.trackMilestones="25,50,75";

// Set up variables to fake ad request
scw.playUndefinedMovie = 0;
scw.stopUndefinedMovie = 0;
scw.adWasPlayed = false;

// Used to make sure each videos events are only tracked once
scw.eventsTracked = {};

scw.Media.monitor = function (scw, obj) {//Use this code with either JavaScript or Flash.
    // eVar1 = Media Name
    // event3 = Movie Starts
    // event4 = Ad Plays
    // event5 = Ad Stops
    // event6 = Content Plays
    // event7 = Content Stops
    // event8 = Movie Ends

    if (obj.mediaEvent == "adPlay" && !scw.eventsTracked[obj.mediaName].event4) { //Executes when the video ad opens.
        scw.Media.trackVars = "events,eVar21,eVar22,eVar23,eVar24,eVar55";
        scw.Media.trackEvents = "event4";
        scw.events="event4";
        scw.Media.track(obj.mediaName);
        scw.eventsTracked[obj.mediaName].event4 = true;
    } else if (obj.mediaEvent == "adStop" && !scw.eventsTracked[obj.mediaName].event5) { //Executes when the video ad stops.
        scw.Media.trackVars = "events,eVar21,eVar22,eVar23,eVar24,eVar55";
        scw.Media.trackEvents = "event5";
        scw.events="event5";
        scw.Media.track(obj.mediaName);
        scw.eventsTracked[obj.mediaName].event5 = true;
    } else if (obj.mediaEvent == "contentPlay" && !scw.eventsTracked[obj.mediaName].event6) { //Executes when the video opens.
        scw.Media.trackVars = "events,eVar21,eVar22,eVar23,eVar24,eVar55";
        scw.Media.trackEvents = "event6";
        scw.events="event6";
        scw.Media.track(obj.mediaName);
        scw.eventsTracked[obj.mediaName].event6 = true;
    } else if (obj.mediaEvent == "contentStop" && !scw.eventsTracked[obj.mediaName].event7) { //Executes when the video stops.
        scw.Media.trackVars = "events,eVar21,eVar22,eVar23,eVar24,eVar55";
        scw.Media.trackEvents = "event7";
        scw.events="event7";
        scw.Media.track(obj.mediaName);
        scw.eventsTracked[obj.mediaName].event7 = true;
    } else if (obj.mediaEvent == "movieEnd" && !scw.eventsTracked[obj.mediaName].event8) { //Executes when the playlist ends.
        scw.Media.trackVars = "events,eVar21,eVar22,eVar23,eVar24,eVar55";
        scw.Media.trackEvents = "event8";
        scw.events="event8";
        scw.Media.track(obj.mediaName);
        scw.eventsTracked[obj.mediaName].event8 = true;
    }
};

scw.setMediaProperties = function(obj){
    scw.prop21 = obj.mediaName;
    scw.prop22 = obj.mediaType;
    scw.prop23 = obj.mediaId;
    scw.prop24 = obj.adId;
    scw.eVar21 = scw.prop21;
    scw.eVar22 = scw.prop22;
    scw.eVar23 = scw.prop23;
    scw.eVar24 = scw.prop24;
}

/*
 * If there was an ad of longer than 5 seconds monitor it
 */
scw.playStopAd = function(obj) {
    obj.mediaEvent = 'adPlay';
    scw.Media.monitor(scw, obj);

    obj.mediaEvent = 'adStop';
    scw.Media.monitor(scw, obj);
}

// TODO - Add to scw. namespace
// Called by the mediaStarted event
function startMovie(obj) {
    // This videos tracked obj
    if ('undefined' == typeof(scw.eventsTracked[obj.mediaName])) {
        scw.eventsTracked[obj.mediaName] = {
            event3: false,
            event4: false,
            event5: false,
            event6: false,
            event7: false,
            event8: false
        };
    }
    if ('programme' == obj.mediaType && !scw.eventsTracked[obj.mediaName].event3) {
        //Executes when the playlist starts.
        scw.Media.trackVars = "events,eVar6,prop6,eVar7,prop7,eVar8,prop8,prop14,eVar14,eVar21,eVar22,eVar23,eVar24,,eVar55";
        scw.Media.trackEvents = "event3";
        scw.events="event3";
        scw.setMediaProperties(obj);
        scw.Media.open(obj.mediaName, obj.mediaLength, obj.mediaPlayerName);
        scw.eventsTracked[obj.mediaName].event3 = true;
    }
}

// TODO - Add to scw. namespace
// Called by the mediaPlaying event
function playMovie(obj) {
    if('advert' == obj.mediaType && 5 < obj.mediaLength) {
        scw.adWasPlayed = true;
        // TODO - Move request into bbcdotcom.av.emp.analytics when alignment live
        COMSCORE.beacon({
            c1:1,
            c2:"6035051",
            c3:"BBC_Sites",
            c4:"BBC",
            c5:"09",
            c6:"",
            c15:""
        });
    // Not used for live streams hence the -1 !== obj.mediaLength
    } else if('programme' == obj.mediaType && -1 !== obj.mediaLength) {
        // TODO - Move request into bbcdotcom.av.emp.analytics when alignment live
        COMSCORE.beacon({
            c1:1,
            c2:"6035051",
            c3:"BBC_Sites",
            c4:"BBC",
            c5:"02",
            c6:"",
            c15:""
        });
        // Need to play the media first before we do any monitoring
        // For some reason it seams that we may be using this in the wrong way
        // For example we are using the media name to set the context of the playlist
        // and then only using play and stop on the main video
        // using the same name to play and stop would increase the play reporting
        scw.setMediaProperties(obj);
        scw.Media.play(obj.mediaName, obj.mediaOffset);

        // If an ad was played we need to fire the events before playing the programme
        if(scw.adWasPlayed) {
            scw.playStopAd(obj);
        }

        obj.mediaEvent = 'contentPlay';
        scw.Media.monitor(scw, obj);
    }
}

// TODO - Add to scw. namespace
// Called by the mediaCompleted event
function stopMovie(obj) {
    // If there is an ad of longer than 5 seconds lets record it
    if('advert' == obj.mediaType && 5 < obj.mediaLength) {
        scw.adWasPlayed = true;
    } else if('programme' == obj.mediaType) {
        obj.mediaEvent = 'contentStop';
        scw.Media.monitor(scw, obj);

        scw.setMediaProperties(obj);
        scw.Media.stop(obj.mediaName, obj.mediaOffset);
    }
}

// TODO - Add to scw. namespace
// Called by the playlistCompleted event
function endMovie(obj) {
    obj.mediaEvent = 'movieEnd';
    scw.Media.monitor(scw, obj);
    // Might not need this
    scw.setMediaProperties(obj);
    scw.Media.close(obj.mediaName);
}

/* WARNING: Changing any of the below variables will cause drastic
changes to how your visitor data is collected.  Changes should only be
made when instructed to do so by your account manager.*/
scw.trackingServer="sa.bbc.com";
scw.trackingServerSecure="ssa.bbc.com";
scw.visitorMigrationKey="4F9A739C";
scw.visitorMigrationServer="bbc.112.2o7.net";
scw.visitorMigrationServerSecure="bbc.112.2o7.net";

/****************************** MODULES *****************************/
/* Module: Survey */
scw.m_Survey_c="var m=s.m_i(\"Survey\");m.launch=function(i,e,c,o,f){this._boot();var m=this,g=window.s_sv_globals||{},l,j;if(g.unloaded||m._blocked())return 0;i=i&&i.constructor&&i.constructor==Array?"
+"i:[i];l=g.manualTriggers;for(j=0;j<i.length;++j)l[l.length]={l:m._suites,i:i[j],e:e||0,c:c||0,o:o||0,f:f||0};m._execute();return 1;};m.version = 10001;m._t=function(){this._boot();var m=this,s=m.s,"
+"g=window.s_sv_globals||{},l,impr,i,k,impr={};if(m._blocked())return;for(i=0;i<s.va_t.length;i++){k=s.va_t[i];if(s[k]) impr[k]=s[k];}impr[\"l\"]=m._suites;impr[\"n\"]=impr[\"pageName\"]||\"\";impr["
+"\"u\"]=impr[\"pageURL\"]||\"\";impr[\"c\"]=impr[\"campaign\"]||\"\";impr[\"r\"]=impr[\"referrer\"]||\"\";l=g.pageImpressions;if(l.length > 4) l[l.length - 4]=null;l[l.length]=impr;m._execute();};m."
+"_rr=function(){var g=window.s_sv_globals||{},f=g.onScQueueEmpty||0;if(f)f();};m._blocked=function(){var m=this,g=window.s_sv_globals||{};return !m._booted||g.stop||!g.pending&&!g.triggerRequested;}"
+";m._execute=function(){if(s_sv_globals.execute)setTimeout(\"s_sv_globals.execute();\",0);};m._boot=function(){var m=this,s=m.s,w=window,g,c,d=s.dc,e=s.visitorNamespace,n=navigator.appName.toLowerCa"
+"se(),a=navigator.userAgent,v=navigator.appVersion,h,i,j,k,l,b;if(w.s_sv_globals)return;if(!((b=v.match(/AppleWebKit\\/([0-9]+)/))?521<b[1]:n==\"netscape\"?a.match(/gecko\\//i):(b=a.match(/opera[ \\"
+"/]?([0-9]+).[0-9]+/i))?7<b[1]:n==\"microsoft internet explorer\"&&!v.match(/macintosh/i)&&(b=v.match(/msie ([0-9]+).([0-9]+)/i))&&(5<b[1]||b[1]==5&&4<b[2])))return;g=w.s_sv_globals={};g.module=m;g."
+"pending=0;g.incomingLists=[];g.pageImpressions=[];g.manualTriggers=[];e=\"survey\";c=g.config={};m._param(c,\"dynamic_root\",(e?e+\".\":\"\")+d+\".2o7.net/survey/dynamic\");m._param(c,\"gather_root"
+"\",(e?e+\".\":\"\")+d+\".2o7.net/survey/gather\");g.url=location.protocol+\"//\"+c.dynamic_root;g.gatherUrl=location.protocol+\"//\"+c.gather_root;g.dataCenter=d;g.onListLoaded=new Function(\"r\","
+"\"b\",\"d\",\"i\",\"l\",\"s_sv_globals.module._loaded(r,b,d,i,l);\");m._suites=(m.suites||s.un).toLowerCase().split(\",\");l=m._suites;b={};for(j=0;j<l.length;++j){i=l[j];if(i&&!b[i]){h=i.length;fo"
+"r(k=0;k<i.length;++k)h=(h&0x03ffffff)<<5^h>>26^i.charCodeAt(k);b[i]={url:g.url+\"/suites/\"+(h%251+100)+\"/\"+encodeURIComponent(i.replace(/\\|/,\"||\").replace(/\\//,\"|-\"))};++g.pending;}}g.suit"
+"es=b;setTimeout(\"s_sv_globals.module._load();\",0);m._booted=1;};m._param=function(c,n,v){var p=\"s_sv_\",w=window,u=\"undefined\";if(typeof c[n]==u)c[n]=typeof w[p+n]==u?v:w[p+n];};m._load=functi"
+"on(){var m=this,g=s_sv_globals,q=g.suites,r,i,n=\"s_sv_sid\",b=m.s.c_r(n);if(!b){b=parseInt((new Date()).getTime()*Math.random());m.s.c_w(n,b);}for(i in q){r=q[i];if(!r.requested){r.requested=1;m._"
+"script(r.url+\"/list.js?\"+b);}}};m._loaded=function(r,b,d,i,l){var m=this,g=s_sv_globals,n=g.incomingLists;--g.pending;if(!g.commonRevision){g.bulkRevision=b;g.commonRevision=r;g.commonUrl=g.url+"
+"\"/common/\"+b;}else if(g.commonRevision!=r)return;if(!l.length)return;n[n.length]={r:i,l:l};if(g.execute)g.execute();else if(!g.triggerRequested){g.triggerRequested=1;m._script(g.commonUrl+\"/trig"
+"ger.js\");}};m._script=function(u){var d=document,e=d.createElement(\"script\");e.type=\"text/javascript\";e.src=u;d.getElementsByTagName(\"head\")[0].appendChild(e);};if(m.onLoad)m.onLoad(s,m)";
scw.m_i("Survey");

/* Module: Media */
scw.m_Media_c="var m=s.m_i('Media');m.cn=function(n){var m=this;return m.s.rep(m.s.rep(m.s.rep(n,\"\\n\",''),\"\\r\",''),'--**--','')};m.open=function(n,l,p,b){var m=this,i=new Object,tm=new Date,a='',"
+"x;n=m.cn(n);l=parseInt(l);if(!l)l=1;if(n&&p){if(!m.l)m.l=new Object;if(m.l[n])m.close(n);if(b&&b.id)a=b.id;for (x in m.l)if(m.l[x]&&m.l[x].a==a)m.close(m.l[x].n);i.n=n;i.l=l;i.p=m.cn(p);i.a=a;i.t=0"
+";i.ts=0;i.s=Math.floor(tm.getTime()/1000);i.lx=0;i.lt=i.s;i.lo=0;i.e='';i.to=-1;m.l[n]=i}};m.close=function(n){this.e(n,0,-1)};m.play=function(n,o){var m=this,i;i=m.e(n,1,o);i.m=new Function('var m"
+"=s_c_il['+m._in+'],i;if(m.l){i=m.l[\"'+m.s.rep(i.n,'\"','\\\\\"')+'\"];if(i){if(i.lx==1)m.e(i.n,3,-1);i.mt=setTimeout(i.m,5000)}}');i.m()};m.stop=function(n,o){this.e(n,2,o)};m.track=function(n){va"
+"r m=this;if (m.trackWhilePlaying) {m.e(n,4,-1)}};m.e=function(n,x,o){var m=this,i,tm=new Date,ts=Math.floor(tm.getTime()/1000),ti=m.trackSeconds,tp=m.trackMilestones,z=new Array,j,d='--**--',t=1,b,"
+"v=m.trackVars,e=m.trackEvents,pe='media',pev3,w=new Object,vo=new Object;n=m.cn(n);i=n&&m.l&&m.l[n]?m.l[n]:0;if(i){w.name=n;w.length=i.l;w.playerName=i.p;if(i.to<0)w.event=\"OPEN\";else w.event=(x="
+"=1?\"PLAY\":(x==2?\"STOP\":(x==3?\"MONITOR\":\"CLOSE\")));w.openTime=new Date();w.openTime.setTime(i.s*1000);if(x>2||(x!=i.lx&&(x!=2||i.lx==1))) {b=\"Media.\"+name;pev3 = m.s.ape(i.n)+d+i.l+d+m.s.a"
+"pe(i.p)+d;if(x){if(o<0&&i.lt>0){o=(ts-i.lt)+i.lo;o=o<i.l?o:i.l-1}o=Math.floor(o);if(x>=2&&i.lo<o){i.t+=o-i.lo;i.ts+=o-i.lo;}if(x<=2){i.e+=(x==1?'S':'E')+o;i.lx=x;}else if(i.lx!=1)m.e(n,1,o);i.lt=ts"
+";i.lo=o;pev3+=i.t+d+i.s+d+(m.trackWhilePlaying&&i.to>=0?'L'+i.to:'')+i.e+(x!=2?(m.trackWhilePlaying?'L':'E')+o:'');if(m.trackWhilePlaying){b=0;pe='m_o';if(x!=4){w.offset=o;w.percent=((w.offset+1)/w"
+".length)*100;w.percent=w.percent>100?100:Math.floor(w.percent);w.timePlayed=i.t;if(m.monitor)m.monitor(m.s,w)}if(i.to<0)pe='m_s';else if(x==4)pe='m_i';else{t=0;v=e='None';ti=ti?parseInt(ti):0;z=tp?"
+"m.s.sp(tp,','):0;if(ti&&i.ts>=ti)t=1;else if(z){if(o<i.to)i.to=o;else{for(j=0;j<z.length;j++){ti=z[j]?parseInt(z[j]):0;if(ti&&((i.to+1)/i.l<ti/100)&&((o+1)/i.l>=ti/100)){t=1;j=z.length}}}}}}}else{m"
+".e(n,2,-1);if(m.trackWhilePlaying){w.offset=i.lo;w.percent=((w.offset+1)/w.length)*100;w.percent=w.percent>100?100:Math.floor(w.percent);w.timePlayed=i.t;if(m.monitor)m.monitor(m.s,w)}m.l[n]=0;if(i"
+".e){pev3+=i.t+d+i.s+d+(m.trackWhilePlaying&&i.to>=0?'L'+i.to:'')+i.e;if(m.trackWhilePlaying){v=e='None';pe='m_o'}else{t=0;m.s.fbr(b)}}else t=0;b=0}if(t){vo.linkTrackVars=v;vo.linkTrackEvents=e;vo.p"
+"e=pe;vo.pev3=pev3;m.s.t(vo,b);if(m.trackWhilePlaying){i.ts=0;i.to=o;i.e=''}}}}return i};m.ae=function(n,l,p,x,o,b){if(n&&p){var m=this;if(!m.l||!m.l[n])m.open(n,l,p,b);m.e(n,x,o)}};m.a=function(o,t"
+"){var m=this,i=o.id?o.id:o.name,n=o.name,p=0,v,c,c1,c2,xc=m.s.h,x,e,f1,f2='s_media_'+m._in+'_oc',f3='s_media_'+m._in+'_t',f4='s_media_'+m._in+'_s',f5='s_media_'+m._in+'_l',f6='s_media_'+m._in+'_m',"
+"f7='s_media_'+m._in+'_c',tcf,w;if(!i){if(!m.c)m.c=0;i='s_media_'+m._in+'_'+m.c;m.c++}if(!o.id)o.id=i;if(!o.name)o.name=n=i;if(!m.ol)m.ol=new Object;if(m.ol[i])return;m.ol[i]=o;if(!xc)xc=m.s.b;tcf=n"
+"ew Function('o','var e,p=0;try{if(o.versionInfo&&o.currentMedia&&o.controls)p=1}catch(e){p=0}return p');p=tcf(o);if(!p){tcf=new Function('o','var e,p=0,t;try{t=o.GetQuickTimeVersion();if(t)p=2}catc"
+"h(e){p=0}return p');p=tcf(o);if(!p){tcf=new Function('o','var e,p=0,t;try{t=o.GetVersionInfo();if(t)p=3}catch(e){p=0}return p');p=tcf(o)}}v=\"var m=s_c_il[\"+m._in+\"],o=m.ol['\"+i+\"']\";if(p==1){"
+"p='Windows Media Player '+o.versionInfo;c1=v+',n,p,l,x=-1,cm,c,mn;if(o){cm=o.currentMedia;c=o.controls;if(cm&&c){mn=cm.name?cm.name:c.URL;l=cm.duration;p=c.currentPosition;n=o.playState;if(n){if(n="
+"=8)x=0;if(n==3)x=1;if(n==1||n==2||n==4||n==5||n==6)x=2;}';c2='if(x>=0)m.ae(mn,l,\"'+p+'\",x,x!=2?p:-1,o)}}';c=c1+c2;if(m.s.isie&&xc){x=m.s.d.createElement('script');x.language='jscript';x.type='tex"
+"t/javascript';x.htmlFor=i;x.event='PlayStateChange(NewState)';x.defer=true;x.text=c;xc.appendChild(x);o[f6]=new Function(c1+'if(n==3){x=3;'+c2+'}setTimeout(o.'+f6+',5000)');o[f6]()}}if(p==2){p='Qui"
+"ckTime Player '+(o.GetIsQuickTimeRegistered()?'Pro ':'')+o.GetQuickTimeVersion();f1=f2;c=v+',n,x,t,l,p,p2,mn;if(o){mn=o.GetMovieName()?o.GetMovieName():o.GetURL();n=o.GetRate();t=o.GetTimeScale();l"
+"=o.GetDuration()/t;p=o.GetTime()/t;p2=o.'+f5+';if(n!=o.'+f4+'||p<p2||p-p2>5){x=2;if(n!=0)x=1;else if(p>=l)x=0;if(p<p2||p-p2>5)m.ae(mn,l,\"'+p+'\",2,p2,o);m.ae(mn,l,\"'+p+'\",x,x!=2?p:-1,o)}if(n>0&&"
+"o.'+f7+'>=10){m.ae(mn,l,\"'+p+'\",3,p,o);o.'+f7+'=0}o.'+f7+'++;o.'+f4+'=n;o.'+f5+'=p;setTimeout(\"'+v+';o.'+f2+'(0,0)\",500)}';o[f1]=new Function('a','b',c);o[f4]=-1;o[f7]=0;o[f1](0,0)}if(p==3){p='"
+"RealPlayer '+o.GetVersionInfo();f1=n+'_OnPlayStateChange';c1=v+',n,x=-1,l,p,mn;if(o){mn=o.GetTitle()?o.GetTitle():o.GetSource();n=o.GetPlayState();l=o.GetLength()/1000;p=o.GetPosition()/1000;if(n!="
+"o.'+f4+'){if(n==3)x=1;if(n==0||n==2||n==4||n==5)x=2;if(n==0&&(p>=l||p==0))x=0;if(x>=0)m.ae(mn,l,\"'+p+'\",x,x!=2?p:-1,o)}if(n==3&&(o.'+f7+'>=10||!o.'+f3+')){m.ae(mn,l,\"'+p+'\",3,p,o);o.'+f7+'=0}o."
+"'+f7+'++;o.'+f4+'=n;';c2='if(o.'+f2+')o.'+f2+'(o,n)}';if(m.s.wd[f1])o[f2]=m.s.wd[f1];m.s.wd[f1]=new Function('a','b',c1+c2);o[f1]=new Function('a','b',c1+'setTimeout(\"'+v+';o.'+f1+'(0,0)\",o.'+f3+"
+"'?500:5000);'+c2);o[f4]=-1;if(m.s.isie)o[f3]=1;o[f7]=0;o[f1](0,0)}};m.as=new Function('e','var m=s_c_il['+m._in+'],l,n;if(m.autoTrack&&m.s.d.getElementsByTagName){l=m.s.d.getElementsByTagName(m.s.i"
+"sie?\"OBJECT\":\"EMBED\");if(l)for(n=0;n<l.length;n++)m.a(l[n]);}');if(s.wd.attachEvent)s.wd.attachEvent('onload',m.as);else if(s.wd.addEventListener)s.wd.addEventListener('load',m.as,false)";
scw.m_i("Media");


/************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
var s_code='',s_objectID;function s_gi(un,pg,ss){var c="s._c='s_c';s.wd=window;if(!s.wd.s_c_in){s.wd.s_c_il=new Array;s.wd.s_c_in=0;}s._il=s.wd.s_c_il;s._in=s.wd.s_c_in;s._il[s._in]=s;s.wd.s_c_in++;s"
+".an=s_an;s.cls=function(x,c){var i,y='';if(!c)c=this.an;for(i=0;i<x.length;i++){n=x.substring(i,i+1);if(c.indexOf(n)>=0)y+=n}return y};s.fl=function(x,l){return x?(''+x).substring(0,l):x};s.co=func"
+"tion(o){if(!o)return o;var n=new Object,x;for(x in o)if(x.indexOf('select')<0&&x.indexOf('filter')<0)n[x]=o[x];return n};s.num=function(x){x=''+x;for(var p=0;p<x.length;p++)if(('0123456789').indexO"
+"f(x.substring(p,p+1))<0)return 0;return 1};s.rep=s_rep;s.sp=s_sp;s.jn=s_jn;s.ape=function(x){var s=this,h='0123456789ABCDEF',i,c=s.charSet,n,l,e,y='';c=c?c.toUpperCase():'';if(x){x=''+x;if(s.em==3)"
+"return encodeURIComponent(x);else if(c=='AUTO'&&('').charCodeAt){for(i=0;i<x.length;i++){c=x.substring(i,i+1);n=x.charCodeAt(i);if(n>127){l=0;e='';while(n||l<4){e=h.substring(n%16,n%16+1)+e;n=(n-n%"
+"16)/16;l++}y+='%u'+e}else if(c=='+')y+='%2B';else y+=escape(c)}return y}else{x=s.rep(escape(''+x),'+','%2B');if(c&&s.em==1&&x.indexOf('%u')<0&&x.indexOf('%U')<0){i=x.indexOf('%');while(i>=0){i++;if"
+"(h.substring(8).indexOf(x.substring(i,i+1).toUpperCase())>=0)return x.substring(0,i)+'u00'+x.substring(i);i=x.indexOf('%',i)}}}}return x};s.epa=function(x){var s=this;if(x){x=''+x;return s.em==3?de"
+"codeURIComponent(x):unescape(s.rep(x,'+',' '))}return x};s.pt=function(x,d,f,a){var s=this,t=x,z=0,y,r;while(t){y=t.indexOf(d);y=y<0?t.length:y;t=t.substring(0,y);r=s[f](t,a);if(r)return r;z+=y+d.l"
+"ength;t=x.substring(z,x.length);t=z<x.length?t:''}return ''};s.isf=function(t,a){var c=a.indexOf(':');if(c>=0)a=a.substring(0,c);if(t.substring(0,2)=='s_')t=t.substring(2);return (t!=''&&t==a)};s.f"
+"sf=function(t,a){var s=this;if(s.pt(a,',','isf',t))s.fsg+=(s.fsg!=''?',':'')+t;return 0};s.fs=function(x,f){var s=this;s.fsg='';s.pt(x,',','fsf',f);return s.fsg};s.si=function(){var s=this,i,k,v,c="
+"s_gi+'var s=s_gi(\"'+s.oun+'\");s.sa(\"'+s.un+'\");';for(i=0;i<s.va_g.length;i++){k=s.va_g[i];v=s[k];if(v!=undefined){if(typeof(v)=='string')c+='s.'+k+'=\"'+s_fe(v)+'\";';else c+='s.'+k+'='+v+';'}}"
+"c+=\"s.lnk=s.eo=s.linkName=s.linkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';\";return c};s.c_d='';s.c_gdf=function(t,a){var s=this;if(!s.num(t))return 1;return 0};s.c_gd=function(){var"
+" s=this,d=s.wd.location.hostname,n=s.fpCookieDomainPeriods,p;if(!n)n=s.cookieDomainPeriods;if(d&&!s.c_d){n=n?parseInt(n):2;n=n>2?n:2;p=d.lastIndexOf('.');if(p>=0){while(p>=0&&n>1){p=d.lastIndexOf('"
+".',p-1);n--}s.c_d=p>0&&s.pt(d,'.','c_gdf',0)?d.substring(p):d}}return s.c_d};s.c_r=function(k){var s=this;k=s.ape(k);var c=' '+s.d.cookie,i=c.indexOf(' '+k+'='),e=i<0?i:c.indexOf(';',i),v=i<0?'':s."
+"epa(c.substring(i+2+k.length,e<0?c.length:e));return v!='[[B]]'?v:''};s.c_w=function(k,v,e){var s=this,d=s.c_gd(),l=s.cookieLifetime,t;v=''+v;l=l?(''+l).toUpperCase():'';if(e&&l!='SESSION'&&l!='NON"
+"E'){t=(v!=''?parseInt(l?l:0):-60);if(t){e=new Date;e.setTime(e.getTime()+(t*1000))}}if(k&&l!='NONE'){s.d.cookie=k+'='+s.ape(v!=''?v:'[[B]]')+'; path=/;'+(e&&l!='SESSION'?' expires='+e.toGMTString()"
+"+';':'')+(d?' domain='+d+';':'');return s.c_r(k)==v}return 0};s.eh=function(o,e,r,f){var s=this,b='s_'+e+'_'+s._in,n=-1,l,i,x;if(!s.ehl)s.ehl=new Array;l=s.ehl;for(i=0;i<l.length&&n<0;i++){if(l[i]."
+"o==o&&l[i].e==e)n=i}if(n<0){n=i;l[n]=new Object}x=l[n];x.o=o;x.e=e;f=r?x.b:f;if(r||f){x.b=r?0:o[e];x.o[e]=f}if(x.b){x.o[b]=x.b;return b}return 0};s.cet=function(f,a,t,o,b){var s=this,r,tcf;if(s.apv"
+">=5&&(!s.isopera||s.apv>=7)){tcf=new Function('s','f','a','t','var e,r;try{r=s[f](a)}catch(e){r=s[t](e)}return r');r=tcf(s,f,a,t)}else{if(s.ismac&&s.u.indexOf('MSIE 4')>=0)r=s[b](a);else{s.eh(s.wd,"
+"'onerror',0,o);r=s[f](a);s.eh(s.wd,'onerror',1)}}return r};s.gtfset=function(e){var s=this;return s.tfs};s.gtfsoe=new Function('e','var s=s_c_il['+s._in+'],c;s.eh(window,\"onerror\",1);s.etfs=1;c=s"
+".t();if(c)s.d.write(c);s.etfs=0;return true');s.gtfsfb=function(a){return window};s.gtfsf=function(w){var s=this,p=w.parent,l=w.location;s.tfs=w;if(p&&p.location!=l&&p.location.host==l.host){s.tfs="
+"p;return s.gtfsf(s.tfs)}return s.tfs};s.gtfs=function(){var s=this;if(!s.tfs){s.tfs=s.wd;if(!s.etfs)s.tfs=s.cet('gtfsf',s.tfs,'gtfset',s.gtfsoe,'gtfsfb')}return s.tfs};s.mrq=function(u){var s=this,"
+"l=s.rl[u],n,r;s.rl[u]=0;if(l)for(n=0;n<l.length;n++){r=l[n];s.mr(0,0,r.r,0,r.t,r.u)}};s.br=function(id,rs){var s=this;if(s.disableBufferedRequests||!s.c_w('s_br',rs))s.brl=rs};s.flushBufferedReques"
+"ts=function(){this.fbr(0)};s.fbr=function(id){var s=this,br=s.c_r('s_br');if(!br)br=s.brl;if(br){if(!s.disableBufferedRequests)s.c_w('s_br','');s.mr(0,0,br)}s.brl=0};s.mr=function(sess,q,rs,id,ta,u"
+"){var s=this,dc=s.dc,t1=s.trackingServer,t2=s.trackingServerSecure,tb=s.trackingServerBase,p='.sc',ns=s.visitorNamespace,un=s.cls(u?u:(ns?ns:s.fun)),r=new Object,l,imn='s_i_'+(un),im,b,e;if(!rs){if"
+"(t1){if(t2&&s.ssl)t1=t2}else{if(!tb)tb='2o7.net';if(dc)dc=(''+dc).toLowerCase();else dc='d1';if(tb=='2o7.net'){if(dc=='d1')dc='112';else if(dc=='d2')dc='122';p=''}t1=un+'.'+dc+'.'+p+tb}rs='http'+(s"
+".ssl?'s':'')+'://'+t1+'/b/ss/'+s.un+'/'+(s.mobile?'5.1':'1')+'/H.22.1/'+sess+'?AQB=1&ndh=1'+(q?q:'')+'&AQE=1';if(s.isie&&!s.ismac)rs=s.fl(rs,2047);if(id){s.br(id,rs);return}}if(s.d.images&&s.apv>=3"
+"&&(!s.isopera||s.apv>=7)&&(s.ns6<0||s.apv>=6.1)){if(!s.rc)s.rc=new Object;if(!s.rc[un]){s.rc[un]=1;if(!s.rl)s.rl=new Object;s.rl[un]=new Array;setTimeout('if(window.s_c_il)window.s_c_il['+s._in+']."
+"mrq(\"'+un+'\")',750)}else{l=s.rl[un];if(l){r.t=ta;r.u=un;r.r=rs;l[l.length]=r;return ''}imn+='_'+s.rc[un];s.rc[un]++}im=s.wd[imn];if(!im)im=s.wd[imn]=new Image;im.s_l=0;im.onload=new Function('e',"
+"'this.s_l=1;var wd=window,s;if(wd.s_c_il){s=wd.s_c_il['+s._in+'];s.mrq(\"'+un+'\");s.nrs--;if(!s.nrs)s.m_m(\"rr\")}');if(!s.nrs){s.nrs=1;s.m_m('rs')}else s.nrs++;im.src=rs;if((!ta||ta=='_self'||ta="
+"='_top'||(s.wd.name&&ta==s.wd.name))&&rs.indexOf('&pe=')>=0){b=e=new Date;while(!im.s_l&&e.getTime()-b.getTime()<500)e=new Date}return ''}return '<im'+'g sr'+'c=\"'+rs+'\" width=1 height=1 border=0"
+" alt=\"\">'};s.gg=function(v){var s=this;if(!s.wd['s_'+v])s.wd['s_'+v]='';return s.wd['s_'+v]};s.glf=function(t,a){if(t.substring(0,2)=='s_')t=t.substring(2);var s=this,v=s.gg(t);if(v)s[t]=v};s.gl="
+"function(v){var s=this;if(s.pg)s.pt(v,',','glf',0)};s.rf=function(x){var s=this,y,i,j,h,l,a,b='',c='',t;if(x){y=''+x;i=y.indexOf('?');if(i>0){a=y.substring(i+1);y=y.substring(0,i);h=y.toLowerCase()"
+";i=0;if(h.substring(0,7)=='http://')i+=7;else if(h.substring(0,8)=='https://')i+=8;h=h.substring(i);i=h.indexOf(\"/\");if(i>0){h=h.substring(0,i);if(h.indexOf('google')>=0){a=s.sp(a,'&');if(a.lengt"
+"h>1){l=',q,ie,start,search_key,word,kw,cd,';for(j=0;j<a.length;j++){t=a[j];i=t.indexOf('=');if(i>0&&l.indexOf(','+t.substring(0,i)+',')>=0)b+=(b?'&':'')+t;else c+=(c?'&':'')+t}if(b&&c){y+='?'+b+'&'"
+"+c;if(''+x!=y)x=y}}}}}}return x};s.hav=function(){var s=this,qs='',fv=s.linkTrackVars,fe=s.linkTrackEvents,mn,i;if(s.pe){mn=s.pe.substring(0,1).toUpperCase()+s.pe.substring(1);if(s[mn]){fv=s[mn].tr"
+"ackVars;fe=s[mn].trackEvents}}fv=fv?fv+','+s.vl_l+','+s.vl_l2:'';for(i=0;i<s.va_t.length;i++){var k=s.va_t[i],v=s[k],b=k.substring(0,4),x=k.substring(4),n=parseInt(x),q=k;if(v&&k!='linkName'&&k!='l"
+"inkType'){if(s.pe||s.lnk||s.eo){if(fv&&(','+fv+',').indexOf(','+k+',')<0)v='';if(k=='events'&&fe)v=s.fs(v,fe)}if(v){if(k=='dynamicVariablePrefix')q='D';else if(k=='visitorID')q='vid';else if(k=='pa"
+"geURL'){q='g';v=s.fl(v,255)}else if(k=='referrer'){q='r';v=s.fl(s.rf(v),255)}else if(k=='vmk'||k=='visitorMigrationKey')q='vmt';else if(k=='visitorMigrationServer'){q='vmf';if(s.ssl&&s.visitorMigra"
+"tionServerSecure)v=''}else if(k=='visitorMigrationServerSecure'){q='vmf';if(!s.ssl&&s.visitorMigrationServer)v=''}else if(k=='charSet'){q='ce';if(v.toUpperCase()=='AUTO')v='ISO8859-1';else if(s.em="
+"=2||s.em==3)v='UTF-8'}else if(k=='visitorNamespace')q='ns';else if(k=='cookieDomainPeriods')q='cdp';else if(k=='cookieLifetime')q='cl';else if(k=='variableProvider')q='vvp';else if(k=='currencyCode"
+"')q='cc';else if(k=='channel')q='ch';else if(k=='transactionID')q='xact';else if(k=='campaign')q='v0';else if(k=='resolution')q='s';else if(k=='colorDepth')q='c';else if(k=='javascriptVersion')q='j"
+"';else if(k=='javaEnabled')q='v';else if(k=='cookiesEnabled')q='k';else if(k=='browserWidth')q='bw';else if(k=='browserHeight')q='bh';else if(k=='connectionType')q='ct';else if(k=='homepage')q='hp'"
+";else if(k=='plugins')q='p';else if(s.num(x)){if(b=='prop')q='c'+n;else if(b=='eVar')q='v'+n;else if(b=='list')q='l'+n;else if(b=='hier'){q='h'+n;v=s.fl(v,255)}}if(v)qs+='&'+q+'='+(k.substring(0,3)"
+"!='pev'?s.ape(v):v)}}}return qs};s.ltdf=function(t,h){t=t?t.toLowerCase():'';h=h?h.toLowerCase():'';var qi=h.indexOf('?');h=qi>=0?h.substring(0,qi):h;if(t&&h.substring(h.length-(t.length+1))=='.'+t"
+")return 1;return 0};s.ltef=function(t,h){t=t?t.toLowerCase():'';h=h?h.toLowerCase():'';if(t&&h.indexOf(t)>=0)return 1;return 0};s.lt=function(h){var s=this,lft=s.linkDownloadFileTypes,lef=s.linkExt"
+"ernalFilters,lif=s.linkInternalFilters;lif=lif?lif:s.wd.location.hostname;h=h.toLowerCase();if(s.trackDownloadLinks&&lft&&s.pt(lft,',','ltdf',h))return 'd';if(s.trackExternalLinks&&h.substring(0,1)"
+"!='#'&&(lef||lif)&&(!lef||s.pt(lef,',','ltef',h))&&(!lif||!s.pt(lif,',','ltef',h)))return 'e';return ''};s.lc=new Function('e','var s=s_c_il['+s._in+'],b=s.eh(this,\"onclick\");s.lnk=s.co(this);s.t"
+"();s.lnk=0;if(b)return this[b](e);return true');s.bc=new Function('e','var s=s_c_il['+s._in+'],f,tcf;if(s.d&&s.d.all&&s.d.all.cppXYctnr)return;s.eo=e.srcElement?e.srcElement:e.target;tcf=new Functi"
+"on(\"s\",\"var e;try{if(s.eo&&(s.eo.tagName||s.eo.parentElement||s.eo.parentNode))s.t()}catch(e){}\");tcf(s);s.eo=0');s.oh=function(o){var s=this,l=s.wd.location,h=o.href?o.href:'',i,j,k,p;i=h.inde"
+"xOf(':');j=h.indexOf('?');k=h.indexOf('/');if(h&&(i<0||(j>=0&&i>j)||(k>=0&&i>k))){p=o.protocol&&o.protocol.length>1?o.protocol:(l.protocol?l.protocol:'');i=l.pathname.lastIndexOf('/');h=(p?p+'//':'"
+"')+(o.host?o.host:(l.host?l.host:''))+(h.substring(0,1)!='/'?l.pathname.substring(0,i<0?0:i)+'/':'')+h}return h};s.ot=function(o){var t=o.tagName;t=t&&t.toUpperCase?t.toUpperCase():'';if(t=='SHAPE'"
+")t='';if(t){if((t=='INPUT'||t=='BUTTON')&&o.type&&o.type.toUpperCase)t=o.type.toUpperCase();else if(!t&&o.href)t='A';}return t};s.oid=function(o){var s=this,t=s.ot(o),p,c,n='',x=0;if(t&&!o.s_oid){p"
+"=o.protocol;c=o.onclick;if(o.href&&(t=='A'||t=='AREA')&&(!c||!p||p.toLowerCase().indexOf('javascript')<0))n=s.oh(o);else if(c){n=s.rep(s.rep(s.rep(s.rep(''+c,\"\\r\",''),\"\\n\",''),\"\\t\",''),' '"
+",'');x=2}else if(t=='INPUT'||t=='SUBMIT'){if(o.value)n=o.value;else if(o.innerText)n=o.innerText;else if(o.textContent)n=o.textContent;x=3}else if(o.src&&t=='IMAGE')n=o.src;if(n){o.s_oid=s.fl(n,100"
+");o.s_oidt=x}}return o.s_oid};s.rqf=function(t,un){var s=this,e=t.indexOf('='),u=e>=0?t.substring(0,e):'',q=e>=0?s.epa(t.substring(e+1)):'';if(u&&q&&(','+u+',').indexOf(','+un+',')>=0){if(u!=s.un&&"
+"s.un.indexOf(',')>=0)q='&u='+u+q+'&u=0';return q}return ''};s.rq=function(un){if(!un)un=this.un;var s=this,c=un.indexOf(','),v=s.c_r('s_sq'),q='';if(c<0)return s.pt(v,'&','rqf',un);return s.pt(un,'"
+",','rq',0)};s.sqp=function(t,a){var s=this,e=t.indexOf('='),q=e<0?'':s.epa(t.substring(e+1));s.sqq[q]='';if(e>=0)s.pt(t.substring(0,e),',','sqs',q);return 0};s.sqs=function(un,q){var s=this;s.squ[u"
+"n]=q;return 0};s.sq=function(q){var s=this,k='s_sq',v=s.c_r(k),x,c=0;s.sqq=new Object;s.squ=new Object;s.sqq[q]='';s.pt(v,'&','sqp',0);s.pt(s.un,',','sqs',q);v='';for(x in s.squ)if(x&&(!Object||!Ob"
+"ject.prototype||!Object.prototype[x]))s.sqq[s.squ[x]]+=(s.sqq[s.squ[x]]?',':'')+x;for(x in s.sqq)if(x&&(!Object||!Object.prototype||!Object.prototype[x])&&s.sqq[x]&&(x==q||c<2)){v+=(v?'&':'')+s.sqq"
+"[x]+'='+s.ape(x);c++}return s.c_w(k,v,0)};s.wdl=new Function('e','var s=s_c_il['+s._in+'],r=true,b=s.eh(s.wd,\"onload\"),i,o,oc;if(b)r=this[b](e);for(i=0;i<s.d.links.length;i++){o=s.d.links[i];oc=o"
+".onclick?\"\"+o.onclick:\"\";if((oc.indexOf(\"s_gs(\")<0||oc.indexOf(\".s_oc(\")>=0)&&oc.indexOf(\".tl(\")<0)s.eh(o,\"onclick\",0,s.lc);}return r');s.wds=function(){var s=this;if(s.apv>3&&(!s.isie|"
+"|!s.ismac||s.apv>=5)){if(s.b&&s.b.attachEvent)s.b.attachEvent('onclick',s.bc);else if(s.b&&s.b.addEventListener)s.b.addEventListener('click',s.bc,false);else s.eh(s.wd,'onload',0,s.wdl)}};s.vs=func"
+"tion(x){var s=this,v=s.visitorSampling,g=s.visitorSamplingGroup,k='s_vsn_'+s.un+(g?'_'+g:''),n=s.c_r(k),e=new Date,y=e.getYear();e.setYear(y+10+(y<1900?1900:0));if(v){v*=100;if(!n){if(!s.c_w(k,x,e)"
+")return 0;n=x}if(n%10000>v)return 0}return 1};s.dyasmf=function(t,m){if(t&&m&&m.indexOf(t)>=0)return 1;return 0};s.dyasf=function(t,m){var s=this,i=t?t.indexOf('='):-1,n,x;if(i>=0&&m){var n=t.subst"
+"ring(0,i),x=t.substring(i+1);if(s.pt(x,',','dyasmf',m))return n}return 0};s.uns=function(){var s=this,x=s.dynamicAccountSelection,l=s.dynamicAccountList,m=s.dynamicAccountMatch,n,i;s.un=s.un.toLowe"
+"rCase();if(x&&l){if(!m)m=s.wd.location.host;if(!m.toLowerCase)m=''+m;l=l.toLowerCase();m=m.toLowerCase();n=s.pt(l,';','dyasf',m);if(n)s.un=n}i=s.un.indexOf(',');s.fun=i<0?s.un:s.un.substring(0,i)};"
+"s.sa=function(un){var s=this;s.un=un;if(!s.oun)s.oun=un;else if((','+s.oun+',').indexOf(','+un+',')<0)s.oun+=','+un;s.uns()};s.m_i=function(n,a){var s=this,m,f=n.substring(0,1),r,l,i;if(!s.m_l)s.m_"
+"l=new Object;if(!s.m_nl)s.m_nl=new Array;m=s.m_l[n];if(!a&&m&&m._e&&!m._i)s.m_a(n);if(!m){m=new Object,m._c='s_m';m._in=s.wd.s_c_in;m._il=s._il;m._il[m._in]=m;s.wd.s_c_in++;m.s=s;m._n=n;m._l=new Ar"
+"ray('_c','_in','_il','_i','_e','_d','_dl','s','n','_r','_g','_g1','_t','_t1','_x','_x1','_rs','_rr','_l');s.m_l[n]=m;s.m_nl[s.m_nl.length]=n}else if(m._r&&!m._m){r=m._r;r._m=m;l=m._l;for(i=0;i<l.le"
+"ngth;i++)if(m[l[i]])r[l[i]]=m[l[i]];r._il[r._in]=r;m=s.m_l[n]=r}if(f==f.toUpperCase())s[n]=m;return m};s.m_a=new Function('n','g','e','if(!g)g=\"m_\"+n;var s=s_c_il['+s._in+'],c=s[g+\"_c\"],m,x,f=0"
+";if(!c)c=s.wd[\"s_\"+g+\"_c\"];if(c&&s_d)s[g]=new Function(\"s\",s_ft(s_d(c)));x=s[g];if(!x)x=s.wd[\\'s_\\'+g];if(!x)x=s.wd[g];m=s.m_i(n,1);if(x&&(!m._i||g!=\"m_\"+n)){m._i=f=1;if((\"\"+x).indexOf("
+"\"function\")>=0)x(s);else s.m_m(\"x\",n,x,e)}m=s.m_i(n,1);if(m._dl)m._dl=m._d=0;s.dlt();return f');s.m_m=function(t,n,d,e){t='_'+t;var s=this,i,x,m,f='_'+t,r=0,u;if(s.m_l&&s.m_nl)for(i=0;i<s.m_nl."
+"length;i++){x=s.m_nl[i];if(!n||x==n){m=s.m_i(x);u=m[t];if(u){if((''+u).indexOf('function')>=0){if(d&&e)u=m[t](d,e);else if(d)u=m[t](d);else u=m[t]()}}if(u)r=1;u=m[t+1];if(u&&!m[f]){if((''+u).indexO"
+"f('function')>=0){if(d&&e)u=m[t+1](d,e);else if(d)u=m[t+1](d);else u=m[t+1]()}}m[f]=1;if(u)r=1}}return r};s.m_ll=function(){var s=this,g=s.m_dl,i,o;if(g)for(i=0;i<g.length;i++){o=g[i];if(o)s.loadMo"
+"dule(o.n,o.u,o.d,o.l,o.e,1);g[i]=0}};s.loadModule=function(n,u,d,l,e,ln){var s=this,m=0,i,g,o=0,f1,f2,c=s.h?s.h:s.b,b,tcf;if(n){i=n.indexOf(':');if(i>=0){g=n.substring(i+1);n=n.substring(0,i)}else "
+"g=\"m_\"+n;m=s.m_i(n)}if((l||(n&&!s.m_a(n,g)))&&u&&s.d&&c&&s.d.createElement){if(d){m._d=1;m._dl=1}if(ln){if(s.ssl)u=s.rep(u,'http:','https:');i='s_s:'+s._in+':'+n+':'+g;b='var s=s_c_il['+s._in+'],"
+"o=s.d.getElementById(\"'+i+'\");if(s&&o){if(!o.l&&s.wd.'+g+'){o.l=1;if(o.i)clearTimeout(o.i);o.i=0;s.m_a(\"'+n+'\",\"'+g+'\"'+(e?',\"'+e+'\"':'')+')}';f2=b+'o.c++;if(!s.maxDelay)s.maxDelay=250;if(!"
+"o.l&&o.c<(s.maxDelay*2)/100)o.i=setTimeout(o.f2,100)}';f1=new Function('e',b+'}');tcf=new Function('s','c','i','u','f1','f2','var e,o=0;try{o=s.d.createElement(\"script\");if(o){o.type=\"text/javas"
+"cript\";'+(n?'o.id=i;o.defer=true;o.onload=o.onreadystatechange=f1;o.f2=f2;o.l=0;':'')+'o.src=u;c.appendChild(o);'+(n?'o.c=0;o.i=setTimeout(f2,100)':'')+'}}catch(e){o=0}return o');o=tcf(s,c,i,u,f1,"
+"f2)}else{o=new Object;o.n=n+':'+g;o.u=u;o.d=d;o.l=l;o.e=e;g=s.m_dl;if(!g)g=s.m_dl=new Array;i=0;while(i<g.length&&g[i])i++;g[i]=o}}else if(n){m=s.m_i(n);m._e=1}return m};s.vo1=function(t,a){if(a[t]"
+"||a['!'+t])this[t]=a[t]};s.vo2=function(t,a){if(!a[t]){a[t]=this[t];if(!a[t])a['!'+t]=1}};s.dlt=new Function('var s=s_c_il['+s._in+'],d=new Date,i,vo,f=0;if(s.dll)for(i=0;i<s.dll.length;i++){vo=s.d"
+"ll[i];if(vo){if(!s.m_m(\"d\")||d.getTime()-vo._t>=s.maxDelay){s.dll[i]=0;s.t(vo)}else f=1}}if(s.dli)clearTimeout(s.dli);s.dli=0;if(f){if(!s.dli)s.dli=setTimeout(s.dlt,s.maxDelay)}else s.dll=0');s.d"
+"l=function(vo){var s=this,d=new Date;if(!vo)vo=new Object;s.pt(s.vl_g,',','vo2',vo);vo._t=d.getTime();if(!s.dll)s.dll=new Array;s.dll[s.dll.length]=vo;if(!s.maxDelay)s.maxDelay=250;s.dlt()};s.t=fun"
+"ction(vo,id){var s=this,trk=1,tm=new Date,sed=Math&&Math.random?Math.floor(Math.random()*10000000000000):tm.getTime(),sess='s'+Math.floor(tm.getTime()/10800000)%10+sed,y=tm.getYear(),vt=tm.getDate("
+")+'/'+tm.getMonth()+'/'+(y<1900?y+1900:y)+' '+tm.getHours()+':'+tm.getMinutes()+':'+tm.getSeconds()+' '+tm.getDay()+' '+tm.getTimezoneOffset(),tcf,tfs=s.gtfs(),ta=-1,q='',qs='',code='',vb=new Objec"
+"t;s.gl(s.vl_g);s.uns();s.m_ll();if(!s.td){var tl=tfs.location,a,o,i,x='',c='',v='',p='',bw='',bh='',j='1.0',k=s.c_w('s_cc','true',0)?'Y':'N',hp='',ct='',pn=0,ps;if(String&&String.prototype){j='1.1'"
+";if(j.match){j='1.2';if(tm.setUTCDate){j='1.3';if(s.isie&&s.ismac&&s.apv>=5)j='1.4';if(pn.toPrecision){j='1.5';a=new Array;if(a.forEach){j='1.6';i=0;o=new Object;tcf=new Function('o','var e,i=0;try"
+"{i=new Iterator(o)}catch(e){}return i');i=tcf(o);if(i&&i.next)j='1.7'}}}}}if(s.apv>=4)x=screen.width+'x'+screen.height;if(s.isns||s.isopera){if(s.apv>=3){v=s.n.javaEnabled()?'Y':'N';if(s.apv>=4){c="
+"screen.pixelDepth;bw=s.wd.innerWidth;bh=s.wd.innerHeight}}s.pl=s.n.plugins}else if(s.isie){if(s.apv>=4){v=s.n.javaEnabled()?'Y':'N';c=screen.colorDepth;if(s.apv>=5){bw=s.d.documentElement.offsetWid"
+"th;bh=s.d.documentElement.offsetHeight;if(!s.ismac&&s.b){tcf=new Function('s','tl','var e,hp=0;try{s.b.addBehavior(\"#default#homePage\");hp=s.b.isHomePage(tl)?\"Y\":\"N\"}catch(e){}return hp');hp="
+"tcf(s,tl);tcf=new Function('s','var e,ct=0;try{s.b.addBehavior(\"#default#clientCaps\");ct=s.b.connectionType}catch(e){}return ct');ct=tcf(s)}}}else r=''}if(s.pl)while(pn<s.pl.length&&pn<30){ps=s.f"
+"l(s.pl[pn].name,100)+';';if(p.indexOf(ps)<0)p+=ps;pn++}s.resolution=x;s.colorDepth=c;s.javascriptVersion=j;s.javaEnabled=v;s.cookiesEnabled=k;s.browserWidth=bw;s.browserHeight=bh;s.connectionType=c"
+"t;s.homepage=hp;s.plugins=p;s.td=1}if(vo){s.pt(s.vl_g,',','vo2',vb);s.pt(s.vl_g,',','vo1',vo)}if((vo&&vo._t)||!s.m_m('d')){if(s.usePlugins)s.doPlugins(s);var l=s.wd.location,r=tfs.document.referrer"
+";if(!s.pageURL)s.pageURL=l.href?l.href:l;if(!s.referrer&&!s._1_referrer){s.referrer=r;s._1_referrer=1}s.m_m('g');if(s.lnk||s.eo){var o=s.eo?s.eo:s.lnk;if(!o)return '';var p=s.pageName,w=1,t=s.ot(o)"
+",n=s.oid(o),x=o.s_oidt,h,l,i,oc;if(s.eo&&o==s.eo){while(o&&!n&&t!='BODY'){o=o.parentElement?o.parentElement:o.parentNode;if(!o)return '';t=s.ot(o);n=s.oid(o);x=o.s_oidt}oc=o.onclick?''+o.onclick:''"
+";if((oc.indexOf(\"s_gs(\")>=0&&oc.indexOf(\".s_oc(\")<0)||oc.indexOf(\".tl(\")>=0)return ''}if(n)ta=o.target;h=s.oh(o);i=h.indexOf('?');h=s.linkLeaveQueryString||i<0?h:h.substring(0,i);l=s.linkName"
+";t=s.linkType?s.linkType.toLowerCase():s.lt(h);if(t&&(h||l))q+='&pe=lnk_'+(t=='d'||t=='e'?s.ape(t):'o')+(h?'&pev1='+s.ape(h):'')+(l?'&pev2='+s.ape(l):'');else trk=0;if(s.trackInlineStats){if(!p){p="
+"s.pageURL;w=0}t=s.ot(o);i=o.sourceIndex;if(s.gg('objectID')){n=s.gg('objectID');x=1;i=1}if(p&&n&&t)qs='&pid='+s.ape(s.fl(p,255))+(w?'&pidt='+w:'')+'&oid='+s.ape(s.fl(n,100))+(x?'&oidt='+x:'')+'&ot="
+"'+s.ape(t)+(i?'&oi='+i:'')}}if(!trk&&!qs)return '';s.sampled=s.vs(sed);if(trk){if(s.sampled)code=s.mr(sess,(vt?'&t='+s.ape(vt):'')+s.hav()+q+(qs?qs:s.rq()),0,id,ta);qs='';s.m_m('t');if(s.p_r)s.p_r("
+");s.referrer=''}s.sq(qs);}else{s.dl(vo);}if(vo)s.pt(s.vl_g,',','vo1',vb);s.lnk=s.eo=s.linkName=s.linkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';if(s.pg)s.wd.s_lnk=s.wd.s_eo=s.wd.s_link"
+"Name=s.wd.s_linkType='';if(!id&&!s.tc){s.tc=1;s.flushBufferedRequests()}return code};s.tl=function(o,t,n,vo){var s=this;s.lnk=s.co(o);s.linkType=t;s.linkName=n;s.t(vo)};if(pg){s.wd.s_co=function(o)"
+"{var s=s_gi(\"_\",1,1);return s.co(o)};s.wd.s_gs=function(un){var s=s_gi(un,1,1);return s.t()};s.wd.s_dc=function(un){var s=s_gi(un,1);return s.t()}}s.ssl=(s.wd.location.protocol.toLowerCase().inde"
+"xOf('https')>=0);s.d=document;s.b=s.d.body;if(s.d.getElementsByTagName){s.h=s.d.getElementsByTagName('HEAD');if(s.h)s.h=s.h[0]}s.n=navigator;s.u=s.n.userAgent;s.ns6=s.u.indexOf('Netscape6/');var ap"
+"n=s.n.appName,v=s.n.appVersion,ie=v.indexOf('MSIE '),o=s.u.indexOf('Opera '),i;if(v.indexOf('Opera')>=0||o>0)apn='Opera';s.isie=(apn=='Microsoft Internet Explorer');s.isns=(apn=='Netscape');s.isope"
+"ra=(apn=='Opera');s.ismac=(s.u.indexOf('Mac')>=0);if(o>0)s.apv=parseFloat(s.u.substring(o+6));else if(ie>0){s.apv=parseInt(i=v.substring(ie+5));if(s.apv>3)s.apv=parseFloat(i)}else if(s.ns6>0)s.apv="
+"parseFloat(s.u.substring(s.ns6+10));else s.apv=parseFloat(v);s.em=0;if(s.em.toPrecision)s.em=3;else if(String.fromCharCode){i=escape(String.fromCharCode(256)).toUpperCase();s.em=(i=='%C4%80'?2:(i=="
+"'%U0100'?1:0))}s.sa(un);s.vl_l='dynamicVariablePrefix,visitorID,vmk,visitorMigrationKey,visitorMigrationServer,visitorMigrationServerSecure,ppu,charSet,visitorNamespace,cookieDomainPeriods,cookieLi"
+"fetime,pageName,pageURL,referrer,currencyCode';s.va_l=s.sp(s.vl_l,',');s.vl_t=s.vl_l+',variableProvider,channel,server,pageType,transactionID,purchaseID,campaign,state,zip,events,products,linkName,"
+"linkType';for(var n=1;n<76;n++)s.vl_t+=',prop'+n+',eVar'+n+',hier'+n+',list'+n;s.vl_l2=',tnt,pe,pev1,pev2,pev3,resolution,colorDepth,javascriptVersion,javaEnabled,cookiesEnabled,browserWidth,browse"
+"rHeight,connectionType,homepage,plugins';s.vl_t+=s.vl_l2;s.va_t=s.sp(s.vl_t,',');s.vl_g=s.vl_t+',trackingServer,trackingServerSecure,trackingServerBase,fpCookieDomainPeriods,disableBufferedRequests"
+",mobile,visitorSampling,visitorSamplingGroup,dynamicAccountSelection,dynamicAccountList,dynamicAccountMatch,trackDownloadLinks,trackExternalLinks,trackInlineStats,linkLeaveQueryString,linkDownloadF"
+"ileTypes,linkExternalFilters,linkInternalFilters,linkTrackVars,linkTrackEvents,linkNames,lnk,eo,_1_referrer';s.va_g=s.sp(s.vl_g,',');s.pg=pg;s.gl(s.vl_g);if(!ss)s.wds()",
w=window,l=w.s_c_il,n=navigator,u=n.userAgent,v=n.appVersion,e=v.indexOf('MSIE '),m=u.indexOf('Netscape6/'),a,i,s;if(un){un=un.toLowerCase();if(l)for(i=0;i<l.length;i++){s=l[i];if(!s._c||s._c=='s_c'){if(s.oun==un)return s;else if(s.fs&&s.sa&&s.fs(s.oun,un)){s.sa(un);return s}}}}w.s_an='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
w.s_sp=new Function("x","d","var a=new Array,i=0,j;if(x){if(x.split)a=x.split(d);else if(!d)for(i=0;i<x.length;i++)a[a.length]=x.substring(i,i+1);else while(i>=0){j=x.indexOf(d,i);a[a.length]=x.subst"
+"ring(i,j<0?x.length:j);i=j;if(i>=0)i+=d.length}}return a");
w.s_jn=new Function("a","d","var x='',i,j=a.length;if(a&&j>0){x=a[0];if(j>1){if(a.join)x=a.join(d);else for(i=1;i<j;i++)x+=d+a[i]}}return x");
w.s_rep=new Function("x","o","n","return s_jn(s_sp(x,o),n)");
w.s_d=new Function("x","var t='`^@$#',l=s_an,l2=new Object,x2,d,b=0,k,i=x.lastIndexOf('~~'),j,v,w;if(i>0){d=x.substring(0,i);x=x.substring(i+2);l=s_sp(l,'');for(i=0;i<62;i++)l2[l[i]]=i;t=s_sp(t,'');d"
+"=s_sp(d,'~');i=0;while(i<5){v=0;if(x.indexOf(t[i])>=0) {x2=s_sp(x,t[i]);for(j=1;j<x2.length;j++){k=x2[j].substring(0,1);w=t[i]+k;if(k!=' '){v=1;w=d[b+l2[k]]}x2[j]=w+x2[j].substring(1)}}if(v)x=s_jn("
+"x2,'');else{w=t[i]+' ';if(x.indexOf(w)>=0)x=s_rep(x,w,t[i]);i++;b+=62}}}return x");
w.s_fe=new Function("c","return s_rep(s_rep(s_rep(c,'\\\\','\\\\\\\\'),'\"','\\\\\"'),\"\\n\",\"\\\\n\")");
w.s_fa=new Function("f","var s=f.indexOf('(')+1,e=f.indexOf(')'),a='',c;while(s>=0&&s<e){c=f.substring(s,s+1);if(c==',')a+='\",\"';else if((\"\\n\\r\\t \").indexOf(c)<0)a+=c;s++}return a?'\"'+a+'\"':"
+"a");
w.s_ft=new Function("c","c+='';var s,e,o,a,d,q,f,h,x;s=c.indexOf('=function(');while(s>=0){s++;d=1;q='';x=0;f=c.substring(s);a=s_fa(f);e=o=c.indexOf('{',s);e++;while(d>0){h=c.substring(e,e+1);if(q){i"
+"f(h==q&&!x)q='';if(h=='\\\\')x=x?0:1;else x=0}else{if(h=='\"'||h==\"'\")q=h;if(h=='{')d++;if(h=='}')d--}if(d>0)e++}c=c.substring(0,s)+'new Function('+(a?a+',':'')+'\"'+s_fe(c.substring(o+1,e))+'\")"
+"'+c.substring(e+1);s=c.indexOf('=function(')}return c;");
c=s_d(c);if(e>0){a=parseInt(i=v.substring(e+5));if(a>3)a=parseFloat(i)}else if(m>0)a=parseFloat(u.substring(m+10));else a=parseFloat(v);if(a>=5&&v.indexOf('Opera')<0&&u.indexOf('Opera')<0){w.s_c=new Function("un","pg","ss","var s=this;"+c);return new s_c(un,pg,ss)}else s=new Function("un","pg","ss","var s=new Object;"+s_ft(c)+";return s");return s(un,pg,ss)}