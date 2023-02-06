/**
 * @api         {post}        /users/create   Create new user
 * @apiVersion  1.0.0
 * @apiName     Create User
 * @apiGroup    User
 *
 * @apiBody     {varchar}     userEmail       email
 * @apiBody     {varchar}     firebaseId      firebase user ID
 *
 * @apiSuccess  {varchar}     email           email
 * @apiSuccess  {bigint}      user_id         user ID
 * @apiSuccess  {tinyint}     active          user is active
 *
 * @apiError    (Error 5xx)   500             Error creating a new user
 */

/**
 * @api         {post}        /users/login    Login user
 * @apiVersion  1.0.0
 * @apiName     Login User
 * @apiGroup    User
 *
 * @apiBody     {varchar}     email           email
 * @apiBody     {varchar}     firebaseUID     firebase user ID
 *
 * @apiSuccess  {varchar}     email           email
 * @apiSuccess  {bigint}      user_id         user ID
 * @apiSuccess  {tinyint}     active          user is active
 *
 * @apiError    (Error 5xx)   500             Error logging in user
 *
 */

/**
 * @api         {post}      /users/logout   Logout User
 * @apiVersion  1.0.0
 * @apiName     Logout User
 * @apiGroup    User
 *
 * @apiSuccess  {boolean}    success        request completed
 *
 * @apiError    (Error 5xx)  500            Error logging out user
 */

/**
 * @api         {delete}      /users    Delete user
 * @apiVersion  1.0.0
 * @apiName     Delete User
 * @apiGroup    User
 *
 * @apiSuccess  {boolean}     success   request completed
 *
 * @apiError    (Error 5xx)   500       Error deleting user
 */

/**
 * @api         {get}             /player       Get all players
 * @apiVersion  1.0.0
 * @apiName     Get All Players
 * @apiGroup    Player
 *
 * @apiSuccess  {bigint}          id            player ID
 * @apiSuccess  {varchar}         full_name     player full name
 * @apiSuccess  {varchar}         name          player first name
 * @apiSuccess  {varchar}         series        anime series
 * @apiSuccess  {varchar}         rank          player rank
 * @apiSuccess  {int}             power_level   player power level
 * @apiSuccess  {varchar}         category      player category
 * @apiSuccess  {int}             fire          affinity type
 * @apiSuccess  {int}             water         affinity type
 * @apiSuccess  {int}             wind          affinity type
 * @apiSuccess  {int}             earth         affinity type
 * @apiSuccess  {int}             arcane        affinity type
 * @apiSuccess  {int}             electric      affinity type
 * @apiSuccess  {int}             celestial     affinity type
 * @apiSuccess  {int}             darkness      affinity type
 * @apiSuccess  {int}             ice           affinity type
 * @apiSuccess  {int}             no_affinity   no affinity type
 * @apiSuccess  {varchar}         weakness      player weakness
 * @apiSuccess  {int}             power_loss    player power loss
 * @apiSuccess  {varchar}         image_url     image url of player
 *
 * @apiError    (Error 5xx)       500           Error get all players
 */

/**
 * @api         {get}         /player/:player_id    Get specific player
 * @apiVersion  1.0.0
 * @apiName     Get Specific Player
 * @apiGroup    Player
 *
 * @apiParam    {int}         player_id             player ID
 *
 * @apiSuccess  {bigint}      id                    player ID
 * @apiSuccess  {varchar}     full_name             player full name
 * @apiSuccess  {varchar}     name                  player first name
 * @apiSuccess  {varchar}     series                anime series
 * @apiSuccess  {varchar}     rank                  player rank
 * @apiSuccess  {int}         power_level           player power level
 * @apiSuccess  {varchar}     category              player category
 * @apiSuccess  {int}         fire                  affinity type
 * @apiSuccess  {int}         water                 affinity type
 * @apiSuccess  {int}         wind                  affinity type
 * @apiSuccess  {int}         earth                 affinity type
 * @apiSuccess  {int}         arcane                affinity type
 * @apiSuccess  {int}         electric              affinity type
 * @apiSuccess  {int}         celestial             affinity type
 * @apiSuccess  {int}         darkness              affinity type
 * @apiSuccess  {int}         ice                   affinity type
 * @apiSuccess  {int}         no_affinity           no affinity type
 * @apiSuccess  {varchar}     weakness              player weakness
 * @apiSuccess  {int}         power_loss            player power loss
 * @apiSuccess  {varchar}     image_url             image url of player
 *
 * @apiError    (Error 5xx)   500                   Error geeting specific player
 */

