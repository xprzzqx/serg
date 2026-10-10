"""Downloads full-size menu photos from Poster and makes uniform 800x600 webp files.

Usage:  python3 tools/photos.py [kolin.json jihlava.json] [--cache DIR]
Then run tools/build_menu.py again: it swaps Poster URLs for the local files.

The live site shows Poster's 297 px thumbnails; every photo also exists as
<name>_original.<ext> (~1000 px). Identical files are stored once.
"""
import hashlib, json, os, sys, urllib.request, concurrent.futures as cf
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageStat

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_menu import load  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "img" / "menu"
MAP = Path(__file__).resolve().parent / "photo-map.json"
W, H = 800, 600


def fetch(url, cache):
    base, ext = os.path.splitext(url)
    fn = cache / hashlib.md5(url.encode()).hexdigest()
    if fn.exists() and fn.stat().st_size > 100: return url, fn
    for u in (base + "_original" + ext, url):
        try:
            req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"})
            fn.write_bytes(urllib.request.urlopen(req, timeout=30).read()); return url, fn
        except Exception:
            pass
    return url, None


def process(src):
    im = Image.open(src).convert("RGB")
    if im.width / im.height >= 1.2:  # landscape: cover-crop to 4:3
        s = max(W / im.width, H / im.height)
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        l, t = (im.width - W) // 2, (im.height - H) // 2
        im = im.crop((l, t, l + W, t + H))
    else:  # portrait or square: fit whole, pad with the photo's own edge colour
        s = min(W / im.width, H / im.height)
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        col = tuple(int(v) for v in ImageStat.Stat(im.crop((0, 0, 6, im.height))).median)
        bg = Image.new("RGB", (W, H), col); bg.paste(im, ((W - im.width) // 2, (H - im.height) // 2)); im = bg
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Color(im).enhance(1.08)
    return im.filter(ImageFilter.UnsharpMask(radius=1.1, percent=55, threshold=2))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    cache = Path(sys.argv[sys.argv.index("--cache") + 1]) if "--cache" in sys.argv else ROOT / ".photo-cache"
    if "--cache" in sys.argv: args = [a for a in args if a != str(cache)]
    cache.mkdir(parents=True, exist_ok=True); OUT.mkdir(parents=True, exist_ok=True)
    files = args[:2] or [None, None]
    urls = sorted({p["image"] for city, path in zip(["kolin", "jihlava"], files)
                   for cat in load(city, path) for p in cat["products"] if p.get("image")})
    with cf.ThreadPoolExecutor(8) as ex: got = list(ex.map(lambda u: fetch(u, cache), urls))
    mapping, by_hash, missing = {}, {}, []
    for url, fn in got:
        if not fn: missing.append(url); continue
        h = hashlib.md5(fn.read_bytes()).hexdigest()[:12]
        if h not in by_hash:
            by_hash[h] = h + ".webp"
            out = OUT / by_hash[h]
            if not out.exists(): process(fn).save(out, "WEBP", quality=74, method=6)
        mapping[url] = by_hash[h]
    keep = set(by_hash.values())
    for f in OUT.glob("*.webp"):
        if f.name not in keep: f.unlink()
    MAP.write_text(json.dumps(mapping, indent=0, sort_keys=True))
    print(f"photos: {len(urls)} urls, {len(by_hash)} unique files, missing {len(missing)}")


if __name__ == "__main__":
    main()
