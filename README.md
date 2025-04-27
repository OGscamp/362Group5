# Group 5 Class Project
 
 | ID | 12345 |
 | ----------- | ----------- |
 | Name | NotAirBnb |
 | Description (Product Vision) | **For** travelers and renters **who** need a simple and efficient way to book short-term stays, **The** NotAirBnb platform provides a seamless experience. **That** ensures users can quickly log in, view available bookings, select a house, and complete payments effortlessly. **Unlike** other competitors with complex and time-consuming booking processes, **our product** guarantees instant confirmation and a hassle-free experience.   |
 | Primary Actor | User |
 | Preconditions | User logged into the system |
 | Postconditions | User has booked a property. |
 
 
 
 
 # Functional Requirments Table

| #   | Feature                     | Description                                                                                                                                                     |
|-----|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1   | User Login Page              | Load a Login Page where users enter email and password for authentication. Successful login redirects to the Home Page. Includes a link to the Register Page.  |
| 2   | Register Page                | Load a Register Page where users create an account by entering email, password, confirm password, and selecting Traveler or Host. Successful registration redirects to the Home Page. |
| 3   | Home Page                    | Load the Home Page displaying a welcome message, destination search bar, and Featured Properties section with image, title, location, price per night, and review rating. |
| 4   | Listing Details Page         | Display a detailed property page showing large image, title, location, number of bedrooms and bathrooms, description, review ratings, and booking options.     |
| 5   | Cart Page                    | Display a summary cart showing listings selected by the user. Allow users to remove listings or proceed to the Payment Page.                                   |
| 6   | Payment Page                 | Accept secure payment information and display a booking summary. Redirect users to the Confirmation Page upon successful payment.                              |
| 7   | Confirmation Page            | Display a confirmation page after successful payment showing booking confirmation and property name.                                                          |
| 8   | Navigation Bar               | Display a navigation bar with NotAirbnb logo, Home link, Search link, and dynamic links based on login status (Login/Register vs My Listings, Bookings, Support, Mailbox, Cart, Welcome message, Logout). |
| 9   | Contact Help Page            | Provide a Contact Help page with a form for users to submit support requests with email, subject, and message. Send a confirmation message upon submission.      |
| 10  | My Listing Page              | Display a My Listings Page where hosts can add new listings by entering title, description, price, location, and uploading photos. Existing listings are displayed if available. |
| 11  | My Booking Page              | Display a My Bookings Page where users can view and manage booking requests. Include filter options for All, Pending, Accepted, Denied, and Payments statuses.  |
| 12  | Mailbox Page                 | Display a Mailbox Page with Inbox and Sent tabs allowing users to manage messages. Accessible only after login.                                                  |
| 13  | User Review                  | Allow users to post ratings and optional comments for properties they have booked. Display reviews on the corresponding Listing Details Page.                   |
| 14  | Host Property Listing        | Allow hosts to create and manage their own property listings including title, description, price, available dates, and images.                                  |
| 15  | Host-User Chat               | Enable messaging between users and hosts from the Listing Details Page. Display previous conversations between users and hosts.                                 |
| 16  | Search Bar and Filter Feature| Provide a search bar and a Filters button to allow users to filter listings by price range, number of bedrooms, and minimum review rating. Update results after applying filters. |