/**
 * @api         {get}         /team/data/:team_id                   Get team
 * @apiVersion  1.0.0
 * @apiName     Get Team
 * @apiGroup    Team
 *
 * @apiParam    {int}         team_id                               team ID
 *
 * @apiSuccess {varchar}      teamName                              team name
 * @apiSuccess {int}          memberId                              member ID
 * @apiSuccess {int}          userPoints                            account points
 * @apiSuccess {Object}       team                                  team object
 * @apiSuccess {Object}       team.captain                          captain object
 * @apiSuccess {int}          team.captain.id                       captain ID
 * @apiSuccess {varchar}      team.captain.name                     captain name
 * @apiSuccess {varchar}      team.captain.rank                     captain rank
 * @apiSuccess {int}          team.captain.teamPoints               captain team page points
 * @apiSuccess {int}          team.captain.matchPoints              captain matchup page points
 * @apiSuccess {Object[]}     team.captain.affinity                 captain list of affinities
 * @apiSuccess {int}          team.captain.originalPower            captain original power
 * @apiSuccess {Object}       team.captain.boost                    captain boost object
 * @apiSuccess {int}          team.captain.boost.week               boost week points
 * @apiSuccess {int}          team.captain.boost.support            boost support points
 * @apiSuccess {int}          team.captain.boost.battlefield        boost battlefield points
 * @apiSuccess {int}          team.captain.boost.voting             boost voting points
 * @apiSuccess {Object}       team.captain.damage                   captain damage object
 * @apiSuccess {int}          team.captain.damage.week              damage week points
 * @apiSuccess {int}          team.captain.damage.villain           damage villain points
 * @apiSuccess {int}          team.captain.damage.battlefield       damage battlefield points
 * @apiSuccess {int}          team.captain.damage.voting            damage voting points
 * @apiSuccess {Object}       team.brawler_a                        brawler_a object
 * @apiSuccess {int}          team.brawler_a.id                     brawler_a ID
 * @apiSuccess {varchar}      team.brawler_a.name                   brawler_a name
 * @apiSuccess {varchar}      team.brawler_a.rank                   brawler_a rank
 * @apiSuccess {int}          team.brawler_a.teamPoints             brawler_a team page points
 * @apiSuccess {int}          team.brawler_a.matchPoints            brawler_a matchup page points
 * @apiSuccess {Object[]}     team.brawler_a.affinity               brawler_a list of affinities
 * @apiSuccess {int}          team.brawler_a.originalPower          brawler_a original power
 * @apiSuccess {Object}       team.brawler_a.boost                  brawler_a boost object
 * @apiSuccess {int}          team.brawler_a.boost.week             boost week points
 * @apiSuccess {int}          team.brawler_a.boost.support          boost support points
 * @apiSuccess {int}          team.brawler_a.boost.battlefield      boost battlefield points
 * @apiSuccess {int}          team.brawler_a.boost.voting           boost voting points
 * @apiSuccess {Object}       team.brawler_a.damage                 brawler_a damage object
 * @apiSuccess {int}          team.brawler_a.damage.week            damage week points
 * @apiSuccess {int}          team.brawler_a.damage.villain         damage villain points
 * @apiSuccess {int}          team.brawler_a.damage.battlefield     damage battlefield points
 * @apiSuccess {int}          team.brawler_a.damage.voting          damage voting points
 * @apiSuccess {Object}       team.brawler_b                        brawler_b object
 * @apiSuccess {int}          team.brawler_b.id                     brawler_b ID
 * @apiSuccess {varchar}      team.brawler_b.name                   brawler_b name
 * @apiSuccess {varchar}      team.brawler_b.rank                   brawler_b rank
 * @apiSuccess {int}          team.brawler_b.teamPoints             brawler_b team page points
 * @apiSuccess {int}          team.brawler_b.matchPoints            brawler_b matchup page points
 * @apiSuccess {Object[]}     team.brawler_b.affinity               brawler_b list of affinities
 * @apiSuccess {int}          team.brawler_b.originalPower          brawler_b original power
 * @apiSuccess {Object}       team.brawler_b.boost                  brawler_b boost object
 * @apiSuccess {int}          team.brawler_b.boost.week             boost week points
 * @apiSuccess {int}          team.brawler_b.boost.support          boost support points
 * @apiSuccess {int}          team.brawler_b.boost.battlefield      boost battlefield points
 * @apiSuccess {int}          team.brawler_b.boost.voting           boost voting points
 * @apiSuccess {Object}       team.brawler_b.damage                 brawler_b damage object
 * @apiSuccess {int}          team.brawler_b.damage.week            damage week points
 * @apiSuccess {int}          team.brawler_b.damage.villain         damage villain points
 * @apiSuccess {int}          team.brawler_b.damage.battlefield     damage battlefield points
 * @apiSuccess {int}          team.brawler_b.damage.voting          damage voting points
 * @apiSuccess {Object}       team.bs_brawler                       bs_brawler object
 * @apiSuccess {int}          team.bs_brawler.id                    bs_brawler ID
 * @apiSuccess {varchar}      team.bs_brawler.name                  bs_brawler name
 * @apiSuccess {varchar}      team.bs_brawler.rank                  bs_brawler rank
 * @apiSuccess {int}          team.bs_brawler.teamPoints            bs_brawler team page points
 * @apiSuccess {int}          team.bs_brawler.matchPoints           bs_brawler matchup page points
 * @apiSuccess {Object[]}     team.bs_brawler.affinity              bs_brawler list of affinities
 * @apiSuccess {int}          team.bs_brawler.originalPower         bs_brawler original power
 * @apiSuccess {Object}       team.bs_brawler.boost                 bs_brawler boost object
 * @apiSuccess {int}          team.bs_brawler.boost.week            boost week points
 * @apiSuccess {int}          team.bs_brawler.boost.support         boost support points
 * @apiSuccess {int}          team.bs_brawler.boost.battlefield     boost battlefield points
 * @apiSuccess {int}          team.bs_brawler.boost.voting          boost voting points
 * @apiSuccess {Object}       team.bs_brawler.damage                bs_brawler damage object
 * @apiSuccess {int}          team.bs_brawler.damage.week           damage week points
 * @apiSuccess {int}          team.bs_brawler.damage.villain        damage villain points
 * @apiSuccess {int}          team.bs_brawler.damage.battlefield    damage battlefield points
 * @apiSuccess {int}          team.bs_brawler.damage.voting         damage voting points
 * @apiSuccess {Object}       team.bs_support                       bs_support object
 * @apiSuccess {int}          team.bs_support.id                    bs_support ID
 * @apiSuccess {varchar}      team.bs_support.name                  bs_support name
 * @apiSuccess {varchar}      team.bs_support.rank                  bs_support rank
 * @apiSuccess {int}          team.bs_support.teamPoints            bs_support team page points
 * @apiSuccess {int}          team.bs_support.matchPoints           bs_support matchup page points
 * @apiSuccess {Object[]}     team.bs_support.affinity              bs_support list of affinities
 * @apiSuccess {int}          team.bs_support.originalPower         bs_support original power
 * @apiSuccess {Object}       team.bs_support.boost                 bs_support boost object
 * @apiSuccess {int}          team.bs_support.boost.week            boost week points
 * @apiSuccess {int}          team.bs_support.boost.support         boost support points
 * @apiSuccess {int}          team.bs_support.boost.battlefield     boost battlefield points
 * @apiSuccess {int}          team.bs_support.boost.voting          boost voting points
 * @apiSuccess {Object}       team.bs_support.damage                bs_support damage object
 * @apiSuccess {int}          team.bs_support.damage.week           damage week points
 * @apiSuccess {int}          team.bs_support.damage.villain        damage villain points
 * @apiSuccess {int}          team.bs_support.damage.battlefield    damage battlefield points
 * @apiSuccess {int}          team.bs_support.damage.voting         damage voting points
 * @apiSuccess {Object}       team.support                          support object
 * @apiSuccess {int}          team.support.id                       support ID
 * @apiSuccess {varchar}      team.support.name                     support name
 * @apiSuccess {varchar}      team.support.rank                     support rank
 * @apiSuccess {int}          team.support.teamPoints               support team page points
 * @apiSuccess {int}          team.support.matchPoints              support matchup page points
 * @apiSuccess {Object[]}     team.support.affinity                 support list of affinities
 * @apiSuccess {int}          team.support.originalPower            support original power
 * @apiSuccess {Object}       team.support.boost                    support boost object
 * @apiSuccess {int}          team.support.boost.week               boost week points
 * @apiSuccess {int}          team.support.boost.support            boost support points
 * @apiSuccess {int}          team.support.boost.battlefield        boost battlefield points
 * @apiSuccess {int}          team.support.boost.voting             boost voting points
 * @apiSuccess {Object}       team.support.damage                   support damage object
 * @apiSuccess {int}          team.support.damage.week              damage week points
 * @apiSuccess {int}          team.support.damage.villain           damage villain points
 * @apiSuccess {int}          team.support.damage.battlefield       damage battlefield points
 * @apiSuccess {int}          team.support.damage.voting            damage voting points
 * @apiSuccess {Object}       team.villain                          villain object
 * @apiSuccess {int}          team.villain.id                       villain ID
 * @apiSuccess {varchar}      team.villain.name                     villain name
 * @apiSuccess {varchar}      team.villain.rank                     villain rank
 * @apiSuccess {int}          team.villain.teamPoints               villain team page points
 * @apiSuccess {int}          team.villain.matchPoints              villain matchup page points
 * @apiSuccess {Object[]}     team.villain.affinity                 villain list of affinities
 * @apiSuccess {int}          team.villain.originalPower            villain original power
 * @apiSuccess {Object}       team.villain.boost                    villain boost object
 * @apiSuccess {int}          team.villain.boost.week               boost week points
 * @apiSuccess {int}          team.villain.boost.support            boost support points
 * @apiSuccess {int}          team.villain.boost.battlefield        boost battlefield points
 * @apiSuccess {int}          team.villain.boost.voting             boost voting points
 * @apiSuccess {Object}       team.villain.damage                   villain damage object
 * @apiSuccess {int}          team.villain.damage.week              damage week points
 * @apiSuccess {int}          team.villain.damage.villain           amage villain points
 * @apiSuccess {int}          team.villain.damage.battlefield       damage battlefield points
 * @apiSuccess {int}          team.villain.damage.voting            damage voting points
 * @apiSuccess {Object}       team.battlefield                      battlefield object
 * @apiSuccess {int}          team.battlefield.id                   battlefield ID
 * @apiSuccess {varchar}      team.battlefield.name                 battlefield name
 * @apiSuccess {varchar}      team.battlefield.rank                 battlefield rank
 * @apiSuccess {int}          team.battlefield.teamPoints           battlefield team page points
 * @apiSuccess {int}          team.battlefield.matchPoints          battlefield matchup page points
 * @apiSuccess {Object[]}     team.battlefield.affinity             battlefield list of affinities
 * @apiSuccess {int}          team.battlefield.originalPower        battlefield original power
 * @apiSuccess {Object}       team.battlefield.boost                battlefield boost object
 * @apiSuccess {int}          team.battlefield.boost.week           boost week points
 * @apiSuccess {int}          team.battlefield.boost.support        boost support points
 * @apiSuccess {int}          team.battlefield.boost.battlefield    boost battlefield points
 * @apiSuccess {int}          team.battlefield.boost.voting         boost voting points
 * @apiSuccess {Object}       team.battlefield.damage               battlefield damage object
 * @apiSuccess {int}          team.battlefield.damage.week          damage week points
 * @apiSuccess {int}          team.battlefield.damage.villain       damage villain points
 * @apiSuccess {int}          team.battlefield.damage.battlefield   damage battlefield points
 * @apiSuccess {int}          team.battlefield.damage.voting        damage voting points
 * @apiSuccess {varchar}      week                                  team name
 *
 * @apiError   (Error 5xx)    5xx                                   Error getting team
 */

