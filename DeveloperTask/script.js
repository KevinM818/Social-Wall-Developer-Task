$(document).ready(function() {

    var service = "";
    var datePublished = "";

    var manualImage = "";
    var manualText = "";
    var manualLinkText = "";
    var manualLink = "";

    var twitterUsername = "";
    var twitterTweet = "";

    var instaImage = "";
    var instaUsername = "";
    var instaCaption = "";

    var manualItems = [];
    var twitterItems = [];
    var instagramItems = [];

    function loadItems(array) {
        //Loop through the response array to load the data into the webpage
        for (var i = 0; i < array.length; i++) {

            service = array[i].service_name;

            manualImage = array[i].item_data.image_url;
            manualText = array[i].item_data.text;
            manualLinkText = array[i].item_data.link_text;
            manualLink = array[i].item_data.link;

            twitterTweet = array[i].item_data.tweet;

            instaCaption = array[i].item_data.caption;

            if (service === "Twitter" || service === "Instagram") {
                username = array[i].item_data.user.username;
            }

            switch (service) {
                case "Manual":
                    $("#main").append("<div class='items'><div class='manual-item'><img src='assets/aff.png' alt='AFF' id='manual-icon'><img src=" + manualImage + " id='manual-thumbnail'><p>" + manualText + "</p><h4><a href=" + manualLink + " target='_blank'>" + manualLinkText + "</a></h4></div></div>");
                    break;
                case "Twitter":
                    $("#main").append("<div class='items'><div class='twitter-item'><img src='assets/twitter.png' alt='twitter' id='twitter-icon'><h4>" + username + "</h4><p>" + linkifyTweet(twitterTweet) + "</p></div></div>");
                    break;
                case "Instagram":
                    instaImage = array[i].item_data.image.medium;
                    $("#main").append("<div class='items'><div class='insta-item'><img src='assets/instagram.png' alt='instagram' id='insta-icon'><img src=" + instaImage + " alt='instagram image' id='insta-thumbnail'><h4>" + username + "</h4><p>" + linkifyInstagram(instaCaption) + "</p></div></div>");
                    break;
            }
        }
    }

    function getItems(singleService) {
        //GET request to get the JSON response
        $.ajax({
            type: "GET",
            url: "https://api.myjson.com/bins/warm5",
            dataType: "json",
            success: function(response) {
                //Convert the item_published string to a date object 
                for (var i = 0; i < response.items.length; i++) {
                    datePublished = response.items[i].item_published;
                    datePublished = new Date(datePublished.substring(0, 10));
                }
                //Sort the JSON response by the date the item was published from most recent to oldest
                response.items.sort(function(a, b) {
                    return (a.item_published > b.item_published) ? -1 : ((a.item_published < b.item_published) ? 1 : 0);
                });
                // Push items to their respective arrays for filter button
                for (var i = 0; i < response.items.length; i++) {
                    service = response.items[i].service_name;
                    switch (service) {
                        case "Manual":
                            manualItems.push(response.items[i]);
                            break;
                        case "Twitter":
                            twitterItems.push(response.items[i]);
                            break;
                        case "Instagram":
                            instagramItems.push(response.items[i]);
                            break;
                    }
                }

                if (singleService === "Manual") {
                    loadItems(manualItems);
                } else if (singleService === "Twitter") {
                    loadItems(twitterItems);
                } else if (singleService === "Instagram") {
                    loadItems(instagramItems);
                } else {
                    loadItems(response.items);
                }
            }
        });
    }


    function linkifyTweet(text) {
        var base_url = 'http://twitter.com/';
        var hashtag_part = 'hashtag/';
        // convert URLs into links  
        text = text.replace(
            /(>|<a[^<>]+href=['"])?(https?:\/\/([-a-z0-9]+\.)+[a-z]{2,5}(\/[-a-z0-9!#()\/?&.,]*[^ !#?().,])?)/gi,
            function($0, $1, $2) {
                return ($1 ? $0 : '<a href="' + $2 + '" target="_blank">' + $2 +
                    '</a>');
            });
        // convert @mentions into links  
        text = text.replace(
            /(:\/\/|>)?(@([_a-z0-9-]+))/gi,
            function($0, $1, $2, $3) {
                return ($1 ? $0 : '<a href="' + base_url + $3 +
                    '" title="Follow ' + $3 + '" target="_blank">@' + $3 +
                    '</a>');
            });
        // convert #hashtags into tag search links  
        text = text.replace(
            /(:\/\/[^ <]*|>)?(\#([_a-z0-9-]+))/gi,
            function($0, $1, $2, $3) {
                return ($1 ? $0 : '<a href="' + base_url + hashtag_part + $3 +
                    '" title="Search tag: ' + $3 + '" target="_blank">#' + $3 +
                    '</a>');
            });

        return text;
    }

    function linkifyInstagram(text) {
        var base_url = 'http://instagram.com/';
        var hashtag_part = 'explore/tags/';
        // convert @mentions into links  
        text = text.replace(
            /(:\/\/|>)?(@([_a-z0-9-]+))/gi,
            function($0, $1, $2, $3) {
                return ($1 ? $0 : '<a href="' + base_url + $3 +
                    '" title="Follow ' + $3 + '" target="_blank">@' + $3 +
                    '</a>');
            });
        // convert #hashtags into tag search links  
        text = text.replace(
            /(:\/\/[^ <]*|>)?(\#([_a-z0-9-]+))/gi,
            function($0, $1, $2, $3) {
                return ($1 ? $0 : '<a href="' + base_url + hashtag_part + $3 +
                    '" title="Search tag: ' + $3 + '" target="_blank">#' + $3 +
                    '</a>');
            });

        return text;
    }
    
    getItems();

    $("#manualBtn").on('click', function() {
        $(this).data("clicked", true);
        $("#twitterBtn").data("clicked", false);
        $("#instagramBtn").data("clicked", false);
        $("#main").html("");
        loadItems(manualItems);
    });

    $("#twitterBtn").on('click', function() {
        $(this).data("clicked", true);
        $("#manualBtn").data("clicked", false);
        $("#instagramBtn").data("clicked", false);
        $("#main").html("");
        loadItems(twitterItems);
    });

    $("#instagramBtn").on('click', function() {
        $(this).data("clicked", true);
        $("#manualBtn").data("clicked", false);
        $("#twitterBtn").data("clicked", false);
        $("#main").html("");
        loadItems(instagramItems);
    });

    $("#loadMore").on("click", function() {
        if ($("#manualBtn").data("clicked")) {
            manualItems = [];
            getItems("Manual");
        } else if ($("#twitterBtn").data("clicked")) {
            twitterItems = [];
            getItems("Twitter");
        } else if ($("#instagramBtn").data("clicked")) {
            instagramItems = [];
            getItems("Instagram");
        } else {
            getItems();
        }
    });

});