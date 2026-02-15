from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Start application
        print("Navigating to home page...")
        page.goto("http://localhost:5173")

        # 2. Login
        print("Logging in...")
        page.fill('input[placeholder="Vorname Nachname"]', "Test User")
        page.click('button:has-text("Starten")')

        # 3. Wait for dashboard
        page.wait_for_url("**/dashboard")
        print("Logged in successfully.")

        # 4. Navigate to the lesson with the dummy video
        # The URL for lesson-1-2 in module-1 of course ferienbetreuung
        lesson_url = "http://localhost:5173/course/ferienbetreuung/lesson/lesson-1-2"
        print(f"Navigating to lesson: {lesson_url}")
        page.goto(lesson_url)

        # 5. Verify video tag exists
        try:
            video_element = page.wait_for_selector("video", timeout=5000)
            if video_element:
                print("SUCCESS: <video> tag found.")

                # Verify source
                source_src = page.evaluate('document.querySelector("video source").src')
                print(f"Video source: {source_src}")

                if "test.mp4" in source_src:
                    print("SUCCESS: Video source points to test.mp4")
                else:
                    print(f"FAILURE: Video source is {source_src}, expected to contain 'test.mp4'")
            else:
                print("FAILURE: <video> tag not found.")
        except Exception as e:
            print(f"FAILURE: Error finding video tag: {e}")

        # 6. Take screenshot
        page.screenshot(path="verification/verification.png")
        print("Screenshot saved to verification/verification.png")

        browser.close()

if __name__ == "__main__":
    run()