/**
 * @api         {get}         /team/matchup/:team_id                Get matchup team
 * @apiVersion  1.0.0
 * @apiName     Get Matchup Team
 * @apiGroup    Team
 *
 * @apiParam    {int}         team_id                               team ID
 *
 * @apiSuccess {varchar}      teamName                              team name
 * @apiSuccess {int}          memberId                              member ID
 * @apiSuccess {int}          userPoints                            account points
 * @apiSuccess {Object}       team                                  team object
 * @apiSuccess {Object}       team.captain                          captain object
 * @apiSuccess {int}          team.captain.id                       captain ID
 * @apiSuccess {varchar}      team.captain.name                     captain name
 * @apiSuccess {varchar}      team.captain.rank                     captain rank
 * @apiSuccess {int}          team.captain.teamPoints               captain team page points
 * @apiSuccess {int}          team.captain.matchPoints              captain matchup page points
 * @apiSuccess {Object[]}     team.captain.affinity                 captain list of affinities
 * @apiSuccess {int}          team.captain.originalPower            captain original power
 * @apiSuccess {Object}       team.captain.boost                    captain boost object
 * @apiSuccess {int}          team.captain.boost.week               boost week points
 * @apiSuccess {int}          team.captain.boost.support            boost support points
 * @apiSuccess {int}          team.captain.boost.battlefield        boost battlefield points
 * @apiSuccess {int}          team.captain.boost.voting             boost voting points
 * @apiSuccess {Object}       team.captain.damage                   captain damage object
 * @apiSuccess {int}          team.captain.damage.week              damage week points
 * @apiSuccess {int}          team.captain.damage.villain           damage villain points
 * @apiSuccess {int}          team.captain.damage.battlefield       damage battlefield points
 * @apiSuccess {int}          team.captain.damage.voting            damage voting points
 * @apiSuccess {Object}       team.brawler_a                        brawler_a object
 * @apiSuccess {int}          team.brawler_a.id                     brawler_a ID
 * @apiSuccess {varchar}      team.brawler_a.name                   brawler_a name
 * @apiSuccess {varchar}      team.brawler_a.rank                   brawler_a rank
 * @apiSuccess {int}          team.brawler_a.teamPoints             brawler_a team page points
 * @apiSuccess {int}          team.brawler_a.matchPoints            brawler_a matchup page points
 * @apiSuccess {Object[]}     team.brawler_a.affinity               brawler_a list of affinities
 * @apiSuccess {int}          team.brawler_a.originalPower          brawler_a original power
 * @apiSuccess {Object}       team.brawler_a.boost                  brawler_a boost object
 * @apiSuccess {int}          team.brawler_a.boost.week             boost week points
 * @apiSuccess {int}          team.brawler_a.boost.support          boost support points
 * @apiSuccess {int}          team.brawler_a.boost.battlefield      boost battlefield points
 * @apiSuccess {int}          team.brawler_a.boost.voting           boost voting points
 * @apiSuccess {Object}       team.brawler_a.damage                 brawler_a damage object
 * @apiSuccess {int}          team.brawler_a.damage.week            damage week points
 * @apiSuccess {int}          team.brawler_a.damage.villain         damage villain points
 * @apiSuccess {int}          team.brawler_a.damage.battlefield     damage battlefield points
 * @apiSuccess {int}          team.brawler_a.damage.voting          damage voting points
 * @apiSuccess {Object}       team.brawler_b                        brawler_b object
 * @apiSuccess {int}          team.brawler_b.id                     brawler_b ID
 * @apiSuccess {varchar}      team.brawler_b.name                   brawler_b name
 * @apiSuccess {varchar}      team.brawler_b.rank                   brawler_b rank
 * @apiSuccess {int}          team.brawler_b.teamPoints             brawler_b team page points
 * @apiSuccess {int}          team.brawler_b.matchPoints            brawler_b matchup page points
 * @apiSuccess {Object[]}     team.brawler_b.affinity               brawler_b list of affinities
 * @apiSuccess {int}          team.brawler_b.originalPower          brawler_b original power
 * @apiSuccess {Object}       team.brawler_b.boost                  brawler_b boost object
 * @apiSuccess {int}          team.brawler_b.boost.week             boost week points
 * @apiSuccess {int}          team.brawler_b.boost.support          boost support points
 * @apiSuccess {int}          team.brawler_b.boost.battlefield      boost battlefield points
 * @apiSuccess {int}          team.brawler_b.boost.voting           boost voting points
 * @apiSuccess {Object}       team.brawler_b.damage                 brawler_b damage object
 * @apiSuccess {int}          team.brawler_b.damage.week            damage week points
 * @apiSuccess {int}          team.brawler_b.damage.villain         damage villain points
 * @apiSuccess {int}          team.brawler_b.damage.battlefield     damage battlefield points
 * @apiSuccess {int}          team.brawler_b.damage.voting          damage voting points
 * @apiSuccess {Object}       team.bs_brawler                       bs_brawler object
 * @apiSuccess {int}          team.bs_brawler.id                    bs_brawler ID
 * @apiSuccess {varchar}      team.bs_brawler.name                  bs_brawler name
 * @apiSuccess {varchar}      team.bs_brawler.rank                  bs_brawler rank
 * @apiSuccess {int}          team.bs_brawler.teamPoints            bs_brawler team page points
 * @apiSuccess {int}          team.bs_brawler.matchPoints           bs_brawler matchup page points
 * @apiSuccess {Object[]}     team.bs_brawler.affinity              bs_brawler list of affinities
 * @apiSuccess {int}          team.bs_brawler.originalPower         bs_brawler original power
 * @apiSuccess {Object}       team.bs_brawler.boost                 bs_brawler boost object
 * @apiSuccess {int}          team.bs_brawler.boost.week            boost week points
 * @apiSuccess {int}          team.bs_brawler.boost.support         boost support points
 * @apiSuccess {int}          team.bs_brawler.boost.battlefield     boost battlefield points
 * @apiSuccess {int}          team.bs_brawler.boost.voting          boost voting points
 * @apiSuccess {Object}       team.bs_brawler.damage                bs_brawler damage object
 * @apiSuccess {int}          team.bs_brawler.damage.week           damage week points
 * @apiSuccess {int}          team.bs_brawler.damage.villain        damage villain points
 * @apiSuccess {int}          team.bs_brawler.damage.battlefield    damage battlefield points
 * @apiSuccess {int}          team.bs_brawler.damage.voting         damage voting points
 * @apiSuccess {Object}       team.bs_support                       bs_support object
 * @apiSuccess {int}          team.bs_support.id                    bs_support ID
 * @apiSuccess {varchar}      team.bs_support.name                  bs_support name
 * @apiSuccess {varchar}      team.bs_support.rank                  bs_support rank
 * @apiSuccess {int}          team.bs_support.teamPoints            bs_support team page points
 * @apiSuccess {int}          team.bs_support.matchPoints           bs_support matchup page points
 * @apiSuccess {Object[]}     team.bs_support.affinity              bs_support list of affinities
 * @apiSuccess {int}          team.bs_support.originalPower         bs_support original power
 * @apiSuccess {Object}       team.bs_support.boost                 bs_support boost object
 * @apiSuccess {int}          team.bs_support.boost.week            boost week points
 * @apiSuccess {int}          team.bs_support.boost.support         boost support points
 * @apiSuccess {int}          team.bs_support.boost.battlefield     boost battlefield points
 * @apiSuccess {int}          team.bs_support.boost.voting          boost voting points
 * @apiSuccess {Object}       team.bs_support.damage                bs_support damage object
 * @apiSuccess {int}          team.bs_support.damage.week           damage week points
 * @apiSuccess {int}          team.bs_support.damage.villain        damage villain points
 * @apiSuccess {int}          team.bs_support.damage.battlefield    damage battlefield points
 * @apiSuccess {int}          team.bs_support.damage.voting         damage voting points
 * @apiSuccess {Object}       team.support                          support object
 * @apiSuccess {int}          team.support.id                       support ID
 * @apiSuccess {varchar}      team.support.name                     support name
 * @apiSuccess {varchar}      team.support.rank                     support rank
 * @apiSuccess {int}          team.support.teamPoints               support team page points
 * @apiSuccess {int}          team.support.matchPoints              support matchup page points
 * @apiSuccess {Object[]}     team.support.affinity                 support list of affinities
 * @apiSuccess {int}          team.support.originalPower            support original power
 * @apiSuccess {Object}       team.support.boost                    support boost object
 * @apiSuccess {int}          team.support.boost.week               boost week points
 * @apiSuccess {int}          team.support.boost.support            boost support points
 * @apiSuccess {int}          team.support.boost.battlefield        boost battlefield points
 * @apiSuccess {int}          team.support.boost.voting             boost voting points
 * @apiSuccess {Object}       team.support.damage                   support damage object
 * @apiSuccess {int}          team.support.damage.week              damage week points
 * @apiSuccess {int}          team.support.damage.villain           damage villain points
 * @apiSuccess {int}          team.support.damage.battlefield       damage battlefield points
 * @apiSuccess {int}          team.support.damage.voting            damage voting points
 * @apiSuccess {Object}       team.villain                          villain object
 * @apiSuccess {int}          team.villain.id                       villain ID
 * @apiSuccess {varchar}      team.villain.name                     villain name
 * @apiSuccess {varchar}      team.villain.rank                     villain rank
 * @apiSuccess {int}          team.villain.teamPoints               villain team page points
 * @apiSuccess {int}          team.villain.matchPoints              villain matchup page points
 * @apiSuccess {Object[]}     team.villain.affinity                 villain list of affinities
 * @apiSuccess {int}          team.villain.originalPower            villain original power
 * @apiSuccess {Object}       team.villain.boost                    villain boost object
 * @apiSuccess {int}          team.villain.boost.week               boost week points
 * @apiSuccess {int}          team.villain.boost.support            boost support points
 * @apiSuccess {int}          team.villain.boost.battlefield        boost battlefield points
 * @apiSuccess {int}          team.villain.boost.voting             boost voting points
 * @apiSuccess {Object}       team.villain.damage                   villain damage object
 * @apiSuccess {int}          team.villain.damage.week              damage week points
 * @apiSuccess {int}          team.villain.damage.villain           amage villain points
 * @apiSuccess {int}          team.villain.damage.battlefield       damage battlefield points
 * @apiSuccess {int}          team.villain.damage.voting            damage voting points
 * @apiSuccess {Object}       team.battlefield                      battlefield object
 * @apiSuccess {int}          team.battlefield.id                   battlefield ID
 * @apiSuccess {varchar}      team.battlefield.name                 battlefield name
 * @apiSuccess {varchar}      team.battlefield.rank                 battlefield rank
 * @apiSuccess {int}          team.battlefield.teamPoints           battlefield team page points
 * @apiSuccess {int}          team.battlefield.matchPoints          battlefield matchup page points
 * @apiSuccess {Object[]}     team.battlefield.affinity             battlefield list of affinities
 * @apiSuccess {int}          team.battlefield.originalPower        battlefield original power
 * @apiSuccess {Object}       team.battlefield.boost                battlefield boost object
 * @apiSuccess {int}          team.battlefield.boost.week           boost week points
 * @apiSuccess {int}          team.battlefield.boost.support        boost support points
 * @apiSuccess {int}          team.battlefield.boost.battlefield    boost battlefield points
 * @apiSuccess {int}          team.battlefield.boost.voting         boost voting points
 * @apiSuccess {Object}       team.battlefield.damage               battlefield damage object
 * @apiSuccess {int}          team.battlefield.damage.week          damage week points
 * @apiSuccess {int}          team.battlefield.damage.villain       damage villain points
 * @apiSuccess {int}          team.battlefield.damage.battlefield   damage battlefield points
 * @apiSuccess {int}          team.battlefield.damage.voting        damage voting points
 * @apiSuccess {varchar}      week                                  team name
 *
 * @apiError   (Error 5xx)    5xx                                   Error getting matchup team
 */

