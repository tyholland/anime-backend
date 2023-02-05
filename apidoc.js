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
 * @apiParam    {team_id}        id                        team ID
 *
 * @apiSuccess  {object[]}       matchupData               matchup data object
 * @apiSuccess  {int}        matchupData.matchupId     matchup ID
 *
 * @apiError    (Error 5xx)      500                       Error get matchup data from team
 */

/**
 * @api         {post}        /matchup/vote/:matchup_id     Create matchup votes
 * @apiVersion  1.0.0
 * @apiName     Create Matchup Votes
 * @apiGroup    Matchup
 *
 * @apiSuccess  {int}         matchupVoteId                 List of Leads
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
 * @api {get} /leads/update/:id Update a lead
 * @apiVersion 1.0.0
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
 * @apiVersion 1.0.0
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
 * @apiVersion  1.0.0
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
 * @apiVersion  1.0.0
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
 * @apiVersion  1.0.0
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
 * @apiVersion  1.0.0
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
 * @apiVersion  1.0.0
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
 * @apiVersion 1.0.0
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
 * @apiVersion  1.0.0
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
 * @apiVersion  1.0.0
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
 * @apiVersion  1.0.0
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
 * @apiVersion  1.0.0
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
 * @apiVersion  1.0.0
 * @apiName     Update a gamer
 * @apiGroup    Google Authentication
 *
 * @apiError (Error 4xx) 401 User not authenticated
 */

/**
 * @api         {get} /auth/google/callback Google Callback
 * @apiVersion  1.0.0
 * @apiName     Googke Callback
 * @apiGroup    Google Authentication
 *
 * @apiError (Error 4xx) 401 User not authentcated
 */

/**
 * @api         {get} /error Authentication errror
 * @apiVersion  1.0.0
 * @apiName     Authentication error
 * @apiGroup    Google Authentication
 *
 * @apiError (Error 4xx) 401 User not authenticated
 */
