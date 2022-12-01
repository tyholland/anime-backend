/**
 * @api         {get} /users Get all Users
 * @apiVersion  2.0.0
 * @apiName     Get All Users
 * @apiGroup    User
 * 
 * @apiSuccess {Object[]}   Users               List of Users
 * @apiSuccess {varchar}    User.username       username
 * @apiSuccess {varchar}    User.password       password
 * @apiSuccess {varchar}    User.email          email
 * @apiSuccess {varchar}    User.password       password
 * @apiSuccess {varchar}    User.first_name     first name
 * @apiSuccess {varchar}    User.last_name      last name
 * @apiSuccess {varchar}    User.age            age
 * @apiSuccess {varchar}    User.race           race
 * @apiSuccess {varchar}    User.gender         gender
 * @apiSuccess {varchar}    User.zip            zipcode
 * @apiSuccess {varchar}    User.categories     categories
 * @apiSuccess {varchar}    User.favorites      favorites
 * @apiSuccess {timestamp}  User.created_on     When user joined into ABS
 * @apiSuccess {varchar}    User.token          token
 * 
 * @apiError   (Error 5xx)  500  Internal Server Error
*/

/**
 * @api         {post} /users/create Create a new User
 * @apiVersion  2.0.0
 * @apiName     Create User
 * @apiGroup    User
 * 
 * @apiBody {varchar} username     email
 * @apiBody {varchar} passsword    password
 * @apiBody {varchar} first_name   first name
 * @apiBody {varchar} last_name    last name
 * @apiBody {varchar} age          age 
 * @apiBody {varchar} race         race
 * @apiBody {varchar} gender       gender
 * @apiBody {varchar} phone        phone number
 * @apiBody {varchar} zipcode      zipcode
 * @apiBody {varchar} categories   categories
 * @apiBody {varchar} favorites    favorites
 * 
 * @apiSuccess {Object}      User                 User
 * @apiSuccess {int}        User.user_id         ID Number
 * @apiSuccess {varchar}    User.username        username
 * @apiSuccess {varchar}    User.password        password
 * @apiSuccess {varchar}    User.email           email
 * @apiSuccess {varchar}    User.password        password
 * @apiSuccess {varchar}    User.first_name      first name
 * @apiSuccess {varchar}    User.last_name       Last name
 * @apiSuccess {varchar}    User.age             age
 * @apiSuccess {varchar}    User.race            race
 * @apiSuccess {varchar}    User.gender          gender
 * @apiSuccess {varchar}    User.zip             zipcode
 * @apiSuccess {varchar}    User.categories      Categories
 * @apiSuccess {varchar}    User.favorites       Favorites
 * @apiSuccess {timestamp}  User.created_on      When user joined into ABS
 * @apiSuccess {varchar}    User.token           token
 * 
 * @apiError   (Error 4xx)  400  Bad request
 * @apiError   (Error 5xx)  500  Internal Server Error
 * 
*/

/**
 * @api         {get} /users/:id Get a User
 * @apiVersion  2.0.0
 * @apiName     Get User
 * @apiGroup    User
 *
 * @apiParam   {int}        id              User ID Number
 * 
 * @apiSuccess {Object}     User                 User
 * @apiSuccess {int}        User.user_id         ID Number
 * @apiSuccess {varchar}    User.username        username
 * @apiSuccess {varchar}    User.password        password
 * @apiSuccess {varchar}    User.email           email
 * @apiSuccess {varchar}    User.password        password
 * @apiSuccess {varchar}    User.first_name      first name
 * @apiSuccess {varchar}    User.last_name       Last name
 * @apiSuccess {varchar}    User.age             age
 * @apiSuccess {varchar}    User.race            race
 * @apiSuccess {varchar}    User.gender          gender
 * @apiSuccess {varchar}    User.zip             zipcode
 * @apiSuccess {varchar}    User.categories      Categories
 * @apiSuccess {varchar}    User.favorites       Favorites
 * @apiSuccess {timestamp}  User.created_on      When user joined into ABS
 * @apiSuccess {varchar}    User.token           token
 * 
 * @apiError   (Error 5xx)  500  Internal Server Error
*/