/**
 * @api         {get}         /team/info/:member_id         Get team info
 * @apiVersion  1.0.0
 * @apiName     Get Team Info
 * @apiGroup    Team
 *
 * @apiParam    {int}         member_id                     member ID
 *
 * @apiSuccess  {varchar}     team_name                     team name
 * @apiSuccess  {int}         points                        account points
 * @apiSuccess  {int}         id                            account ID
 * @apiSuccess  {int}         league_id                     league ID
 * @apiSuccess  {varchar}     name                          league name
 * @apiSuccess  {Object}      rank                          team record
 * @apiSuccess  {int}         rank.win                      team wins
 * @apiSuccess  {int}         rank.loss                     team losses
 *
 * @apiError    (Error 5xx)   500                           Error getting team info
 */

/**
 * @api         {put}         /team/name/:member_id         Update team name
 * @apiVersion  1.0.0
 * @apiName     Update Team Name
 * @apiGroup    Team
 *
 * @apiParam    {int}         member_id                     member ID
 *
 * @apiBody     {varchar}     name                          team name
 *
 * @apiSuccess  {boolean}     success                       request completed
 *
 * @apiError    (Error 5xx)   500                           Error updating team name
 */

/**
 * @api         {put}         /team/:team_id        Update team
 * @apiVersion  1.0.0
 * @apiName     Update Team
 * @apiGroup    Team
 *
 * @apiParam    {int}         team_id               team ID
 *
 * @apiBody     {Object}      captain               captain object
 * @apiBody     {Object}      brawlerA              brawlerA object
 * @apiBody     {Object}      brawlerB              brawlerB object
 * @apiBody     {Object}      bsBrawler             bsBrawler object
 * @apiBody     {Object}      bsSupport             bsSupport object
 * @apiBody     {Object}      support               support object
 * @apiBody     {Object}      villain               villain object
 * @apiBody     {Object}      battlefield           battlefield object
 *
 * @apiSuccess  {boolean}     success               request completed
 *
 * @apiError    (Error 5xx)   500                   Error updating team
 */

