twig({id:"template.html.twig", data:[{"type":"raw","value":"<div style=\"clear: both;\"></div>\n<div class=\"formDividerWd\" id=\"cmt_top\" style=\"background: #5B92F4; padding: 3%; margin: 3% 0 5% 0;\">\n    <span style=\"float: right; color: #fff; \">"},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"commentTotals","match":["commentTotals"]},{"type":"Twig.expression.type.key.period","key":"pending"},{"type":"Twig.expression.type.number","value":0,"match":["0",null]},{"type":"Twig.expression.type.operator.binary","value":">","precidence":8,"associativity":"leftToRight","operator":">"}],"output":[{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"commentTotals","match":["commentTotals"]},{"type":"Twig.expression.type.key.period","key":"pending"}]}]}},{"type":"logic","token":{"type":"Twig.logic.type.else","match":["else"],"output":[{"type":"raw","value":"0"}]}},{"type":"raw","value":"        Pending</span>\n    <div class=\"comment_bubble_inverted\" style=\"background: #fff; text-align: center; \">\n        <span style=\" font-size: 1em; color: #5B92F4;\">"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"commentTotals","match":["commentTotals"]},{"type":"Twig.expression.type.key.period","key":"count"}]},{"type":"raw","value":"</span>\n    </div>\n    <span style=\"color: #fff;\">Comments</span>\n</div>\n\n<!-- TODO: readd reauth here-->\n"},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"disableNewComments","match":["disableNewComments"]},{"type":"Twig.expression.type.bool","value":true},{"type":"Twig.expression.type.operator.binary","value":"!=","precidence":9,"associativity":"leftToRight","operator":"!="},{"type":"Twig.expression.type.variable","value":"SESSION","match":["SESSION"]},{"type":"Twig.expression.type.key.period","key":"mid"},{"type":"Twig.expression.type.test","filter":"defined"},{"type":"Twig.expression.type.operator.binary","value":"and","precidence":13,"associativity":"leftToRight","operator":"and"},{"type":"Twig.expression.type.variable","value":"SESSION","match":["SESSION"]},{"type":"Twig.expression.type.key.period","key":"REAUTH"},{"type":"Twig.expression.type.key.period","key":"comments"},{"type":"Twig.expression.type.test","filter":"defined"},{"type":"Twig.expression.type.operator.binary","value":"and","precidence":13,"associativity":"leftToRight","operator":"and"}],"output":[{"type":"raw","value":"    "},{"type":"raw","value":"\n    <div class=\"fadeMe\"></div>\n    <div class=\"reauth-box\">\n        <h2 style=\"margin: 0px;\">You must re-login before participating in the KSL.com comment board</h2>\n        <h4>To post or vote on comments, it is necessary to re-authenticate your login after 48 hours.</h4>\n        <div class=\"error\"></div>\n        <div class=\"reauthinputmn\"><span>email:</span><br /><input type=\"text\" id=\"reauth_email\" /></div>\n        <div class=\"reauthinputmn\"><span>password:</span><br /><input type=\"password\" id=\"reauth_password\" /></div>\n        <h3 style=\"color: #fff;\">\n            Re-Login\n        </h3>\n        <h4 style=\"color: #111;\">To continue without re-login\n            <button data-intent=\"close\">Click Here</button>\n        </h4>\n    </div>\n"}]}},{"type":"raw","value":"\n<div id=\"cmt_mn\">\n    <div style='clear: both;'></div>\n\n    <div>\n        <a href=\"?sid=160754&nid=250\">View the KSL.com Comment Board Guidelines &raquo;</a>\n    </div>\n\n    <!-- TODO: readd reauth here-->\n    "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"disableNewComments","match":["disableNewComments"]},{"type":"Twig.expression.type.bool","value":true},{"type":"Twig.expression.type.operator.binary","value":"!=","precidence":9,"associativity":"leftToRight","operator":"!="},{"type":"Twig.expression.type.variable","value":"SESSION","match":["SESSION"]},{"type":"Twig.expression.type.key.period","key":"mid"},{"type":"Twig.expression.type.test","filter":"defined"},{"type":"Twig.expression.type.operator.binary","value":"and","precidence":13,"associativity":"leftToRight","operator":"and"},{"type":"Twig.expression.type.variable","value":"SESSION","match":["SESSION"]},{"type":"Twig.expression.type.key.period","key":"REAUTH"},{"type":"Twig.expression.type.key.period","key":"comments"},{"type":"Twig.expression.type.test","filter":"defined","modifier":"not"},{"type":"Twig.expression.type.operator.binary","value":"and","precidence":13,"associativity":"leftToRight","operator":"and"}],"output":[{"type":"raw","value":"        <div id=\"reply_div_0\" class=\"reply_div\" style='display: block;'>\n            <textarea id=\"reply_0\" class=\"replytext\" alt=\"0\"\n                      placeholder=\"Type your comment here. Keep it civil and stay on topic.\"></textarea>\n            <div class=\"buttonBox\">\n                <div id=\"reply_post_0\" class=\"replybuttonsubmit\"\n                     style=\" color: #fff !important;  background: #5B92F4;  width: 25%; height: auto;  padding: 2%;  float: right;\"\n                     onclick=\"\"\n                     alt=\"0\">post\n                </div>\n            </div>\n        </div>\n    "}]}},{"type":"logic","token":{"type":"Twig.logic.type.elseif","stack":[{"type":"Twig.expression.type.variable","value":"SESSION","match":["SESSION"]},{"type":"Twig.expression.type.key.period","key":"mid"},{"type":"Twig.expression.type.test","filter":"defined","modifier":"not"}],"output":[{"type":"raw","value":"        <div class=\"notaccepting\" style='margin-top: 5px; margin-bottom: 5px;'>\n            You must be logged in to post a comment.<br />\n            <a href='/public/member/signin?login_forward="},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"url","match":["url"]}]},{"type":"raw","value":"'>login here</a>\n        </div>\n    "}]}},{"type":"logic","token":{"type":"Twig.logic.type.elseif","stack":[{"type":"Twig.expression.type.variable","value":"disableNewComments","match":["disableNewComments"]},{"type":"Twig.expression.type.bool","value":true},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"        <div class=\"notaccepting\" style='margin-top: 5px; margin-bottom: 5px;'>\n            Sorry, we are not accepting new comments on this story, but if you have more to contribute please email <a\n                    style='font-size: 12px; color: #369;' href='mailto:newstip@ksl.com'>newstip@ksl.com</a>\n        </div>\n    "}]}},{"type":"raw","value":"    <div style=\"clear: both;\"></div>\n\n    <ul id=\"commentSorting\" class=\"ctx-menu\">\n        <li class=\"ctx-menu--option ctx-menu--option__active\"\n            style=\"width: "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"SESSION","match":["SESSION"]},{"type":"Twig.expression.type.key.period","key":"member"},{"type":"Twig.expression.type.key.period","key":"group"},{"type":"Twig.expression.type.key.period","key":"root"},{"type":"Twig.expression.type.test","filter":"defined"}],"output":[{"type":"raw","value":"25%"}]}},{"type":"logic","token":{"type":"Twig.logic.type.else","match":["else"],"output":[{"type":"raw","value":"35%"}]}},{"type":"raw","value":";\">\n            <a href=\"#\" data-value=\"oldest\">Oldest</a>\n        </li>\n        <li class=\"ctx-menu--option\"\n            style=\"width: "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"SESSION","match":["SESSION"]},{"type":"Twig.expression.type.key.period","key":"member"},{"type":"Twig.expression.type.key.period","key":"group"},{"type":"Twig.expression.type.key.period","key":"root"},{"type":"Twig.expression.type.test","filter":"defined"}],"output":[{"type":"raw","value":"25%"}]}},{"type":"logic","token":{"type":"Twig.logic.type.else","match":["else"],"output":[{"type":"raw","value":"35%"}]}},{"type":"raw","value":";\">\n            <a href=\"#\" data-value=\"newest\">Newest</a>\n        </li>\n        <li class=\"ctx-menu--option\"\n            style=\"width: "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"SESSION","match":["SESSION"]},{"type":"Twig.expression.type.key.period","key":"member"},{"type":"Twig.expression.type.key.period","key":"group"},{"type":"Twig.expression.type.key.period","key":"root"},{"type":"Twig.expression.type.test","filter":"defined"}],"output":[{"type":"raw","value":"25%"}]}},{"type":"logic","token":{"type":"Twig.logic.type.else","match":["else"],"output":[{"type":"raw","value":"35%"}]}},{"type":"raw","value":";\">\n            <a href=\"#\" data-value=\"popular\">Popular</a>\n        </li>\n    </ul>\n\n    <ul id=\"commentBoard\"></ul>\n    "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"commentTotals","match":["commentTotals"]},{"type":"Twig.expression.type.key.period","key":"count"},{"type":"Twig.expression.type.number","value":0,"match":["0",null]},{"type":"Twig.expression.type.operator.binary","value":">","precidence":8,"associativity":"leftToRight","operator":">"}],"output":[{"type":"raw","value":"        <div style=\"clear: both; max-width: 100%;\">\n            <button id=\"loadMore\" class=\"button\">Load More Comments</button>\n        </div>\n    "}]}},{"type":"raw","value":"    <div class=\"mainCount\">Showing <span class=\"pagesize\"></span> of "},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"commentTotals","match":["commentTotals"]},{"type":"Twig.expression.type.key.period","key":"count"}]},{"type":"raw","value":" comments</div>\n    "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"commentTotals","match":["commentTotals"]},{"type":"Twig.expression.type.key.period","key":"count"},{"type":"Twig.expression.type.number","value":0,"match":["0",null]},{"type":"Twig.expression.type.operator.binary","value":">","precidence":8,"associativity":"leftToRight","operator":">"}],"output":[{"type":"raw","value":"        "},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"disableNewComments","match":["disableNewComments"]},{"type":"Twig.expression.type.bool","value":true},{"type":"Twig.expression.type.operator.binary","value":"==","precidence":9,"associativity":"leftToRight","operator":"=="}],"output":[{"type":"raw","value":"            <div class=\"notaccepting\" style='margin-top: 5px;'>\n                Sorry, we are not accepting new comments on this story, but if you have more to contribute please email\n                <a style='font-size: 12px; color: #369;' href='mailto:newstip@ksl.com'>newstip@ksl.com</a>\n            </div>\n            <div class=\"notaccepting\" style='margin-top: 5px;'>\n                You must be logged in to post a comment.<br />\n                <a href='/public/member/signin?login_forward="},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"url","match":["url"]}]},{"type":"raw","value":"'>login here</a>\n            </div>\n        "}]}},{"type":"raw","value":"    "}]}},{"type":"raw","value":"</div>\n"}], precompiled: true});