/**
 * @api         {put} /users/update/:id Update a user's info
 * @apiVersion  2.0.0
 * @apiName     Update User
 * @apiGroup    User
 *
 * @apiParam {int} id User ID
 * 
 * @apiBody {varchar} username      username
 * @apiBody {varchar} password      password
 * @apiBody {varchar} email         email
 * @apiBody {varchar} password      password
 * @apiBody {varchar} first_name    first name
 * @apiBody {varchar} last_name     Last name
 * @apiBody {varchar} age           age
 * @apiBody {varchar} race          race
 * @apiBody {varchar} gender        gender
 * @apiBody {varchar} zip           zipcode
 * @apiBody {varchar} categories    categories
 * @apiBody {varchar} favorites     favorites
 * 
 * @apiSuccess {Object}     User                 User
 * @apiSuccess {int}        User.user_id         ID Number
 * @apiSuccess {varchar}    User.username        username
 * @apiSuccess {varchar}    User.password        password
 * @apiSuccess {varchar}    User.email           email
 * @apiSuccess {varchar}    User.password        password
 * @apiSuccess {varchar}    User.first_name      first name
 * @apiSuccess {varchar}    User.last_name       Last name
 * @apiSuccess {varchar}    User.age             age
 * @apiSuccess {varchar}    User.race            race
 * @apiSuccess {varchar}    User.gender          gender
 * @apiSuccess {varchar}    User.zip             zipcode
 * @apiSuccess {varchar}    User.categories      Categories
 * @apiSuccess {varchar}    User.favorites       Favorites
 * @apiSuccess {timestamp}  User.created_on      When user joined into ABS
 * @apiSuccess {varchar}    User.token           token
 * 
 * @apiError   (Error 4xx)  400  Bad request
 * @apiError   (Error 5xx)  500  Internal Server Error
*/

/**
 * @api         {delete} /users/delete/:id Delete a User
 * @apiVersion  2.0.0
 * @apiName     Delete User
 * @apiGroup    User
 *
 * @apiParam    {int} id    User ID
 * 
 * @apiSuccess {Object}     User                 Deleted User
 * @apiSuccess {int}        User.user_id         ID number
 * @apiSuccess {varchar}    User.username        username
 * @apiSuccess {varchar}    User.password        password
 * @apiSuccess {varchar}    User.email           email
 * @apiSuccess {varchar}    User.password        password
 * @apiSuccess {varchar}    User.first_name      first name
 * @apiSuccess {varchar}    User.last_name       Last name
 * @apiSuccess {varchar}    User.age             age
 * @apiSuccess {varchar}    User.race            race
 * @apiSuccess {varchar}    User.gender          gender
 * @apiSuccess {varchar}    User.zip             zipcode
 * @apiSuccess {varchar}    User.categories      Categories
 * @apiSuccess {varchar}    User.favorites       Favorites
 * @apiSuccess {timestamp}  User.created_on      When user joined into ABS
 * @apiSuccess {varchar}    User.token           token
 * 
 * @apiError   (Error 5xx)  500  Internal Server Error
*/

/**
 * @api         {get} /users/login Login a User
 * @apiVersion  2.0.0
 * @apiName     Login
 * @apiGroup    User
 *
 * @apiBody     {varchar}   username  User email
 * @apiBody     {varchar}   passsword User password
 * 
 * @apiSuccess {Object}     User                 Logged in User
 * @apiSuccess {int}        User.user_id         ID number
 * @apiSuccess {varchar}    User.username        username
 * @apiSuccess {varchar}    User.password        password
 * @apiSuccess {varchar}    User.email           email
 * @apiSuccess {varchar}    User.password        password
 * @apiSuccess {varchar}    User.first_name      first name
 * @apiSuccess {varchar}    User.last_name       Last name
 * @apiSuccess {varchar}    User.age             age
 * @apiSuccess {varchar}    User.race            race
 * @apiSuccess {varchar}    User.gender          gender
 * @apiSuccess {varchar}    User.zip             zipcode
 * @apiSuccess {varchar}    User.categories      Categories
 * @apiSuccess {varchar}    User.favorites       Favorites
 * @apiSuccess {timestamp}  User.created_on      When user joined into ABS
 * @apiSuccess {varchar}    User.token           token
 * 
 * @apiError (Error 4xx) 401 Invalid Credentials
*/

/**
 * @api         {post} /users/forgotPassword Send a temporary password
 * @apiVersion  2.0.0
 * @apiName     Forgot Password Email
 * @apiGroup    User
 *
 * @apiBody     {varchar}   email  User email
 * 
 * @apiError (Error 4xx) 4xx Invalid Email
 * @apiError (Error 5xx) 5xx Server Error
*/

