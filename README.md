# Group 5 Class Project
 
 | ID | 12345 |
 | ----------- | ----------- |
 | Name | NotAirBnb |
 | Description (Product Vision) | **For** travelers and renters **who** need a simple and efficient way to book short-term stays, **The** NotAirBnb platform provides a seamless experience. **That** ensures users can quickly log in, view available bookings, select a house, and complete payments effortlessly. **Unlike** other competitors with complex and time-consuming booking processes, **our product** guarantees instant confirmation and a hassle-free experience.   |
 | Primary Actor | User |
 | Preconditions | User logged into the system |
 | Postconditions | User has booked a home. |
 
 # Functional Requirments Table

| #   | Feature                 | Description                                                                 |
|-----|--------------------------|-----------------------------------------------------------------------------|
| 1   | User Login Page          | Load the login page where users can enter their email and password. Includes a register button. Successful login redirects users appropriately. |
| 2   | Listing Page             | Display vacant property listings with image, title, price, and review rating. Includes “Add to Cart” and sorting features by price or rating. |
| 3   | Listing Details Page     | Show detailed property page with more images, full description, review ratings, host info, date selection, and user-host chat feature. |
| 4   | Cart Page                | Show a summary cart of selected listings. Users can remove listings or proceed to the Payment Page. |
| 5   | Payment Page             | Securely accept payment information and display booking summary. Redirects to Confirmation Page upon successful payment. |
| 6   | Confirmation Page        | Display a confirmation message and booking details (including property name) after successful payment. |
| 7   | Navigation Bar           | Display a consistent nav bar on all pages with links to Listing, Cart, Payment, and Login. Allows navigation between major sections. |
| 8   | Contact Help Page        | Display a form for support requests. Users can enter email, subject, and message. Sends a confirmation upon submission. |
| 9   | User Review              | Allow users to post ratings and comments for booked properties. Display reviews on the Listing Details Page. |
| 10  | Host Property Listing    | Allow hosts to create and manage their own listings, including title, description, price, availability, and images. |
| 11  | Host-User Chat           | Enable messaging between users and hosts from the Listing Details Page. Stores and displays previous conversations. |

# Detailed Functional Requirements

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

 
 
 
 # Non-Functional Requirements
 
| #   | Feature                   | Description                                                                 |
|-----|---------------------------|-----------------------------------------------------------------------------|
| 1   | Login Page Load Time      | Page shall load within 2 seconds.                                          |
| 2   | Login Response Time       | Login process shall complete within 2 seconds.                             |
| 3   | Payment Processing Speed  | Payment and redirect shall complete within 5 seconds.                      |
| 4   | UI Responsiveness         | UI shall adapt correctly to all devices.                                   |
| 5   | Data Security             | Data shall be stored and transmitted securely.                             |
| 6   | Role-Based Access Control | Hosts and users shall have different system permissions.                   |
| 7   | System Availability       | Website shall be available 99% of the time, excluding maintenance.         |
| 8   | Elastic Scalability       | System shall scale resources based on number of users.                     |
| 9   | Message History           | Chat system shall retain last messages even after reload.                  |
| 10  | Error Handling            | System shall provide clear, actionable error messages.                     |
 
 
 
 # Main Success Scenario  
 1. User browses the homepage and views available property listings.
 2. System displays a list of diverse avaiable homes
 3. User selects a property from the list
 4. User proceeds to the payment option
 5. User clicks **“Submit”** button to confirm booking
 6. System sucessfully books the property and sends a confirmation email.
 
 # Activity Diagram
 ![Logo](Group%205%20UML%20Software.jpg)
