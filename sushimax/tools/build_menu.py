"""Builds js/menu-data.js from the live SushiMax menu API (Poster POS).

Usage:  python3 tools/build_menu.py            # fetch from sushimax.cz
        python3 tools/build_menu.py kolin.json jihlava.json

Cleans what the live site shows as-is: category names, missing diacritics,
typos, weight and piece count hidden in set descriptions.
"""
import json, re, sys, urllib.request
from pathlib import Path

API = "https://sushimax.cz/api/restaurants/{}/menu"
OUT = Path(__file__).resolve().parent.parent / "js" / "menu-data.js"
PHOTOS = Path(__file__).resolve().parent / "photo-map.json"  # written by tools/photos.py

# Source category -> unified id. Both cities end up with the same names.
CATS = {
    "sushi": "sushi", "Sushi": "sushi",
    "Sety": "sety", "VIP": "vip",
    "Klasicke": "rolky", "Roly": "rolky",
    "Maki": "maki", "Futomaki": "futomaki",
    "Philadeiphia": "philadelphia", "Philadelphia": "philadelphia",
    "Kalifornia": "kalifornia",
    "Teple": "teple", "Teplí rolky": "teple",
    "Dezerty": "dezerty", "Sladké rolky/Dezert": "dezerty",
    "Snidané": "snidane",
    "obed a priloha": "bowl", "Obéd": "obed",
    "Hlavní jídla": "hlavni",
    "Grill": "grill", "Grill/Omački": "grill",
    "Bowl/Těstoviny": "bowl", "Testoviny/Palacinky": "testoviny",
    "Fast food": "fastfood",
    "Polévky": "polevky", "Saláty": "salaty",
    "Přilohy": "prilohy", "Předkrmy/Omačky": "predkrmy",
    "Teplí nápoje": "napoje-teple", "Studené nápoje": "napoje",
    "Koktejly": "koktejly", "Pivo/Snacky": "pivo",
}
ORDER = ["sety", "vip", "philadelphia", "kalifornia", "rolky", "futomaki", "maki",
         "teple", "sushi", "snidane", "obed", "hlavni", "grill", "bowl", "testoviny",
         "fastfood", "polevky", "salaty", "predkrmy", "prilohy", "dezerty",
         "napoje-teple", "napoje", "koktejly", "pivo"]

# Word-level fixes: missing diacritics and typos found in the live menu.
FIX = {
    "pikantni": "pikantní", "kurecim": "kuřecím", "kuřecim": "kuřecím", "keřecim": "kuřecím",
    "kuřečím": "kuřecím", "kuřeci": "kuřecí", "smazenym": "smaženým", "smaženym": "smaženým",
    "smazeny": "smažený", "slavkou": "slávkou", "slavkami": "slávkami", "cukou": "čukou",
    "salat": "salát", "salatem": "salátem", "pecena": "pečená", "pečena": "pečená",
    "peceny": "pečený", "pecenym": "pečeným", "kaviaru": "kaviáru", "kaviarem": "kaviárem",
    "avokado": "avokádo", "avokadem": "avokádem", "uzenym": "uzeným", "tuňakem": "tuňákem",
    "tuňak": "tuňák", "tunak": "tuňák", "marinovanym": "marinovaným", "lososovy": "lososový",
    "zeleny": "zelený", "zeleninovy": "zeleninový", "krevetovy": "krevetový", "syrem": "sýrem",
    "syr": "sýr", "tvarohove": "tvarohové", "omacka": "omáčka", "omačka": "omáčka",
    "uhor": "úhoř", "uhoř": "úhoř", "uhorem": "úhořem", "uhořem": "úhořem", "červeny": "červený",
    "dvakrat": "dvakrát", "mandlova": "mandlová", "mandlovy": "mandlový", "exoticka": "exotická",
    "vikend": "víkend", "kalifornsky": "kalifornský", "zapeceny": "zapečený", "aljaska": "aljaška",
    "kralovsky": "královský", "kralovska": "královská", "syrova": "sýrová", "syrovy": "sýrový",
    "zlaty": "zlatý", "žluty": "žlutý", "horky": "horký", "morsky": "mořský",
    "oceanska": "oceánská", "vepřovym": "vepřovým", "vegeterianske": "vegetariánské",
    "vegetarianske": "vegetariánské", "křidla": "křídla", "teply": "teplý", "houbova": "houbová",
    "krémova": "krémová", "vyvar": "vývar", "polevka": "polévka", "ceaser": "caesar",
    "ceasar": "caesar", "řecky": "řecký", "grilovanymi": "grilovanými", "mořskymi": "mořskými",
    "morskymi": "mořskými", "mořskýmí": "mořskými", "čerstve": "čerstvé", "bramborova": "bramborová",
    "grilovana": "grilovaná", "smetanove": "smetanové", "japonká": "japonská", "ořechova": "ořechová",
    "rodzinkama": "rozinkami", "zakzsaná": "zakysaná", "klasickás": "klasická", "ploby": "plody",
    "téstoviny": "těstoviny", "téstovine": "těstoviny", "locosem": "lososem", "bleck": "black",
    "konbenzovaným": "kondenzovaným", "keremelem": "karamelem", "čokolade": "čokoládě",
    "jahode": "jahodě", "veprove": "vepřové", "vepřove": "vepřové", "saslik": "šašlik",
    "zampiony": "žampiony", "česnekova": "česneková", "horcicna": "hořčičná", "tatarska": "tatarská",
    "caj": "čaj", "jabko": "jablko", "pomaranc": "pomeranč", "snídané": "snídaně",
    "palacinky": "palačinky", "medovnik": "medovník", "spaisi": "spicy", "rajčetem": "rajčetem",
    "krevrtou": "krevetou", "robiko": "tobiko", "lsland": "Island", "lced": "Iced", "olov": "Olov",
}
NEW_DAYS = 40
SIDES = re.compile(r"sojov|zázvor|wasabi|hůlk|omáčk|^\d+\s*(g|ks|ml)\b", re.I)