/**
 * @api         {get} /uninstalled
 * @apiVersion  2.0.0
 * @apiName     Get All Unistalled Reasons
 * @apiGroup    Uninstalled Reasons
 * 
 * @apiSuccess {Object}     Reasons                Reason
 * @apiSuccess {int}        Reason.uninstall_id    ID number
 * @apiSuccess {varchar}    Reason.annoyed         Uninstall reason is annoyed
 * @apiSuccess {varchar}    Reason.canada          Uninstall reason is lives in Canada
 * @apiSuccess {varchar}    Reason.cashback        Uninstall reason is cashback
 * @apiSuccess {varchar}    Reason.shop            Uninstall reason is doesn't shop
 * @apiSuccess {varchar}    Reason.technical       Uninstall reason is due to technical issues
 * @apiSuccess {varchar}    Reason.useful          Uninstall reason is not useful
 * @apiSuccess {varchar}    Reason.work            Uninstall reason is on work computer
 * @apiSuccess {timestamp}  Reason.created_on      When uninstall reason was created
 * @apiSuccess {varchar}    Reason.other           Uninstall reason is other
 * @apiSuccess {varchar}    Reason.other_response  Uninstall reason is user entered response
 * @apiSuccess {varchar}    Reason.sizing          Uninstall reason is not the right sizing
 * 
 * @apiError   (Error 5xx)  500  Internal Server Error
*/

/**
 * @api         {post} /uninstalled/create Create an uninstalled reason
 * @apiVersion  2.0.0
 * @apiName     Create Uninstalled Reason
 * @apiGroup    Uninstalled Reasons
 * 
 * @apiBody {varchar}    annoyed         Uninstall reason is annoyed
 * @apiBody {varchar}    canada          Uninstall reason is lives in Canada
 * @apiBody {varchar}    cashback        Uninstall reason is cashback
 * @apiBody {varchar}    shop            Uninstall reason is doesn't shop
 * @apiBody {varchar}    technical       Uninstall reason is due to technical issues
 * @apiBody {varchar}    useful          Uninstall reason is not useful
 * @apiBody {varchar}    work            Uninstall reason is on work computer
 * @apiBody {timestamp}  created_on      When uninstall reason was created
 * @apiBody {varchar}    other           Uninstall reason is other
 * @apiBody {varchar}    other_response  Uninstall reason is user entered response
 * @apiBody {varchar}    sizing          Uninstall reason is not the right sizing
 * 
 * @apiSuccess {Object}     Reason                 Reason
 * @apiSuccess {int}        Reason.uninstall_id    ID number
 * @apiSuccess {varchar}    Reason.annoyed         Uninstall reason is annoyed
 * @apiSuccess {varchar}    Reason.canada          Uninstall reason is lives in Canada
 * @apiSuccess {varchar}    Reason.cashback        Uninstall reason is cashback
 * @apiSuccess {varchar}    Reason.shop            Uninstall reason is doesn't shop
 * @apiSuccess {varchar}    Reason.technical       Uninstall reason is due to technical issues
 * @apiSuccess {varchar}    Reason.useful          Uninstall reason is not useful
 * @apiSuccess {varchar}    Reason.work            Uninstall reason is on work computer
 * @apiSuccess {timestamp}  Reason.created_on      When uninstall reason was created
 * @apiSuccess {varchar}    Reason.other           Uninstall reason is other
 * @apiSuccess {varchar}    Reason.other_response  Uninstall reason is user entered response
 * @apiSuccess {varchar}    Reason.sizing          Uninstall reason is not the right sizing
 * 
 * @apiError   (Error 5xx)  500  Internal Server Error
*/

/**
 * @api         {get} /uninstalled/:id Get an uninstalled reason
 * @apiVersion  2.0.0
 * @apiName     Get Unistalled Reason
 * @apiGroup    Uninstalled Reasons
 *
 * @apiParam   {int}        id                     reason ID number
 * 
 * @apiSuccess {Object}     Reason                 Reason
 * @apiSuccess {int}        Reason.uninstall_id    ID number
 * @apiSuccess {varchar}    Reason.annoyed         Uninstall reason is annoyed
 * @apiSuccess {varchar}    Reason.canada          Uninstall reason is lives in Canada
 * @apiSuccess {varchar}    Reason.cashback        Uninstall reason is cashback
 * @apiSuccess {varchar}    Reason.shop            Uninstall reason is doesn't shop
 * @apiSuccess {varchar}    Reason.technical       Uninstall reason is due to technical issues
 * @apiSuccess {varchar}    Reason.useful          Uninstall reason is not useful
 * @apiSuccess {varchar}    Reason.work            Uninstall reason is on work computer
 * @apiSuccess {timestamp}  Reason.created_on      When uninstall reason was created
 * @apiSuccess {varchar}    Reason.other           Uninstall reason is other
 * @apiSuccess {varchar}    Reason.other_response  Uninstall reason is user entered response
 * @apiSuccess {varchar}    Reason.sizing          Uninstall reason is not the right sizing
 * 
 * @apiError   (Error 5xx)  500  Internal Server Error
*/

