# nforce-api
### An API endpoint for posting a new Contact object in Salesforce
https://nodesvr.herokuapp.com/api/contacts

- The POST request must include this header -->  ```Content-Type: application/json```
- The contact's LastName field is required

Sample request body:
```
{
	"FirstName": "Bob",
	"LastName": "Sacamano"
}
```
Documentation for the nforce package: https://github.com/kevinohara80/nforce#readme