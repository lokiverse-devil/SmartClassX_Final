from machine import Pin
import time

LED_PIN = 2        
ACTIVE_LOW = False  
led = Pin(LED_PIN, Pin.OUT)

def led_on():
    led.value(0 if ACTIVE_LOW else 1)

def led_off():
    led.value(1 if ACTIVE_LOW else 0)

def blink(times, on_ms=200, off_ms=150):
    for _ in range(times):
        led_on()
        time.sleep_ms(on_ms)
        led_off()
        time.sleep_ms(off_ms)


try:
    from noticeboard import SmartNoticeBoard
except Exception as e:
    print("Import error:", e)
    blink(2, 300, 200)  
    raise


app = SmartNoticeBoard()


try:
    app.wifi.connect()   
    blink(1, 350, 150)   
except Exception as e:
    print("WiFi/connect error:", e)
    blink(2, 350, 200)  
    raise


try:
    app.run()
except Exception as e:
    print("Runtime error:", e)
    while True:
        blink(2, 200, 150)
        time.sleep(0.5)
