# Group 5 Class Project
 
 | ID | 12345 |
 | ----------- | ----------- |
 | Name | NotAirBnb |
 | Description (Product Vision) | **For** travelers and renters **who** need a simple and efficient way to book short-term stays, **The** NotAirBnb platform provides a seamless experience. **That** ensures users can quickly log in, view available bookings, select a house, and complete payments effortlessly. **Unlike** other competitors with complex and time-consuming booking processes, **our product** guarantees instant confirmation and a hassle-free experience.   |
 | Primary Actor | User |
 | Preconditions | User logged into the system |
 | Postconditions | User has booked a home. |
 
 # Functional Requirments
 1. User Login Page: The system shall load the login page, where users can enter their email and password for authentication. Upon successful authentication, users will be logged in. The page shall also include a register button for new users.
 2. Listing Page: The system shall display a listing page showing vacant properties. Each listing includes an image of the property, property title, price per night, and review rating. An “Add to Cart” button shall be available on each listing, allowing users to add the selected property to their cart. The page shall also include a sort feature button allowing users to sort by prices (low to high/ high to low) and review rating (highest rated first).
 3. Listing Details Page: The system shall display a detailed page for each property when a user selects a listing from the Listings Page. This page shall include more images, a complete property description, detailed review ratings, and host information. Users can select check-in and check-out dates and add the property to their cart from this page. The page shall also include a chat feature that allows direct contact between the hosts and the users.
 4. Cart Page: The system shall display a summary cart that displays the listings the user selects on the Product Page. The page shall include options to remove a selected listing and a checkout button to proceed to the Payment Page.
 5. Payment Page: The system shall display a page where users can securely enter their payment method and information. The page shall also include a summary of the booking details and total cost. Upon submission, the system shall process the payment, and if the payment is successful, redirect the user to the Confirmation Page.
 6. Confirmation Page: The system shall display a confirmation page after a successful payment. The page shall confirm the user’s booking and display the property name.
 7. Navigation Bar: The system shall display a navigation bar at the top of each page, containing links to Listing, Cart, Payment, and Login. The navigation bar shall be consistent across all pages and allow users to navigate between the main pages on the website.
 8. Contact Help Page: The system shall provide a Contact Help page where users can submit support requests. The page shall include a form that allows users to enter their email address, subject, and message. Upon submission, the system shall send a confirmation message to the users when the customer support team receives the request.
 9. User Review: The system shall allow users to post reviews for properties they have booked. Each review shall include a rating and an optional written comment. The system shall display submitted reviews on the corresponding Listing Details Page, maintaining a backlog of reviews for each property.
 10. Host Property Listing: The system shall allow hosts to create and manage their one property listings. Hosts can enter property titles, descriptions, price, available dates, and images.
 11. Host-User Chat: The system shall provide a messaging feature that allows users to chat with hosts. Users shall be able to initiate a conversation from the Listing Detail Page to ask questions before booking. Hosts shall be able to view and respond to messages. The chat system shall display previous messages between the users and hosts.
 | #   | Feature                         | Description |
 |-----|---------------------------------|-------------|
 | 23  | Login User                      | Have a login page for the user to get their credentials authenticated |
 | 7   | Product Page                     | Display a product page to the user displaying vacant houses for rent |
 | 42  | Review Page                      | Contain a “cart” and a page to review user’s decisions |
 | 15  | Payment Page                     | Have a payment page that allows the user to input their payment information |
 | 88  | Confirmation Page                | Display a confirmation page for the user that confirms the user’s purchase |
 | 30  | Allow users to post reviews      | Keep a backlog of reviews for each listing |
 | 99  | Allow hosts to list properties   | Let hosts have the ability to create their own listings as a permissioned user |
 
 
 
 # Non-Functional Requirements
 1. Login Page Load Time: The system shall load into the User login page within 2 seconds.
 2. Login Response Time: The login process shall be complete within 2 seconds.
 3. Payment Processing Speed: The system shall complete payment processing and redirect to the Confirmation Page within 5 seconds.
 4. UI Responsiveness: The UI shall be responsive and correctly display on a desktop and other devices.
 5. Data Security: All user data, including passwords and payment information, shall be securely stored and transmitted.
 6. Role-Based Access Control: The system shall implement authentication and separate user and host-level privileges.
 7. System Availability: The system shall be available 99% of the time, excluding maintenance.
 8. Elastic Scalability: The system shall scale processing resources dynamically based on the number of active users to maintain performance.
 9. Message History: The chat system shall retain and display the last messages between a user and host, even after page reload.
 10. Error Handling: The system shall provide clear error messages to users when form validation fails or operations are unsuccessful.
 | #   | Feature                          | Description |
 |-----|----------------------------------|-------------|
 | 14  | Logs a user in quickly           | User login should complete within 2 seconds |
 | 37  | Find available rooms quickly     | Search for available rooms should return in under 3 seconds |
 | 82  | Processes payments quickly       | Payment processing and confirmation should be under 5 seconds |
 | 21  | The UI should be intuitive       | Make navigating the website simple and adaptable across different devices. |
 | 56  | Processing should be elastic     | System can scale processing resources based on the number of users |
 
 
 
 # Main Success Scenario  
 1. User searches for the area of the location they would want to book at
 2. System displays a list of homes in the area.
 3. User selects home in the area selected 
 4. User goes to the payment option
 5. User clicks **“Submit”** button
 6. System books user under a home and sends a confirmation email.
 
 # Activity Diagram
 ![Logo](Group%205%20UML%20Software.jpg)
