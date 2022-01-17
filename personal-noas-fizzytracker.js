// THIS TRACKER SCRIPT HAS BEEN CREATED BY FIZZY (https://fizzyelf.jcink.net/index.php?showtopic=10)
// ALL CREDITS TO FIZZY
// THE SCRIPT IS ONLY HOSTED BY YUEN HERE WITH SPECIFIC MODIFICATIONS PERTAINING TO NAP OF A STAR (https://napofastar.jcink.net/)

document.write(`<style>
.fizztrackerwrap, .fizzhistorywrap {position: relative; max-width: 500px; margin: 10px auto; padding: 1px 15px;}
.fizztrackerwrap p, .fizzhistorywrap p {
    position: relative;
    font-size: 1.2em;
    border-bottom: 1px solid;
    padding-bottom: 0.35em;
    display: flex;
    justify-content: space-between;
    font-family: Palatino, Palatino Linotype, Palatino LT STD, Book Antiqua, Georgia, serif;
}
.fizzthreadwrap {display: block; position: relative; text-decoration: none;}
.tracker-item {margin-left: 2em; margin-bottom: 0.5em;}
.fizztrackerwrap .tracker-item {text-indent: -1.75em;}
.tracker-item .status {width: 1.5em; text-align: center;font-family: serif; display: inline-block; line-height: 1}
.tracker-item .caughtup {color: green;}
.tracker-item .myturn {color: firebrick}
.tracker-item * {text-indent: 0;}
.tracker-item hr { border: 0; height: 1px; background: #8885; margin: 0.5em 12%;}
.fizzhistorywrap + span[style="font-size: 90%;"] + script + span[style="font-size: 90%;"] {display: none;}
</style>`);

function loadJsFile(filename, ifNotExists, callback ) {
    if (!ifNotExists)  {
        let fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
        if (callback) {
            fileref.onreadystatechange = callback;
            fileref.onload = callback;
        }
        document.head.appendChild(fileref);
    } else if (callback) {
        callback();
    }
}

function createTrackerElements (params, Current_Script) {

    const Open_Thread_Wrapper = $("<div class='fizztrackerwrap'></div>");
    const Alt_Thread_Wrapper = $("<div class='fizztrackerwrap' style='display:none;'></div>");
    const Closed_Thread_Wrapper = $("<div class='fizzhistorywrap'></div>");
    $(Current_Script).before(Open_Thread_Wrapper);
    $(Current_Script).before(Alt_Thread_Wrapper);
    $(Current_Script).before(Closed_Thread_Wrapper);

    params.thisTracker = $(`<div id="track${params.characterName.replace(/[^a-zA-Z]/g, '')}"></div>`);
    params.thisAltTracker = $(`<div id="alt${params.characterName.replace(/[^a-zA-Z]/g, '')}"></div>`);
    params.thisHistory = params.thisAltHistory = $(`<div id="history${params.characterName.replace(/[^a-zA-Z]/g, '')}"></div>`);

    Open_Thread_Wrapper.append(`<p>active <span class="cp cp-refresh"></span></p>`).on('click', 'p', RefreshParticipatedTracker(params));
    Alt_Thread_Wrapper.append(`<p>${params.altSectionTitle || "communications"}</p>`);
    Closed_Thread_Wrapper.append(`<p>archived</p>`);

    $(Open_Thread_Wrapper).append(params.thisTracker);
    $(Alt_Thread_Wrapper).append(params.thisAltTracker);
    $(Closed_Thread_Wrapper).append(params.thisHistory);

    $(Current_Script).before(`<center style="font-size: 90%;"> Tracker Code by <span class="cp cp-poet"></span> <a href="http://fizzyelf.jcink.net">FizzyElf</a> <span class="cp cp-paw"></span></center>`);
}

function TrackParticipatedThreads(params = {}) {
    if (window.trackernum === undefined) window.trackernum = 0;
    else trackernum++;
    params.trackernum = trackernum;
    const Is_Mobile = (document.getElementById("mobile") !== null);
console.log("tracker num ", trackernum)

    const scriptelements = document.getElementsByTagName("script");
    const Current_Script = scriptelements[scriptelements.length - 1];

    if (!params) {
        params = {};
    }
    if (!params.indicators) {
        params.indicators = ['<span class="cp cp-check-mark"></span>', '<span class="cp cp-cross"></span>'];
    }
    if (!params.lockedMacroIdentifier) {
        params.lockedMacroIdentifier = "[title*=Closed],[class*=lock],[class*=closed]";
    }
    if (!params.archiveForumNames) {
        params.archiveForumIds = ["40", "41"];
    }
    if (!params.altForumNames) {
        params.altForumIds: ["20"];
    }
    if (!params.ignoreForumNames) {
        params.ignoreForumNames = ["1", "3", "8", "11", "12", "13", "14", "15", "16", "17", "19", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "33", "34", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "93", "94", "100", "101", "102", "103", "107", "110", "117", "125", "126", "127", "129", "130", "132", "133"];
    }
    if (!params.floodControl) {
        params.floodControl = 8;
    }

    loadJsFile('https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.js', window.jQuery, function() {
        if (!params.characterName) {
            params.characterName = $(Current_Script).closest(".mobile-post, .post-normal").find("a[href*=showuser]").first().text().trim();
        }
        createTrackerElements(params, Current_Script);
        loadJsFile('https://files.jcink.net/uploads2/fizzyelf/sharedresources/autoTrackerMainProfile.js', window.FillTracker, function() {
            console.log(params.characterName, "tracker num ", params.trackernum,"timeout: ", params.floodControl * 1000 * params.trackernum )
            setTimeout(async () => {

                await FillTracker(params.characterName, params);
                if (Is_Mobile) $.get("/?act=mobile");
                if (params.thisAltTracker.text() != "None") params.thisAltTracker.parent().show();
                
            }, params.floodControl * 1000 * params.trackernum); 
            
        })
    });

}

function RefreshParticipatedTracker (params, Is_Mobile) {
    return function() {
        params.thisTracker.html('');
        params.thisAltTracker.html('');
        params.thisHistory.html('');
        setTimeout(async () => {
            await FillTracker(params.characterName, params);
            if (Is_Mobile) $.get("/?act=mobile");
            if (params.thisAltTracker.text() != "None") params.thisAltTracker.parent().show();
            
        }, 0); 
    }
}