def fix_text(s):
    s = re.sub(r"\s*\([^)]*[а-яА-ЯіїєІЇЄ][^)]*\)", "", s)  # drop Russian glosses
    def word(m):
        w = m.group(0); f = FIX.get(w.lower())
        if not f: return w
        return f[0].upper() + f[1:] if w[0].isupper() else f
    s = re.sub(r"[A-Za-zÀ-žА-я]+", word, s)
    s = re.sub(r"\bs (?=[sSzZšŠžŽ])", "se ", s)  # "s smaženým" -> "se smaženým"
    s = re.sub(r"(?<!\d)\s*,\s*(?!\d)", ", ", s)
    s = re.sub(r"(,\s*){2,}", ", ", s)  # empty items: "a, , b" -> "a, b"
    s = re.sub(r"\.\s*,", ",", s)  # "omáčka., rýže" -> "omáčka, rýže"
    return re.sub(r"\s+", " ", s).strip()


def nice_name(s):
    s = re.sub(r"\s+", " ", s).strip()
    if s.isupper() and len(s) > 4:  # "PÁNEV S HOVĚZÍM MASEM" -> "Pánev s hovězím masem"
        s = s.lower().replace("bbq", "BBQ")
    s = fix_text(s)
    return s[0].upper() + s[1:] if s else s


def parse(p, cat):
    raw = (p.get("description") or "").replace("\r", "")
    lines = [l.strip(" ,") for l in raw.split("\n") if l.strip(" ,")]
    item = {
        "id": int(p["posterProductId"]),
        "c": cat,
        "n": nice_name(p["name"]),
        "p": int(p["price"]),
        "img": PHOTO_MAP.get(p.get("image", ""), p.get("image", "")),
    }
    m = re.search(r"_(\d{10})_", p.get("image", ""))
    item["_t"] = int(m.group(1)) if m else 0  # upload time, see main()
    w = (p.get("weight") or "").replace(" ", "")
    pcs = None
    if cat == "sety":
        meta = [l for l in lines if re.fullmatch(r"\d+\s*(g|ks)", l, re.I)]
        for m in meta:
            if m.lower().endswith("ks"): pcs = int(re.match(r"\d+", m).group())
            elif not w: w = m.replace(" ", "")
        rolls = [fix_text(l) for l in lines if not SIDES.search(l)]
        item["r"] = [r[0].upper() + r[1:] for r in rolls]
    else:
        d = fix_text(", ".join(lines))  # Poster often has one ingredient per line
        # trailing "250g 8ks", ", porce, 121g" etc.
        while True:
            m = re.search(r"[,\s]*(?:porce|(\d+)\s*(g|ks)\.?)\s*$", d, re.I)
            if not m or m.start() == m.end(): break
            if m.group(2) and m.group(2).lower() == "ks": pcs = int(m.group(1))
            elif m.group(2) and not w: w = m.group(1) + "g"
            d = d[:m.start()]
        d = re.sub(r"\s*\d+\s*porce$", "", d)
        if d and d.lower() != item["n"].lower(): item["d"] = d[0].upper() + d[1:]
    if w and re.fullmatch(r"\d+g", w): item["w"] = int(w[:-1])
    if pcs: item["k"] = pcs
    return item


def load(city, path=None):
    if path: return json.load(open(path, encoding="utf-8"))
    req = urllib.request.Request(API.format(city), headers={"User-Agent": "Mozilla/5.0"})
    return json.load(urllib.request.urlopen(req, timeout=30))


PHOTO_MAP = json.loads(PHOTOS.read_text()) if PHOTOS.exists() else {}


def main():
    files = sys.argv[1:3] or [None, None]
    data = {}
    for city, path in zip(["kolin", "jihlava"], files):
        items = []
        for cat in load(city, path):
            cid = CATS.get(cat["name"])
            if not cid: raise SystemExit(f"unknown category {cat['name']!r} in {city}")
            items += [parse(p, cid) for p in cat["products"] if not p.get("hidden") and p.get("available", True)]
        # "Novinka": photo uploaded to Poster within NEW_DAYS of the newest one
        # (the upload time is part of the file name: product_<unix time>_<id>).
        newest = max(i["_t"] for i in items)
        for i in items:
            if i.pop("_t") > newest - NEW_DAYS * 86400: i["nw"] = 1
        items.sort(key=lambda i: ORDER.index(i["c"]))
        data[city] = items
        print(city, len(items), "items")
    OUT.write_text("// Generated by tools/build_menu.py from sushimax.cz/api — do not edit by hand.\n"
                   "window.SM_IMG = 'img/menu/';  // local photos; full URLs are Poster fallbacks\n"
                   "window.SM_MENU = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n",
                   encoding="utf-8")


if __name__ == "__main__":
    main()