/**
 * @api         {put} /uninstalled/update/:id Update an uninstalled reason
 * @apiVersion  2.0.0
 * @apiName     Update Uninstalled Reason
 * @apiGroup    Uninstalled Reasons
 *
 * @apiParam {int}       id              User ID
 * 
 * @apiBody {varchar}    annoyed         Uninstall reason is annoyed
 * @apiBody {varchar}    canada          Uninstall reason is lives in Canada
 * @apiBody {varchar}    cashback        Uninstall reason is cashback
 * @apiBody {varchar}    shop            Uninstall reason is doesn't shop
 * @apiBody {varchar}    technical       Uninstall reason is due to technical issues
 * @apiBody {varchar}    useful          Uninstall reason is not useful
 * @apiBody {varchar}    work            Uninstall reason is on work computer
 * @apiBody {timestamp}  created_on      When uninstall reason was created
 * @apiBody {varchar}    other           Uninstall reason is other
 * @apiBody {varchar}    other_response  Uninstall reason is user entered response
 * @apiBody {varchar}    sizing          Uninstall reason is not the right sizing
 * 
 * @apiSuccess {Object}     Reason                 Reason
 * @apiSuccess {int}        Reason.uninstall_id    Reason ID number
 * @apiSuccess {varchar}    Reason.annoyed         Uninstall reason is annoyed
 * @apiSuccess {varchar}    Reason.canada          Uninstall reason is lives in Canada
 * @apiSuccess {varchar}    Reason.cashback        Uninstall reason is cashback
 * @apiSuccess {varchar}    Reason.shop            Uninstall reason is doesn't shop
 * @apiSuccess {varchar}    Reason.technical       Uninstall reason is due to technical issues
 * @apiSuccess {varchar}    Reason.useful          Uninstall reason is not useful
 * @apiSuccess {varchar}    Reason.work            Uninstall reason is on work computer
 * @apiSuccess {timestamp}  Reason.created_on      When uninstall reason was created
 * @apiSuccess {varchar}    Reason.other           Uninstall reason is other
 * @apiSuccess {varchar}    Reason.other_response  Uninstall reason is user entered response
 * @apiSuccess {varchar}    Reason.sizing          Uninstall reason is not the right sizing
 * 
 * @apiError   (Error 5xx)  500  Internal Server Error
*/

/**
 * @api         {delete} /uninstalled/delete/:id Delete an uninstalled reason
 * @apiVersion  2.0.0
 * @apiName     Delete Uninstalled Reason
 * @apiGroup    Uninstalled Reasons
 *
 * @apiParam    {int}       id                  reason ID number
 * 
 * @apiSuccess {int}        uninstall_id    Reason ID number
 * @apiSuccess {varchar}    annoyed         Uninstall reason is annoyed
 * @apiSuccess {varchar}    canada          Uninstall reason is lives in Canada
 * @apiSuccess {varchar}    cashback        Uninstall reason is cashback
 * @apiSuccess {varchar}    shop            Uninstall reason is doesn't shop
 * @apiSuccess {varchar}    technical       Uninstall reason is due to technical issues
 * @apiSuccess {varchar}    useful          Uninstall reason is not useful
 * @apiSuccess {varchar}    work            Uninstall reason is on work computer
 * @apiSuccess {timestamp}  created_on      When uninstall reason was created
 * @apiSuccess {varchar}    other           Uninstall reason is other
 * @apiSuccess {varchar}    other_response  Uninstall reason is user entered response
 * @apiSuccess {varchar}    sizing          Uninstall reason is not the right sizing
 * 
 * @apiError   (Error 5xx)  500  Internal Server Error
*/

