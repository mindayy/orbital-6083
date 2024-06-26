import java.io.IOException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class lovetScrapper {

    public static void main(String[] args) {
        String url = "https://lovet.sg/collection/new-in";

        try {
            Document document = Jsoup.connect(url).get();
            Elements items = document.select(".productrow");
            
            System.out.println("==========================");
            System.out.println("Items - Lovet Scrapper");
            for(Element item: items) {
                String title = item.select(".product-title").text();
                String price = item.select(".uc-price").text();
                System.out.println(title + " - " + price);
            }
        System.out.println("==========================");

        } catch(IOException e) {
            e.printStackTrace();
        }
    }
}
