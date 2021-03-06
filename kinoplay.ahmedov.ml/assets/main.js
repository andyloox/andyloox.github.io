var oldRelease, navbar = document.getElementById("navbar");
var loadedOldReleases = !1;

function getOldReleases(e) {
    for (i = 0; i < e.length; i++) {
        var n = e[i],
            t = createElement("div", "releaseTableView"),
            a = createElement("span", "releaseVersion");
        a.innerText = n.name, t.appendChild(a);
        var o = createElement("span", "releaseDate");
        o.innerText = new Date(n.published_at).toLocaleDateString(), t.appendChild(o);
        var r = createElement("div", "button");
        r.innerText = "Download";
        var d = n.assets.reverse();
        for (getLink = 0; getLink < d.length; getLink++) var s = d[getLink].browser_download_url;
        var l = createElement("a");
        l.href = s, l.appendChild(r), t.appendChild(l);
        var c = new showdown.Converter;
        t.innerHTML += c.makeHtml(n.body.replace(/^((?!^- .*).)*$/gm, ""));
        try {
            if (1 < t.getElementsByTagName("ul")[0].childElementCount) {
                var m = createElement("div", "viewMoreButton");
                m.setAttribute("onClick", "expandChangelog(this)"), m.innerText = "more", t.appendChild(m)
            }
        } catch (e) { }
        document.getElementById("legacyReleases").appendChild(t)
    }
    loadedOldReleases = !0
}

function updateProgessBar(e) {
    document.getElementById("progressBar").style.transform = "translateX(-" + (100 - e) + "%)"
}

function createElement(e, n) {
    var t = document.createElement(e);
    return n && (t.className = n), t
}

function goTo(e) {
    var n = 0;
    e && (n = document.getElementById(e).getBoundingClientRect().top - document.body.getBoundingClientRect().top + 180), document.body.scrollTop = n, document.documentElement.scrollTop = n
}

function expandChangelog(e) {
    "more" == e.innerText ? e.innerText = "less" : e.innerText = "more", e.parentNode.classList.toggle("expanded")
}

function viewLegacyVersions() {
    viewLegacyVersionsButton = document.getElementById("viewLegacyVersions"), "View Previous Versions" == viewLegacyVersionsButton.innerText ? (loadedOldReleases || getOldReleases(oldRelease), document.getElementById("legacyReleases").style.display = "inline", viewLegacyVersionsButton.innerText = "Hide Previous Versions") : (document.getElementById("legacyReleases").style.display = "none", viewLegacyVersionsButton.innerText = "View Previous Versions")
}
var darkMode, animateHTML = function () {
    var n, t;

    function e() {
        n = document.querySelectorAll(".hidden"), t = window.innerHeight, window.addEventListener("scroll", a), window.addEventListener("resize", e), a()
    }

    function a() {
        for (var e = 0; e < n.length; e++) {
            n[e].getBoundingClientRect().top - t <= -200 && (n[e].className = n[e].className.replace("hidden", "fadeInElement"))
        }
    }
    return {
        init: e
    }
};

function toggleDarkMode() {
    createCookie("darkMode", darkMode = darkMode ? (document.getElementsByTagName("html")[0].classList.remove("darkMode"), !1) : (enableDarkMode(), !0), 999999)
}

function enableDarkMode() {
    document.getElementsByTagName("html")[0].classList.add("darkMode")
}

function readCookie(e) {
    for (var n = e + "=", t = document.cookie.split(";"), a = 0; a < t.length; a++) {
        for (var o = t[a];
            " " == o.charAt(0);) o = o.substring(1, o.length);
        if (0 == o.indexOf(n)) return "true" == o.substring(n.length, o.length) || "false" != o.substring(n.length, o.length) && o.substring(n.length, o.length)
    }
    return null
}

function createCookie(e, n, t) {
    if (t) {
        var a = new Date;
        a.setTime(a.getTime() + 24 * t * 60 * 60 * 1e3);
        var o = "; expires=" + a.toGMTString()
    } else o = "";
    document.cookie = e + "=" + n + o + "; path=/"
}
animateHTML().init(), window.matchMedia("(prefers-color-scheme: dark)").matches && enableDarkMode(), document.cookie ? (darkMode = readCookie("darkMode")) && enableDarkMode() : darkMode = !1;