//"Lead" is a placeholder for entities in Leads[]
/**
 * @api         {get} /leads Get all Leads
 * @apiVersion  2.0.0
 * @apiName     Get Leads
 * @apiGroup    Customer Service
 * 
 * @apiSuccess {Object[]}   Leads           List of Leads
 * @apiSuccess {int}        Lead.lead_id    Lead ID number
 * @apiSuccess {varchar}    Lead.first_name Lead first name
 * @apiSuccess {varchar}    Lead.last_name  Lead ast name
 * @apiSuccess {varchar}    Lead.email      Lead email
 * @apiSuccess {timestamp}  Lead.created_on Lead Date lead submitted form
 * @apiSuccess {varchar}    Lead.source     Lead Application lead submitted from
 * @apiSuccess {varchar}    Lead.affiliate  Lead Person that referred lead
 * @apiSuccess {varchar}    Lead.prime      Lead Lead has prime
 * @apiSuccess {varchar}    Lead.zip        Lead zip code
*/

/**
 * @api         {post} /leads/create Add a new lead
 * @apiVersion  2.0.0
 * @apiName     New Leads
 * @apiGroup    Customer Service
 * 
 * @apiBody {varchar} first_name    Lead first name
 * @apiBody {varchar} last_name     Lead last name
 * @apiBody {varchar} email         Lead email
 * @apiBody {varchar} soure         Lead source
 * @apiBody {varchar} affiliate     Person that referred lead
 * @apiBody {varchar} prime         Lead has prime
 * @apiBody {varchar} zip           Lead zip code
 * 
 * @apiSuccess {int}       lead_id      Lead ID number
 * @apiSuccess {varchar}   first_name   Lead first name
 * @apiSuccess {varchar}   last_name    Lead last name
 * @apiSuccess {varchar}   email        Lead email
 * @apiSuccess {timestamp} created_on   Date lead submitted form
 * @apiSuccess {varchar}   source       Application lead submitted from
 * @apiSuccess {varchar}   affiliate    Person that referred lead
 * @apiSuccess {varchar}   prime        Lead has prime
 * @apiSuccess {varchar}   zip          Lead zip code
 * 
 * @apiError (Error 4xx) 400  Invalid email or zipcode
 * @apiError (Error 5xx) 500  Internal Server Error
*/

/**
 * @api {get} /leads/:id Get a lead
 * @apiVersion 2.0.0
 * @apiName Get Lead
 * @apiGroup Customer Service
 *
 * @apiParam {int} id Lead ID
 * 
 * @apiSuccess {Object}     Lead            Lead
 * @apiSuccess {int}        Lead.lead_id    ID number
 * @apiSuccess {varchar}    Lead.first_name first name
 * @apiSuccess {varchar}    Lead.last_name  last name
 * @apiSuccess {varchar}    Lead.email      email
 * @apiSuccess {timestamp}  Lead.created_on Date lead submitted form
 * @apiSuccess {varchar}    Lead.source     Application lead submitted from
 * @apiSuccess {varchar}    Lead.affiliate  Person that referred lead
 * @apiSuccess {varchar}    Lead.prime      Lead has prime
 * @apiSuccess {varchar}    Lead.zip        zip code
 * 
 * @apiError   (Error 5xx)  500  Internal Server Error
*/

/**
 * @api {get} /leads/update/:id Update a lead
 * @apiVersion 2.0.0
 * @apiName Update Lead
 * @apiGroup Customer Service
 *
 * @apiParam {int} id Lead ID
 * 
 * @apiBody {varchar} first_name    Lead first name
 * @apiBody {varchar} last_name     Lead last name
 * @apiBody {varchar} email         Lead email
 * @apiBody {varchar} soure         Lead source
 * @apiBody {varchar} affiliate     Person that referred lead
 * @apiBody {varchar} prime         Lead has prime
 * @apiBody {varchar} zip           Lead zip code
 * 
 * @apiSuccess {Object}     Lead            Lead
 * @apiSuccess {int}        Lead.lead_id    ID number
 * @apiSuccess {varchar}    Lead.first_name first name
 * @apiSuccess {varchar}    Lead.last_name  last name
 * @apiSuccess {varchar}    Lead.email      email
 * @apiSuccess {timestamp}  Lead.created_on Date lead submitted from
 * @apiSuccess {varchar}    Lead.source     Application lead submitted from
 * @apiSuccess {varchar}    Lead.affiliate  Person that referred lead
 * @apiSuccess {varchar}    Lead.prime      Lead has prime
 * @apiSuccess {varchar}    Lead.zip        zip code
 * 
 * @apiError   (Error 5xx)  500  Internal Server Error
*/

