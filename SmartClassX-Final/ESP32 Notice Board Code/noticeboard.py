from machine import Pin, I2C
import ssd1306
import time
import network
import urequests

# ------------------- WiFi Manager -------------------
class WiFiManager:
    def __init__(self, ssid, password):
        self.ssid = ssid
        self.password = password
        self.wifi = network.WLAN(network.STA_IF)

    def connect(self):
        self.wifi.active(True)
        self.wifi.connect(self.ssid, self.password)
        while not self.wifi.isconnected():
            print("Connecting to WiFi...")
            time.sleep(1)
        print("Connected! IP:", self.wifi.ifconfig()[0])
        return True


# ------------------- OLED Display -------------------
class OLEDDisplay:
    def __init__(self, scl_pin=22, sda_pin=21, width=128, height=64):
        i2c = I2C(0, scl=Pin(scl_pin), sda=Pin(sda_pin))
        self.oled = ssd1306.SSD1306_I2C(width, height, i2c)

    def wrap_text(self, text, max_chars=16):
        words = text.split(' ')
        lines, current = [], ""
        for word in words:
            if len(current + ' ' + word) <= max_chars:
                current = (current + ' ' + word).strip()
            else:
                lines.append(current)
                current = word
        lines.append(current)
        return lines

    def show_text_centered(self, text, y):
        x = max(0, (128 - len(text) * 8) // 2)
        self.oled.text(text, x, y)

    def fade_transition(self):
        self.oled.fill(0)
        for _ in range(3):
            self.oled.text("•••", 60, 28)
            self.oled.show()
            time.sleep(0.15)
            self.oled.fill(0)
            self.oled.show()
            time.sleep(0.15)
        time.sleep(0.3)

    def scroll_text_rtl(self, text, y, speed=0.04):
        padded = text + "    "
        text_width = len(padded) * 8
        for x in range(128, -text_width, -1):
            self.oled.fill_rect(0, y - 2, 128, 20, 0)
            self.oled.text(padded, x, y)
            self.oled.show()
            time.sleep(speed)

    def fade_in_event(self, event):
        for _ in range(5):
            self.oled.fill(0)
            self.show_text_centered("Event: " + event.get("Event", ""), 0)
            place_lines = self.wrap_text("Place: " + event.get("place", ""))
            for i, line in enumerate(place_lines):
                self.show_text_centered(line, 14 + i * 12)
            y = 14 + len(place_lines) * 12
            self.oled.text("Time: " + event.get("Time", ""), 0, y)
            self.oled.hline(0, y + 12, 128, 1)
            self.oled.show()
            time.sleep(0.1)

    def show_event(self, event):
        self.oled.fill(0)
        self.show_text_centered("Event: " + event.get("Event", ""), 0)
        place_lines = self.wrap_text("Place: " + event.get("place", ""))
        for i, line in enumerate(place_lines):
            self.show_text_centered(line, 14 + i * 12)
        y = 14 + len(place_lines) * 12
        self.oled.text("Time: " + event.get("Time", ""), 0, y)
        self.oled.hline(0, y + 12, 128, 1)
        self.oled.show()
        time.sleep(1)
        self.scroll_text_rtl(event.get("Desc", ""), y + 16)


# ------------------- Event Manager -------------------
class EventManager:
    def __init__(self, url):
        self.url = url
        self.previous_events = []

    def fetch_events(self):
        try:
            r = urequests.get(self.url)
            data = r.json()
            r.close()
            return data
        except Exception as e:
            print("Error fetching:", e)
            return []

    def is_new(self, event):
        return event not in self.previous_events

    def update_events(self, events):
        self.previous_events = events


# ------------------- Main Application -------------------
class SmartNoticeBoard:
    def __init__(self):
        self.wifi = WiFiManager("<Wifi SSID>", "<Password>")
        self.display = OLEDDisplay()
        self.event_manager = EventManager(
            "https://opensheet.elk.sh/14Ds6rUqfqAZFYH18PUCrN0-4BLnaMQRwbxqEFPWl8H4/Sheet1"
        )

    def run(self):
        self.wifi.connect()
        while True:
            events = self.event_manager.fetch_events()
            if not events:
                print("No events found")
                time.sleep(10)
                continue

            for e in events:
                if self.event_manager.is_new(e):
                    self.display.fade_in_event(e)
                else:
                    self.display.fade_transition()
                self.display.show_event(e)

            self.event_manager.update_events(events)


# ------------------- Run App -------------------
if __name__ == "__main__":
    app = SmartNoticeBoard()
    app.run()