/**
 * @api         {get}         /team/schedule/:league_id     Get schedule
 * @apiVersion  1.0.0
 * @apiName     Get Schedule
 * @apiGroup    Team
 *
 * @apiParam    {int}         league_id                     league ID
 *
 * @apiSuccess  {Object[]}    mainSchedule                  schedule array
 * @apiSuccess  {varchar}     mainSchedule.teamA            team one
 * @apiSuccess  {varchar}     mainSchedule.teamB            team two
 * @apiSuccess  {int}         mainSchedule.scoreA           team one score
 * @apiSuccess  {int}         mainSchedule.scoreB           team two score
 * @apiSuccess  {int}         mainSchedule.week             league week
 *
 * @apiError    (Error 5xx)   500                           Error getting league schedule
 */

/**
 * @api         {get}         /matchup/:matchup_id    Get matchup
 * @apiVersion  1.0.0
 * @apiName     Get Matchup
 * @apiGroup    Matchup
 *
 * @apiParam    {int}         matchup_id              matchup ID
 *
 * @apiSuccess  {Object}      matchup                 matchup object
 * @apiSuccess  {int}         matchup.id              matchup ID
 * @apiSuccess  {int}         matchup.league_id       league ID
 * @apiSuccess  {int}         matchup.team_a          team A
 * @apiSuccess  {int}         matchup.team_b          team B
 * @apiSuccess  {int}         matchup.score_a         score A
 * @apiSuccess  {int}         matchup.score_b         score B
 * @apiSuccess  {int}         matchup.week            matchup week
 * @apiSuccess  {tinyint}     matchup.active          matchup availability
 * @apiSuccess  {Object[]}    votes                   votes object
 * @apiSuccess  {int}         votes.initiator_id      vote initiator
 * @apiSuccess  {int}         votes.matchup_id        matchup ID
 * @apiSuccess  {int}         votes.player_a_id       player A ID
 * @apiSuccess  {int}         votes.player_b_id       player B ID
 * @apiSuccess  {int}         votes.player_a_count    votes for player A
 * @apiSuccess  {int}         votes.player_b_count    votes for player B
 * @apiSuccess  {int}         votes.rank              player rank
 * @apiSuccess  {int}         votes.active            vote avilability
 * @apiSuccess  {timestamp}   votes.create_date       vote date created
 *
 * @apiError    (Error 5xx)   500                     Error getting matchup
 */