/**
 * @api {delete} /leads/delete/:id Delete a Lead
 * @apiVersion 2.0.0
 * @apiName Delete Lead
 * @apiGroup Customer Service
 *
 * @apiParam {int} id Lead ID
 * 
 * @apiSuccess {Object}     Lead            Lead
 * @apiSuccess {int}        Lead.lead_id    ID number
 * @apiSuccess {varchar}    Lead.first_name first name
 * @apiSuccess {varchar}    Lead.last_name  last name
 * @apiSuccess {varchar}    Lead.email      email
 * @apiSuccess {timestamp}  Lead.created_on Date lead submitted from
 * @apiSuccess {varchar}    Lead.source     Application lead submitted from
 * @apiSuccess {varchar}    Lead.affiliate  Person that referred lead
 * @apiSuccess {varchar}    Lead.prime      Lead has prime
 * @apiSuccess {varchar}    Lead.zip        zip code
 *
 * @apiError   (Error 5xx)  500  Internal Server Error
*/

/**
 * @api         {get} /products Get all available products
 * @apiVersion  2.0.0
 * @apiName     Get All Products
 * @apiGroup    Products
 *
 * @apiSuccess {String[]} Products             List of products
 * @apiSuccess {String}   Product.id           Product identification number
 * @apiSuccess {String}   Product.description  Product description
 * @apiSuccess {String}   Product.image        Product image
 * @apiSuccess {String}   Product.name         Product name
 * @apiSuccess {String}   Product.category     Category the product fits into
 * @apiSuccess {String}   Product.platform     Platform that the product is apart of
 * @apiSuccess {String}   Product.priority     Order the product shows up in the list of products
 * @apiSuccess {String}   Product.size         Product size(s)
 * @apiSuccess {String}   Product.color        Product color(s)
 * @apiSuccess {String}   Product.link         Product link to the store that it comes from
 * @apiSuccess {String}   Product.store        Name of store that the product is from
 * 
 * @apiError   (Error 5xx)  500  Internal Server Error
*/

/**
 * @api         {get} /products/:id Get a product
 * @apiVersion  2.0.0
 * @apiName     Get Product
 * @apiGroup    Products
 *
 * @apiParam   {String}   id Price id of product
 * 
 * @apiSuccess {String}   Product              Product
 * @apiSuccess {String}   Product.id           Product identification number
 * @apiSuccess {String}   Product.description  Product description
 * @apiSuccess {String}   Product.image        Product image
 * @apiSuccess {String}   Product.name         Product name
 * @apiSuccess {String}   Product.category     Category the product fits into
 * @apiSuccess {String}   Product.platform     Platform that the product is apart of
 * @apiSuccess {String}   Product.priority     Order the product shows up in the list of products
 * @apiSuccess {String}   Product.size         Product size(s)
 * @apiSuccess {String}   Product.color        Product color(s)
 * @apiSuccess {String}   Product.link         Product link to the store that it comes from
 * @apiSuccess {String}   Product.store        Name of store that the product is from
 * 
 * @apiError   (Error 5xx)  500  Internal Server Error
*/

/**
 * @api         {get} /products/extra/:id Get all available products filtered by price
 * @apiVersion  2.0.0
 * @apiName     Get Extra Products
 * @apiGroup    Products
 * 
 * @apiParam   {String} id Price id of product
 *
 * @apiSuccess {String[]}  Products            List of extra products
 * @apiSuccess {String}   Product.id           Product identification number
 * @apiSuccess {String}   Product.description  Product description
 * @apiSuccess {String}   Product.image        Product image
 * @apiSuccess {String}   Product.name         Product name
 * @apiSuccess {String}   Product.category     Category the product fits into
 * @apiSuccess {String}   Product.platform     Platform that the product is apart of
 * @apiSuccess {String}   Product.priority     Order the product shows up in the list of products
 * @apiSuccess {String}   Product.size         Product size(s)
 * @apiSuccess {String}   Product.color        Product color(s)
 * @apiSuccess {String}   Product.link         Product link to the store that it comes from
 * @apiSuccess {String}   Product.store        Name of store that the product is from
 * 
 * @apiError   (Error 5xx)  500  Internal Server Error
*/

