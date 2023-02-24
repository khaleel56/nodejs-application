NodeJss App 
user have to Register, 
user can Login & Logout, 
user can Post a task & delete, 
user can fetch list of posted tasks,
user can manage the sequence of tasks that will reflect in  etch list of posted tasks

import below curls and replace the domain of the url (http://localhost:3000/)  with ur hosted app site & hit from postman

1. Register Api

curl --location --request POST 'http://localhost:3000/app/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "emailId":"sampletestmail2023@gmail.com",
    "password":"shaik"
}'

2. Login curl

curl --location --request POST 'http://localhost:3000/app/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "emailId":"sampletestmail2023@gmail.com",
    "password":"shaik"
}'

3. verify otp curl 

curl --location --request POST 'http://localhost:3000/app/verify-otp' \
--header 'Content-Type: application/json' \
--data-raw '{
    "emailId":"sampletestmail2023@gmail.com",
    "otp":1395
    }'


4. curl to post a new task

curl --location --request POST 'http://localhost:3000/app/create-post' \
--header 'Content-Type: application/json' \
--data-raw '      {
    "emailId":"sampletestmail@gmail.com",
    "taskId":1,
    "date":"2023-02-22",
    "task":"jogging for one hour",
    "status":"Incomplete"
    }'

5. update curl to update posted task 

curl --location --request PATCH 'http://localhost:3000/app/update-post' \
--header 'Content-Type: application/json' \
--data-raw '{
        "emailId":"sampletestmail@gmail.com",
        "taskId":1,
    "status":"Completed"
}'

6. delete curl to delete posted task

curl --location --request DELETE 'http://localhost:3000/app/delete-post' \
--header 'Content-Type: application/json' \
--data-raw '{
        "emailId":"sampletestmail@gmail.com",
        "taskId":1
        }'

7. get api to fetch list of posted tasks

curl --location --request GET 'http://localhost:3000/app/post-list?page=2&limit=2' \
--header 'Content-Type: application/json' \
--data-raw '{
    "emailId":"sampletestmail2023@gmail.com"
}'

8. to sort the sequence of the tasks and post again to reflect this task sequence in above get api

curl --location --request POST 'http://localhost:3000/app/sort-posts' \
--header 'Content-Type: application/json' \
--data-raw '{
    "emailId":"sampletestmail@gmail.com",
    "taskSequence":[3,1,2]
}'

9. curl to logout 

curl --location --request POST 'http://localhost:3000/app/logout' \
--header 'Content-Type: application/json' \
--data-raw '{
    "emailId":"sampletestmail@gmail.com"
}'


