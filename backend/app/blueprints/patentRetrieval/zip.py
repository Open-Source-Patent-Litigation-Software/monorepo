from utils.schemas import ZipInput
from utils.scraping import PatentScraper
import zipfile
from io import BytesIO

class Zip:
    def __init__(self, data: dict):
        validatedInput = ZipInput(**data)
        self.scraper = PatentScraper("")
        self.pns = validatedInput.pns

    def handleRequest(self):
        zip_buffer = BytesIO()
        not_found_patents = []
        validPatents = False
        with zipfile.ZipFile(zip_buffer, 'w') as zipf:
            for patent_id in self.pns:
                pdf_link = self.scraper.getPDFLink(patent_id)
                if pdf_link:
                    # print("pdf link found")
                    pdf_content = self.scraper.scrapePDF(pdf_link)
                    if pdf_content:
                        zipf.writestr(f"{patent_id}.pdf", pdf_content)
                        validPatents = True
                    else:
                        not_found_patents.append(patent_id)
                else:
                    not_found_patents.append(patent_id)
        zip_buffer.seek(0)
        return zip_buffer, validPatents, not_found_patents