/**
 * @api         {get} /scrap/coupon/:site Get list of coupons for a given site
 * @apiVersion  2.0.0
 * @apiName     Coupon Scrap
 * @apiGroup    Scrap Data
 *
 * @apiParam   {string}     site             Store url to scrap
 * 
 * @apiSuccess {object}     codes            Coupon code info
 * @apiSuccess {int}        couponCount      Amount of coupons available
 * @apiSuccess {boolen}     notRecommended   Website does not has any coupons
 * 
 * @apiError (Error 5xx) 500 Fetch Items Error
*/

/**
 * @api         {post} /scrap/product Check Product Page Details
 * @apiVersion  2.0.0
 * @apiName     Discount Scrap
 * @apiGroup    Scrap Data
 *
 * @apiBody {varchar} desired Desired amount for product
 * @apiBody {varchar} dayAmount Amount of days to extend past wishdate
 * @apiBody {varchar} wishDate Wish date for product to reach desired amount
 * @apiBody {varchar} name Product name
 * 
 * @apiSuccess {string} message Successful text
 * @apiSuccess {boolean} hasDrop Coupon is available to grab
 * @apiSuccess {string} prod Product name
*/

/**
 * @api        {post} /scrap/price Get product price change
 * @apiVersion 2.0.0
 * @apiName    Product Scrap
 * @apiGroup   Scrap Data
 *
 * @apiBody    {varchar} url Site link
 * 
 * @apiSuccess {string} price       Product price
 * @apiSuccess {string} price2      Product price
 * @apiSuccess {string} price3      Product price
 * @apiSuccess {string} sale        Product sale price
 * @apiSuccess {string} url         Product class page
 * @apiSuccess {int}    dayAmount   Amount of days to extend past wishdate
 * @apiSuccess {int}    desired     Desired amount for product
 * @apiSuccess {string} percentage  Percent savings
 * @apiSuccess {string} wishDate    Wish date for product to reach desired amount
 */

/**
 * @api         {get} /gaming/user Get all gamers
 * @apiVersion  2.0.0
 * @apiName     Get Gamers
 * @apiGroup    Gamers
 * 
 * @apiSuccess {Object[]}  Gamers                     List of gamers
 * @apiSuccess {varchar}   Gamer.acct_username        Gamer username
 * @apiSuccess {int}       Gamer.gaming_id            Gaming id
 * @apiSuccess {int}       Gamer.users_highest_score  Gamer highest score
 * @apiSuccess {int}       Gamer.curr_level           Gamer level in game
 * @apiSuccess {double}    Gamer.time_played          time spent playing game
 * @apiSuccess {int}       Gamer.bubbleshot           bubbleshot results
 * @apiSuccess {varchar}   Gamer.curr_tokens          Gamer current tokens
 * @apiSuccess {boolean}   Gamer.x_levels_completed   Gamer levels completed in game
 * @apiSuccess {int}       Gamer.number_comm_tokens   Gamer levels completed in game
 * @apiSuccess {int}       Gamer.event_id             Event id
*/

/**
 * @api         {post} /gaming/create Create a gamer
 * @apiVersion  2.0.0
 * @apiName     Create a gamer
 * @apiGroup    Gamers
 * 
 * @apiBody {varchar}   acct_username        Gamer username
 * @apiBody {int}       gaming_id            Gaming id
 * @apiBody {int}       users_highest_score  Gamer's highest score
 * @apiBody {int}       curr_level           Gamer's level in game
 * @apiBody {double}    time_played          time spent playing game
 * @apiBody {int}       bubbleshot           bubbleshot results
 * @apiBody {varchar}   curr_tokens          Gamer's current tokens
 * @apiBody {boolean}   x_levels_completed   Gamer's levels completed in game
 * @apiBody {int}       number_comm_tokens   Gamer's levels completed in game
 * @apiBody {int}       event_id             Event id
 * @apiBody {int}       user_id              Gamer User id number
 * 
 * @apiSuccess {Object}    Gamer                Gamer
 * @apiSuccess {varchar}   Gamer.acct_username        Gamer username
 * @apiSuccess {int}       Gamer.gaming_id            Gaming id
 * @apiSuccess {int}       Gamer.users_highest_score  Gamer highest score
 * @apiSuccess {int}       Gamer.curr_level           Gamer level in game
 * @apiSuccess {double}    Gamer.time_played          time spent playing game
 * @apiSuccess {int}       Gamer.bubbleshot           bubbleshot results
 * @apiSuccess {varchar}   Gamer.curr_tokens          Gamer current tokens
 * @apiSuccess {boolean}   Gamer.x_levels_completed   Gamer levels completed in game
 * @apiSuccess {int}       Gamer.number_comm_tokens   Gamer levels completed in game
 * @apiSuccess {int}       Gamer.event_id             Event id
 * @apiBody    {int}       Gamer.user_id              Gamer user id number
 * 
 * @apiError   (Error 5xx)  500  Internal Server Error
*/

