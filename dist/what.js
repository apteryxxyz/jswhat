/* jswhat v0.0.6 | (c) 2021 Apteryx */
(function (root, factory) {
    if (typeof module === 'object' && typeof exports === 'object')
        factory(module.exports);
    else if (typeof exports === 'object')
        factory(exports);
    else
        factory(root);
})(this, function (object) {
    return (function () {
        object.what = { regex: {} };
        object.what.is = function (text, search, { filter = '', exclude = '' } = {}) {
            if (!text) text = new Error('[jswhat] Missing or invalid argument \'text\'');
            else if (Array.isArray(text) || typeof text === 'string') text = [].concat.apply([], [text]);
            else text = new Error(`[jswhat] Parameter 'text' must be an array or string`);
            if (text instanceof Error) {
                var matched = [];
                matched.error = text;
                return matched;
            } else return object.what.regex.check(text, { search, filter, exclude });
        }
        object.what.regex.check = function (strings, options = {}) {
            var timer = Date.now();
            var matched = [];
            if (typeof strings === 'string') strings = [strings];
            matched.text = strings;

            if (!strings || (!Array.isArray(strings) && typeof strings !== 'string'))
                matched.error = new Error(`[jswhat] Parameter 'text' must be an array or string`);
            if (options.search && typeof options.search !== 'boolean')
                matched.error = new Error(`[jswhat] Option 'search' must be a boolean`);
            if (options.include && (!Array.isArray(options.include) && typeof options.include !== 'string'))
                matched.error = new Error(`[jswhat] Option 'include' must be an array or string`);
            if (options.exclude && (!Array.isArray(options.exclude) && typeof options.exclude !== 'string'))
                matched.error = new Error(`[jswhat] Option 'exclude' must be an array or string`);
            if (matched.error) return matched;

            var regexes = object.what.regex.json.regexes.map(function (r) {
                var c = {} = r, newFlags = r.flags;
                c.boundary = `^${r.regex}$`;
                if (options.search !== true) c.regex = c.boundary;
                if (options.search === true) newFlags = newFlags + 'g';
                c.expression = new RegExp(c.regex, newFlags);
                return c;
            })

            if (options.filter) {
                var filter = [].concat.apply([], [options.filter]).map(function (t) {
                    return t.toLowerCase();
                })
                regexes = regexes.filter(function (r) {
                    var keep = false;
                    for (var i = 0; i < filter.length && keep !== true; i++)
                        keep = [r.name, ...r.tags].map(function (t) {
                            return t.toLowerCase();
                        }).includes(filter[i]);
                    return keep;
                })
            }

            if (options.exclude) {
                var exclude = [].concat.apply([], [options.exclude]).map(function (t) {
                    return t.toLowerCase();
                })
                regexes = regexes.filter(function (r) {
                    var keep = true;
                    for (var i = 0; i < exclude.length && keep !== false; i++)
                        keep = ![r.name, ...r.tags].map(function (t) {
                            return t.toLowerCase();
                        }).includes(exclude[i]);
                    return keep;
                })
            }

            for (var string of strings) {
                for (var regex of regexes) {
                    var matches = string.match(regex.expression);
                    if (!matches) continue;
                    else if (!matches.input) matches = matches.map(function (m) {
                        return m.match(new RegExp(regex.regex, regex.flags));
                    })
                    else matches = [matches];

                    for (var match of matches) {
                        match.url = regex.url;
                        match.description = regex.description;

                        if (regex.name === 'Phone Number') {
                            var locations = [];
                            for (var phone of object.what.regex.json.phoneCodes)
                                if (match[0].trim().includes(phone.code))
                                    locations.push(phone.country);
                            if (locations.length >= 1)
                                match.description = 'Location(s):' + locations.join(', ');
                        }

                        if (regex.url && regex.url.includes('{')) {
                            for (var i = 0; i < 10; i++) {
                                if (!match[i]) continue;
                                else match.url = match.url.replace(new RegExp(`\\{${i}\\}`, 'g'), match[i]);
                            }
                        }

                        matched.push({
                            matched: match[0],
                            name: regex.name,
                            description: match.description,
                            url: match.url,
                            regex: new RegExp(regex.boundary, regex.flags),
                            tags: regex.tags
                        })
                    }
                }
            }

            matched.time = Date.now() - timer;
            return matched;
        }
object.what.regex.json = {"regexes":[{"name":"Access-Content-Allow-Header","description":"Used for Cross-Origin Resource Sharing (CORS)","url":"","regex":"Access-Control-Allow(-Headers)?: ([a-z0-9-,* ]+)","flags":"i","tags":["Networking","Website"]},{"name":"Amazon AWS Access Key ID","description":"","url":"","regex":"AKIA[0-9A-Z]{16}","flags":"","tags":["Amazon","AWS","Secret"]},{"name":"Amazon Web Services Simple Storage (AWS S3) Internal URL","description":"Internal URL, only accessible via the virtual private cloud.","url":"","regex":"s3://([^/]+)/(.*?([^/]+)/?)","flags":"i","tags":["Amazon","AWS","Internet","Networking"]},{"name":"Amazon Web Services Simple Storage (AWS S3) URL","description":"","url":"","regex":"[https://]*s3\\.amazonaws.com[/]+.*$|[a-zA-Z0-9_-]*\\.s3\\.amazonaws.com/.*","flags":"i","tags":["Amazon","AWS","Internet","Networking"]},{"name":"American Express Card Number","description":"","url":"","regex":"3[47][0-9]{13}","flags":"","tags":["Credit Card","Finance"]},{"name":"American Social Security Number","description":"An American Identification Number","url":"","regex":"(?!(000|666|9))\\d{3}-?(?!00)\\d{2}-?(?!0000)\\d{4}","flags":"","tags":["Credentials","Secret","Username"]},{"name":"Authorization API","description":"","url":"","regex":"api[key|_key|\\s+]+[a-zA-Z0-9=:_\\+\\./-]{5,100}","flags":"i","tags":["Authorization","Secret"]},{"name":"Authorization Basic","description":"","url":"","regex":"basic [a-zA-Z0-9=:_\\+\\./-]{5,100}","flags":"i","tags":["Authorization","Secret"]},{"name":"Authorization Bearer","description":"","url":"","regex":"bearer [a-zA-Z0-9=:_\\+\\./-]{5,100}","flags":"i","tags":["Authorization","Secret"]},{"name":"Authorization Bot","description":"","url":"","regex":"bot [a-zA-Z0-9=:_\\+\\./-]{5,100}","flags":"i","tags":["Authorization","Secret"]},{"name":"BCGlobal Card Number","description":"","url":"","regex":"(6541|6556)[0-9]{12}","flags":"","tags":["Credit Card","Finance"]},{"name":"Bitcoin (BTC) Wallet Address","description":"","url":"https://www.blockchain.com/btc/address/{0}","regex":"[13][a-km-zA-HJ-NP-Z1-9]{25,34}","flags":"","tags":["Cryptocurrency","Finance"]},{"name":"Bitcoin Cash (BCH) Wallet Address","description":"","url":"https://www.blockchain.com/bch/address/{0}","regex":"bitcoincash:[a-zA-Z0-9]{42}","flags":"","tags":["Cryptocurrency","Finance"]},{"name":"Capture The Flag (CTF) Flag","description":"","url":"","regex":"flag{.*}|ctf{.*}|ctfa{.*}","flags":"i","tags":["Cyber Security"]},{"name":"Carte Blanche Card Number","description":"","url":"","regex":"389[0-9]{11}","flags":"","tags":["Credit Card","Finance"]},{"name":"Diners Club Card Number","description":"","url":"","regex":"3(0[0-5]|[68][0-9])[0-9]{11}","flags":"","tags":["Credit Card","Finance"]},{"name":"Discover Card Number","description":"","url":"","regex":"65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})","flags":"","tags":["Credit Card","Finance"]},{"name":"Dogecoin (DOGE) Wallet Address","description":"","url":"https://dogechain.info/address/{0}","regex":"D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}","flags":"","tags":["Cryptocurrency","Finance"]},{"name":"Email Address","description":"","url":"","regex":"([a-z0-9!#$%&'\"*+/=?^_`{|}~-]+(\\.[a-z0-9!#$%&'\"*+/=?^_`{|}~-]+)*)@(([a-z0-9]([a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9]([a-z0-9-]*[a-z0-9])?|\\[(((2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}((2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:)\\])","flags":"i","tags":["Identifiers","Credentials"]},{"name":"Ethereum (ETH) Wallet Address","description":"","url":"https://etherscan.io/address/{0}","regex":"0x[a-f0-9]{40}","flags":"i","tags":["Cryptocurrency","Finance"]},{"name":"EUI-48 Identifier (Ethernet, WiFi, Bluetooth, etc)","description":"","url":"https://maclookup.app/search/result?mac={0}","regex":"([0-9A-Fa-f]{2}[:]){5}[0-9A-Fa-f]{2}|([0-9A-Fa-f]{2}[-]){5}[0-9A-Fa-f]{2}|([0-9A-Fa-f]{4}[\\.]){2}[0-9A-Fa-f]{4}","flags":"","tags":["Identifiers","Networking"]},{"name":"Facebook Access Token","description":"","url":"","regex":"EAACEdEose0cBA[0-9A-Za-z]+","flags":"","tags":["Facebook","Secret"]},{"name":"Firebase Token","description":"","url":"","regex":"AAAA[A-Za-z0-9_-]{7}:[A-Za-z0-9_-]{140}","flags":"","tags":["Google","Firebase","Secret"]},{"name":"GitHub Access Token","description":"","url":"","regex":"[a-zA-Z0-9_-]*:[a-zA-Z0-9_-]+@github\\.com*","flags":"","tags":["GitHub","Secret"]},{"name":"Google API Key","description":"","url":"","regex":"AIza[0-9A-Za-z-_]{35}","flags":"","tags":["Google","Secret"]},{"name":"Google Captcha Key","description":"","url":"","regex":"(6L[0-9A-Za-z-_]{38}|6[0-9a-zA-Z_-]{39})","flags":"","tags":["Google","Captcha","Secret"]},{"name":"Google OAuth Access Token","description":"","url":"","regex":"ya29\\.[0-9A-Za-z\\-_]+","flags":"","tags":["Google","OAuth","Secret"]},{"name":"HackTheBox Flag Format","description":"Used for Capture The Flags at https://hackthebox.eu","url":"","regex":"hackthebox{.*}|htb{.*}","flags":"i","tags":["Cyber Security"]},{"name":"Heroku API Key","description":"","url":"","regex":"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}","flags":"","tags":["Heroku","Secret"]},{"name":"Hex Colour Value","description":"","url":"https://www.color-hex.com/color/{1}","regex":"#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})","flags":"","tags":["Website"]},{"name":"Insta Payment Card Number","description":"","url":"","regex":"63[7-9][0-9]{13}","flags":"","tags":["Credit Card","Finance"]},{"name":"Internet Protocol (IP) Address Version 4","description":"","url":"https://www.shodan.io/host/{0}","regex":"((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:[0-9]{1,5})?","flags":"","tags":["Identifiers","Networking"]},{"name":"Internet Protocol (IP) Address Version 6","description":"","url":"https://www.shodan.io/host/{0}","regex":"\\[?(([0-9a-f]{1,4}:){7,7}[0-9a-f]{1,4}|([0-9a-f]{4}:){1,7}:|([0-9a-f]{1,4}:){1,6}:[0-9a-f]{1,4}|([0-9a-f]{1,4}:){1,5}(:[0-9a-f]{1,4}){1,2}|([0-9a-f]{1,4}:){1,4}(:[0-9a-f]{1,4}){1,3}|([0-9a-f]{1,4}:){1,3}(:[0-9a-f]{1,4}){1,4}|([0-9a-fA]{1,4}:){1,2}(:[0-9a-f]{1,4}){1,5}|[0-9a-f]{1,4}:((:[0-9a-f]{1,4}){1,6})|:((:[0-9a-f]{1,4}){1,7}|:)|fe80:(:[0-9a-f]{0,4}){0,4}%[0-9a-z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-f]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\\]?(:[0-9]{1,5})?","flags":"","tags":["Identifiers","Networking"]},{"name":"JCB Card Number","description":"","url":"","regex":"(2131|1800|35\\d{3})\\d{11}","flags":"","tags":["Credit Card","Finance"]},{"name":"JSON Web Token (JWT)","description":"","url":"","regex":"(ey[a-zA-Z0-9_=]+)\\.(ey[a-zA-Z0-9_=]+)\\.([a-zA-Z0-9_\\-\\+/=]*)","flags":"","tags":["Security","Hacking","Secret","Website"]},{"name":"Korean Local Card Number","description":"","url":"","regex":"9[0-9]{15}","flags":"","tags":["Credit Card","Finance"]},{"name":"Laser Card Number","description":"","url":"","regex":"(6304|6706|6709|6771)[0-9]{12,15}","flags":"","tags":["Credit Card","Finance"]},{"name":"Latitude & Longitude Coordinates","description":"","url":"https://www.google.com/maps/place/{0}","regex":"([-+]?\\d{1,2}([.]\\d+)?),\\s*([-+]?\\d{1,3}([.]\\d+)?\\.?)","flags":"i","tags":["Geo-location"]},{"name":"Litecoin (LTC) Wallet Address","description":"","url":"https://live.blockcypher.com/ltc/address/{0}","regex":"(L|M)[a-zA-Z0-9]{33}","flags":"","tags":["Cryptocurrency","Finance"]},{"name":"Maestro Card Number","description":"","url":"","regex":"(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}","flags":"","tags":["Credit Card","Finance"]},{"name":"Mailgun API Key","description":"","url":"","regex":"key-[0-9a-zA-Z]{32}","flags":"","tags":["Mailgun","Secret"]},{"name":"MasterCard Number","description":"","url":"","regex":"(5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}","flags":"","tags":["Credit Card","Finance"]},{"name":"Monero (XMR) Wallet Address","description":"","url":"","regex":"4([0-9]|[A-B])[a-zA-Z0-9]{93}","flags":"","tags":["Cryptocurrency","Finance"]},{"name":"PayPal Braintree Access Token","description":"","url":"","regex":"access_token\\$production\\$[0-9a-z]{16}\\$[0-9a-f]{32}","flags":"","tags":["PayPal","Braintree","Secret"]},{"name":"Phone Number","description":"","url":"","regex":"(\\+(\\d{1,3}))?[-. (]*?(\\d{3})[-. )]*(\\d{3})[-. ]*(\\d{4})( x ?\\d+)?\\s*","flags":"i","tags":["Identifiers","Credentials","Communication"]},{"name":"Ripple (XRP) Wallet Address","description":"","url":"https://xrpscan.com/account/{0}","regex":"r[a-zA-Z0-9]{33}","flags":"","tags":["Cryptocurrency","Finance"]},{"name":"Slack Token","description":"","url":"","regex":"\"api_token\":\"(xox[a-zA-Z]-[a-zA-Z0-9-]+)\"","flags":"","tags":["Slack","Secret"]},{"name":"Solo Card Number","description":"","url":"","regex":"(6334|6767)[0-9]{12}|(6334|6767)[0-9]{14}|(6334|6767)[0-9]{15}","flags":"","tags":["Credit Card","Finance"]},{"name":"Square Access Token","description":"","url":"","regex":"(sqOatp-[0-9A-Za-z_-]{22}|EAAA[a-zA-Z0-9]{60})","flags":"","tags":["Square","Secret"]},{"name":"Square OAuth Secret","description":"","url":"","regex":"(sq0csp-[ 0-9A-Za-z_-]{43}|sq0[a-z]{3}-[0-9A-Za-z_-]{22,43})","flags":"","tags":["Square","OAuth","Secret"]},{"name":"SSH ECDSA Public Key","description":"","url":"","regex":"ecdsa-sha2-nistp[0-9]{3} [A-Za-z0-9+/=]+[^ \n]+","flags":"","tags":["Credentials","Cyber Security"]},{"name":"SSH ED25519 Public Key","description":"","url":"","regex":"ssh-ed25519 [A-Za-z0-9+/=]+[^ \n]+","flags":"","tags":["Credentials","Cyber Security"]},{"name":"SSH privKey","description":"","url":"","regex":"([-]+BEGIN [^\\s]+ PRIVATE KEY[-]+[\\s]*[^-]*[-]+END [^\\s]+ PRIVATE KEY[-]+)","flags":"","tags":["SSH","Secret"]},{"name":"SSH RSA Public Key","description":"","url":"","regex":"ssh-rsa [A-Za-z0-9+/=]+[^ \n]+","flags":"","tags":["Credentials","Cyber Security"]},{"name":"Stripe Restricted API Key","description":"","url":"","regex":"rk_live_[0-9a-zA-Z]{24}","flags":"","tags":["Stripe","Secret"]},{"name":"Stripe Standard API Key","description":"","url":"","regex":"sk_live_[a-zA-Z0-9]{24}","flags":"","tags":["Stripe","Secret"]},{"name":"Switch Card Number","description":"","url":"","regex":"(4903|4905|4911|4936|6333|6759)[0-9]{12}|(4903|4905|4911|4936|6333|6759)[0-9]{14}|(4903|4905|4911|4936|6333|6759)[0-9]{15}|564182[0-9]{10}|564182[0-9]{12}|564182[0-9]{13}|633110[0-9]{10}|633110[0-9]{12}|633110[0-9]{13}","flags":"","tags":["Credit Card","Finance"]},{"name":"TryHackMe Flag Format","description":"Used for Capture The Flags at https://tryhackme.com","url":"","regex":"thm{.*}|tryhackme{.*}","flags":"i","tags":["Cyber Security"]},{"name":"Twilio Account Key","description":"","url":"","regex":"AC[a-zA-Z0-9_-]{32}","flags":"","tags":["Twilio","Secret"]},{"name":"Twilio API Key","description":"","url":"","regex":"SK[0-9a-fA-F]{32}","flags":"","tags":["Twilio","Secret"]},{"name":"Twilio App SID","description":"","url":"","regex":"AP[a-zA-Z0-9_-]{32}","flags":"","tags":["Twilio","Secret"]},{"name":"Uniform Resource Locator (URL)","description":"","url":"{0}","regex":"(((https?|ftp)://((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:[0-9]{1,5})?)([a-z0-9-_/]?\\.?)*|((https?|ftp)://)?(\\S+:\\S+@)?([a-z0-9-_]?\\.?)+?([a-z0-9-_][a-z0-9-_]{0,62})\\.(ABARTH|ABBOTT|ABBVIE|AFRICA|AGENCY|AIRBUS|AIRTEL|ALIPAY|ALSACE|ALSTOM|AMAZON|ANQUAN|ARAMCO|AUTHOR|BAYERN|BEAUTY|BERLIN|BHARTI|BOSTIK|BOSTON|BROKER|CAMERA|CAREER|CASINO|CENTER|CHANEL|CHROME|CHURCH|CIRCLE|CLAIMS|CLINIC|COFFEE|COMSEC|CONDOS|COUPON|CREDIT|CRUISE|DATING|DATSUN|DEALER|DEGREE|DENTAL|DESIGN|DIRECT|DOCTOR|DUNLOP|DUPONT|DURBAN|EMERCK|ENERGY|ESTATE|EVENTS|EXPERT|FAMILY|FLICKR|FUTBOL|GALLUP|GARDEN|GEORGE|GIVING|GLOBAL|GOOGLE|GRATIS|HEALTH|HERMES|HIPHOP|HOCKEY|HOTELS|HUGHES|IMAMAT|INSURE|INTUIT|JAGUAR|JOBURG|JUEGOS|KAUFEN|KINDER|KINDLE|KOSHER|LANCIA|LATINO|LAWYER|LEFRAK|LIVING|LOCKER|LONDON|LUXURY|MADRID|MAISON|MAKEUP|MARKET|MATTEL|MOBILE|MONASH|MORMON|MOSCOW|MUSEUM|MUTUAL|NAGOYA|NATURA|NISSAN|NISSAY|NORTON|NOWRUZ|OFFICE|OLAYAN|ONLINE|ORACLE|ORANGE|OTSUKA|PFIZER|PHOTOS|PHYSIO|PICTET|QUEBEC|RACING|REALTY|REISEN|REPAIR|REPORT|REVIEW|ROCHER|ROGERS|RYUKYU|SAFETY|SAKURA|SANOFI|SCHOOL|SCHULE|SEARCH|SECURE|SELECT|SHOUJI|SOCCER|SOCIAL|STREAM|STUDIO|SUPPLY|SUZUKI|SWATCH|SYDNEY|TAIPEI|TAOBAO|TARGET|TATTOO|TENNIS|TIENDA|TJMAXX|TKMAXX|TOYOTA|TRAVEL|UNICOM|VIAJES|VIKING|VILLAS|VIRGIN|VISION|VOTING|VOYAGE|VUELOS|WALTER|WEBCAM|XIHUAN|YACHTS|YANDEX|ZAPPOS|ACTOR|ADULT|AETNA|AMFAM|AMICA|APPLE|ARCHI|AUDIO|AUTOS|AZURE|BAIDU|BEATS|BIBLE|BINGO|BLACK|BOATS|BOSCH|BUILD|CANON|CARDS|CHASE|CHEAP|CISCO|CITIC|CLICK|CLOUD|COACH|CODES|CROWN|CYMRU|DABUR|DANCE|DEALS|DELTA|DRIVE|DUBAI|EARTH|EDEKA|EMAIL|EPSON|FAITH|FEDEX|FINAL|FOREX|FORUM|GALLO|GAMES|GIFTS|GIVES|GLADE|GLASS|GLOBO|GMAIL|GREEN|GRIPE|GROUP|GUCCI|GUIDE|HOMES|HONDA|HORSE|HOUSE|HYATT|IKANO|IRISH|JETZT|KOELN|KYOTO|LAMER|LEASE|LEGAL|LEXUS|LILLY|LINDE|LIPSY|LIXIL|LOANS|LOCUS|LOTTE|LOTTO|MACYS|MANGO|MEDIA|MIAMI|MONEY|MOVIE|NEXUS|NIKON|NINJA|NOKIA|NOWTV|OMEGA|OSAKA|PARIS|PARTS|PARTY|PHONE|PHOTO|PIZZA|PLACE|POKER|PRAXI|PRESS|PRIME|PROMO|QUEST|RADIO|REHAB|REISE|RICOH|ROCKS|RODEO|RUGBY|SALON|SENER|SEVEN|SHARP|SHELL|SHOES|SKYPE|SLING|SMART|SMILE|SOLAR|SPACE|SPORT|STADA|STORE|STUDY|STYLE|SUCKS|SWISS|TATAR|TIRES|TIROL|TMALL|TODAY|TOKYO|TOOLS|TORAY|TOTAL|TOURS|TRADE|TRUST|TUNES|TUSHU|UBANK|VEGAS|VIDEO|VODKA|VOLVO|WALES|WATCH|WEBER|WEIBO|WORKS|WORLD|XEROX|YAHOO|AARP|ABLE|ADAC|AERO|AKDN|ALLY|AMEX|ARAB|ARMY|ARPA|ARTE|ASDA|ASIA|AUDI|AUTO|BABY|BAND|BANK|BBVA|BEER|BEST|BIKE|BING|BLOG|BLUE|BOFA|BOND|BOOK|BUZZ|CAFE|CALL|CAMP|CARE|CARS|CASA|CASE|CASH|CBRE|CERN|CHAT|CITI|CITY|CLUB|COOL|COOP|CYOU|DATA|DATE|DCLK|DEAL|DELL|DESI|DIET|DISH|DOCS|DUCK|DVAG|ERNI|FAGE|FAIL|FANS|FARM|FAST|FIAT|FIDO|FILM|FIRE|FISH|FLIR|FOOD|FORD|FREE|FUND|GAME|GBIZ|GENT|GGEE|GIFT|GMBH|GOLD|GOLF|GOOG|GUGE|GURU|HAIR|HAUS|HDFC|HELP|HERE|HGTV|HOST|HSBC|ICBC|IEEE|IMDB|IMMO|INFO|ITAU|JAVA|JEEP|JOBS|JPRS|KDDI|KIWI|KPMG|KRED|LAND|LEGO|LGBT|LIDL|LIFE|LIKE|LIMO|LINK|LIVE|LOAN|LOFT|LOVE|LTDA|LUXE|MAIF|MEET|MEME|MENU|MINI|MINT|MOBI|MODA|MOTO|NAME|NAVY|NEWS|NEXT|NICO|NIKE|OLLO|OPEN|PAGE|PARS|PCCW|PICS|PING|PINK|PLAY|PLUS|POHL|PORN|POST|PROD|PROF|QPON|RAID|READ|REIT|RENT|REST|RICH|RMIT|ROOM|RSVP|RUHR|SAFE|SALE|SARL|SAVE|SAXO|SCOT|SEAT|SEEK|SEXY|SHAW|SHIA|SHOP|SHOW|SILK|SINA|SITE|SKIN|SNCF|SOHU|SONG|SONY|SPOT|STAR|SURF|TALK|TAXI|TEAM|TECH|TEVA|TIAA|TIPS|TOWN|TOYS|TUBE|VANA|VISA|VIVA|VIVO|VOTE|VOTO|WANG|WEIR|WIEN|WIKI|WINE|WORK|XBOX|YOGA|ZARA|ZERO|ZONE|UTC|AAA|ABB|ABC|ACO|ADS|AEG|AFL|AIG|ANZ|AOL|APP|ART|AWS|AXA|BAR|BBC|BBT|BCG|BCN|BET|BID|BIO|BIZ|BMS|BMW|BOM|BOO|BOT|BOX|BUY|BZH|CAB|CAL|CAM|CAR|CAT|CBA|CBN|CBS|CEO|CFA|CFD|COM|CPA|CRS|CSC|DAD|DAY|DDS|DEV|DHL|DIY|DNP|DOG|DOT|DTV|DVR|EAT|ECO|EDU|ESQ|EUS|FAN|FIT|FLY|FOO|FOX|FRL|FTR|FUN|FYI|GAL|GAP|GAY|GDN|GEA|GLE|GMO|GMX|GOO|GOP|GOT|GOV|HBO|HIV|HKT|HOT|HOW|IBM|ICE|ICU|IFM|INC|ING|INK|INT|IST|ITV|JCB|JIO|JLL|JMP|JNJ|JOT|JOY|KFH|KIA|KIM|KPN|KRD|LAT|LAW|LDS|LLC|LLP|LOL|LPL|LTD|MAN|MAP|MBA|MED|MEN|MIL|MIT|MLB|MLS|MMA|MOE|MOI|MOM|MOV|MSD|MTN|MTR|NAB|NBA|NEC|NET|NEW|NFL|NGO|NHK|NOW|NRA|NRW|NTT|NYC|OBI|OFF|ONE|ONG|ONL|OOO|ORG|OTT|OVH|PAY|PET|PHD|PID|PIN|PNC|PRO|PRU|PUB|PWC|QVC|RED|REN|RIL|RIO|RIP|RUN|RWE|SAP|SAS|SBI|SBS|SCA|SCB|SES|SEW|SEX|SFR|SKI|SKY|SOY|SPA|SRL|STC|TAB|TAX|TCI|TDK|TEL|THD|TJX|TOP|TRV|TUI|TVS|UBS|UNO|UOL|UPS|VET|VIG|VIN|VIP|WED|WIN|WME|WOW|WTC|WTF|XIN|XXX|XYZ|YOU|YUN|ZIP|AC|AD|AE|AF|AG|AI|AL|AM|AO|AQ|AR|AS|AT|AU|AW|AX|AZ|BA|BB|BD|BE|BF|BG|BH|BI|BJ|BM|BN|BO|BR|BS|BT|BV|BW|BY|BZ|CA|CC|CD|CF|CG|CH|CI|CK|CL|CM|CN|CO|CR|CU|CV|CW|CX|CY|CZ|DE|DJ|DK|DM|DO|DZ|EC|EE|EG|ER|ES|ET|EU|FI|FJ|FK|FM|FO|FR|GA|GB|GD|GE|GF|GG|GH|GI|GL|GM|GN|GP|GQ|GR|GS|GT|GU|GW|GY|HK|HM|HN|HR|HT|HU|ID|IE|IL|IM|IN|IO|IQ|IR|IS|IT|JE|JM|JO|JP|KE|KG|KH|KI|KM|KN|KP|KR|KW|KY|KZ|LA|LB|LC|LI|LK|LR|LS|LT|LU|LV|LY|MA|MC|MD|ME|MG|MH|MK|ML|MM|MN|MO|MP|MQ|MR|MS|MT|MU|MV|MW|MX|MY|MZ|NA|NC|NE|NF|NG|NI|NL|NO|NP|NR|NU|NZ|OM|PA|PE|PF|PG|PH|PK|PL|PM|PN|PR|PS|PT|PW|PY|QA|RE|RO|RS|RU|RW|SA|SB|SC|SD|SE|SG|SH|SI|SJ|SK|SL|SM|SN|SO|SR|SS|ST|SU|SV|SX|SY|SZ|TC|TD|TF|TG|TH|TJ|TK|TL|TM|TN|TO|TR|TT|TV|TW|TZ|UA|UG|UK|US|UY|UZ|VA|VC|VE|VG|VI|VN|VU|WF|WS|YE|YT|ZA|ZM|ZW)(:\\d{2,5})?([/?#]\\S*)?)","flags":"i","tags":["Identifiers"]},{"name":"Unix Milliseconds Timestamp","description":"Milliseconds elapsed since unix epoch: 1970","url":"","regex":"[0-9]{11,13}","flags":"","tags":["Time"]},{"name":"Unix Timestamp","description":"Seconds elapsed since unix epoch: 1970","url":"","regex":"[0-9]{8,10}","flags":"","tags":["Time"]},{"name":"Visa Card Number","description":"","url":"","regex":"4[0-9]{12}([0-9]{3})?","flags":"","tags":["Credit Card","Finance"]},{"name":"Windows Path","description":"","url":"{0}","regex":"[A-Z]:[\\\\]([a-zA-Z0-9 _.-]+[\\\\])*([a-zA-Z0-9 _.-]+)?","flags":"","tags":["Path"]},{"name":"YouTube Channel ID","description":"","url":"https://www.youtube.com/channel/{0}","regex":"UC[0-9A-Za-z_-]{21}[AQgw]{1}","flags":"","tags":["Media"]},{"name":"YouTube Channel URL","description":"","url":"{0}","regex":"(https?://)?((www|m)\\.)?(youtube\\.com)(/(c/|channel/|user/)?)([0-9A-Za-z_-]{1,})","flags":"i","tags":["Media"]},{"name":"YouTube Video ID","description":"","url":"https://www.youtube.com/watch?v={0}","regex":"(?=.*[A-Z])(?=.*[a-z])[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]{1}","flags":"","tags":["Media"]},{"name":"YouTube Video URL","description":"","url":"{0}","regex":"(https?://)?(youtu\\.be/|(www\\.|m\\.)?youtube\\.com/(watch|v|embed)(\\.php)?(\\?.*v=|/))([a-zA-Z0-9\\_-]+)","flags":"i","tags":["Media"]}],"phoneCodes":[{"country":"Afghanistan","code":"+93"},{"country":"Aland Islands","code":"+358"},{"country":"Albania","code":"+355"},{"country":"Algeria","code":"+213"},{"country":"AmericanSamoa","code":"+1 684"},{"country":"Andorra","code":"+376"},{"country":"Angola","code":"+244"},{"country":"Anguilla","code":"+1 264"},{"country":"Antarctica","code":"+672"},{"country":"Antigua and Barbuda","code":"+1268"},{"country":"Argentina","code":"+54"},{"country":"Armenia","code":"+374"},{"country":"Aruba","code":"+297"},{"country":"Australia","code":"+61"},{"country":"Austria","code":"+43"},{"country":"Azerbaijan","code":"+994"},{"country":"Bahamas","code":"+1 242"},{"country":"Bahrain","code":"+973"},{"country":"Bangladesh","code":"+880"},{"country":"Barbados","code":"+1 246"},{"country":"Belarus","code":"+375"},{"country":"Belgium","code":"+32"},{"country":"Belize","code":"+501"},{"country":"Benin","code":"+229"},{"country":"Bermuda","code":"+1 441"},{"country":"Bhutan","code":"+975"},{"country":"Bolivia, Plurinational State of","code":"+591"},{"country":"Bosnia and Herzegovina","code":"+387"},{"country":"Botswana","code":"+267"},{"country":"Brazil","code":"+55"},{"country":"British Indian Ocean Territory","code":"+246"},{"country":"Brunei Darussalam","code":"+673"},{"country":"Bulgaria","code":"+359"},{"country":"Burkina Faso","code":"+226"},{"country":"Burundi","code":"+257"},{"country":"Cambodia","code":"+855"},{"country":"Cameroon","code":"+237"},{"country":"Canada","code":"+1"},{"country":"Cape Verde","code":"+238"},{"country":"Cayman Islands","code":"+ 345"},{"country":"Central African Republic","code":"+236"},{"country":"Chad","code":"+235"},{"country":"Chile","code":"+56"},{"country":"China","code":"+86"},{"country":"Christmas Island","code":"+61"},{"country":"Cocos (Keeling) Islands","code":"+61"},{"country":"Colombia","code":"+57"},{"country":"Comoros","code":"+269"},{"country":"Congo","code":"+242"},{"country":"Congo, The Democratic Republic of the Congo","code":"+243"},{"country":"Cook Islands","code":"+682"},{"country":"Costa Rica","code":"+506"},{"country":"Cote d'Ivoire","code":"+225"},{"country":"Croatia","code":"+385"},{"country":"Cuba","code":"+53"},{"country":"Cyprus","code":"+357"},{"country":"Czech Republic","code":"+420"},{"country":"Denmark","code":"+45"},{"country":"Djibouti","code":"+253"},{"country":"Dominica","code":"+1 767"},{"country":"Dominican Republic","code":"+1 849"},{"country":"Ecuador","code":"+593"},{"country":"Egypt","code":"+20"},{"country":"El Salvador","code":"+503"},{"country":"Equatorial Guinea","code":"+240"},{"country":"Eritrea","code":"+291"},{"country":"Estonia","code":"+372"},{"country":"Ethiopia","code":"+251"},{"country":"Falkland Islands (Malvinas)","code":"+500"},{"country":"Faroe Islands","code":"+298"},{"country":"Fiji","code":"+679"},{"country":"Finland","code":"+358"},{"country":"France","code":"+33"},{"country":"French Guiana","code":"+594"},{"country":"French Polynesia","code":"+689"},{"country":"Gabon","code":"+241"},{"country":"Gambia","code":"+220"},{"country":"Georgia","code":"+995"},{"country":"Germany","code":"+49"},{"country":"Ghana","code":"+233"},{"country":"Gibraltar","code":"+350"},{"country":"Greece","code":"+30"},{"country":"Greenland","code":"+299"},{"country":"Grenada","code":"+1 473"},{"country":"Guadeloupe","code":"+590"},{"country":"Guam","code":"+1 671"},{"country":"Guatemala","code":"+502"},{"country":"Guernsey","code":"+44"},{"country":"Guinea","code":"+224"},{"country":"Guinea-Bissau","code":"+245"},{"country":"Guyana","code":"+595"},{"country":"Haiti","code":"+509"},{"country":"Holy See (Vatican City State)","code":"+379"},{"country":"Honduras","code":"+504"},{"country":"Hong Kong","code":"+852"},{"country":"Hungary","code":"+36"},{"country":"Iceland","code":"+354"},{"country":"India","code":"+91"},{"country":"Indonesia","code":"+62"},{"country":"Iran, Islamic Republic of Persian Gulf","code":"+98"},{"country":"Iraq","code":"+964"},{"country":"Ireland","code":"+353"},{"country":"Isle of Man","code":"+44"},{"country":"Israel","code":"+972"},{"country":"Italy","code":"+39"},{"country":"Jamaica","code":"+1 876"},{"country":"Japan","code":"+81"},{"country":"Jersey","code":"+44"},{"country":"Jordan","code":"+962"},{"country":"Kazakhstan","code":"+7 7"},{"country":"Kenya","code":"+254"},{"country":"Kiribati","code":"+686"},{"country":"Korea, Democratic People's Republic of Korea","code":"+850"},{"country":"Korea, Republic of South Korea","code":"+82"},{"country":"Kosovo","code":"+383"},{"country":"Kuwait","code":"+965"},{"country":"Kyrgyzstan","code":"+996"},{"country":"Laos","code":"+856"},{"country":"Latvia","code":"+371"},{"country":"Lebanon","code":"+961"},{"country":"Lesotho","code":"+266"},{"country":"Liberia","code":"+231"},{"country":"Libyan Arab Jamahiriya","code":"+218"},{"country":"Liechtenstein","code":"+423"},{"country":"Lithuania","code":"+370"},{"country":"Luxembourg","code":"+352"},{"country":"Macao","code":"+853"},{"country":"Macedonia","code":"+389"},{"country":"Madagascar","code":"+261"},{"country":"Malawi","code":"+265"},{"country":"Malaysia","code":"+60"},{"country":"Maldives","code":"+960"},{"country":"Mali","code":"+223"},{"country":"Malta","code":"+356"},{"country":"Marshall Islands","code":"+692"},{"country":"Martinique","code":"+596"},{"country":"Mauritania","code":"+222"},{"country":"Mauritius","code":"+230"},{"country":"Mayotte","code":"+262"},{"country":"Mexico","code":"+52"},{"country":"Micronesia, Federated States of Micronesia","code":"+691"},{"country":"Moldova","code":"+373"},{"country":"Monaco","code":"+377"},{"country":"Mongolia","code":"+976"},{"country":"Montenegro","code":"+382"},{"country":"Montserrat","code":"+1664"},{"country":"Morocco","code":"+212"},{"country":"Mozambique","code":"+258"},{"country":"Myanmar","code":"+95"},{"country":"Namibia","code":"+264"},{"country":"Nauru","code":"+674"},{"country":"Nepal","code":"+977"},{"country":"Netherlands","code":"+31"},{"country":"Netherlands Antilles","code":"+599"},{"country":"New Caledonia","code":"+687"},{"country":"New Zealand","code":"+64"},{"country":"Nicaragua","code":"+505"},{"country":"Niger","code":"+227"},{"country":"Nigeria","code":"+234"},{"country":"Niue","code":"+683"},{"country":"Norfolk Island","code":"+672"},{"country":"Northern Mariana Islands","code":"+1 670"},{"country":"Norway","code":"+47"},{"country":"Oman","code":"+968"},{"country":"Pakistan","code":"+92"},{"country":"Palau","code":"+680"},{"country":"Palestinian Territory, Occupied","code":"+970"},{"country":"Panama","code":"+507"},{"country":"Papua New Guinea","code":"+675"},{"country":"Paraguay","code":"+595"},{"country":"Peru","code":"+51"},{"country":"Philippines","code":"+63"},{"country":"Pitcairn","code":"+872"},{"country":"Poland","code":"+48"},{"country":"Portugal","code":"+351"},{"country":"Puerto Rico","code":"+1 939"},{"country":"Qatar","code":"+974"},{"country":"Reunion","code":"+262"},{"country":"Romania","code":"+40"},{"country":"Russia","code":"+7"},{"country":"Rwanda","code":"+250"},{"country":"Saint Barthelemy","code":"+590"},{"country":"Saint Helena, Ascension and Tristan Da Cunha","code":"+290"},{"country":"Saint Kitts and Nevis","code":"+1 869"},{"country":"Saint Lucia","code":"+1 758"},{"country":"Saint Martin","code":"+590"},{"country":"Saint Pierre and Miquelon","code":"+508"},{"country":"Saint Vincent and the Grenadines","code":"+1 784"},{"country":"Samoa","code":"+685"},{"country":"San Marino","code":"+378"},{"country":"Sao Tome and Principe","code":"+239"},{"country":"Saudi Arabia","code":"+966"},{"country":"Senegal","code":"+221"},{"country":"Serbia","code":"+381"},{"country":"Seychelles","code":"+248"},{"country":"Sierra Leone","code":"+232"},{"country":"Singapore","code":"+65"},{"country":"Slovakia","code":"+421"},{"country":"Slovenia","code":"+386"},{"country":"Solomon Islands","code":"+677"},{"country":"Somalia","code":"+252"},{"country":"South Africa","code":"+27"},{"country":"South Georgia and the South Sandwich Islands","code":"+500"},{"country":"Spain","code":"+34"},{"country":"Sri Lanka","code":"+94"},{"country":"Sudan","code":"+249"},{"country":"Suricountry","code":"+597"},{"country":"Svalbard and Jan Mayen","code":"+47"},{"country":"Swaziland","code":"+268"},{"country":"Sweden","code":"+46"},{"country":"Switzerland","code":"+41"},{"country":"Syrian Arab Republic","code":"+963"},{"country":"Taiwan","code":"+886"},{"country":"Tajikistan","code":"+992"},{"country":"Tanzania, United Republic of Tanzania","code":"+255"},{"country":"Thailand","code":"+66"},{"country":"Timor-Leste","code":"+670"},{"country":"Togo","code":"+228"},{"country":"Tokelau","code":"+690"},{"country":"Tonga","code":"+676"},{"country":"Trinidad and Tobago","code":"+1 868"},{"country":"Tunisia","code":"+216"},{"country":"Turkey","code":"+90"},{"country":"Turkmenistan","code":"+993"},{"country":"Turks and Caicos Islands","code":"+1 649"},{"country":"Tuvalu","code":"+688"},{"country":"Uganda","code":"+256"},{"country":"Ukraine","code":"+380"},{"country":"United Arab Emirates","code":"+971"},{"country":"United Kingdom","code":"+44"},{"country":"United States","code":"+1"},{"country":"Uruguay","code":"+598"},{"country":"Uzbekistan","code":"+998"},{"country":"Vanuatu","code":"+678"},{"country":"Venezuela, Bolivarian Republic of Venezuela","code":"+58"},{"country":"Vietnam","code":"+84"},{"country":"Virgin Islands, British","code":"+1 284"},{"country":"Virgin Islands, U.S.","code":"+1 340"},{"country":"Wallis and Futuna","code":"+681"},{"country":"Yemen","code":"+967"},{"country":"Zambia","code":"+260"},{"country":"Zimbabwe","code":"+263"}]};
    })();
})