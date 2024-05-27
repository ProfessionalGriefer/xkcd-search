import scrapy
from scraper.items import ComicItem


url = "https://xkcd.com"


class MainSpider(scrapy.Spider):
    name = "main"
    allowed_domains = ["xkcd.com"]
    start_urls = [f"{url}/{i}" for i in range(1, 2937)]

    def parse(self, response, **_):
        item = ComicItem()

        item["title"] = response.css("div#ctitle ::text").get()
        item["image_path"] = response.xpath("/html/body/div[2]/div[2]/img/@src").get()
        yield item