/**
 * @api         {put} /gaming/update/:id Update a gamer
 * @apiVersion  2.0.0
 * @apiName     Update a gamer
 * @apiGroup    Gamers
 * 
 * @apiParam {int} id Gamer ID
 * 
 * @apiBody {varchar}   acct_username        Gamer username
 * @apiBody {int}       gaming_id            Gaming id
 * @apiBody {int}       users_highest_score  Gamer's highest score
 * @apiBody {int}       curr_level           Gamer's level in game
 * @apiBody {double}    time_played          time spent playing game
 * @apiBody {int}       bubbleshot           bubbleshot results
 * @apiBody {varchar}   curr_tokens          Gamer's current tokens
 * @apiBody {boolean}   x_levels_completed   Gamer's levels completed in game
 * @apiBody {int}       number_comm_tokens   Gamer's levels completed in game
 * @apiBody {int}       event_id             Event id
 * @apiBody {int}       user_id              Gamer User id number
 * 
 * @apiSuccess {Object}    Gamer                Gamer
 * @apiSuccess {varchar}   Gamer.acct_username        Gamer username
 * @apiSuccess {int}       Gamer.gaming_id            Gaming id
 * @apiSuccess {int}       Gamer.users_highest_score  Gamer highest score
 * @apiSuccess {int}       Gamer.curr_level           Gamer level in game
 * @apiSuccess {double}    Gamer.time_played          time spent playing game
 * @apiSuccess {int}       Gamer.bubbleshot           bubbleshot results
 * @apiSuccess {varchar}   Gamer.curr_tokens          Gamer current tokens
 * @apiSuccess {boolean}   Gamer.x_levels_completed   Gamer levels completed in game
 * @apiSuccess {int}       Gamer.number_comm_tokens   Gamer levels completed in game
 * @apiSuccess {int}       Gamer.event_id             Event id
 * @apiBody    {int}       Gamer.user_id              Gamer user id number
 * 
 * @apiError   (Error 5xx)  500  Internal Server Error
*/

/**
 * @api         {delete} /gaming/delete/:id Delete a gamer
 * @apiVersion  2.0.0
 * @apiName     Update a gamer
 * @apiGroup    Gamers
 * 
 * @apiParam {int} id gamer id
 * 
 * @apiSuccess {Object}    Gamer                      Deleted Gamer
 * @apiSuccess {varchar}   Gamer.acct_username        Gamer username
 * @apiSuccess {int}       Gamer.gaming_id            Gaming id
 * @apiSuccess {int}       Gamer.users_highest_score  Gamer highest score
 * @apiSuccess {int}       Gamer.curr_level           Gamer level in game
 * @apiSuccess {double}    Gamer.time_played          time spent playing game
 * @apiSuccess {int}       Gamer.bubbleshot           bubbleshot results
 * @apiSuccess {varchar}   Gamer.curr_tokens          Gamer current tokens
 * @apiSuccess {boolean}   Gamer.x_levels_completed   Gamer levels completed in game
 * @apiSuccess {int}       Gamer.number_comm_tokens   Gamer levels completed in game
 * @apiSuccess {int}       Gamer.event_id             Event id
 * @apiBody    {int}       Gamer.user_id              Gamer user id number
 * 
 * @apiError   (Error 5xx)  500  Internal Server Error
*/

/**
 * @api         {get} /auth/google Authorize a user
 * @apiVersion  2.0.0
 * @apiName     Update a gamer
 * @apiGroup    Google Authentication
 * 
 * @apiError (Error 4xx) 401 User not authenticated
*/

/**
 * @api         {get} /auth/google/callback Google Callback
 * @apiVersion  2.0.0
 * @apiName     Googke Callback
 * @apiGroup    Google Authentication
 * 
 * @apiError (Error 4xx) 401 User not authentcated
*/

/**
 * @api         {get} /error Authentication errror
 * @apiVersion  2.0.0
 * @apiName     Authentication error
 * @apiGroup    Google Authentication
 * 
 * @apiError (Error 4xx) 401 User not authenticated
*/
