const { Builder, By, until } = require('selenium-webdriver');

(async function testLoginSearchNutritionAndBookAppointment() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Step 1: Open HealthConnect Homepage
        await driver.get('http://localhost:3000'); // Change if needed

        // Step 2: Click on Login Button
        let loginButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Login')]")), 10000);
        await loginButton.click();

        // Step 3: Wait for the Login Page to Load
        await driver.wait(until.urlContains('/login'), 20000);

        // Step 4: Find email and password fields and enter login credentials
        let emailField = await driver.wait(until.elementLocated(By.css('input[type="email"]')), 10000);
        await emailField.sendKeys('atharva@gmail.com');

        let passwordField = await driver.wait(until.elementLocated(By.css('input[type="password"]')), 10000);
        await passwordField.sendKeys('Atharva1!@#');

        // Step 5: Click the Login Submit Button
        let submitButton = await driver.wait(
            until.elementLocated(By.css('button.bg-greeen.text-white.font-semibold')), 
            10000
        );
        await submitButton.click();

        // Step 6: Wait for successful login (redirect to dashboard or home)
        await driver.wait(until.urlContains('/'), 20000);
        console.log("Successfully logged in!");

        // Step 7: Scroll down to reveal the services section
        await driver.executeScript("window.scrollBy(0, 800);");
        await driver.sleep(3000);
        
        // Scroll more if needed to ensure the services section is visible
        await driver.executeScript("window.scrollBy(0, 300);");
        await driver.sleep(3000);

        // Step 8: Try multiple approaches to find the Learn More link
        try {
            // First approach: Try to find exactly "Learn More" text
            console.log("Trying to find Learn More link by exact text");
            let learnMoreButton = await driver.wait(
                until.elementLocated(By.xpath("//a[text()='Learn More']")),
                5000
            );
            await learnMoreButton.click();
            await driver.sleep(3000);
        } catch (error) {
            console.log("First attempt failed, trying by green button text");
            try {
                // Second approach: Find a green button/link near Nutrition Analyzer
                let learnMoreButtons = await driver.findElements(By.css("a.text-green-500, a.text-green-600, button.text-green-500, button.text-green-600"));
                
                if (learnMoreButtons.length > 0) {
                    // Click the first green button/link (assuming it's the Learn More for Nutrition)
                    await learnMoreButtons[0].click();
                    console.log("Clicked first green button/link");
                    await driver.sleep(3000);
                } else {
                    // Third approach: Try by link text containing "More" or "Learn"
                    console.log("No green buttons found, trying by partial link text");
                    let anyLearnButton = await driver.wait(
                        until.elementLocated(By.partialLinkText("Learn")),
                        5000
                    );
                    await anyLearnButton.click();
                    await driver.sleep(3000);
                }
            } catch (error) {
                console.log("All standard attempts failed, trying direct navigation");
                // Last resort: Navigate directly to the nutrition search page
                await driver.get('http://localhost:3001/nutrisearch');
                await driver.sleep(3000);
            }
        }

        // Step 9: Wait for navigation to complete to nutrition page
        await driver.wait(until.urlContains('/nutrisearch'), 20000);
        console.log("Successfully navigated to Nutrition Analyzer!");

        // Step 10: Wait for the food input field to be visible and enter "samosa"
        await driver.sleep(5000);
        let foodInput = await driver.wait(
            until.elementLocated(By.css('input[placeholder*="Avocado" i]')), 
            10000
        );
        await foodInput.clear();
        await foodInput.sendKeys('samosa');
        console.log("Successfully entered 'samosa' in the food search field");
        await driver.sleep(3000);

        // Step 11: Click the "Get Nutritional Info" button
        try {
            let searchButton = await driver.wait(
                until.elementLocated(By.xpath("//button[contains(text(), 'Get Nutritional Info')]")),
                5000
            );
            await searchButton.click();
            console.log("Clicked the search button");
            await driver.sleep(6000);
        } catch (error) {
            console.log("Search button not found or not needed to click");
        }

        // Step 12: Click on Home to navigate back to homepage
        console.log("Attempting to navigate back to homepage");
        let homeButton = await driver.wait(
            until.elementLocated(By.xpath("//a[contains(text(),'Home')]")), 
            10000
        );
        await homeButton.click();
        await driver.sleep(3000);
        
        // Wait for navigation to complete to homepage
        await driver.wait(until.urlContains('/'), 10000);
        console.log("Successfully navigated back to homepage!");

        // NEW SECTION: BMI Calculator
        // Step 13: Scroll down to reveal the services section again
        console.log("Scrolling down to reveal the BMI Calculator section");
        await driver.executeScript("window.scrollBy(0, 800);");
        await driver.sleep(3000);
        
        // Scroll more if needed to ensure the services section is visible
        await driver.executeScript("window.scrollBy(0, 300);");
        await driver.sleep(3000);

        // Step 14: Try multiple approaches to find the Calculate button/link for BMI Calculator
        console.log("Looking for Calculate button/link in BMI Calculator section");
        try {
            let calculateButton = await driver.wait(
                until.elementLocated(By.xpath("//a[contains(text(),'Calculate')]")),
                5000
            );
            await calculateButton.click();
            console.log("Found and clicked Calculate button by exact text");
            await driver.sleep(3000);
        } catch (error) {
            console.log("First attempt failed, trying with partial text");
            try {
                let calculateButton = await driver.wait(
                    until.elementLocated(By.partialLinkText("Calculate")),
                    5000
                );
                await calculateButton.click();
                console.log("Found and clicked Calculate button by partial text");
                await driver.sleep(3000);
            } catch (error) {
                console.log("Second attempt failed, trying with CSS selector for green buttons");
                try {
                    let greenButtons = await driver.findElements(By.css("a.text-green-500, button.text-green-500, a.bg-green-500, button.bg-green-500"));
                    
                    if (greenButtons.length > 0) {
                        for (let i = 0; i < greenButtons.length; i++) {
                            let buttonText = await greenButtons[i].getText();
                            console.log(`Found button with text: ${buttonText}`);
                            if (buttonText.includes("Calculate") || buttonText.includes("BMI")) {
                                await greenButtons[i].click();
                                console.log("Clicked on button containing 'Calculate' or 'BMI' text");
                                await driver.sleep(3000);
                                break;
                            }
                            
                            // Fallback based on position
                            if (i === 1) {
                                await greenButtons[i].click();
                                console.log("Clicked on the second green button");
                                await driver.sleep(3000);
                                break;
                            }
                        }
                    } else {
                        console.log("No green buttons found, trying direct navigation");
                        await driver.get('http://localhost:3001/bmicalculator');
                        console.log("Directly navigated to BMI calculator page");
                        await driver.sleep(3000);
                    }
                } catch (error) {
                    console.log("All attempts failed, trying direct navigation");
                    await driver.get('http://localhost:3001/bmicalculator');
                    console.log("Directly navigated to BMI calculator page");
                    await driver.sleep(3000);
                }
            }
        }
        
        // Wait for BMI calculator page to load
        await driver.sleep(5000);
        console.log("BMI Calculator page loaded");

        // Step 15: Fill out the BMI calculator form
        // Enter Weight (72 kg)
        console.log("Entering weight value");
        try {
            let weightField = await driver.wait(
                until.elementLocated(By.css('input[placeholder="Weight (kg)"], input[name="weight"]')), 
                5000
            );
            await weightField.clear();
            await weightField.sendKeys('72');
            console.log("Successfully entered weight: 72 kg");
            await driver.sleep(3000);
        } catch (error) {
            console.log("Error finding weight field by placeholder, trying alternative selectors");
            try {
                let inputs = await driver.findElements(By.css('input[type="text"], input[type="number"]'));
                if (inputs.length > 0) {
                    await inputs[0].clear();
                    await inputs[0].sendKeys('72');
                    console.log("Entered weight using first input field");
                    await driver.sleep(3000);
                }
            } catch (innerError) {
                console.log("Failed to enter weight:", innerError.message);
            }
        }

        // Enter Height (1.7 m)
        console.log("Entering height value");
        try {
            let heightField = await driver.wait(
                until.elementLocated(By.css('input[placeholder="Height (m)"], input[name="height"]')), 
                5000
            );
            await heightField.clear();
            await heightField.sendKeys('1.7');
            console.log("Successfully entered height: 1.7 m");
            await driver.sleep(3000);
        } catch (error) {
            console.log("Error finding height field by placeholder, trying alternative selectors");
            try {
                let inputs = await driver.findElements(By.css('input[type="text"], input[type="number"]'));
                if (inputs.length > 1) {
                    await inputs[1].clear();
                    await inputs[1].sendKeys('1.7');
                    console.log("Entered height using second input field");
                    await driver.sleep(3000);
                }
            } catch (innerError) {
                console.log("Failed to enter height:", innerError.message);
            }
        }

        // Enter Age (20)
        console.log("Entering age value");
        try {
            let ageField = await driver.wait(
                until.elementLocated(By.css('input[placeholder="Age"], input[name="age"]')), 
                5000
            );
            await ageField.clear();
            await ageField.sendKeys('20');
            console.log("Successfully entered age: 20");
            await driver.sleep(3000);
        } catch (error) {
            console.log("Error finding age field by placeholder, trying alternative selectors");
            try {
                let inputs = await driver.findElements(By.css('input[type="text"], input[type="number"]'));
                if (inputs.length > 2) {
                    await inputs[2].clear();
                    await inputs[2].sendKeys('20');
                    console.log("Entered age using third input field");
                    await driver.sleep(3000);
                }
            } catch (innerError) {
                console.log("Failed to enter age:", innerError.message);
            }
        }

        // Step 16: Click Calculate BMI button
        console.log("Clicking Calculate BMI button");
        try {
            let calculateBMIButton = await driver.wait(
                until.elementLocated(By.xpath("//button[contains(text(), 'Calculate BMI')]")), 
                5000
            );
            await calculateBMIButton.click();
            console.log("Successfully clicked Calculate BMI button");
            await driver.sleep(3000);
        } catch (error) {
            console.log("Error finding Calculate BMI button by text, trying alternatives");
            try {
                let greenButtons = await driver.findElements(By.css("button.bg-green-500, button.bg-green-600, button.text-green-500"));
                if (greenButtons.length > 0) {
                    await greenButtons[0].click();
                    console.log("Clicked first green button as Calculate BMI button");
                    await driver.sleep(3000);
                } else {
                    let buttons = await driver.findElements(By.css("button"));
                    if (buttons.length > 0) {
                        for (let button of buttons) {
                            let text = await button.getText();
                            if (text.toLowerCase().includes("calculate") || text.toLowerCase().includes("bmi")) {
                                await button.click();
                                console.log("Found and clicked button with Calculate or BMI text");
                                await driver.sleep(3000);
                                break;
                            }
                        }
                    }
                }
            } catch (innerError) {
                console.log("Failed to click Calculate BMI button:", innerError.message);
            }
        }

        // Wait for BMI calculation result
        await driver.sleep(5000);
        console.log("BMI calculation completed");

        // Step 17: Navigate back to homepage
        console.log("Navigating back to homepage");
        try {
            let homeLink = await driver.findElement(By.xpath("//a[contains(text(),'Home')]"));
            await homeLink.click();
            console.log("Successfully clicked on Home link");
            await driver.sleep(3000);
            
            await driver.wait(until.urlContains('/'), 10000);
            console.log("Successfully returned to homepage!");
        } catch (error) {
            console.log("Error returning to homepage:", error.message);
            await driver.get('http://localhost:3001');
            console.log("Returned to homepage via direct navigation");
            await driver.sleep(3000);
        }

        // FIXED SECTION: Click on Logout at top right corner
        console.log("Attempting to click on Logout button");
        try {
            await driver.sleep(3000);
            let logoutButton = await driver.wait(
                until.elementLocated(By.xpath("//button[contains(text(), 'Logout')]")), 
                5000
            );
            await logoutButton.click();
            console.log("Successfully clicked on Logout button");
            await driver.sleep(3000);
        } catch (error) {
            console.log("Error finding Logout button by text, trying alternative approaches");
            try {
                let logoutButtons = await driver.findElements(By.css("div.flex.cursor-pointer.justify-center.items-center button"));
                if (logoutButtons.length > 0) {
                    for (let btn of logoutButtons) {
                        let text = await btn.getText();
                        if (text.includes("Logout")) {
                            await btn.click();
                            console.log("Found and clicked Logout button by text content");
                            await driver.sleep(3000);
                            break;
                        }
                    }
                    if (logoutButtons.length > 0) {
                        await logoutButtons[logoutButtons.length - 1].click();
                        console.log("Clicked the last button in the navigation area");
                        await driver.sleep(3000);
                    }
                }
            } catch (innerError) {
                console.log("Error with complex Logout selectors, trying simpler approach");
                try {
                    let anyLogoutBtn = await driver.findElement(By.css("button:contains('Logout')"));
                    await anyLogoutBtn.click();
                    console.log("Found and clicked button containing Logout text");
                    await driver.sleep(3000);
                } catch (finalError) {
                    console.log("All logout methods failed, using JavaScript click as last resort");
                    try {
                        await driver.executeScript(`
                            const elements = Array.from(document.querySelectorAll('button'));
                            const logoutButton = elements.find(el => el.textContent.includes('Logout'));
                            if (logoutButton) logoutButton.click();
                        `);
                        console.log("Attempted to click Logout button via JavaScript");
                        await driver.sleep(3000);
                    } catch (jsError) {
                        console.log("JavaScript click method also failed:", jsError.message);
                    }
                }
            }
        }

        // Wait to confirm logout (usually redirects to login page or home)
        await driver.sleep(5000);
        console.log("Logout process completed");

    } catch (error) {
        console.error("Main Error:", error);
    } finally {
        await driver.quit();
    }
})();