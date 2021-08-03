# ParentSquare Interview Project

Hello to whomever is reviewing this project! If you have any questions, feel free to reach out to me via my email at kmjanssen1@gmail.com. Otherise, have a good day!

The purpose of this project is to create an API endpoint that sends text messages. The API will perform validation of the request, save the attempt, and make a call to a SMS provider. The provider will then call the API's callback endpoint to deliver the outcome of the call, which is also stored.

## Before Using
Please make sure you have the following installed:
- Node.js
- ngrok (https://ngrok.com/)

## Usage

### Running The Project
1. To start the project, navigate to the root directory of the cloned repo .../parentsquare in command line
2. Run the `npm start` command
    - This will spin up the server listening at port 3001
2. To expose the API to the internet, in command line navigate to the directory where your `ngrock.exe` is located
3. Run the `ngrok http 3001` command, and you should see an output like the one below:
```
ngrok by @inconshreveable                                (Ctrl+C to quit)

Session Status                connecting
Version                       2.3.40
Region                        United States (us)
ngrok by @inconshreveable                                                                      
Session Status                online
Account                       Kevin Janssen (Plan: Free)
Version                       2.3.40
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://a5dfebd9004b.ngrok.io -> http://localhost:3001
Forwarding                    https://a5dfebd9004b.ngrok.io -> http://localhost:3001

Connections                   ttl     opn     rt1     rt5     p50     p90    
```
4. Using the example above, the server is now exposed to the internet at the http://a5dfebd9004b.ngrok.io and https://a5dfebd9004b.ngrok.io addresses
    - For the purposes of this assignment please use the **http** address for sending requests
5. You're now able to send requests to the server! :D

### Sending Requests
1. To call the web service to send text messages, you can send a curl command like below:
```
curl -X POST -H "Content-Type: application/json" -d '{"to_number": "1234567890", "message": "This is my message", "callback_url": "http://a5dfebd9004b.ngrok.io/delivery"}' http://localhost:3001/texts
```

* Note how in the callback_url, we use the forwarding address provided by our `ngrok http 3001` command, http://a5dfebd9004b.ngrok.io, followed by the callback resource, /delivery. This will point the SMS provider to the correct endpoint to handle the callback.

2. Upon a successful request, you should receive a response with the message id of the text like the following:
`{"message_id":"64450e8d-c103-40fd-b426-c12ddceb3750"}`

3. If the request is not succussful, you will receive a helpful response like the following:
`{"message":"Please enter a valid phone number. Phone number must be 10 numbers. The following are examples of acceptable formats: (123) 456-7890, 123.456.7890, 123-456-7890, and 1234567890"}` 