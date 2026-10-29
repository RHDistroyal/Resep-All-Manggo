import json
import os
import re

photos_path = os.path.join(os.path.dirname(__file__), "photo_scraper", "scraped_cookpad_photos.json")
with open(photos_path, "r", encoding="utf-8") as f:
    photos_dict = json.load(f)

photos = list(photos_dict.values())
print(f"Total available Cookpad photos: {len(photos)}")

# Check how many have unique URLs
unique_urls = set(p['url'] for p in photos)
print(f"Total unique photo URLs: {len(unique_urls)}")

