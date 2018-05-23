import {
    polyfill
} from 'es6-promise';
polyfill();
// A simple data API that will be used to get the data for our
// components. On a real website, a more robust data fetching
// solution would be more appropriate.
const Device = {
    na: navigator.userAgent,
    data: [
        { name : "Browser CodeName", value : navigator.appCodeName },
        { name : "Browser Name", value : navigator.appName },
        { name : "Browser Version", value : navigator.appVersion },
        { name : "Cookies Enabled", value : navigator.cookieEnabled ? 'true': 'false'  },
        { name : "Browser Language", value : navigator.language },
        { name : "Browser Online", value : navigator.onLine ? 'true': 'false' },
        { name : "Platform", value : navigator.platform },
        { name : "User-agent header", value : navigator.userAgent },
        { name : "iOSDevice", value : ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0 ? 'true': 'false' },
        { name : "iPad", value : navigator.platform.indexOf("iPad")>-1 ? 'true': 'false' },
        { name : "iPhone", value : navigator.platform.indexOf("iPhone")>-1 ? 'true': 'false' },
        { name : "win32", value : navigator.platform.indexOf("Win32")>-1 ? 'true': 'false' },
        { name : "iOS" , value : navigator.platform.indexOf("MacIntel")>-1 ? 'true': 'false' },
        { name : "android", value : navigator.platform.indexOf("Android")>-1? 'true': 'false' }
    ]
}

export default Device