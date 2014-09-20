/**
 * YelpController
 *
 * @description :: Server-side logic for managing yelps
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {
    index: function (req, res) {
        
        // Get query vars
        var keywords = req.param('keywords');
        var location = req.param('location');
        var radius = req.param('radius');        
        var limit = req.param('limit')? req.param('limit') : 5;
        var page = req.param('page')? req.param('page') : 1;
        var total = req.param('total');

        // Calculate
        var offset = (parseInt(page) - 1) * parseInt(limit);
        var last = parseInt(offset) + parseInt(limit);
        
        // Set limit to match total on the last page
        // (otherwise Yelp returns unrelated records)
        if (total && last >= total) {
            var limitOffset = last - total;
            var tempLimit = limit - limitOffset;
            last = parseInt(offset) + tempLimit;
        }
        
        // Check for required field
        if (!keywords || (keywords && keywords.length < 3)) {
            return res.send(400, { 
                error: "Missing required field: keywords (minimum length: 3)"
            });
        }
        
        // Compile query
        var query = { 
            term: keywords,            
            location: location? location : "1168 Hamilton St., Vancouver, BC",
            radius_filter: radius? radius : 10000,            
            category_filter: "restaurants",
            limit: tempLimit? tempLimit : limit,            
            offset: offset
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
                    error: "Yelp connection failed. Please try refreshing your browser.",
                    response: error
                });
            }
            return res.send({
                page: page,
                limit: limit,
                start: offset + 1,
                last: last,
                total: tempLimit? total : data.total,
                businesses: data.businesses
            });
        });
    },
    
    business: function (req, res) {
        // Get query var
        var id = req.param('slug');
        
        // Check for required field
        if (!id || (id < 5)) {
            return res.send(400, { 
                error: "Missing business id (minimum length: 5)"
            });
        }
        
        // Yelp Auth (use module: yelp)
        var yelp = require("yelp").createClient({
            consumer_key: "bL1WmjzGVGGp-zloCXYVJA", 
            consumer_secret: "wjUQx87Ty9Fazk2gHEjfl48FDeI",
            token: "zxKtH7bAWdU-jrxGl8USKxJ9MkOEmyfn",
            token_secret: "DPU37xWg1KigSwHIV4QIEit9mqg"
        });
        
        // Exec Yelp Query
        yelp.business(id, function (error, data) {
            if (error) {
                return res.send(400, {
                    error: "Yelp connection failed. Please try again.",
                    response: error
                });
            }
            return res.send(data.reviews);
        });
    }
};