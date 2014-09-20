/**
 * YelpController
 *
 * @description :: Server-side logic for managing yelps
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {
    get: function (req, res) {
        
        // Get query vars
        var keywords = req.param('keywords');
        var location = req.param('location');
        var limit = req.param('limit');
        var radius = req.param('radius');
        
        // Check for required fields
        if (!keywords || (keywords && keywords.length < 3)) {
            return res.send(400, { 
                error: "Missing required field: keywords (minimum length: 3)"
            });
        }
        
        // Compile query
        var query = { 
            term: keywords,
            limit: limit? limit : 10,
            location: location? location : "1168 Hamilton St., Vancouver, BC",
            radius_filter: radius? radius : 10000,            
            category_filter: "restaurants"
        };
                
        // Yelp Auth (use module: yelp)
        var yelp = require("yelp").createClient({
            consumer_key: "bL1WmjzGVGGp-zloCXYVJA", 
            consumer_secret: "wjUQx87Ty9Fazk2gHEjfl48FDeI",
            token: "zxKtH7bAWdU-jrxGl8USKxJ9MkOEmyfn",
            token_secret: "DPU37xWg1KigSwHIV4QIEit9mqg"
        });
        
        // Exec Yelp Query
        yelp.search(query, function (error, data) {
            if (error) {
                return res.send(400, {
                    error: "Yelp connection failed. Please notify the website administrator.",
                    response: error
                });
            }
            return res.send(data.businesses);
        });
    }
};