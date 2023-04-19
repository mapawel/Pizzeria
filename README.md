# Restaurant System, Pizzeria (backend)

### Description:
- Typescript project (no framework used), Object Oriented Programming.
- Simple abstraction of a restaurant system to manage orders / tables / ingreadients.
- The application operates on an in-memory DB (no real DB has been implemented at this stage).
- Basic unit tests using Chai/Mocha.

##### Completed tasks:
-  Preparation of an abstraction that simulates a pizzeria.
- The pizzeria has: a list of ingredients with their quantities, a list of available employees taking orders (orders cannot be placed online), a list of available chefs, a list of orders in progress, a list of completed orders, a list of available and occupied tables.
- The pizzeria allows: placing an order, placing an order with a discount using the appropriate code, reserving a table for a person or a group dining in, ordering for takeaway.
- A person coming to the pizzeria orders a pizza and occupies a table with x number of seats. Each order is made by a separate chef. In a situation where there are no chefs, the order should go to a queue if there is an available table for the customer to wait for the order. In a situation where there is no table and the chef is busy, the customer cannot be served.
