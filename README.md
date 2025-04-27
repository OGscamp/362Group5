# Group 5 Class Project
 
 | ID | 12345 |
 | ----------- | ----------- |
 | Name | NotAirBnb |
 | Description (Product Vision) | **For** travelers and renters **who** need a simple and efficient way to book short-term stays, **The** NotAirBnb platform provides a seamless experience. **That** ensures users can quickly log in, view available bookings, select a house, and complete payments effortlessly. **Unlike** other competitors with complex and time-consuming booking processes, **our product** guarantees instant confirmation and a hassle-free experience.   |
 | Primary Actor | User |
 | Preconditions | User logged into the system |
 | Postconditions | User has booked a property. |
 
 
 
 
 # Functional Requirments Table

| #   | Feature                  | Description                                                                 |
|-----|---------------------------|-----------------------------------------------------------------------------|
| 1   | Start Page                | Load a Start Page with a welcome message, "Find a Place" and "Become a Host" options, a login button, a register button, and a destination search bar. |
| 2   | User Login Page           | Load a Login Page where users enter email and password for authentication. Successful login redirects to the Home Page. Includes a link to the Register Page. |
| 3   | Register Page             | Load a Register Page where users create an account by entering email, password, confirm password, and selecting Traveler or Host. Successful registration redirects to the Home Page. |
| 4   | Home Page                 | Display a Home Page showing vacant property listings with images, titles, price per night, and review ratings. Includes filter options for price, bedrooms, and review rating. |
| 5   | Listing Details Page      | Show detailed property page with more images, full description, review ratings, host information, date selection, and a user-host chat feature. |
| 6   | Cart Page                 | Display a summary cart of listings selected by the user. Allow removal of listings and proceeding to the Payment Page. |
| 7   | Payment Page              | Accept secure payment information and display booking summary. Redirect to the Confirmation Page upon successful payment. |
| 8   | Confirmation Page         | Display a confirmation page after successful payment showing booking details including property name. |
| 9   | Navigation Bar            | Display a navigation bar with NotAirbnb logo, Home link, Search Bar, Cart link, Login link, and Register link. All items except the Search Bar are clickable links. |
| 10  | Contact Help Page         | Provide a form for users to submit support requests with email, subject, and message. Send a confirmation message upon submission. |
| 11  | User Review               | Allow users to post ratings and comments for booked properties. Display reviews on the corresponding Listing Details Page. |
| 12  | Host Property Listing     | Allow hosts to create and manage their own listings, including title, description, price, available dates, and images. |
| 13  | Host-User Chat            | Enable messaging between users and hosts from the Listing Details Page. Store and display previous conversations. |




# Detailed Functional Requirements

 1. Start Page: The system shall load in to a Start Page with a welcome message ("Welcome to NotAirbnb"). The page shall provide two main options: "Find a Place" and "Become a Host." It shall also include a login button, a sign-up button at the top right corner, and a search bar where users can search for destinations.
 2. User Login Page: The system shall load a Login Page where users can enter their email and password for authentication. Upon successful authentication, users shall be logged in and redirected appropriately to the Listing Page. The Login Page shall also include a link that directs users to the Register Page if they want to create a new account.
 3. Register Page: The system shall load a Register Page where new users can create an account. The Sign Up Page shall provide input fields for the user's email address, password, confirm password, and whether they are a Traveler or Host. Upon successful registration, the system shall save the user's credentials and redirect the user to the Home Page.
 4. Home Page: The system shall display a home page showing vacant properties. Each listing includes an image of the property, property title, price per night, and review rating. The page shall also include a filter button allowing users to filter by price (min-max), amount of bedrooms (1-4+) and review rating (2-4+ stars).
 5. Listing Details Page: The system shall display a detailed page for each property when a user selects a listing from the Home Page. This page shall include more images, a complete property description, detailed review ratings, and host information. Users can select check-in and check-out dates and add the property to their cart from this page. The page shall also include a chat feature that allows direct contact between the hosts and the users.
 6. Cart Page: The system shall display a summary cart that displays the listings the user selects on the Home Page. The page shall include options to remove a selected listing and a checkout button to proceed to the Payment Page.
 7. Payment Page: The system shall display a page where users can securely enter their payment method and information. The page shall also include a summary of the booking details and total cost. Upon submission, the system shall process the payment, and if the payment is successful, redirect the user to the Confirmation Page.
 8. Confirmation Page: The system shall display a confirmation page after a successful payment. The page shall confirm the user’s booking and display the property name.
 9. Navigation Bar: The system shall display a navigation bar at the top of each page, containing the NotAirbnb logo, Home link, Search Bar, Cart link, Login link, and Register link. Each item in the navigation bar, except the Search Bar, shall function as a clickable link that redirects users to the corresponding page. The Search Bar shall allow users to search for destinations. The navigation bar shall be consistent and accessible across all pages of the website.
 10. Contact Help Page: The system shall provide a Contact Help page where users can submit support requests. The page shall include a form that allows users to enter their email address, subject, and message. Upon submission, the system shall send a confirmation message to the users when the customer support team receives the request.
 11. User Review: The system shall allow users to post reviews for properties they have booked. Each review shall include a rating and an optional written comment. The system shall display submitted reviews on the corresponding Listing Details Page, maintaining a backlog of reviews for each property.
 12. Host Property Listing: The system shall allow hosts to create and manage their one property listings. Hosts can enter property titles, descriptions, price, available dates, and images.
 13. Host-User Chat: The system shall provide a messaging feature that allows users to chat with hosts. Users shall be able to initiate a conversation from the Listing Detail Page to ask questions before booking. Hosts shall be able to view and respond to messages. The chat system shall display previous messages between the users and hosts.
 
 


 # Non-Functional Requirements
 
| #   | Feature                   | Description                                                                 |
|-----|----------------------------|-----------------------------------------------------------------------------|
| 1   | Start Page Load Time       | The Start Page shall load within 2 seconds.                                 |
| 2   | Login and Register Response Time | The Login and Register processes shall complete within 2 seconds.         |
| 3   | Payment Processing Speed   | Payment processing and redirection shall complete within 5 seconds.         |
| 4   | UI Responsiveness          | The UI shall adapt correctly across desktop, tablet, and mobile devices.    |
| 5   | Data Security              | All user data shall be securely stored and transmitted over HTTPS.          |
| 6   | Role-Based Access Control  | Hosts and users shall have distinct system permissions.                    |
| 7   | System Availability        | The system shall maintain 99% availability, excluding scheduled maintenance.|
| 8   | Elastic Scalability        | The system shall dynamically scale resources based on the number of active users. |
| 9   | Message History            | The chat system shall retain and display the last messages even after a page reload. |
| 10  | Error Handling             | The system shall provide clear and actionable error messages to users.      |

 
 
 
 # Main Success Scenario  
 1. User browses the homepage and views available property listings.
 2. System displays a list of diverse avaiable homes
 3. User selects a property from the list
 4. User proceeds to the payment option
 5. User clicks **“Submit”** button to confirm booking
 6. System sucessfully books the property and sends a confirmation email.
 
 # Activity Diagram
 ![Logo](Group%205%20UML%20Software%20Updated.jpg)