/**
 * @api         {get}            /matchup/team/:team_id    Get matchup from team
 * @apiVersion  1.0.0
 * @apiName     Get Matchup From Team
 * @apiGroup    Matchup
 *
 * @apiParam    {int}             team_id                  team ID
 *
 * @apiSuccess  {object[]}       matchupData               matchup data object
 * @apiSuccess  {int}            matchupData.matchupId     matchup ID
 *
 * @apiError    (Error 5xx)      500                       Error get matchup data from team
 */

/**
 * @api         {post}        /matchup/vote/:matchup_id     Create matchup votes
 * @apiVersion  1.0.0
 * @apiName     Create Matchup Votes
 * @apiGroup    Matchup
 *
 * @apiParam    {int}         matchup_id                    matchup ID
 *
 * @apiSuccess  {int}         matchupVoteId                 matchup vote ID
 *
 * @apiError    (Error 5xx)   500                           Error creating matchup votes
 */

/**
 * @api         {get}         /matchup/votes/:vote_id     Get matchup votes
 * @apiVersion  1.0.0
 * @apiName     Get Matchup Votes
 * @apiGroup    Matchup
 *
 * @apiParam    {int}         vote_id                     vote ID
 *
 * @apiSuccess  {int}         active                      vote availability
 * @apiSuccess  {int}         player_a_id                 player A ID
 * @apiSuccess  {int}         player_b_id                 player B ID
 * @apiSuccess  {int}         player_a_count              votes for player A
 * @apiSuccess  {int}         player_b_count              votes for player B
 * @apiSuccess  {varchar}     leagueName                  league name
 *
 * @apiError    (Error 5xx)   500                         Error getting matchup votes
 */

