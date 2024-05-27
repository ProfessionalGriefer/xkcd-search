import requests
import os
import psycopg2


# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter


class ScraperPipeline:
    def download_image(self, item):
        # title = item["title"]
        image_path = item["image_path"]
        filename = os.path.basename(image_path)
        path = os.path.join("images", filename)
        if os.path.isfile(path):
            return item

        data = requests.get("https://xkcd.com" + image_path).content
        if not os.path.isdir("images"):
            os.mkdir("images")
        with open(path, "wb") as handler:
            handler.write(data)
        return item

    def save_to_db(self, item):
        pass

    def process_item(self, item, spider):
        self.download_image(item)
        self.save_to_db(item)