# Detailed Functional Requirements

 1. User Login Page: The system shall load a Login Page where users can enter their email and password for authentication. Upon successful authentication, users shall be logged in and redirected appropriately to the Listing Page. The Login Page shall also include a link that directs users to the Register Page if they want to create a new account.
 2. Register Page: The system shall load a Register Page where new users can create an account. The Sign Up Page shall provide input fields for the user's email address, password, confirm password, and whether they are a Traveler or Host. Upon successful registration, the system shall save the user's credentials and redirect the user to the Home Page.
 3. Home Page: The system shall load the Home Page displaying a welcome message, a destination search bar, and a Featured Properties section. Each property listing shall include an image, title, location, price per night, and review rating. Users shall be able to search for destinations using the search bar. The Home Page shall also include a prompt inviting users to "Sign in to List Your Property."
 4. Listing Details Page: The system shall display a detailed page for each property when a user selects a listing from the Home Page. This page shall include a large image of the property, property title, location, number of bedrooms, number of bathrooms, a complete property description, and detailed review ratings. Users shall be able to select check-in and check-out dates, specify the number of guests, view the total price, and either add the property to their cart or proceed to booking. The page shall also display existing user reviews related to the property.
 5. Cart Page: The system shall display a summary cart that displays the listings the user selects on the Home Page. The page shall include options to remove a selected listing and a checkout button to proceed to the Payment Page.
 6. Payment Page: The system shall display a page where users can securely enter their payment method and information. The page shall also include a summary of the booking details and total cost. Upon submission, the system shall process the payment, and if the payment is successful, redirect the user to the Confirmation Page.
 7. Confirmation Page: The system shall display a confirmation page after a successful payment. The page shall confirm the user’s booking and display the property name.
 8. Navigation Bar: The system shall display a navigation bar at the top of each page, containing the NotAirbnb logo, Home link, and Search link. When the user is not logged in, the navigation bar shall display Login and Register links. When the user is logged in, the navigation bar shall instead display My Listings, Bookings, Support, Mailbox, a Cart icon showing the number of items in the cart, a Welcome message with the user's name, and a Logout button. Each item in the navigation bar, except the Search Bar, shall function as a clickable link that redirects users to the corresponding page. The Search Bar shall allow users to search for destinations. The navigation bar shall remain consistent and accessible across all pages of the website.
 9. Contact Help Page: The system shall provide a Contact Help page where users can submit support requests. The page shall include a form that allows users to enter their email address, subject, and message. Upon submission, the system shall send a confirmation message to the users when the customer support team receives the request.
 10. My Listing Page: The system shall display a My Listings Page where hosts can view and manage the properties they have listed. The page shall include an "Add New Listing" button that opens a form allowing hosts to input a title, description, price, location, and upload photos for a new property. Upon submitting the form, the new listing shall be added to the database. If the user already has existing listings, they shall be displayed on the page in a structured format.
 11. My Booking Page: The system shall display a My Bookings Page where users can view and manage their booking requests. The page shall provide filter options for users to view bookings by status, including All, Pending, Accepted, Denied, and Payments. If no bookings are found under a selected category, the system shall display a "No bookings found" message. The My Bookings Page shall present a clear and organized view to help users easily track the status of their reservations.
 12. Mailbox Page: The system shall display a Mailbox Page where users can view and manage their messages. The page shall contain two tabs, Inbox and Sent, allowing users to toggle between received and sent messages. The Mailbox Page shall be accessible only after the user logs in and shall provide a simple and organized view of user communications.
 13. User Review: The system shall allow users to post reviews for properties they have booked. Each review shall include a rating and an optional written comment. The system shall display submitted reviews on the corresponding Listing Details Page, maintaining a backlog of reviews for each property.
 14. Host Property Listing: The system shall allow host to create and manage their property listings. Hosts can enter property titles, descriptions, price, available dates, and images.
 15. Host-User Chat: The system shall provide a messaging feature that allows users to chat with hosts. Users shall be able to initiate a conversation from the Listing Detail Page to ask questions before booking. Hosts shall be able to view and respond to messages. The chat system shall display previous messages between the users and hosts.
 16. Search Bar and Filter Feature: The system shall provide a search bar at the top of the Home Page allowing users to search for properties by title. A Filters button shall be available next to the search bar, allowing users to expand additional filtering options. Users shall be able to filter listings by setting a price range (minimum and maximum), selecting the number of bedrooms, and selecting a minimum review rating. After choosing the desired filters, users shall click an "Apply Filters" button to update the displayed property listings based on the selected search and filter criteria.


 


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