/**
 * @api         {get}         /matchup/all/votes          Get all matchup votes
 * @apiVersion  1.0.0
 * @apiName     Get All Matchup Votes
 * @apiGroup    Matchup
 *
 * @apiSuccess  {int}         active                      vote availability
 * @apiSuccess  {int}         player_a_id                 player A ID
 * @apiSuccess  {int}         player_b_id                 player B ID
 * @apiSuccess  {int}         player_a_count              votes for player A
 * @apiSuccess  {int}         player_b_count              votes for player B
 * @apiSuccess  {varchar}     leagueName                  league name
 *
 * @apiError    (Error 5xx)   500                         Error getting matchup votes
 */

/**
 * @api             {put}         /matchup/add    Add votes
 * @apiVersion      1.0.0
 * @apiName         Add Votes
 * @apiGroup        Matchup
 *
 * @apiBody         {int}         voteId          vote ID
 * @apiBody         {int}         votedFor        voted for ID
 * @apiBody         {varchar}     playerCount     specific player string
 *
 * @apiSuccess      {int}         votes           number of votes
 *
 * @apiError        (Error 5xx)   500             Error adding votes
 */

/**
 * @api           {get}         /league/:league_id    Get league
 * @apiVersion    1.0.0
 * @apiName       Get League
 * @apiGroup      League
 *
 * @apiParam      {int}         league_id             league ID
 *
 * @apiSuccess    {varchar}     name                  league name
 * @apiSuccess    {int}         num_teams             number of teams
 * @apiSuccess    {int}         creator_id            league creator
 * @apiSuccess    {int}         teamId                creator team ID
 *
 * @apiError      (Error 5xx)   500                   Error getting league
 */

/**
 * @api           {get}         /league/view         Get all leagues
 * @apiVersion    1.0.0
 * @apiName       Get All Leagues
 * @apiGroup      League
 *
 * @apiSuccess    {varchar}     name                 league name
 * @apiSuccess    {int}         leagueId             league ID
 * @apiSuccess    {varchar}     team_name            team name
 * @apiSuccess    {int}         teamId               team ID
 *
 * @apiError      (Error 5xx)   500                  Error getting all leagues
 */

/**
 * @api           {post}        /league/create    Create league
 * @apiVersion    1.0.0
 * @apiName       Create League
 * @apiGroup      League
 *
 * @apiBody       {varchar}     name              league name
 * @apiBody       {int}         numTeams          number of teams
 *
 * @apiSuccess    {int}         teamId            team ID
 * @apiSuccess    {int}         leagueId          league ID
 *
 * @apiError      (Error 5xx)   500               Error creating league
 */

/**
 * @api           {put}         /league/join       Join league
 * @apiVersion    1.0.0
 * @apiName       Join League
 * @apiGroup      League
 *
 * @apiBody       {varchar}     hash              league hash
 *
 * @apiSuccess    {int}         teamId            team ID
 * @apiSuccess    {int}         leagueId          league ID
 *
 * @apiError      (Error 5xx)   500               Error joining league
 */

/**
 * @api           {put}         /league/:league_id    Update league
 * @apiVersion    1.0.0
 * @apiName       Update League
 * @apiGroup      League
 *
 * @apiParam      {int}         league_id             league hash
 *
 * @apiBody       {varchar}     name                  league name
 * @apiBody       {int}         teams                 number of teams
 * @apiBody       {int}         isActive              league availability
 *
 * @apiSuccess    {boolean}     success               request completed
 *
 * @apiError      (Error 5xx)   500                   Error updating league
 */

/**
 * @api           {delete}      /league/:league_id    Delete league
 * @apiVersion    1.0.0
 * @apiName       Delete League
 * @apiGroup      League
 *
 * @apiParam      {int}         league_id             league ID
 *
 * @apiSuccess    {boolean}     success               request completed
 *
 * @apiError      (Error 5xx)   500                   Error deleting league
 */

/**
 * @api           {get}          /league/scoreboard/:league_id    Get scoreboard
 * @apiVersion    1.0.0
 * @apiName       Get Scoreboard
 * @apiGroup      League
 *
 * @apiParam      {int}          league_id                        league ID
 *
 * @apiSuccess    {object[]}     mainScoreboard                   scoreboard object
 * @apiSuccess    {varchar}      mainScoreboard.teamA             team A name
 * @apiSuccess    {varchar}      mainScoreboard.teamB             team B name
 * @apiSuccess    {int}          mainScoreboard.scoreA            team A score
 * @apiSuccess    {int}          mainScoreboard.scoreB            team B score
 *
 * @apiError      (Error 5xx)    500                              Error getting league scoreboard
 */

/**
 * @api           {get}          /league/standings/:league_id    Get standings
 * @apiVersion    1.0.0
 * @apiName       Get Standings
 * @apiGroup      League
 *
 * @apiParam      {int}          league_id                       league ID
 *
 * @apiSuccess    {object[]}     mainRankings                    rankings object
 * @apiSuccess    {varchar}      mainRankings.team               team name
 * @apiSuccess    {int}          mainRankings.teamId             team ID
 * @apiSuccess    {int}          mainRankings.win                games won
 * @apiSuccess    {int}          mainRankings.loss               games lost
 *
 * @apiError      (Error 5xx)    500                             Error getting league standings
 */

/**
 * @api           {post}          /league/start    Start league
 * @apiVersion    1.0.0
 * @apiName       Start League
 * @apiGroup      League
 *
 * @apiBody       {int}           leagueId         league ID
 *
 * @apiSuccess    {boolean}       success          request completed
 *
 * @apiError      (Error 5xx)     500              Error starting league
 */

/**
 * @api           {get}         /league/admin/settings      Get league admin data
 * @apiVersion    1.0.0
 * @apiName       Get League Admin Data
 * @apiGroup      League
 *
 * @apiSuccess    {Object}      league                      league object
 * @apiSuccess    {int}         league.id                   league ID
 * @apiSuccess    {varchar}     league.name                 league name
 * @apiSuccess    {int}         league.num_teams            number of teams
 * @apiSuccess    {tinyint}     league.active               league availability
 * @apiSuccess    {int}         league.creator_id           league creator
 * @apiSuccess    {tinyint}     league.is_roster_active     roster is/isn't editiable
 * @apiSuccess    {tinyint}     league.is_voting_active     voting is/isn't editiable
 * @apiSuccess    {varchar}     league.hash                 league hash
 * @apiSuccess    {varchar}     league.create_date          date league created
 * @apiSuccess    {int}         league.week                 league week
 * @apiSuccess    {Object[]}    teams                       teams object
 * @apiSuccess    {int}         teams.id                    team ID
 * @apiSuccess    {int}         teams.user_id               team user ID
 * @apiSuccess    {int}         teams.league_id             league ID
 * @apiSuccess    {varchar}     teams.team_name             team name
 * @apiSuccess    {int}         teams.points                team points
 *
 * @apiError      (Error 5xx)   500                         Error getting league admin data
 */

/**
 * @api           {delete}      /league/remove/:member_id   Remove team from league
 * @apiVersion    1.0.0
 * @apiName       Remove Team From League
 * @apiGroup      League
 *
 * @apiParam      {int}         member_id                   member ID
 *
 * @apiBody       {int}         leagueId                    league ID
 *
 * @apiSuccess    {Object[]}    teams                       teams object
 * @apiSuccess    {int}         teams.id                    team ID
 * @apiSuccess    {int}         teams.user_id               team user ID
 * @apiSuccess    {int}         teams.league_id             league ID
 * @apiSuccess    {varchar}     teams.team_name             team name
 * @apiSuccess    {int}         teams.points                team points
 *
 * @apiError      (Error 5xx)   500                         Error removing team from league
 */
